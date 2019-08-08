<template>
    <div class="voting-container">
        <button class="reset btn-vote" @click="voteIt(1)" :class="{'color-primary': voteStatus == 1}">
            <font-awesome-icon icon="chevron-up"></font-awesome-icon>
        </button>
        <div class="vote-count" itemprop="upvoteCount" data-value="vote">
            {{vote}}
        </div>
        <button class="reset btn-vote" @click="voteIt(-1)" :class="{'color-primary': voteStatus == -1}">
            <font-awesome-icon icon="chevron-down"></font-awesome-icon>
        </button>
        <button class="reset" v-if="question">
            <div class="btn-vote--small">
                <font-awesome-icon :icon="starIcon" @click.prevent="wardIt"></font-awesome-icon>
            </div>
            <div>{{ward}}</div>
        </button>
        <button class="reset" v-if="is_active">
            <div class="btn-check--small">
                <font-awesome-icon :icon="['fas', 'check']" ></font-awesome-icon>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    name: "ArticleVote",
    props: [
        "vote", "ward", "question", "selected", "article_pk", "is_active"
    ],
    data() {
        return {
            warded: false,
            voteStatus: 0
        }
    },
    methods: {
        wardIt() {
            let data = {
                "article_id": this.article_pk,
                "user_id": this.$session.get('userPk'),
                "user_token": this.$session.get('jwt'),
            }
            this.$axios.post('wards', data).then(res=>{
                this.warded = !this.warded;
                if (this.warded) {
                    this.ward++;
                } else {
                    this.ward--;
                }
            }
            )
        },
        voteIt(num) {
            if (this.voteStatus) return alert('not allowed');
            let data = {
                article_id: this.article_pk,
                user_id : this.$session.get('userPk'),
                good: num
            }
            this.$axios.post('votes', data).then((res) => {
                if (num ==1) {
                    this.vote++;
                    this.voteStatus = 1;
                } else {
                    this.vote--;
                    this.voteStatus = -1;
                }
            })
        }
    },
    computed: {
        starIcon: function() {
            return this.warded ? ['fas', 'star'] : ['far', 'star'];
        }

    },
    mounted() {
        this.$axios.get(`wards/${this.article_pk}/${this.$session.get('userPk')}`).then(res=>{
            console.log(res.data.status);
            if (res.data.status == 'success') {
                this.warded = true;
            }else {
                this.warded =  false;
            }
        });

        this.$axios.get(`votes/${this.article_pk}/${this.$session.get('userPk')}`).then(res=>{
            this.voteStatus = res.data.data;
        })
    }
}
</script>

<style lang="scss" scoped>
.voting-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
}
.btn-vote {
    font-size: 1.5rem;
    &--small {
        font-size: 1.2rem;
    }
}
.btn-check {
    &--small{
        font-size: 1.5rem;
        color: var(--color-primary-dark)
    }
}

</style>
