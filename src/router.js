import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children:[
        {
          path: '/home',
          redirect: '/home/monitor'
        },
        {
          path: '/home/monitor',
          name: 'monitor',
          component: () => import( './views/monitor/monitor.vue')
        },
        {
          path: '/home/report',
          name: 'report',
          component: () => import( './views/report/report.vue'),
          children:[
            {
              path: '/home/report',
              redirect: '/home/report/record'
            },
            {
              path: '/home/report/record',
              name: 'record',
              component: () => import( './views/report/record.vue')
            },
            {
              path: '/home/report/valve',
              name: 'valve',
              component: () => import( './views/report/valve.vue')
            },
            {
              path: '/home/report/pip',
              name: 'pip',
              component: () => import( './views/report/pip.vue')
            },
            {
              path: '/home/report/valveAly',
              name: 'anaValve',
              component: () => import( './views/report/valveAly.vue')
            },
            {
              path: '/home/report/pipAly',
              name: 'anaPip',
              component: () => import( './views/report/pipAly.vue')
            },
            {
              path: '/home/report/personAly',
              name: 'person',
              component: () => import( './views/report/personAly.vue')
            }
          ]
        },
        {
          path: '/home/manage',
          name: 'manage',
          component: () => import( './views/manage/manage.vue'),
          children:[
            {
              path: '/home/manage',
              redirect: '/home/manage/teams'
            },
            {
              path: '/home/manage/device',
              name: 'device',
              component: () => import( './views/manage/device.vue')
            },
            {
              path: '/home/manage/teams',
              name: 'teams',
              component: () => import( './views/manage/teams.vue')
            },
            {
              path: '/home/manage/car',
              name: 'carManage',
              component: () => import( './views/manage/car.vue')
            }
          ]
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( './views/login/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import( './views/register/register.vue')
    }
  ]
})
