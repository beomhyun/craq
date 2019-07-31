<template>
    <div class="Follow">
        <div class="follow__filter">
            <button>Following</button>
            <button>Follower</button>
        </div>
        <UserCard/>
        
    </div>
</template>
<script>
import UserCard from '@/components/UserCard.vue';

export default {
    name: 'ProfileFollow',
    components: {
        UserCard,
    }
}
</script>

<style lang="scss" scoped>

</style>


