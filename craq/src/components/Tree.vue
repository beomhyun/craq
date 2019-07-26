<template>
  <div>
    <div v-if="!addtree">
      <div class="container max-width-lg" style="display: flex">
        <h2 style="display: inline; width: 100%">CRAQ NODE</h2>
        <button @click="addTree" class="btn btn--subtle btn--md" style="">Add Tree</button>
      </div>
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
<style lang="scss" scoped>
  .wrapper {
    background-color: var(--color-surface);
    width: 100%;
    height: 100%;
    padding: var(--space-xl) var(--space-lg);
    border-radius: var(--radius-sm);
    color: var(--color-on-surface);
  }
  @-webkit-keyframes pulse {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes pulse {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }

  .noShow {
    display: none;
  }
</style>
