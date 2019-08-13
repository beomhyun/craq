<template>
    <div>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>

export default {
  name : 'Notice',
}

</script>

<style  lang="scss" scoped>
</style>
