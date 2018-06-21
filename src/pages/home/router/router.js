import Vue from 'vue'
import Router from 'vue-router'
import A from '../views/A'
import B from '../views/B'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: A
    },
    {
      path: '/a',
      name: 'a',
      component: A
    },
    {
      path: '/b',
      name: 'b',
      component: B
    }
  ]
})