import { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = [
  '/guide/',
  '/protocol/',
]

export const navbar = [{
  text: 'UniSign Protocol',
  link: '/protocol/'
}, {
  text: 'UniSign Home',
  link: 'https://unisign.org'
}]

export const en = {
  sidebar,
  navbar,
}