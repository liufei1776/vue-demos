import { describe, it, expect, vi } from 'vitest';

describe('异步函数测试', () => {
  it('Promise Reject', async () => {
    const rejectFn = () => Promise.reject(new Error('异步错误'));
    await expect(rejectFn).rejects.toThrow('异步错误');
  });

  it('模拟网络错误时, fetch请求失败', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch');
    mockFetch.mockRejectedValue(new Error('请求失败'));

    await expect(mockFetch('/api')).rejects.toThrow('请求失败');
    expect(mockFetch).toHaveBeenCalledWith('/api');
  });

  it('模拟 fetch 返回 http 404', async () => {
    const fetchData = async () => {
      const res = await fetch('/api');
      if (!res.ok) throw new Error('请求失败');
      return res.json();
    };

    // @ts-ignore
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false, // 404 or 500,
      status: 404,
    });

    await expect(fetchData()).rejects.toThrow('请求失败');
  });
});
