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
    axios.get('http://15.164.153.221:9000/api-docs/', {
    }).
    then((response) => {

    })
  }
}

</script>

<style>
</style>
