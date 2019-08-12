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
  created() {},
}

</script>

<style  lang="scss" scoped>
</style>
