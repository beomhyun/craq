<template>
  <div>
    <br>
    <form id="myForm" @submit.prevent="createTree">
      <input type="text" name="topic" v-model="topic" class="form-control width-100%" placeholder="게시판 제목"><br>
      <textarea name="body" v-model="body" class="form-control width-100%"></textarea><br>
      <button class="btn btn--primary max-width-adaptive-md" style="margin : auto; align: right">Send</button>
    </form>
  </div>
</template>

<script>

export default {

  name: "CreateTree",

  data() {
    return {
      topic: '',
      body: '',
    }
  },
  methods: {
    createTree : function() {
      if(this.topic.length < 1) {
        alert("게시판 제목울 1글자 이상 입력해 주세요")
        return;
      }

      this.$axios.post('topics', {
        topic : this.topic,
      })
      .then((response) => {
        console.log(response);
        this.$router.push({name:'community'});
      })
    }
  }
}

</script>

<style>
</style>
