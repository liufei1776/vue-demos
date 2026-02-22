import { h } from 'vue';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyButton from './components/MyButton.vue';
import UserCard from './components/UserCard.vue';
import SearchInput from './components/SearchInput.vue';
import LoginForm from './components/LoginForm.vue';

describe('MyButton 组件测试', () => {
  it('测试1: 验证插槽内容渲染', () => {
    const wrapper = mount(MyButton, {
      slots: { default: '提交' },
    });

    expect(wrapper.text()).toContain('提交');
  });

  it('测试2: 验证disabled状态', () => {
    const wrapper = mount(MyButton, {
      props: { disabled: true },
    });

    expect(wrapper.classes()).toContain('is-disabled');
  });

  it('测试3: 非禁用状态下验证点击事件', async () => {
    const wrapper = mount(MyButton);

    await wrapper.trigger('click'); // 🌟 关键：触发点击事件（异步！）
    expect(wrapper.emitted()).toHaveProperty('click'); // 验证 emit 被调用
  });

  it('测试4: 禁用状态下点击事件无效', async () => {
    const wrapper = mount(MyButton, {
      props: { disabled: true },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});

describe('UserCard 组件测试', () => {
  it('作用域插槽', () => {
    // 🔑 关键：用函数模拟作用域插槽
    const wrapper = mount(UserCard, {
      slots: {
        default({ user, isLoggedIn }) {
          return h('div', [
            h('span', { class: 'name' }, user.name),
            h('span', { class: 'status' }, isLoggedIn ? '已登录' : '未登录'),
          ]);
        },
      },
    });

    console.log(wrapper.html());

    // 验证：插槽收到正确的值
    expect(wrapper.find('.name').text()).toBe('xiaoming');
    expect(wrapper.find('.status').text()).toBe('已登录');
  });
});

describe('UserCard 组件测试', () => {
  it('输入时应触发 search 事件，携带输入值', async () => {
    const wrapper = mount(SearchInput);

    // 🔑 触发 input 事件（模拟用户输入）
    await wrapper.find('input').setValue('hello'); // setValue = input + change 事件

    // 验证：search 事件被触发，且参数正确
    expect(wrapper.emitted('search')).toBeDefined();
    expect(wrapper.emitted('search')?.[0]).toEqual(['hello']);
  });

  it('调用 组件实例clear方法 应触发 clear 事件', () => {
    const wrapper = mount(SearchInput);

    // 🔑 通过 wrapper.vm 访问组件实例方法
    wrapper.vm.clear();

    expect(wrapper.emitted('clear')).toBeTruthy();
  });
});

describe('LoginForm 组件测试', () => {
  it('提交表单应触发 login 事件，携带用户名和密码', async () => {
    const wrapper = mount(LoginForm);

    // 🔑 设置输入框值
    await wrapper.find('input[name="username"]').setValue('admin');
    await wrapper.find('input[name="password"]').setValue('123456');

    // 🔑 触发表单提交
    await wrapper.find('form').trigger('submit');

    // 验证：login 事件被触发，参数正确
    const loginEvent = wrapper.emitted('login');
    const loginEvetPaylod = loginEvent?.[0][0];

    // 验证：login 事件被触发，参数正确
    expect(loginEvent).toBeTruthy();
    expect(loginEvetPaylod).toEqual({ username: 'admin', password: '123456' });
  });

  it('用户名或密码为空时，不应触发 login 事件', async () => {
    const wrapper = mount(LoginForm);

    await wrapper.find('input[name="username"]').setValue('admin');
    await wrapper.find('input[name="password"]').setValue(''); // 密码未填写
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('login')).toBeUndefined(); // ← 未触发
  });
});
