<template>
  <div class="tree-board">
    <div class="container max-width-lg" style="display: flex">
      <h2 style="display: inline; width: 100%">CRAQ NODE</h2>
      <button @click="addTree" class="btn btn--primary btn--md" style="">Add Tree</button>
    </div>
    <!-- <h5>My Community</h5> -->
    <MyCommunities/>
    <AllCommunity/>
  </div>

</template>

<script>
import MyCommunities from '@/components/freeboardDir/MyCommunities.vue'
import AllCommunity from '@/components/freeboardDir/AllCommunity.vue'

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

<style scoped lang="scss">
.tree-board {
  // transition: all 2s ease;
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  // transition: all 5s ease;
  // background-color: #fff;
  // border: 1px solid #ccc;
  // overflow: hidden;
  // padding-left: var(--space-xxxs);
  // padding-top: var(--space-xxxs);
  // cursor: text;
  // text-align: left;
  // -webkit-appearance: textfield;
  // display: flex;
  // flex-wrap: wrap;
}
</style>
