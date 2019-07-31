<template>
  <div class="form-control">
    <br>
    <form id="myForm" @submit.prevent="createTree">
      <input type="text" name="topic" v-model="topic" class="form-control width-100%"><br>
      <textarea name="body" v-model="body" class="form-control width-100%"></textarea><br>
      <button class="btn--primary max-width-adaptive-md" style="margin : auto">Send</button>
    </form>
  </div>
</template>

<script>

export default {

  name: "CreateTree",

  data() {
    return {
      topic: 'topic',
      body: 'body',
    }
  },
  methods: {
    createTree : function() {
      // axios.post('http://192.168.31.58:10123/api-docs/', {
      //   user_id : this.$store.state.user_id,
      //   topic : this.topic,
      //   body : this.body
      // })
      // .then((response) => {
      //
      // })

      this.$router.push({name:'community'});
    }
  }
}

</script>

<style>
</style>
