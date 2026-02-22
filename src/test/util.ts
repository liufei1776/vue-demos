import { getUser } from './api'; // 依赖 api 模块

export const getUserName = async (id: number) => {
  const user = await getUser(id);
  return user.name.toUpperCase();
};
