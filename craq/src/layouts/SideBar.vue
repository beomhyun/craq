<template>
    <div class="grid">
        <div class="col-2">
            <component :is="'SideBar'"></component>
        </div>
        <div class="col">
            <router-view></router-view>
        </div>
    </div>

</template>

<script>
import SideBar from '@/components/SideBar.vue';

export default {
    name: "Default",
    components: {
        SideBar
    }
}

</script>

<style scoped lang="scss">

</style>
