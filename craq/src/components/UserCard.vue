<template>
    <div class="userCard">
        <div class="userImg">
            <img :src="imageFile" alt="">
            <div class="userInfo__Middle">
                <font-awesome-icon icon="check" v-if="!userdata.IS_FOLLOWED" class="userInfo__Middle-icon circle" @click="getFollow"/>
                <font-awesome-icon icon="times" v-if="userdata.IS_FOLLOWED" class="userInfo__Middle-icon times" @click="deleteFollow"/>
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
import swal from 'sweetalert';
export default {
    name: 'UserCard',
    props: [
        "list", 'follower', 'following'
    ],
    data() {
        return {
            userdata : {},
            imageFile: '',
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
        },
        'userdata': function() {
            this.update();
        }
    },
    methods: {
        getFollow() {
            const data = {
                fromUser : this.$session.get('userPk'),
                toUser : this.userdata.PK
            }
            this.$axios.post('follows', data).then(res=>{
                swal({  
                        title : "팔로우 성공!!",
                        text:'새 친구가 생기셨네요? 일방적이지만요',
                        icon: "success", 
                        button: false,
                        timer: 2000,
                        });
            })
        },
        deleteFollow() {
            const data = {
                fromUser : this.$session.get('userPk'),
                toUser : this.userdata.PK
            }
            this.$axios.delete('follows',  { data } ).then(res=>{
                swal({  
                        title : "팔로우 삭제!!",
                        text:'얼마 있지도 않은 친구가 하나 사라졌네요!',
                        icon: "error", 
                        button: false,
                        timer: 2000,
                        });
            })
        },
        update() {
            if (this.list) {
                this.$axios.get(`users/${this.list.ANSWER_USERPK}`).then(res => {
                    this.userdata = res.data.data[0];
                    }
                )
                this.$axios.get(`users/profile-image/${this.list.ANSWER_USERPK}`).then(
                    response=>{
                        this.imageFile = `http://15.164.153.221:9000/${response.data.data}`;
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
                        this.imageFile = `http://15.164.153.221:9000/${response.data.data}`;
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
                        this.imageFile = `http://15.164.153.221:9000/${response.data.data}`;
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
        width: 33px;
        top: -45px;
        left: 45px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 50%;
        background-color: alpha(var(--color-white), 0.9);
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
    color: var(--color-primary);
}
.times {
    color: var(--color-accent);
}

</style>



