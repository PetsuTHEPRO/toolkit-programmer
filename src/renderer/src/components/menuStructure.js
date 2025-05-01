export const menuStructure = (t) => [
  {
    id: 'Dashboard',
    text: t('sidebar.dashboard'),
    icon: 'bx bx-pie-chart-alt-2',
    rota: 'dashboard'
  },
  {
    id: 'Resources',
    text: t('sidebar.resources.title'),
    icon: 'bx bx-folder',
    rota: '',
    children: [
      {
        id: 'Images',
        text: t('sidebar.resources.images'),
        icon: 'bx bx-image-alt',
        rota: 'image'
      },
      {
        id: 'Fonts',
        text: t('sidebar.resources.fonts'),
        icon: 'bx bx-font',
        rota: 'font'
      },
      {
        id: 'Palette',
        text: t('sidebar.resources.palette'),
        icon: 'bx bx-palette',
        rota: 'color'
      }
    ]
  },
  {
    id: 'Developers',
    text: t('sidebar.developers.title'),
    icon: 'bx bx-code-block',
    rota: '',
    children: [
      { id: 'API', text: t('sidebar.developers.api'), icon: 'bx bx-extension', rota: 'api' },
      { id: 'Code', text: t('sidebar.developers.code'), icon: 'bx bx-code-alt', rota: 'algorithm' },
      {
        id: 'Frameworks',
        text: t('sidebar.developers.framework'),
        icon: 'bx bx-calculator',
        rota: 'framework'
      }
    ]
  },
  {
    id: 'Learn',
    text: t('sidebar.learn.title'),
    icon: 'bx bx-brain',
    rota: '',
    children: [
      {
        id: 'Articles',
        text: t('sidebar.learn.articles'),
        icon: 'bx bx-book-open',
        rota: 'article'
      },
      { id: 'Videos', text: t('sidebar.learn.videos'), icon: 'bx bx-video', rota: 'video' },
      { id: 'Links', text: t('sidebar.learn.links'), icon: 'bx bx-link', rota: 'link' }
    ]
  },
  {
    id: 'Help',
    text: t('sidebar.help'),
    icon: 'bx bx-bot',
    rota: 'assistenteIA'
  },
  {
    id: 'Settings',
    text: t('sidebar.settings'),
    icon: 'bx bx-cog',
    rota: 'configuracao'
  },
  {
    id: 'Logout',
    text: 'Logout',
    icon: 'bx bx-log-out',
    rota: 'home'
  }
]
