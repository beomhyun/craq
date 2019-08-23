<template>
  <h5>All Community</h5>


</template>

<script>

export default {
  name : 'AllCommunity',
  data() {
    return {
      topic : []
    }
  },
  created() {
    axios.get('http://13.125.251.247:9000/api-docs/', {
    }).
    then((response) => {

    })
  }
}

</script>

<style>
</style>
