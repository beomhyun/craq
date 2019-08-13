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
        <td class="" v-html="notice.TITLE" @click="showDetail(notice)"></td>
        <!-- <td v-html="notice.title"><router-link :to="{ name: 'freedetail', params: {id : notice.id} }"></router-link></td> -->
        <td v-html="notice.USERNAME"></td>
        <td><time itemprop=notice.CREATED_AT datetime=notice.CREATED_AT>{{notice.CREATED_AT|formatDate}}</time></td>
        <td v-html="notice.VIEW"></td>
        <td v-if="notice.VOTE != null" v-html="notice.VOTE"></td>
        <td v-else>0</td>
      </tr>
      <tr v-for="board in topic_articles">
        <td v-if="isManager"><button class="btn btn--primary btn-lg" style="margin:3px" @click="postDelete(board.PK)">Delete</button></th>
        <td v-html="board.ROWNUM"></td>
        <td class="table-hover" v-html="board.TITLE" @click="showDetail(board)"></td>
        <!-- <td v-html="board.title"><router-link :to="{ name: 'freedetail', params: {id : board.id} }"></router-link></td> -->
        <td v-html="board.USERNAME"></td>
        <td><time itemprop=board.CREATED_AT datetime=board.CREATED_AT>{{board.CREATED_AT|formatDate}}</time></td>
        <td v-html="board.VIEW"></td>
        <td v-if="board.VOTE != null" v-html="board.VOTE"></td>
        <td v-else>0</td>
      </tr>
      </tbody>
    </table>
    <div>
      <div class="pagination">
            <Paginator :chunkSize="5" :maxPage="endPage" :curPage="page" @clicked="showPage"></Paginator>
      </div>
    </div>
    <div class="container max-width-lg center">
      <button class="btn btn--subtle btn--md" style="margin:5px;" @click="notice">공지사항</button>
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
      noticeToggle : false,
      topic_articles : [],
      topic_notices : [],
      selected: 0,
      searcharticle : '',
      endPage : 0,
      isManager : false,
      isSearch: false,
      searchPage : 1,
      }
    },
    // beforeRouteUpdate(to) {
    //   this.name = to.params.name
    // }
    created() {
      // alert(this.topic);
      this.freelistCall();

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
      freelistCall() {
        this.$axios
        .get(`articles/${this.topic}/${(this.page)}`)
        .then((res) => {
          if(res.data.maxPage > 0) {
            this.topic_articles = res.data.data;
            this.endPage = res.data.maxPage;
            console.log(this.topic_articles)
          }
        });
      },
      boardwrite() {
        this.$router.push({name:'freewrite'});
        // this.$router.push({name:"write"});
      },
      showDetail(board) {
        this.$router.push({name: 'freedetail' , params: { id: `${board.PK}`, topic : `${this.topic}`, page : this.page}});
      },
      postDelete(postPK) {
        this.$axios
        .delete(`articles/${postPK}`)
        .then((res) => {
          // this.$router.reload();
          this.freelistCall();
          // this.loaded: true,
        })
      },
      searchArticle() {
        this.$axios
        .get(`articles/searches?topic_id=${this.topic}&type_id=${this.selected}&word=${this.searcharticle}&page=1`)
        .then((res) => {
          if(res.data.data != null) {
            this.topic_articles = res.data.data;
            this.isSearch = true;
            this.endPage = res.data.maxPage;
          }else {
            alert("검색 결과가 없습니다.!!")
          }
        })
      },
      showPage(index) {
        if(this.isSearch) {
          this.$axios
          .get(`articles/searches?topic_id=${this.topic}&type_id=${this.selected}&word=${this.searcharticle}&page=${index}`)
          .then((res) => {
            this.topic_articles = res.data.data;
            this.page = index;
          })
        }else {
          this.$axios
          .get(`articles/${this.topic}/${index}`)
          .then((res) => {
            this.topic_articles = res.data.data;
            this.page = index;
          })
        }
      },
      notice() {
        this.noticeToggle = !this.noticeToggle;
      }
    },
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

     .table-hover:hover {
       // background: var(--color-tertiary);
       color : var(--color-primary);
       font-weight: bold;
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
