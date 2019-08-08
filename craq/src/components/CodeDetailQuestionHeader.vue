<template>
    <div id="question-header">
        <h1>
            <a class="question-hyperlink margin-bottom-xs" href="">
                {{title}}
            </a>
        </h1>
        <div class="ask-question">
            <a class="btn btn--primary" @click.prevent="goAsk">Ask Question</a>
        </div>
    </div>


</template>
<script>
export default {
    name: "CodeDetailQuestionHeader",
    props: [
        "title"
    ],
    methods: {
        goAsk() {
            this.$router.push({
                'name': 'askquestion'
            })
        }

    }
}
</script>


<style lang="scss" scoped>
#question-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
}

</style>
