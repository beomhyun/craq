import Vue from 'vue'
import Router from 'vue-router'
//test
import Notice from '@/components/Notice.vue';
import Tags from '@/components/Tags.vue';

//tree
import Tree from '@/components/Tree.vue';
import AddTree from '@/components/freeboardDir/CreateTree.vue';
import Community from '@/components/freeboardDir/Community.vue'
//
import Profile from '@/components/Profile.vue';
import Main from '@/components/Main.vue'

// Code
import Code from '@/components/Code.vue';
import AskQuestion from '@/components/AskQuestion.vue';
import CodeDetail from '@/components/CodeDetail.vue';

//Community
import FreeBoard from '@/components/freeboardDir/FreeBoard.vue';
import FreeHome from '@/components/freeboardDir/FreeHome.vue';
import FreeBoardWrite from '@/components/freeboardDir/FreeBoardWrite.vue';
import FreeDetail from '@/components/freeboardDir/FreeDetail.vue';

import ShowDetail from '@/components/freeboardDir/ShowDetail.vue'
import FreeEdit from '@/components/freeboardDir/FreeEdit.vue'
// import FreeDetail from '@/components/FreeDetail.vue'
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
      name: 'home',
      component: Main,

    },
    {
      path: '/notice',
      meta: {},
      name: 'notice',
      component: Notice
    },
    {
      path: '/tags',
      meta: {},
      name: 'tags',
      component: Tags
    },

    // Tree
    {
      path: '/tree',
      meta: {},
      name: 'tree',
      component: Tree,
      children : [
        {
          path: '',
          name : 'community',
          component : Community
        },
        {
          path : 'addtree',
          name : 'addtree',
          component : AddTree,
        }
      ]
    },
    {
      path: '/profile/:user_name',
      meta: {
      },
      name: 'profile',
      component: Profile
      // this.$router.push({'name': 'profile', 'params':{user_name: 'rngus'}})
    },
    {
      path: '/code',
      name: 'code',
      meta: {

      },
      component: Code,
    },
    {
      path: '/askquestion',
      meta: {},
      name: 'askquestion',

      component: AskQuestion
    },



    // FreeBoard
    {
      path: '/freeboard/:topic',
      meta: {},
      name: 'freeboard',
      component: FreeBoard,
      // props : true,
      children : [
        {
          path : '',
          name : 'home',
          component : FreeHome
        },
        {
          path : 'write',
          name : 'freewrite',
          component : FreeBoardWrite
        },
        {
          path : 'detail/:id',
          name : 'freedetail',
          component : FreeDetail,
          props : true,
        },
        {
          path : 'detail/:id/edit',
          name : 'freeedit',
          component : FreeEdit,
          props : true
        }
      ]
    },
    {
      path: '/code/:question_pk',
      name: 'Questions',
      component: CodeDetail,
      props: true
    }
  ]
})
