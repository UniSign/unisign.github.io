import {defineUserConfig, DefaultThemeOptions} from 'vuepress'
import { en } from './locales/en'
import { zh } from './locales/zh'

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  title: 'UniSign',

  // theme and its config
  // theme: 'vuepress-theme-book',
  theme: '@vuepress/theme-default',
  themeConfig: {
    darkMode: false,
    logo: '/favicon.png',
    repo: 'https://github.com/UniSign/unisign-docs',
    locales: {
      '/': {
        selectLanguageName: 'English',
        selectLanguageText: 'Languages',
        navbar: [{
          text: 'Guide',
          link: './guide'
        }, {
          text: '教程',
          children: ['./guide']
        }],
        sidebar: en.sidebar
      },
      '/zh/': {
        selectLanguageName: '中文',
        selectLanguageText: 'Languages',
        editLinkText: '编辑此页',
        navbar: [{
          text: 'Guide',
          link: './guide'
        }, {
          text: '教程',
          children: ['./guide']
        }],
        sidebar: zh.sidebar
      }
    }
  },
  locales: {
    '/': {
      lang: 'en-US',
      description: 'The generic interface between private-key managers and applications for the Web3.0.',
    },
    '/zh/': {
      lang: 'zh-CN',
      description: '连接你所有的私钥和 Dapp',
    }
  },
  plugins: [
    ['vuepress-plugin-clean-urls', {
      normalSuffix: '',
    }]
  ]
})