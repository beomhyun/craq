<template>
  <div class="container">
    <table class="freetable table width-100%">
      <col width="10%"><col width="30%"><col width="10%"><col width="15%"><col width="20%"><col width="15%">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
          <th>추천수</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="notice in topic_notices" v-if="noticeToggle">
        <td>공지</td>
        <td v-html="notice.title" @click="showDetail(notice)"></router-link></td>
        <!-- <td v-html="notice.title"><router-link :to="{ name: 'freedetail', params: {id : notice.id} }"></router-link></td> -->
        <td v-html="notice.user_name"></td>
        <td v-html="notice.createAt"></td>
        <td v-html="notice.views"></td>
        <td v-html="notice.recommend"></td>
      </tr>
      <tr v-for="board in sortedData">
        <td v-html="board.id"></td>
        <td v-html="board.title" @click="showDetail(board)"></td>
        <!-- <td v-html="board.title"><router-link :to="{ name: 'freedetail', params: {id : board.id} }"></router-link></td> -->
        <td v-html="board.user_name"></td>
        <td v-html="board.createAt"></td>
        <td v-html="board.views"></td>
        <td v-html="board.recommend"></td>
      </tr>
      </tbody>
    </table>
    <div class="container max-width-lg">
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="notice">공지사항</button>
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="newest">최신순</button>
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="viewSort">조회순</button>
      <button class="btn btn--primary btn--md" style="margin:5px;" @click="boardwrite">글쓰기</button>
    </div>
  </div>
</template>

<script>
export default {
  name : "FreeList",
  components : {

  },
  props :[
    'topic'
  ],
  data() {
    return {
      newtoggle : true,
      viewtoggle : true,
      isNew : false,
      noticeToggle : false,
      topic_articles : [
          {
            id : '1',
            title : 'lorem ipsum1',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31'
          },
          {
            id : '2',
            title : 'lorem ipsum2',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

            user_name : '정준희',
            createAt : '19.07.25',
            views : '8000',
            recommend : '31'
          },
          {
            id : '3',
            title : 'lorem ipsum3',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

            user_name : '정준희',
            createAt : '19.07.25',
            views : '1700',
            recommend : '31'
          },
          {
            id : '4',
            title : 'lorem ipsum4',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user_name : '정준희',
            createAt : '19.07.25',
            views : '9000',
            recommend : '31',
          },
          {
            id : '5',
            title : 'lorem ipsum5',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user_name : '정준희',
            createAt : '19.07.25',
            views : '1800',
            recommend : '31'
          },
        ],
        topic_notices : [
          {
            id : '5',
            title : 'First Notice',
            body : '규정을 잘 지킵시다',
            user_name : '관리자',
            createAt : '19.07.29',
            views : '10000',
            recommend : '331'
          },
          {
            id : '5',
            title : 'Second Notice',
            body : '규정 좀 잘 지킵시다.',
            user_name : '관리자',
            createAt : '19.07.29',
            views : '11000',
            recommend : '431'
          }
        ]
      }
    },
    created() {
      // alert(this.topic);
    },
    methods : {
      boardwrite() {
        this.$router.push({name:'freewrite'});
        // this.$router.push({name:"write"});
      },
      showDetail(board) {
        // this.$router.push({path: `${this.topic}/detail/${board.id}`, params: { info : board}});
        this.$router.push({name: 'freedetail' , params: { id: board.id, info : board}});
      },
      newest: function() {
        // Set slice() to avoid to generate an infinite loop!
        // alert("newest")
        this.isNew = true
        if(this.newtoggle) {
            this.newtoggle = false;
        }else {
          this.newtoggle = true;
        }
      },
      viewSort: function() {
        this.isNew = false;
        if(this.viewtoggle) {
          this.viewtoggle = false;
        }else {
          this.viewtoggle = true;
        }
      },
      notice() {
        this.noticeToggle = !this.noticeToggle;
      }
    },
    computed: {
      sortedData : function() {
        return this.topic_articles.sort((a,b) => {

          if(this.isNew) {
            if(this.newtoggle) {
              return a.id - b.id
            }else {
              return b.id - a.id
            }
          }else {
            if(this.viewtoggle) {
              return a.views - b.views
            }else {
              return b.views - a.views
            }
          }
        });
      }
    },
    watch: {
      newest() {},
      viewSort() {},
    }

}
</script>

<style>
table.freetable {
    border-collapse: separate;
    border-spacing: 3px;
    text-align: left;
    line-height: 1.5;
    border-top: 1px solid #ccc;
    margin : 20px 10px;
}
table.freetable th {
    /* width: 20%; */
    padding: 10px;
    font-weight: bold;
    vertical-align: top;
    border-bottom: 1px solid #ccc;
}
table.freetable td {
    /* width: 20%; */
    padding: 10px;
    vertical-align: top;
    border-bottom: 1px solid #ccc;
}
</style>
