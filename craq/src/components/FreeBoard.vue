<template>
  <h4>{{topic}} 게시판</h4>
  <br>
  
</template>

<script>

export default {
  name : 'FreeBoard',
  data() {
    return {
      topic : this.$route.params.topic,
    }
  },
  created() {
    // var id = this.$route.params.id

  }
}

</script>

<style>
</style>
