import Vue from 'vue'
import Router from 'vue-router'
//test
import Code from '@/components/Code.vue';
import Notice from '@/components/Notice.vue';
import Tags from '@/components/Tags.vue';
import Tree from '@/components/Tree.vue';
import Profile from '@/components/Profile.vue';
import Main from '@/components/Main.vue'

//Community
import Community from '@/components/Community.vue';
import CreateTree from '@/components/CreateTree.vue';
import FreeBoard from '@/components/FreeBoard.vue';

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
      name: 'Home',
      component: Main,

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
      component: Tree,

      children: [
        {
          path: 'createtree',
          meta: {},
          name: 'createtree',
          component: CreateTree
        },
      ]

    },
    {
      path: '/profile',
      meta: {
      },
      name: 'profile',
      component: Profile
    },
    {
      path: '/code',
      name: 'code',
      meta: {

      },
      component: Code
    },
    {
      path: '/freeboard/:topic',
      meta: {},
      name: 'freeboard',
      component: FreeBoard
    },
  ]
})
