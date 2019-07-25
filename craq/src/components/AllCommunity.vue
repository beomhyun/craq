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
    axios.get('http://192.168.31.58:10123/api-docs/', {
    }).
    then((response) => {

    })
  }
}

</script>

<style>
</style>
