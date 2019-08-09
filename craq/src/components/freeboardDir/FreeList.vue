<template>
  <div class="container">
    <table class="table freetable width-100%">
      <col v-if="isManager" width="10%"><col width="10%"><col width="30%"><col width="10%"><col width="15%"><col width="10%"><col width="10%">
      <thead>
        <tr>
          <th v-if="isManager">삭제</th>
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
        <td v-if="isManager"><button class="btn btn--primary btn-lg" style="margin:3px" @click="postDelete(notice.PK)">Delete</button></th>
        <td>공지</td>
        <td v-html="notice.TITLE" @click="showDetail(notice)"></td>
        <!-- <td v-html="notice.title"><router-link :to="{ name: 'freedetail', params: {id : notice.id} }"></router-link></td> -->
        <td v-html="notice.USERNAME"></td>
        <td v-html="notice.CREATED_AT"></td>
        <td v-html="notice.VIEW"></td>
        <td v-html="notice.VOTE"></td>
      </tr>
      <tr v-for="(board, idx) in sortedData">
        <td v-if="isManager"><button class="btn btn--primary btn-lg" style="margin:3px" @click="postDelete(board.PK)">Delete</button></th>
        <td v-html="board.PK"></td>
        <td v-html="board.TITLE" @click="showDetail(board)"></td>
        <!-- <td v-html="board.title"><router-link :to="{ name: 'freedetail', params: {id : board.id} }"></router-link></td> -->
        <td v-html="board.USERNAME"></td>
        <td v-html="board.CREATED_AT"></td>
        <td v-html="board.VIEW"></td>
        <td v-html="board.VOTE"></td>
      </tr>
      </tbody>
    </table>
    <div>
      <div class="pagination">
            <!-- <button type="button" name="button" v-if="startPage > 0" @click="startPage = startPage - 10"><</button>

            <ul v-for="index in totalpage">
                <li v-html='index + startPage' @click='showPage(index + startPage)'></li>
            </ul>
            <button type="button" name="button" v-if="startPage < endPage/10" @click="startPage = startPage + 10">></button> -->
            <Paginator :chunkSize="5" :maxPage="endPage" :curPage="page" @clicked="showPage"></Paginator>
      </div>
    </div>
    <div class="container max-width-lg center">
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="notice">공지사항</button>
      <!-- <button class="btn btn--subtle btn--md" style="margin:5px;" @click="newest">최신순</button>
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="viewSort">조회순</button> -->
      <button class="btn btn--primary btn--md" style="margin:5px;" @click="boardwrite">글쓰기</button>

      <form id="_frmForm1" name="frmForm1" @submit.prevent="searchArticle" class="form-horizontal">
        <div class="width-100%" >
          <select v-model="selected" class="form-control width-30%" autofocus>
            <!-- inline object literal -->
            <option selected="selected" v-bind:value="0">제목</option>
            <option v-bind:value="1">내용</option>
            <option v-bind:value="2">제목+내용</option>
          </select>
          <input type="search" name="searchA" v-model="searcharticle" class="form-control width-70%">
          <button type="submit" class="btn btn-accept btn-sm" name="button" style="margin:5px;">Search</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  name : "FreeList",
  components : {
    Paginator,
  },
  loading : Spinner,
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
      topic_notices : [],
      totalpage: 1,
      info: {},
      selected: 0,
      searcharticle : '',
      endPage : 0,
      isManager : false,
      }
    },
    // beforeRouteUpdate(to) {
    //   this.name = to.params.name
    // }
    created() {
      // alert(this.topic);
      this.$axios
      .get(`articles/${this.topic}/${this.page}`)
      .then((res) => {
        this.topic_articles = res.data.data;
        this.endPage = res.data.maxPage
        // if(this.startPage + this.pageSize < res.data.maxPage) {
        //   this.startPage = parseInt((this.page / 10)) * 10
        //   console.log(this.startPage)
        //   this.totalpage = this.pageSize;
        //   this.isMore = true;
        // }else {
        //   this.totalpage = res.data.maxPage % (this.pageSize+1);
        //   this.isMore = false
        // }
        console.log(this.topic_articles)
      });

      this.$axios
      .get(`articles/notices/topics/${this.topic}`)
      .then((res) => {
        this.topic_notices = res.data.data;
      });

      this.$axios
      .get(`managers/${this.topic}/${this.$session.get("userPk")}`)
      .then((res) => {
        console.log(res.data);
        if(res.data.status === "fail") {
          this.isManager = false;
        }else {
          this.isManager = true;
        }
      });
    },
    methods : {
      boardwrite() {
        this.$router.push({name:'freewrite'});
        // this.$router.push({name:"write"});
      },
      showDetail(board) {
        // this.$router.push({path: `detail/${board.PK}`, params: { id: `${board.PK}`, topic : `${this.topic}`}});
        // console.log(this.$route.name);
        if(this.$route.name !== "freedetail") {
          this.$router.push({name: 'freedetail' , params: { id: `${board.PK}`, topic : `${this.topic}`, page : this.page}});
        }else {
          // console.log(this.$route.name)
          this.$router.replace({name: 'freedetail' , params: { id: `${board.PK}`, topic : `${this.topic}`, page : this.page}});
          // this.$router.go(1);
        }
      },
      postDelete(postPK) {
        this.$axios
        .delete(`articles/${postPK}`)
        .then((res) => {
          this.$router.reload();
          // this.loaded: true,
        })
      },
      searchArticle() {
        this.$axios
        .get(`articles/searches?topic_id=${this.topic}&type_id=${this.selected}&word=${this.searcharticle}&page=1`)
        .then((res) => {
          this.topic_articles = res.data.data;
        })
      },
      showPage(index) {
        this.$axios
        .get(`articles/${this.topic}/${index}`)
        .then((res) => {
          this.topic_articles = res.data.data;

          this.page = index;
        })
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
              return a.ROWNUM - b.ROWNUM
            }else {
              return b.ROWNUM - a.ROWNUM
            }
          }else {
            if(this.viewtoggle) {
              return a.VIEW - b.VIEW
            }else {
              return b.VIEW - a.VIEW
            }
          }
        });
      },
      // this.showPage(this.page)
    },
    watch: {
      newest() {},
      viewSort() {},
    }

}
</script>

<style scoped lang="scss">
 table.freetable {
    border-collapse: separate;
    border-spacing: 3px;
    text-align: left;
    line-height: 1.5;
    border-top: 1px solid #ccc;
    margin : 20px 10px;

    th {
       padding: 10px;
       font-weight: bold;
       vertical-align: top;
       border-bottom: 1px solid #ccc;
       border-color: var(--color-on-primary)
     }

     td {
         padding: 10px;
         vertical-align: top;
         border-bottom: 1px solid #ccc;
     }
}
.pagination {
  // display: inline-block;
  ul {
  	list-style:none;
  	float:left;
  	display:inline;

    li {
    	float:left;
      padding:4px;
    	margin-right:3px;
    	width:15px;
    	// color:#000;
    	font:bold 12px tahoma;
    	border:1px solid #eee;
    	text-align:center;
    	text-decoration:none;

      :hover, :focus {
      	// color:#fff;
      	border:1px solid #f40;
      	// background-color:#f40;
      }
    }
  }

}
</style>
