<template>
    <div class="answerMain">
        <div class="defalutQuestion">
            <ArticleContent :body="body"></ArticleContent>
        </div>
        <div class="answerForm">
            <label for="content"><strong>content</strong> - 문제 해결을 위해 시도한 것들을 상세하게 작성해주십시오.</label>
            <froala id="edit content" :tag="'textarea'" :config="config" v-model="inputContent"></froala>
        </div>
        <div class="btn btn--primary btn--md" @click="createAnswer">Submit</div> 
    </div>
</template>
<script>
import ArticleContent from "@/components/ArticleContent.vue";
import VueFroala from 'vue-froala-wysiwyg';

export default {
    name: 'CodeAnswer',
    props: [
        'body',
        'article_pk'
    ],
    components: {
        ArticleContent
    },
    data() {
        return{
             // Text Editor Config
            config: {
                events: {
                    initialized: function () {  
                    },
                },
                width: '800'
            },
            inputContent : ''
        }
    },
    mounted() {
        this.inputContent =  "이곳에 답변을 작성해 주십시오."
        console.log(this.article_pk)
    },
    methods: {
        createAnswer() {
            const data = {
                'topic_id' : 1,
                'article_id' : this.article_pk,
                "beforeContent": 0,
                "user_id": this.$session.get('userPk'),
                'body' : this.inputContent,
            }
            this.$axios.post('contents' , data).then(res => {
                this.$router.push({
                    'name': 'Questions',
                    params : { question_pk : this.article_pk }
                })
            })
            
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


