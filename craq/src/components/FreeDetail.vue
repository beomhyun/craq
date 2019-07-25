<template>
  <div>
    <h1>Free Detail</h1>

    <div>
      <strong>{{info.user_name}}</strong> <button>{{info.recommend}}</button>
    </div>

    <div>
      <h3>{{info.title}}</h3>
      <p>{{info.body}}</p>
    </div>

    <div>
      <button>Edit</button>
      <button>Delete</button>
      <span>{{info.createAt}}</span>
    </div>

    <div>
      <h5>Comments</h5>
      <div v-for="comment in comments">
        <FreeComment :comment="comment"/>
      </div>
    </div>
  </div>
</template>

<script>
import FreeComment from '@/components/FreeComment.vue'

export default {
  name : 'FreeDetail',
  props : {
    info : {type: null}
  },
  components : {
    FreeComment
  },
  data() {
    return {
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

  }

}


</script>

<style>
</style>
