import { describe, it, expect, vi } from 'vitest';

vi.mock('./api', () => ({
  getUser: vi.fn().mockResolvedValue({ id: 1, name: 'xiaoming' }),
}));

import { getUserName } from './util';
import { getUser } from './api';

describe('学习 vi mock', () => {
  it('获取用户名（大写）', async () => {
    const name = await getUserName(1);

    expect(name).toBe('XIAOMING');
    expect(getUser).toHaveBeenCalledWith(1);
    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
