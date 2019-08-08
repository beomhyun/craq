<template>
    <div class="post-signature">
        <div class="user-info">
            <div class="user-action-time">
                <a href="" title="show all edits">{{ primary ? 'edited' : 'created' }}
                    <span title="2019-1-1">{{primary ? edited: created | formatDate}}</span>
                </a>
            </div>
            <div class="user-gravatar32">
                <a href="">
                    <span class="anonymous-gravatar" style="display:none;"></span>
                    <img src="../assets/3232placeholder.png" alt="" width="32" height="32">
                </a>
            </div>
            <div class="user-details">
                <a href="">{{userName}}</a>
                <div class="-flair">
                    <span class="reputation-score" title="reputation score">9,000</span>
                    <span title="helloworld">
                        <span class="badge"><font-awesome-icon :icon="['far', 'copyright']"></font-awesome-icon></span>
                        <span class="badgecount">20</span>
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

        }
    },
    watch:{
edited: function(val, oldVal) {
this.update()
}
    },
    methods: {
        update() {
            if (this.primary) {
                this.$axios.get(`users/${this.editor}`).then(res=>{
                    this.userName = res.data[0].username;
                    console.log(this.editor)
                })
            } else {
                this.$axios.get(`users/${this.creator}`).then(res=>{
                    this.userName = res.data[0].username;
                    console.log(this.creator)
                })
            }
        }
    },
    mounted() {
        this.update()
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
