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
        <button class="reset" v-if="canSelected" @click.prevent="selectThis">
            <div class="btn-check--small-contrast">
                <font-awesome-icon :icon="['far', 'check-circle']" ></font-awesome-icon>
            </div>
        </button>
    </div>
</template>

<script>
import swal from 'sweetalert';

export default {    
    name: "ArticleVote",
    props: [
        "vote", "ward", "question", "selected", "article_pk", "is_active", "canSelected",
    ],
    data() {
        return {
            warded: false,
            voteStatus: 0
        }
    },
    methods: {
        selectThis() {
            this.$axios.put(`questions/${this.$route.params.question_pk}/answers/${this.article_pk}`).then(res=>{
                this.$root.$emit('question_selected', this.article_pk);
                swal({
                        title : "답변을 채택했습니다!", 
                        text : "이 답변이 마음에 드셨군요?",
                        icon : "success",
                        button: false,
                        timer : 2000
                        })
            })
        },
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
                    swal({
                        title : "와드를 박았습니다!", 
                        text : "시야 점수 1점 획득! 답변이 달리길 기다려 봅시다!",
                        icon : "success",
                        button: false,
                        timer : 4000
                        })
                } else {
                    this.ward--;
                    swal({
                        title : "와드를 지웠습니다!", 
                        text : "이제 이 글에 아주 유용한 답변이 달려도 당신은 알 수 없겠군요!",
                        icon : "error",
                        button: false,
                        timer : 4000
                        })
                }
            }
            )
        },
        voteIt(num) {
            if (this.voteStatus) return swal({
                        title : "투표는 단 한번만 가능!", 
                        text : "신중하게 선택하셨어야죠!",
                        icon : "info",
                        button: false,
                        timer : 2000
                        });
            let data = {
                article_id: this.article_pk,
                user_id : this.$session.get('userPk'),
                good: num
            }
            this.$axios.post('votes', data).then((res) => {
                if (num ==1) {
                    this.vote++;
                    this.voteStatus = 1;
                    swal({
                        title : "1점 추가!", 
                        text : "이 답변이 마음에 드셨군요?",
                        icon : "success",
                        button: false,
                        timer : 2000
                        })
                } else {
                    this.vote--;
                    this.voteStatus = -1;
                    swal({
                        title : "1점 감점!", 
                        text : "이 글이 그렇게나 싫었나요?",
                        icon : "error",
                        button: false,
                        timer : 2000
                        })
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

        this.$root.$on('question_selected', e=> {
            if (e == this.article_pk) {
                this.is_active = true; 
            } else {
                this.is_active = false;
            }
            this.canSelected = false;
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
        color: var(--color-primary-dark);

        &-contrast {
            font-size: 1.5rem;
            color: var(--color-contrast-medium);
        }
    }
}

</style>
