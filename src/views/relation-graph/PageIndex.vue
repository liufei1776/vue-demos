<template>
  <div class="graph-container">
    <RelationGraph ref="rg" :options="rgOptions">
      <template #node="{ node }">
        <div class="custom-node">
          <div>{{ node.text }}</div>
          <div>{{ node.data.desc }}</div>
        </div>
      </template>
    </RelationGraph>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';
import RelationGraph from 'relation-graph-vue3';
import type { RGOptions, RGJsonData } from 'relation-graph-vue3';

const rgInstance = useTemplateRef<InstanceType<typeof RelationGraph>>('rg');

const rgOptions: RGOptions = {
  layout: {
    layoutName: 'tree',
    from: 'top',
  },
};

const rgData: RGJsonData = {
  rootId: 'nodeId',
  nodes: [
    { id: 'node1', text: '总部', data: { desc: '一级部门' } },
    { id: 'node2', text: '技术部', data: { desc: '二级部门' } },
    { id: 'node3', text: '产品部', data: { desc: '二级级部门' } },
  ],
  lines: [
    { from: 'node1', to: 'node2', text: '' },
    { from: 'node1', to: 'node3', text: '' },
  ],
};

onMounted(() => {
  rgInstance.value?.setJsonData(rgData);
});
</script>

<style scoped>
.graph-container {
  height: 100%;
  background-color: aliceblue;
}

.custom-node {
  width: 100px;
  height: 50px;
}
</style>
