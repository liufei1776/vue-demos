// 观察者模式核心逻辑（组合式函数）
import { ref } from 'vue';

export function useSubject() {
  const observers = ref(new Set()); // 使用 Set 避免重复添加

  // 添加观察者
  const addObserver = (observer) => {
    observers.value.add(observer);
  };

  // 移除观察者
  const removeObserver = (observer) => {
    observers.value.delete(observer);
  };

  // 通知所有观察者
  const notify = (payload) => {
    observers.value.forEach((observer) => {
      if (typeof observer.update === 'function') {
        observer.update(payload); // 传递状态数据
      }
    });
  };

  return { observers, addObserver, removeObserver, notify };
}
