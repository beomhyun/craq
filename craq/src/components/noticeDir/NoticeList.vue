<template>
  <div class="container">
    <table class="table freetable width-100%">
      <col v-if="isManager" width="10%"><col width="30%"><col width="10%"><col width="15%"><col width="10%"><col width="10%">
      <thead>
        <tr>
          <th v-if="isManager">삭제</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
          <th>추천수</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="notice in noticesArticles">
        <td v-if="isManager"><button class="btn btn--primary btn-lg" style="margin:3px" @click="postDelete(notice.PK)">Delete</button></th>
        <td v-html="notice.TITLE" @click="showDetail(notice)"></td>
        <td v-html="notice.USERNAME"></td>
        <td><time itemprop=notice.CREATED_AT datetime=notice.CREATED_AT>{{notice.CREATED_AT|formatDate}}</time></td>
        <td v-html="notice.VIEW"></td>
        <td v-if="notice.VOTE != null" v-html="notice.VOTE"></td>
        <td v-else>0</td>
      </tr>
      </tbody>
    </table>
    <div>
      <div class="pagination">
            <Paginator :chunkSize="5" :maxPage="endPage" :curPage="page" @clicked="showNoticePage"></Paginator>
      </div>
    </div>
    <div class="container max-width-lg center">
      <button v-if="isManager" class="btn btn--primary btn--md" style="margin:5px;" @click="boardwrite">글쓰기</button>
      <form id="_frmForm1" name="frmForm1" @submit.prevent="searchNotice" class="form-horizontal">
        <div class="width-100%" >
          <select v-model="selected" class="form-control width-30%" autofocus>
            <!-- inline object literal -->
            <option selected="selected" v-bind:value="0">제목</option>
            <option v-bind:value="1">내용</option>
            <option v-bind:value="2">제목+내용</option>
          </select>
          <input type="search" name="searchA" v-model="searchnotice" class="form-control width-70%">
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
  name : "NoticeList",
  components : {
    Paginator,
  },
  props :[
    'page'
  ],
  data() {
    return {
      noticesArticles : [],
      selected: 0,
      searchnotice : '',
      endPage : 0,
      isManager : false,
      }
    },
    // beforeRouteUpdate(to) {
    //   this.name = to.params.name
    // }
    created() {
      // alert(this.topic);
      this.noticelistCall();

      this.$axios
      .get(`managers/2/${this.$session.get("userPk")}`)
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
      noticelistCall() {
        this.$axios
        .get(`articles/notices/pages/1`)
        .then((res) => {
          if(res.data.maxPage > 0) {
            this.noticesArticles = res.data.data;
            this.endPage = res.data.maxPage;
            // console.log(this.topic_articles)
          }
        });
      },
      boardwrite() {
        this.$router.push({name:'noticewrite'});
        // this.$router.push({name:"write"});
      },
      showDetail(board) {
        this.$router.push({name: 'noticedetail' , params: { id: `${board.PK}`, topic : 2, page : this.page}});
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
      searchNotice() {
        this.$axios
        .get(`articles/searches?topic_id=2&type_id=${this.selected}&word=${this.searchnotice}&page=1`)
        .then((res) => {
          if(res.data.data != null) {
            this.noticesArticles = res.data.data;
          }else {
            alert("검색 결과가 없습니다.!!")
          }

        })
      },
      showNoticePage(index) {
        this.$axios
        .get(`articles/notices/pages/${index}`)
        .then((res) => {
          this.noticesArticles = res.data.data;
          this.page = index;
        })
      },
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
