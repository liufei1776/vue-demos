import { vi, expect, it, describe } from 'vitest';

describe('学习 vi.fn', () => {
  it('mock fn 基础监控 1', () => {
    const mockLog = vi.fn();
    mockLog.mockReturnValue('success');

    expect(mockLog()).toBe('success');

    mockLog.mockReturnValue('***');
    expect(mockLog('pwd')).toBe('***');

    expect(mockLog).toHaveBeenCalledTimes(2);
  });

  it('mock fn 基础监控 2', () => {
    const mockLog = vi.fn();
    mockLog('error');
    mockLog('warn');

    // 验证调用细节（替身自带“记忆芯片”）
    console.log(mockLog.mock.calls); // → [ ['error'], ['warn'] ] ← 记录每次调用的参数！

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith('error');
  });

  it('mock fn 异步返回', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: 1 }),
    });
    const res = await mockFetch();
    const data = await res.json();

    expect(data.id).toBe(1);
  });
});
