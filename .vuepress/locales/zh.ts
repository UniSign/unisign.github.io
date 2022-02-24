import { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = [
  '/zh/guide/',
  '/zh/protocol/',
]

export const navbar = [{
  text: 'UniSign 协议',
  link: '/zh/protocol/'
}, {
  text: 'UniSign 官网',
  link: 'https://unisign.org'
}]

export const zh = {
  sidebar,
  navbar,
}