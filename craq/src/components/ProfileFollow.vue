<template>
    <div class="follow">

        <div class="follow__filter">
            <div class="follow__filter-btn" @click="toggleFollowing" :class="{'selected' : setFollowing}">Following</div>
            <div class="follow__filter-btn" @click="toggleFollower" :class="{'selected' : setFollower}">Follower</div>
        </div>

        <div class="follow__list following" v-show="setFollowing">
            <div :key="a" v-for="a in 10" class="cardlist">
                <UserCard/>
            </div>
        </div>

        <div class="follow__list follower"  v-show="setFollower">
            <div :key="a" v-for="a in 10" class="cardlist">
                <UserCard/>
            </div>
        </div>

    </div>
</template>
<script>
import UserCard from '@/components/UserCard.vue';

export default {
    name: 'ProfileFollow',
    components: {
        UserCard,
    },
    data() {
        return {
            followingList: [],
            followerList: [],
            setFollowing: true,
            setFollower: false
        }
    },
    methods: {
        toggleFollowing() {
            if ( this.setFollowing == false ) {
                this.setFollowing = true;
                this.setFollower = false;
            }
        },
        toggleFollower() {
            if ( this.setFollower == false ) {
                this.setFollowing = false;
                this.setFollower = true;
            }
        },
    }

}
</script>

<style lang="scss" scoped>

.follow {
    user-select: none;
    display: flex;
    flex-direction: column;

    width: 100%;
    height: auto;
    background-color: var(--color-surface-light);
    padding: var(--space-md);

    &__filter {
        display: flex;

        &-btn {
            cursor: pointer;
            width: 130px;
            height: 45px;

            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            color: var(--color-contrast-low);

            border-radius: var(--radius-sm);

            background-color: var(--color-surface-dark);
            margin-right: var(--space-sm);
        }
    }

    &__list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        position: relative;
        top: -3px;

        width: 100%;
        height: 100%;
        background-color: var(--color-surface);

        border-bottom-left-radius:  var(--radius-sm);
        border-bottom-right-radius:  var(--radius-sm);
        border-top: 3px solid var(--color-tertiary);

        padding: var(--space-md);
    }
}

.follow__filter .selected {

    cursor: pointer;

    border-top: 3px solid var(--color-tertiary);
    border-left: 3px solid var(--color-tertiary);
    border-right: 3px solid var(--color-tertiary);
    color: var(--color-on-surface);
    font-weight: bold;
    background-color: var(--color-surface);

    z-index: 1;
}

.cardlist {
    padding-bottom: var(--space-md);
}


</style>
