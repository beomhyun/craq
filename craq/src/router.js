import Vue from 'vue'
import Router from 'vue-router'
//test
import Notice from '@/components/Notice.vue';
import Tags from '@/components/Tags.vue';
import Profile from '@/components/Profile.vue';
import Main from '@/components/Main.vue'

// Code
import Code from '@/components/Code.vue';
import AskQuestion from '@/components/AskQuestion.vue';
import CodeDetail from '@/components/CodeDetail.vue';
import CodeAnswer from '@/components/CodeAnswer.vue';
import CodeImprove from '@/components/CodeImprove.vue';

//tree
import Tree from '@/components/Tree.vue';
import AddTree from '@/components/freeboardDir/CreateTree.vue';
import Community from '@/components/freeboardDir/Community.vue'
//Community
import FreeBoard from '@/components/freeboardDir/FreeBoard.vue';
import FreeHome from '@/components/freeboardDir/FreeHome.vue';
import FreeBoardWrite from '@/components/freeboardDir/FreeBoardWrite.vue';
import FreeDetail from '@/components/freeboardDir/FreeDetail.vue';
import FreeEdit from '@/components/freeboardDir/FreeEdit.vue'
//Notice
import NoticeHome from '@/components/noticeDir/NoticeHome.vue';
import NoticeWrite from '@/components/noticeDir/NoticeWrite.vue';
import NoticeDetail from '@/components/noticeDir/NoticeDetail.vue';

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
      path: '/tags',
      meta: {
      },
      name: 'tags',
      component: Tags
    },
    {
      path: '/profile/:user_name',
      meta: {
      },
      name: 'profile',
      component: Profile,
      prop:true
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
    {
      path: '/code/:question_pk',
      name: 'Questions',
      component: CodeDetail,
      props: true
    },
    {
      path: '/code/:question_pk/answers/',
      name: 'Answer',
      component: CodeAnswer,
      props: true
    },
    {
      path: '/questions/:question_pk/improve/',
      name: 'Improve',
      component: CodeImprove,
      props: true
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
     path: '/notice',
     meta: {
     },
     name: 'notice',
     component: Notice,
     children : [
       {
         path: '',
         name : 'noticehome',
         component : NoticeHome
       },
       {
         path : 'write',
         name : 'noticewrite',
         component : NoticeWrite
       },
       {
         path : 'detail/:id',
         name : 'noticedetail',
         component : NoticeDetail,
         props : true,
       }
     ]
   },
  ]
})
