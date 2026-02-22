import { describe, it, expect, vi } from 'vitest';
import { getUser, sendLog } from './api';

describe('学习 vi.spyOn', () => {
  it('应调用 fetch 获取用户数据', async () => {
    // 给 global.fetch 装上“替身”：当被调用时，返回假数据

    // @ts-ignore
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ id: 1, name: '小明' }),
    });

    // 🚀 执行测试（此时 fetch 是替身！）
    const user = await getUser(1);

    // ✅ 验证两件事：
    expect(user).toEqual({ id: 1, name: '小明' }); // 1. 返回值正确
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/user/1'); // 2. fetch 确实被调用了！
  });

  it('应调用 fetch 发送日志', async () => {
    // @ts-ignore
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true });

    // 执行被测函数
    const res = await sendLog('error:404');

    expect(res.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      '/log',
      expect.objectContaining({
        // 第2参数：配置对象（宽松匹配关键字段）
        // headers: {
        //   'Content-Type': 'application/json;charset=utf-8',
        // },
        // method: 'POST',
        body: JSON.stringify({ msg: 'error:404' }), // ← 重点：验证 body 内容！
      }),
    );
  });
});
