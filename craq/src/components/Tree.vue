<template>
  <div>
    <!-- <router-views -->
    <router-view></router-view>
  </div>
</template>

<script>
// import Community from '@/components/Community.vue'
// import CreateTree from '@/components/CreateTree.vue'

export default {
  name : 'Tree',
  components : {
    // Community,
    // CreateTree
  },
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
