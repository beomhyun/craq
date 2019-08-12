<template>
    <div class="answerMain">
        <div class="defalutQuestion">
            <ArticleContent v-if="loaded" :body="this.VERSION[this.current].BODY"></ArticleContent>
        </div>
        <div class="answerForm">
            <label for="content"><strong>content</strong> - 문제 해결을 위해 시도한 것들을 상세하게 작성해주십시오.</label>
            <froala id="edit content" :tag="'textarea'" :config="config" v-model="inputContent"></froala>
        </div>
        <div class="btn btn--primary btn--md" @click="createAnswer">Submit</div> 
    </div>
</template>
<script>
// import ArticleContent from "@/components/ArticleContent.vue";
import Spinner from "@/components/Spinner.vue";

const ArticleContent = () => ({
    component: import("@/components/ArticleContent.vue"),
    loading: Spinner,
    delay: 500
});

import VueFroala from 'vue-froala-wysiwyg';

export default {
    name: 'CodeAnswer',
    props: [
        'question_pk'
    ],
    components: {
        ArticleContent
    },
    data() {
        return{
            current : 0,
            VERSION: [],

             // Text Editor Config
            config: {
                events: {
                    initialized: function () {  
                    },
                },
                width: '800',
                height: '500',
                placeholderText : '질문자를 위해 훌륭한 답변을 제시해 주세요!'
            },
            inputContent : '',
            loaded : false
        }
    },
    mounted() {
        this.$axios.get(`questions/detail/${this.question_pk}`).then(res=>{
            const data = res.data.data;
            this.VERSION = data.VERSION;
            this.current = data.VERSION.length-1;
            this.loaded = true
        })
    },
    methods: {
        createAnswer() {
            const data = {
                'topic_id' : 1,
                'article_id' : this.question_pk,
                "beforeContent": 0,
                "user_id": this.$session.get('userPk'),
                'body' : this.inputContent,
            }
            console.log("푸시 전")
            console.log(this.question_pk)
            this.$axios.post('contents' , data).then(res => {
                console.log(res)
                this.$router.push({
                    name: 'Questions',
                    params : { question_pk : this.question_pk }
                })
            }). ca
            
        }
    }
}
</script>
<style lang="scss" scoped>
.answerMain {
    display: flex;
    align-items: space-around;
    flex-direction: column;
    padding: var(--space-lg);

    background-color: var(--color-background);
}

.defalutQuestion {
    width: 100%;
    border: 1px solid var(--color-contrast-low);
    margin: var(--space-xxs);

    background-color: var(--color-surface);
}

.answerForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border: 1px solid var(--color-contrast-low);
    margin: var(--space-xxs);

    background-color: var(--color-surface);
}
</style>


