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
        <td v-html="board.ROWNUM"></td>
        <td v-html="board.TITLE" @click="showDetail(board)"></td>
        <!-- <td v-html="board.title"><router-link :to="{ name: 'freedetail', params: {id : board.id} }"></router-link></td> -->
        <td v-html="board.USERNAME"></td>
        <td v-html="board.CREATED_AT"></td>
        <td v-html="board.VIEW"></td>
        <td v-html="board.VOTE"></td>
      </tr>
      </tbody>
    </table>
    <div class="pagenation">
        <ul v-for="index in totalpage">
            <li v-html='index' @click='showpage(index)'></li> |
        </ul>
    </div>
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
    'topic',
    'page'
  ],
  data() {
    return {
      newtoggle : true,
      viewtoggle : true,
      isNew : false,
      noticeToggle : false,
      topic_articles : [],
      topic_notices : []
      }
    },
    created() {
      // alert(this.topic);
      this.$axios
      .get(`articles/${this.topic}/${this.page}`)
      .then((res) => {
        this.topic_articles = res.data;
        console.log(this.topic_articles)
      })
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
