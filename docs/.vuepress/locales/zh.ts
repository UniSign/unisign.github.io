import { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = [
  '/zh/',
  '/zh/faq',
  '/zh/terminology',
  {
  text: '注册 DAS',
  children: [
    '/zh/register/charsets',
    '/zh/register/open-registration-rules',
    '/zh/register/pricing',
  ],
}, {
  text: '共同建设',
  children: [
    '/zh/contribute/build-together',
    '/zh/contribute/channel',
    '/zh/contribute/keeper',
    '/zh/contribute/referral',
    '/zh/contribute/registrar',
  ],
}, {
  text: '开发者',
  children: [
    '/zh/developers/build-application',
    '/zh/developers/records-key-namespace',
    '/zh/developers/wallet-integration',
  ],
}, {
  text: '其他',
  children: [
    '/zh/others/change-log',
    '/zh/others/why-assets-on-ckb-can-managed-by-btc-address',
    {
      text: `DAS 官网`,
      link: `https://did.id`,
    },
    {
      text: `Github`,
      link: `https://github.com`,
    },
  ],
}]

export const zh = {
  sidebar,
}