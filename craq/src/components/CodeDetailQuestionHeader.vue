<template>
    <div id="question-header">
        <h1>
            <a class="question-hyperlink margin-bottom-xs" href="">
                {{title}}
            </a>
        </h1>
        <div class="ask-question">
            <a class="btn btn--primary" @click.prevent="goAsk">답변달기</a>
        </div>
    </div>


</template>
<script>
export default {
    name: "CodeDetailQuestionHeader",
    props: [
        "title",
        "article_pk"
    ],
    data() {
        return {
            current : 0,
            VERSION: [{BODY:"loading"},{BODY:"loading"},{BODY:"loading"}],
        }
    },
    methods: {
        goAsk() {
            this.$router.push({
                'name': 'Answer',
                params : { question_pk : this.article_pk}
            })
        }

    },
    mounted() {
        this.$axios.get(`questions/detail/${this.article_pk}`).then(res=>{
            const data = res.data.data;
            this.VERSION = this.VERSION.concat(data.VERSION);
            this.current = this.QUESTION[0].VERSION+2;
        })
    },
}
</script>


<style lang="scss" scoped>
#question-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
}

</style>
