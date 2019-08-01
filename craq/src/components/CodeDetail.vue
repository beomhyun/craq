<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">

                    <div id="question" class="question">
                        <Article></Article>
                    </div>
                    <div id="answers">
                        <CodeDetailAnswerHeader></CodeDetailAnswerHeader>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import CodeDetailQuestionHeader from '@/components/CodeDetailQuestionHeader.vue';
import CodeDetailQuestionHeaderBottom from '@/components/CodeDetailQuestionHeaderBottom.vue';
import Article from '@/components/Article.vue';
import CodeDetailAnswerHeader from '@/components/CodeDetailAnswerHeader.vue';

export default {
    name: "CodeDetail",
    components: {
        CodeDetailAnswerHeader,
        CodeDetailQuestionHeader,
        CodeDetailQuestionHeaderBottom,
        Article,
    }
}

</script>

<style scoped lang="scss">
#mainbar {
    width: calc(100%-300px-24px); //TODO
    float: left;
    margin: 0;
    padding: 0;
}

#question {
    clear: both;
}



.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
.ps-relative {
    position: relative !important;
}
.d-block {
    display: block !important;
}
</style>
