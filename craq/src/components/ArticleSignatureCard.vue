<template>
    <div class="post-signature">
        <div class="user-info">
            <div class="user-action-time">
                <a title="show all edits">{{ primary ? 'edited' : 'created' }}
                    <span title="2019-1-1">{{primary ? edited: created | formatDate}}</span>
                </a>
            </div>
            <div class="user-gravatar32">
                <a href="#">
                    <span class="anonymous-gravatar" style="display:none;"></span>
                    <img :src="url" alt="" width="32" height="32">
                </a>
            </div>
            <div class="user-details">
                <a @click="goProfile">{{userName}}</a>
                <div class="-flair">
                    <span class="reputation-score" title="reputation score">{{score}}</span>
                    <span title="helloworld">
                        <span class="badge"><font-awesome-icon :icon="['far', 'copyright']"></font-awesome-icon></span>
                        <span class="badgecount">{{selectCount}}</span>
                    </span>

                </div>
            </div>
        </div>
    </div>

</template>


<script>
export default {
    name: "ArticleSignatureCard",
    props: [
        "creator", "editor", "primary", "created", "edited"
    ],
    data() {
        return {
            userName: "temp",
            imageFile: "default_profile.png",
            score: 0,
            selectCount: 0,
        }
    },
    watch:{
        edited: function(val, oldVal) {
            this.update()
        }
    },
    methods: {
        update() {
            let endpoint;
            if (this.primary) {
                endpoint = this.editor;
            } else {
                endpoint = this.creator;
            }

            this.$axios.get(`users/${endpoint}`).then(res=>{
                this.userName = res.data.data[0].USERNAME;
                this.score = res.data.data[0].SCORE;
                this.selectCount = res.data.data[0].SELECTED_ANSWER;
            })
            this.$axios.get(`users/profile-image/${endpoint}`).then(res=> {
                this.imageFile = res.data.data;
            })

        },
        goProfile() {
            this.$router.push({
                path: '/profile/' + this.userName
            })

        }
    },
    mounted() {
        this.update();
    },
    computed: {
        url: function() {
            return `http://15.164.153.221:9000/${this.imageFile}`
        }
    }
}

</script>


<style lang="scss" scoped>
.-flair {
    display: block;

    & > span:not(.reputation-score) {
        margin-right: 3px;
        margin-left: 2px;
    font-size: 13px; }
}
.anonymous-gravatar {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-position: 0 -400;
    background-image: url('../assets/anonymous.png'), none;
    background-size: contain;
}
.post-signature {

    &-signature {
        text-align: left;
        vertical-align: top;
        width: 200px;
        margin: 4px 0px;
    }

}
.user {

    &-info {
        box-sizing: border-box;
        padding: 5px 6px 7px 7px;
        width: 200px;
    }

    &-gravatar32 {
        float: left;
        width: 32px;
        height: 32px;
        border-radius: 1px;
    }
}

.owner {
    border-radius: 3px;
    background-color: var(--color-tertiary);
    color: var(--color-on-tertiary);
}

.reputation-score {
    font-weight: bold;
    font-size: 12px;
    margin-right: 2px;
}

.badge {
    color: var(--color-primary-dark);
}

a {
    font-size: 12px;
    color: var(--color-tertiary-darker);

    &:hover {
        color: var(--color-tertiary); 
    }
}

</style>
