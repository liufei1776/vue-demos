import { createI18n } from 'vue-i18n';

const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  'ja-JP': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',

  datetimeFormats,
  messages: {
    'zh-CN': {
      header: '这是header部分',
      // main: "这是内容部分, 你的邮箱 {account}{'@'}{domain}",
      main: 'no apples | one apple | {count} apples',
      footer: '这是footer部分',
    },
    'en-US': {
      header: 'This is the header',
      main: 'The is the content',
      footer: 'The is the footer',
    },
  },
});
