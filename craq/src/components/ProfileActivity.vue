<template>
    <div class="follow">

        <div class="follow__filter">
            <div class="follow__filter-btn" @click="toggleAsk" :class="{'selected' : setAsk}">Ask</div>
            <div class="follow__filter-btn" @click="toggleAnswer" :class="{'selected' : setAnswer}">Answer</div>
            <div class="follow__filter-btn" @click="togglePost" :class="{'selected' : setPost}">Post</div>
            <div class="follow__filter-btn" @click="toggleComments" :class="{'selected' : setComments}">Comments</div>
        </div>

        <div class="follow__list following" v-if="setAsk">
            <div :key="idx" v-for="(list, idx) in askData" class="cardlist">
                <router-link :to="{name: 'Questions', params: {question_pk : list.QUESTION[0].PK}}">
                    <CardProfile :list="list"/>
                </router-link>
            </div>
        </div>

        <div class="follow__list follower"  v-if="setAnswer&&loaded">
            <div :key="idx" v-for="(list, idx) in answerData" class="cardlist">
                <router-link :to="{name: 'Questions', params: {question_pk : list.QUESTION[0].PK}}">
                    <CardProfile :list="list"/>
                </router-link>
            </div>
        </div>

        <!-- <div class="follow__list follower"  v-show="setPost">
            <div :key="a" v-for="a in 10" class="cardlist">
                <UserCard/>
            </div>
        </div>

        <div class="follow__list follower"  v-show="setComments">
            <div :key="a" v-for="a in 10" class="cardlist">
                <UserCard/>
            </div>
        </div> -->

    </div>
</template>
<script>
import CardProfile from '@/components/CardProfile.vue';

export default {
    name: 'ProfileActivity',
    props: [
        'userActivityData',
        'userData',
    ],
    components: {
        CardProfile,
    },
    data() {
        return {
            askData: [{
                QUESTION: [
                    {PK:1}
                ]
            }],
            answerData: [{
                QUESTION: [
                    {PK:1}
                ]
            }],
            cardLists: [],
            setAsk: true,
            setAnswer: false,
            setPost: false,
            setComments: false,
            loaded: false
        }
    },
    methods: {
        toggleAsk() {
            if ( this.setAsk == false ) {
                this.setAsk = true;
                this.setAnswer = false;
                this.setPost = false;
                this.setComments = false;
            }
        },
        
        toggleAnswer() {
            if ( this.setAnswer == false ) {
                this.setAnswer = true;
                this.setAsk = false;
                //this.setAnswer = true;
                this.setPost = false;
                this.setComments = false;
            }
        },
        
        togglePost() {
            if ( this.setPost == false ) {
                this.setAsk = false;
                this.setAnswer = false;
                this.setPost = true;
                this.setComments = false;
            }
        },
        
        toggleComments() {
            if ( this.setComments == false ) {
                this.setAsk = false;
                this.setAnswer = false;
                this.setPost = false;
                this.setComments = true;
            }
        },
        
    },

    mounted() {
        let waiter = []
        this.userActivityData.QUESTION.forEach((el) => {
            waiter.push(this.$axios.get('questions/detail/' + el.PK).then(res => {
                this.askData.push(res.data.data)
            }))
        });
        this.userActivityData.ANSWER.forEach((el) => {
            waiter.push(this.$axios.get('questions/detail/' + el.PK).then(res => {
                this.answerData.push(res.data.data)
            }))
        });
        Promise.all(waiter).then(()=>{this.loaded=true})
        
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
            color: var(--color-contrast-high);            

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
    width: 100%;
    padding-bottom: var(--space-md);
}


</style>


