<template>
  <div>
    <input type="file" @change="handleUpload" />
    <button @click="abortUpload" v-if="isUploading">中断上传</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SparkMD5 from 'spark-md5';

const CHUNK_SIZE = 1024 * 1024;
let fileName = '';
let fileHash = '';
const isUploading = ref(false);
let abortControllers: AbortController[] = [];

const handleUpload = async (e: Event) => {
  const inputEle = e.target as HTMLInputElement;
  const file = inputEle.files?.[0];
  if (!file) return;

  fileName = file.name;
  const chunks = createChunks(file);
  console.log(chunks);

  fileHash = await calFileHash(chunks);
  console.log(fileHash);

  // 发起校验
  const verifyRes = await verify();
  if (!verifyRes.data.shouldUpload) {
    console.log('秒传成功! 文件已存在');
    return;
  }
  console.log(verifyRes.data.existChunks);

  // 需上传：进入分片上传环节（下文展开）
  await uploadChunks(chunks, verifyRes.data.existChunks);
};

const createChunks = (file: File) => {
  let cur = 0;
  const chunks: Blob[] = [];
  while (cur < file.size) {
    const blob = file.slice(cur, cur + CHUNK_SIZE);
    chunks.push(blob);
    cur += CHUNK_SIZE;
  }
  return chunks;
};

/**
 * 计算文件哈希值（抽样优化）
 * @param {Blob[]} chunks - 分片数组
 * @returns {Promise<string>} 文件哈希值
 */
// const calFileHash = (chunks: Blob[]) => {
//   return new Promise<string>((resolve) => {
//     const spark = new SparkMD5.ArrayBuffer(); // 初始化 MD5 计算器
//     const fileReader = new FileReader();
//     const targets: Blob[] = []; // 存放抽样的片段（用于计算哈希）

//     // 抽样策略：首尾分片全量，中间分片取3个2字节片段（共6字节）
//     chunks.forEach((chunk, index) => {
//       if (index === 0 || index === chunks.length - 1) {
//         // 首位分片：全量加入抽样
//         targets.push(chunk);
//       } else {
//         // 中间分片：取前2字节、中间2字节、后2字节
//         targets.push(chunk.slice(0, 2));
//         targets.push(chunk.slice(CHUNK_SIZE / 2, CHUNK_SIZE / 2 + 2));
//         targets.push(chunk.slice(CHUNK_SIZE - 2, CHUNK_SIZE));
//       }
//     });

//     // 读取抽样判断并计算哈希
//     fileReader.readAsArrayBuffer(new Blob(targets));
//     fileReader.onload = (e: ProgressEvent<FileReader>) => {
//       spark.append(e.target?.result as ArrayBuffer);
//       resolve(spark.end());
//     };
//   });
// };

const calFileHash = (chunks: Blob[]) => {
  return new Promise<string>((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let currentChunk = 0;

    const loadNext = () => {
      fileReader.readAsArrayBuffer(chunks[currentChunk]);
    };

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      spark.append(e.target?.result as ArrayBuffer);
      currentChunk++;

      if (currentChunk < chunks.length) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    loadNext();
  });
};

const verify = async () => {
  const res = await fetch('http://localhost:9000/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      fileHash,
      fileName,
    }),
  });

  return res.json();
};

/**
 * 上传分片（核心函数）
 * @param {Blob[]} chunks - 所有分片数组
 * @param {string[]} existChunks - 已上传的分片标识列表
 */
const uploadChunks = async (chunks: Blob[], existChunks: string[]) => {
  isUploading.value = true;
  abortControllers = []; // 清楚历史中断控制器

  // 1. 生成所有分片的基础信息（文件哈希、分片标识、分片数据）
  const chunkInfoList = chunks.map((chunk, index) => ({
    fileHash,
    chunkHash: `${fileHash}-${index}`,
    chunk,
  }));

  // 2. 过滤已上传的分片 -》 只保留待上传的
  const formDataList = chunkInfoList
    .filter((item) => !existChunks.includes(item.chunkHash))
    .map((item) => {
      const formData = new FormData();
      formData.append('fileHash', item.fileHash);
      formData.append('chunkHash', item.chunkHash);
      formData.append('chunk', item.chunk);
      return formData;
    });

  if (!formDataList.length) {
    // 所有分片已上传 -》 直接请求合并
    return;
  }

  // 3. 并发上传分片（下文展开）
  await uploadWithConcurrencyControl(formDataList);
};

/**
 * 带并发控制的分片上传
 * @param {FormData[]} formDatas - 待上传的FormData列表
 */
const uploadWithConcurrencyControl = async (formDataList: FormData[]) => {
  const MAX_CONCURRENT = 2; // 最大并发数（可根据需求调整）
  let currentIndex = 0; // 当前待上传的分片索引
  let taskPool: Promise<any>[] = []; // 存储当前正在执行的请（请求池）

  while (isUploading.value && currentIndex < formDataList.length) {
    // 为每个请求创建独立的中断控制器
    const controller = new AbortController();
    const { signal } = controller;
    abortControllers.push(controller);

    const task = fetch('http://localhost:9000/upload', {
      method: 'POST',
      body: formDataList[currentIndex],
      signal,
    })
      .then((res) => {
        // 请求完成后，从请求池和控制器列表中移除
        taskPool = taskPool.filter((t) => t !== task);
        abortControllers = abortControllers.filter((c) => c !== controller);
        return res.json();
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.error('分片上传失败', err);
          // 无论何种错误，都清理状态
          taskPool = taskPool.filter((t) => t !== task);
          abortControllers = abortControllers.filter((c) => c !== controller);
        }
      });

    taskPool.push(task);

    // 当请求池满了，等待最快完成的一个请求再继续（释放并发名额）
    if (taskPool.length === MAX_CONCURRENT) {
      await Promise.race(taskPool);
    }

    currentIndex++;
  }

  // 只有再未中断的情况下，等待所有剩余请求完成
  if (isUploading.value) {
    await Promise.all(taskPool);
  }

  // 所有分片上传完成 -》 请求合并
  requestMerge();
};

// 最后，请求合并分片
const requestMerge = async () => {
  await fetch('http://localhost:9000/merge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      fileHash,
      fileName,
      size: CHUNK_SIZE, // 分片大小（用于计算写入位置）
    }),
  });

  // 合并完成后的清理
  isUploading.value = false;
  abortControllers = [];
};

/**
 * 中断上传（用户触发）
 */
const abortUpload = () => {
  if (!isUploading.value) return;

  // 1. 中断所有正在进行的请求
  abortControllers.forEach((controller) => controller.abort());

  // 2. 清理状态
  abortControllers = [];
  isUploading.value = false;

  // 3. 通知用户
  alert('上传已中断，下次可继续上传');
};
</script>
