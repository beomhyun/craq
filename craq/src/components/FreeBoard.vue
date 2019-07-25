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
      all_tmp_data : [
        {
          id : '1'
          title : 'lorem ipsum1',
          user_name : '정준희'
        },
        {
          id : '2'
          title : 'lorem ipsum2',
          user_name : '정준희'
        },
        {
          id : '3'
          title : 'lorem ipsum3',
          user_name : '정준희'
        },
        {
          id : '4'
          title : 'lorem ipsum4',
          user_name : '정준희'
        },
        {
          id : '5'
          title : 'lorem ipsum5',
          user_name : '정준희'
        },
      ],
      topic_articles : [
        {
          id : '1'
          title : 'lorem ipsum1',
          user_name : '정준희'
          createAt : '19.07.25',
          views : '1000',
          recommend : '31'
        },
        {
          id : '2'
          title : 'lorem ipsum2',
          user_name : '정준희'
          createAt : '19.07.25',
          views : '1000',
          recommend : '31'
        },
        {
          id : '3'
          title : 'lorem ipsum3',
          user_name : '정준희'
          createAt : '19.07.25',
          views : '1000',
          recommend : '31'
        },
        {
          id : '4'
          title : 'lorem ipsum4',
          user_name : '정준희'
          createAt : '19.07.25',
          views : '1000',
          recommend : '31'
        },
        {
          id : '5'
          title : 'lorem ipsum5',
          user_name : '정준희'
          createAt : '19.07.25',
          views : '1000',
          recommend : '31'
        },

      ]
    }
  },
  created() {
    // var id = this.$route.params.id
    //get All FreeBoard
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    //
    // })
  }
}

</script>

<style>
</style>
