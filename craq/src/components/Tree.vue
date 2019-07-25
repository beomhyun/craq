<template>
  <div>
    <div v-if="!addtree">
      <h2>CRAQ NODE</h2>
      <button @click="addTree">Add Tree</button>
      <!-- <button><router-link :to="{name: 'createtree', params: {addtree}}">Add Tree</router-link></button> -->
      <Community/>
    </div>
    <div v-else>
      <h2>Add Tree</h2>
      <CreateTree @childs-event="parentsMethod"/>
    </div>

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import Community from '@/components/Community.vue'
import CreateTree from '@/components/CreateTree.vue'

export default {
  name : 'Tree',
  components : {
    Community,
    CreateTree
  },
  data () {
    return {
      addtree : false
    }
  },
  mounted() {
    this.addtree = false
  },
  methods : {
    addTree : function() {
      // this.$router.push({name:'createtree'});
      this.addtree = true;
    },
    parentsMethod: function(addtree) {
      this.addtree = addtree // 자식으로 부터받은 메시지를 사용
    }
  }
}

</script>

<style>
</style>
