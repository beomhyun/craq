<template>
  <div>
    <h5> 인기글 </h5>

    <div v-for="mycomm in tmpData">
      <strong><router-link :to="{ name: 'freeboard', params: {topic : mycomm.topic} }">{{mycomm.body}}</router-link></strong>
      <br>
    </div>
  </div>
</template>

<script>

export default {
  name : "MyCommunities",
  data() {
    return {
      tmpData : [
        {
          topic : '1',
          body : 'Lorem ipsum dolor1'
        },
        {
          topic : '2',
          body : 'Lorem ipsum dolor2'
        },
        {
          topic : '3',
          body : 'Lorem ipsum dolor3'
        },
        {
          topic : '4',
          body : 'Lorem ipsum dolor4'
        }
      ]
    }
  },
}

</script>

<style>
</style>
