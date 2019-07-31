<template>
  <div>
    <table class="table freecomment width-100%" cellpadding="0" cellspacing="0">
      <col width="10%"><col width="30%"><col width="20%"><col width="20%">
      <thead style="text-align:left">
        <tr>
          <th scope="col" style="text-align : center;">{{comment.user_name}}</th>
          <th scope="col" >{{comment.content}}</th>
          <th scope="col" style="text-align : center;">{{comment.createAt}}</th>
          <th scope="col" style="text-align : center;">
            <button type="button" name="repeat" class="btn btn--primary btn--md" @click="commentAnswer">답글</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isAnswer">
          <!-- <td><input type="text" name="answer" v-model="" /></td> -->
          <td colspan="3"><input type="text" name="answer" v-model="answer" class="form-control width-100%"/></td>
          <td><button type="button" name="regist" class="btn btn--accent btn--md" @click="commentRegist">등록</button></td>
        </tr>
      </tbody>
    </table>
    <!-- <strong>{{comment.user_name}}</strong>|&nbsp;
    <i>{{comment.content}}</i>&nbsp;-&nbsp;<strong>{{comment.createAt}}</strong> -->
  </div>
</template>

<script>
export default {
  name : 'FreeComment',
  data() {
    return {
      isAnswer : false,
      answer : "answer",
    }
  },
  props : {
    comment : {type : null}
  },
  methods : {
    commentAnswer() {
      this.isAnswer = !this.isAnswer;
    },
    commentRegist() {
      // axios
      this.isAnswer = !this.isAnswer;
    }
  },
  mounted() {
    this.isAnswer = false;
    this.answer = "answer";
  },
}
</script>

<style>
table.freecomment {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
    border-top: 3px solid #369;;
    /* border-left: 3px solid #369; */
  margin : 20px 10px;
}
table.freecomment th {
    width: 30%;
    padding: 10px;
    font-weight: bold;
    vertical-align: top;
    /* color: #110; */
    /* border-right: 1px solid #ccc; */
    /* border-bottom: 1px solid #ccc; */

}
table.freecomment td {
    width: 349px;
    padding: 10px;
    vertical-align: top;
    /* border-right: 1px solid #ccc; */
    /* border-bottom: 1px solid #ccc; */
}
</style>
