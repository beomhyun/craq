<template>
  <div>
    <h5>My Community</h5>
    <MyCommunities/>
    <AllCommunity/>
  </div>

</template>

<script>
import MyCommunities from '@/components/MyCommunities.vue'
import AllCommunity from '@/components/AllCommunity.vue'

export default {
  name : "Community",
  components : {
    MyCommunities,
    AllCommunity,
  },
  data() {
    return {
      addtree : false,
    }
  },
  methods : {

  }
}

</script>

<style>
</style>
