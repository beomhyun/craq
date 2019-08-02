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
