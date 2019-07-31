<template>
  <div class="board">
    <!-- <h1>Free Detail</h1> -->
    <div class="board">

      <table class="freedetail" cellpadding="0 width-100%" cellspacing="0">
        <thead style="text-align:left">
          <tr>
            <th class="th" scope="col" colspan="4">{{info.user_name}}</th>
          </tr>
          <tr>
            <th scope="col" colspan="3">{{info.title}}</th>
            <th>
              <button type="button" class="btn btn--primary btn-lg">
                {{info.recommend}}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="detail">
            <th scope="row">DATE</th>
            <td>{{info.createAt}}</td>
            <th scope="row">VIEW</th>
            <td>{{info.views}}</td>
          </tr>
          <!-- <tr>
            <th scope="col" colspan="4" class="hide"></th>
          </tr> -->
          <tr>
            <td class="body" colspan="4">{{info.body}}</td>
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
    </div>
    <!-- <h3>{{info.title}}</h3> -->
    <!-- <router-view></router-view> -->

    <!-- </div> -->
    <div style="text-align : center">
      <h5 class="h5">Comments</h5>
      <div v-for="comment in comments">
        <FreeComment :comment="comment"/>
      </div>
      <input type="text" name="answer" v-model="answer" class="form-control width-90%"/>
      <button type="button" name="regist" class="btn btn--accent btn--md" @click="commentRegist">등록</button>
      <FreeList/>
    </div>
  </div>
</template>

<script>
import FreeComment from '@/components/FreeComment.vue'
import FreeList from '@/components/FreeList.vue'
import FreeEdit from '@/components/freeboardDir/FreeEdit.vue'
import ShowDetail from '@/components/freeboardDir/ShowDetail.vue'

export default {
  name : 'FreeDetail',
  props : [
    'info'
  ],
  components : {
    FreeComment,
    FreeEdit,
    FreeList,
    ShowDetail
  },
  data() {
    return {
      isEdit : false,
      comments : [
        {
          id : "1",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "2",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "3",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "4",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "5",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "6",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        },
        {
          id : "7",
          user_name : "jjh",
          content : "who is lorem ipsum? I'donn know!",
          createAt : "19.07.25"
        }
      ]
    }
  },
  created() {
    // axios.get().then()

  },
  methods : {
    goEditPage() {
      this.$router.push({name : 'freeedit', params : {freeInfo : this.info}});
    }
  }
}


</script>

<style lang="scss" scoped>
.freedetail {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
    border-top: 1px solid #ccc;
    border-left: 3px solid #369;
    margin : 20px 10px;

    &__th {
        width: 147px;
        padding: 10px;
        font-weight: bold;
        vertical-align: top;
        color: #153d73;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        /* border-bottom: 1px solid #ccc; */

    }
    &__td {
        width: 349px;
        padding: 10px;
        vertical-align: top;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        border-bottom: 1px solid #ccc;
    }
}


</style>
