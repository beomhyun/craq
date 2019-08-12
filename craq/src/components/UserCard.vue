<template>
    <div class="userCard">
        <div class="userImg">
            <img :src="imageFile" alt="">
            <div class="userInfo__Middle">
                    <font-awesome-icon icon="check" class="userInfo__Middle-icon circle"/>
                    <font-awesome-icon :icon="['far', 'envelope']" class="userInfo__Middle-icon envelope"/>
                    <font-awesome-icon icon="exclamation-triangle" class="userInfo__Middle-icon triangle"/>
            </div>
        </div>

        <div class="userInfo">
            <div class="userInfo__Top">
                <div class="userInfo__Top-name" @click="goProfile">
                    {{userdata.USERNAME}}
                </div>
                <div class="userInfo__Top-mail">
                    {{userdata.EMAIL}}
                </div>
            </div>
            
            <div class="userInfo__Bottom">
                <div class="userInfo__Bottom-detail">
                    <p class="userInfo__Bottom-title">Score</p>
                    <p>{{userdata.SCORE}}</p>
                </div>        
                <div class="userInfo__Bottom-detail">
                    <p class="userInfo__Bottom-title">Answer</p>
                    <p>{{userdata.ANSWERS}}</p>
                </div>        
            </div>
         </div>
    </div>
</template>
<script>
export default {
    name: 'UserCard',
    props: [
        "list", 'follower', 'following'
    ],
    data() {
        return {
            userdata : {},
            imageFile: ''
        }
    },
    watch: {
        'list': function() {
            this.update();
        },
        'follower': function() {
            this.update();
        },
        'following': function() {
            this.update();
        }
    },
    methods: {
        update() {
            if (this.list) {
                this.$axios.get(`users/${this.list.ANSWER_USERPK}`).then(res => {
                    this.userdata = res.data.data[0];
                    }
                )
                this.$axios.get(`users/profile-image/${this.list.ANSWER_USERPK}`).then(
                    response=>{
                        this.imageFile = `http://192.168.31.58:10123/${response.data.data}`;
                    }
                )                       
            }
            if (this.follower) {
                this.$axios.get(`users/${this.follower}`).then(res => {
                    this.userdata = res.data.data[0];
                    }
                )
                this.$axios.get(`users/profile-image/${this.follower}`).then(
                    response=>{
                        this.imageFile = `http://192.168.31.58:10123/${response.data.data}`;
                    }
                )                       
            }
            if (this.following) {
                this.$axios.get(`users/${this.following}`).then(res => {
                    this.userdata = res.data.data[0];
                    }
                )
                this.$axios.get(`users/profile-image/${this.following}`).then(
                    response=>{
                        this.imageFile = `http://192.168.31.58:10123/${response.data.data}`;
                    }
                )                       
            }
        },
        goProfile() {
            this.$router.push({
                'name': 'profile',
                params : {user_name : this.userdata.USERNAME, user_pk : this.userdata.PK}
            })

        }
    },
    mounted() {
        this.update();
    }
}
</script>
<style lang="scss" scoped>
.userCard {
    width: 300px;
    height: 120px;
    display: flex;
    background-color: var(--color-surface);
    border: 1px solid var(--color-contrast-low);
}
.userImg {
    width: 120px;
    height: 120px;
}
.userImg img{
    width: 120px;
    height: 118px;
}

.userInfo {
    width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: var(--space-xxs);

    &__Top{
        &-name {
            cursor: pointer;
            font-size: var(--text-md);
            color: var(--color-on-surface);
            font-weight: bold;
            text-align: center;
        }
        &-mail {
            font-size: var(--text-sm);
            color: var(--color-contrast);
            text-align: center;
        }
    }

    &__Middle {
        position: relative;
        height: 33px;
        top: -40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: alpha(var(--color-surface-darker), 0.7);
        margin-top: var(--space-xxxs);
        opacity: 0;
        transition: opacity 0.4s;

        &-icon {
            font-size: var(--text-md);
        }

        &-icon:hover {
            cursor: pointer;
        }
    }
    &__Bottom {
        display: flex;
        justify-content: space-around;
        margin-top: var(--space-xxxs);

        &-detail {
            text-align: center;
        }

        &-title {
            font-size: cal(var(--text-md), -0.2em);
            font-weight: bold;
        }
    }
}

.userCard:hover .userInfo__Middle {
    opacity: 1;
    transition: opacity 0.4s;
}

.circle {
    color: var(--color-primary-dark);
}
.envelope {
    color: var(--color-black);
}
.triangle {
    color: var(--color-accent);
}


</style>



