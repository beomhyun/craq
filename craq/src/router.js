import Vue from 'vue'
import Router from 'vue-router'
//test
import Code from '@/components/Code.vue';
import Notice from '@/components/Notice.vue';
import Tags from '@/components/Tags.vue';
import Tree from '@/components/Tree.vue';
import Profile from '@/components/Profile.vue';
//end test
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      meta: {
        layout: "Default"
      },
      name: 'code',
      component: Code,

    },
    {
      path: '/notice',
      meta: {
      },
      name: 'notice',
      component: Notice
    },
    {
      path: '/tags',
      meta: {
      },
      name: 'tags',
      component: Tags
    },
    {
      path: '/tree',
      meta: {
      },
      name: 'tree',
      component: Tree
    },
    {
      path: '/profile',
      meta: {
      },
      name: 'profile',
      component: Profile
    },
  ]
})
