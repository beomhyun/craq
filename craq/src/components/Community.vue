<template>
  <div>
    <div class="container max-width-lg" style="display: flex">
      <h2 style="display: inline; width: 100%">CRAQ NODE</h2>
      <button @click="addTree" class="btn btn--subtle btn--md" style="">Add Tree</button>
    </div>
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

  methods : {
    addTree() {
      this.$router.push({name:'addtree'});
    }
  }
}

</script>

<style>
</style>
