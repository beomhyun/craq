<template>
  <div>
    <!-- <h1>Free Detail</h1> -->
    <!-- <div class="board"> -->

      <table class="table width-100%" cellpadding="0" cellspacing="0">
        <thead style="text-align:left">
          <tr>
            <th class="th" scope="col" colspan="4">{{info.USERNAME}}</th>
          </tr>
          <tr>
            <th scope="col" colspan="3">{{info.TITLE}}</th>
            <th>
              <!-- <tr> -->
                <div class="voteBtn">
                  <button id="_upvote" name="upVote" class="btn btn--primary up" @click="myVote = 1">^</button>
                  <div v-if="info.VOTE > 0">{{info.VOTE}}</div>
                  <div v-else>0</div>
                  <button id="_downvote" name="downVote" class="btn btn--primary down" @click="myVote = -1">v</button>
                </div>
              <!-- </tr> -->
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="detail">
            <th scope="row">DATE</th>
            <td>{{info.CREATED_AT}}</td>
            <th scope="row">VIEW</th>
            <td>{{info.VIEW}}</td>
          </tr>
          <!-- <tr>
            <th scope="col" colspan="4" class="hide"></th>
          </tr> -->
          <tr>
            <td class="body" colspan="4">{{info.BODY}}</td>
          </tr>
          <tr v-if="info.IMAGE !== 'default_profile.png'">
            <td colspan="4"><img class="preview" :src="info.IMAGE"></td>
            <!-- <td colspan="4">{{imgData}}</td> -->
          </tr>
          <tr>
            <td colspan="3"></td>
            <td>
              <button class="btn btn--primary btn-lg" style="margin:3px" @click="goEditPage">Edit</button>
              <button class="btn btn--primary btn-lg" style="margin:3px" @click="freeDelete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    <!-- </div> -->
    <!-- <h3>{{info.title}}</h3> -->
    <!-- <router-view></router-view> -->

    <!-- </div> -->
    <div style="text-align : center">
      <h5 class="h5">Comments</h5>
      <div v-for="comment in comments">
        <FreeComment :comment="comment"/>
      </div>

      <form id="commentForm" @submit.prevent="sendComment" class="form-control width-100%">
        <span>
          <input type="text" name="comment" v-model="answer" class="form-control">
          <button type="submit" class="btn btn--accent btn--md">Send</button>
        </span>
      </form>
      <!-- <input type="text" name="answer" v-model="answer" class="form-control width-90%"/> -->
      <!-- <button type="button" name="regist" class="btn btn--accent btn--md" @click="commentRegist">등록</button> -->
      <FreeList :topic="this.topic" :page='this.page'/>
    </div>
  </div>
</template>

<script>
import FreeComment from '@/components/freeboardDir/FreeComment.vue'
import FreeList from '@/components/freeboardDir/FreeList.vue'
import FreeEdit from '@/components/freeboardDir/FreeEdit.vue'
// import ShowDetail from '@/components/freeboardDir/ShowDetail.vue'

export default {
  name : 'FreeDetail',
  props : [
    'id',
    'topic',
    'page'
  ],
  components : {
    FreeComment,
    FreeEdit,
    FreeList,
    // ShowDetail
  },
  data() {
    return {
      isEdit : false,
      imgData : '',
      info : {},
      comments : [],
      answer : "",
      articleID : this.id,
      myVote : 0,
    }
  },
  created() {

    this.$axios
    .get(`contents/articles/${this.articleID}`)
    .then((res) => {
      this.info = res.data.data[0];
      console.log(this.info.IMAGE)
    });

    this.listComments();
  },
  methods : {
    goEditPage() {
      this.$router.push({name : 'freeedit', params : {id : `${this.articleID}`, freeInfo : this.info}});
    },
    freeDelete() {
      this.$axios
      .delete(`articles/${this.articleID}`)
      .then((res) => {
        this.$router.go(-1);
      })
    },
    recommendBoard() {
      console.log("recommendBoard")
    },
    sendComment() {
      this.$axios
      .post(`comments`, {
        user_id: this.$session.get("userPk"),
        content_id: this.info.PK,
        parent_id: 0,
        body: this.answer
      })
      .then((res) => {
        this.listComments()
      })
    },
    listComments() {
      this.$axios
      .get(`comments/articles/${this.articleID}`)
      .then((res) => {
        this.comments = res.data.data
        console.log(this.comments[0])
      });
    }
  }
}


</script>

<style lang="scss" scoped>
// .freedetail {
//     border-collapse: collapse;
//     text-align: left;
//     line-height: 1.5;
//     border-top: 1px solid #ccc;
//     border-left: 3px solid #369;
//     margin : 20px 10px;
//
//     &__th {
//         width: 147px;
//         padding: 10px;
//         font-weight: bold;
//         vertical-align: top;
//         // color: #153d73;
//         border-top: 1px solid #ccc;
//         /* border-right: 1px solid #ccc; */
//         /* border-bottom: 1px solid #ccc; */
//
//     }
//     &__td {
//         width: 349px;
//         padding: 10px;
//         vertical-align: top;
//         border-top: 1px solid #ccc;
//         /* border-right: 1px solid #ccc; */
//         border-bottom: 1px solid #ccc;
//     }
// }


</style>
