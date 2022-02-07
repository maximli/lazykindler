export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/book_list',
    icon: 'ReadOutlined',
    name: '书籍',
    routes: [
      {
        name: '集合',
        icon: 'smile',
        path: '/book_list/book_collections',
        component: './book_list/book_collections',
      },
      {
        name: '书库',
        icon: 'smile',
        path: '/book_list/all_books',
        component: './book_list/all_books',
      },
      {
        name: '临时导入',
        icon: 'smile',
        path: '/book_list/tmp_books',
        component: './book_list/tmp_books',
      },
    ],
  },
  {
    path: '/kindle',
    name: 'kindle',
    icon: 'FireOutlined',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/sub-page1', name: '笔记', icon: 'smile', component: './Welcome' },
      { path: '/admin/sub-page2', name: '生词', icon: 'smile', component: './Welcome' },
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
