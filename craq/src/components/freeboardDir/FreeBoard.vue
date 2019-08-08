<template>
    <div>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
import FreeHome from '@/components/freeboardDir/FreeHome.vue'

export default {
  name : 'FreeBoard',
  components : {
    FreeHome
  },
  created() {
    // var id = this.$route.params.id
    //get All FreeBoard
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    //
    // })
  },
}

</script>

<style  lang="scss" scoped>
</style>
