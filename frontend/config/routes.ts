export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/book_list',
    icon: 'table',
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
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
