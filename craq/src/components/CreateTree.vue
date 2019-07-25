<template>
  <div>
    <br>
    <form id="myForm" @submit.prevent="createTree">
      <input type="text" name="topic" v-model="topic"><br>
      <textarea name="body" v-model="body"></textarea><br>
      <button>Send</button>
    </form>
  </div>
</template>

<script>

export default {

  name: "CreateTree",
  props : {
    addtree : {type: Boolean, default: false}
  }
  ,data() {
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
      this.addtree = false;
      this.$emit('childs-event', this.addtree)
      // this.$router.push({name:'tree'})
    }
  }
}

</script>

<style>
</style>
