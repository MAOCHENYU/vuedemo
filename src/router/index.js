import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '??????', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    alwaysShow: true, // will always show the root menu
    name: 'goods',
    meta: {
      title: '??????',
      icon: 'shopping',
      roles: ['*'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/goods/index'),
        name: 'goods',
        meta: { title: '????????????', noCache: true, roles: ['*'] }
      }
      // {
      //   path: 'goodtype',
      //   component: () => import('@/views/goods/goodtype'),
      //   name: 'goodtype',
      //   meta: { title: '????????????', noCache: true, roles: ['*'] }
      // }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'user',
  //   meta: {
  //     title: '??????',
  //     icon: 'el-icon-user-solid',
  //     roles: ['*'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/user/index'),
  //       name: 'admin',
  //       meta: { title: '?????????', noCache: true, roles: ['*'] }
  //     },
  //     {
  //       path: 'business',
  //       component: () => import('@/views/user/business'),
  //       name: 'business',
  //       meta: { title: '??????', noCache: true, roles: ['*'] }
  //     },
  //     {
  //       path: 'user',
  //       component: () => import('@/views/user/user'),
  //       name: 'users',
  //       meta: { title: '??????', noCache: true, roles: ['*'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/model',
  //   component: Layout,
  //   redirect: '/model/admin',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'model',
  //   meta: {
  //     title: '??????',
  //     icon: 'tree-table',
  //     roles: ['*'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'wechat',
  //       component: () => import('@/views/model/wechat'),
  //       name: 'wechat',
  //       meta: { title: '?????????', noCache: true, roles: ['*'] }
  //     },
  //     {
  //       path: 'admin',
  //       component: () => import('@/views/model/admin'),
  //       name: 'adminmodel',
  //       meta: { title: '??????', noCache: true, roles: ['*'] }
  //     },
  //   ]
  // },
  {
    path: '/order',
    component: Layout,
    // redirect: '/order/index',
    // alwaysShow: true, // will always show the root menu
    // name: 'order',
    // meta: {
    //   title: '??????',
    //   icon: 'lock',
    //   roles: ['*'] // you can set roles in root nav
    // },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'orderlist',
        meta: { title: '????????????', icon: 'el-icon-tickets', noCache: true }
      }
    ]
  },
  // {
  //   path: '/roles',
  //   component: Layout,
  //   // redirect: '/user/roles/rolelist',
  //   // alwaysShow: true, // will always show the root menu
  //   // name: 'roles',
  //   // meta: {
  //   //   title: '??????',
  //   //   icon: 'lock',
  //   //   roles: ['*'] // you can set roles in root nav
  //   // },
  //   children: [
  //     {
  //       path: 'rolelist',
  //       component: () => import('@/views/roles/rolelist'),
  //       name: 'rolelist',
  //       meta: { title: '????????????', icon: 'peoples', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
