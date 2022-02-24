import {defineUserConfig, DefaultThemeOptions} from 'vuepress'
import { en } from './locales/en'
import { zh } from './locales/zh'

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  title: 'UniSign',
  locales: {
    '/': {
      lang: 'en-US',
      description: 'The generic interface between private-key managers and applications for the Web3.0.',
    },
    '/zh/': {
      lang: 'zh-CN',
      description: '连接你所有的私钥和 Dapp',
    },
  },

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    darkMode: false,
    logo: '/favicon.png',
    repo: 'https://github.com/UniSign/unisign.github.io',
    locales: {
      '/': {
        selectLanguageName: 'English',
        selectLanguageText: 'Languages',
        navbar: en.navbar,
        sidebar: en.sidebar
      },
      '/zh/': {
        selectLanguageName: '中文',
        selectLanguageText: 'Languages',
        editLinkText: '编辑此页',
        navbar: zh.navbar,
        sidebar: zh.sidebar
      },
    }
  },

  plugins: [
    ['vuepress-plugin-clean-urls', {
      normalSuffix: '',
    }],
    [
      // 'vuepress-plugin-redirect',
      'vuepress-plugin-redirect',
      {
        // locales: true,
        redirectors: [
          {
            base: '/',
            alternative: '/guide/',
          },
        ],
      },
    ],
    ['@vuepress/plugin-search', {
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/zh/': {
          placeholder: '搜索',
        },
      },
    }],
  ]
})