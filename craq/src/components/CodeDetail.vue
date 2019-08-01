<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">

                    <div id="question" class="question">
                        <div class="post-layout">
                            <div class="votecell post-layout--left">
                                <CodeDetailVote></CodeDetailVote>
                            </div>
                            <div class="postcell post-layout--right">
                                <CodeDetailContent></CodeDetailContent>
                                <CodeDetailTagList></CodeDetailTagList>
                                <CodeDetailQuestionSignature></CodeDetailQuestionSignature>
                                <div style="grid-column: 1 / 3;"></div>
                                <div class="post-layout--right">
                                    <CodeDetailComments></CodeDetailComments>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import CodeDetailQuestionHeader from '@/components/CodeDetailQuestionHeader.vue';
import CodeDetailQuestionHeaderBottom from '@/components/CodeDetailQuestionHeaderBottom.vue';
import CodeDetailVote from '@/components/CodeDetailVote.vue';
import CodeDetailTagList from '@/components/CodeDetailTagList.vue';
import CodeDetailQuestionSignature from '@/components/CodeDetailQuestionSignature';
import CodeDetailComments from '@/components/CodeDetailComments.vue';
import CodeDetailContent from '@/components/CodeDetailContent.vue';

export default {
    name: "CodeDetail",
    components: {
        CodeDetailContent,
        CodeDetailComments,
        CodeDetailQuestionHeader,
        CodeDetailQuestionHeaderBottom,
        CodeDetailVote,
        CodeDetailTagList,
        CodeDetailQuestionSignature,
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


.votecell {
    vertical-align: top;
    padding-right: 15px;
    width: auto;
}
.postcell {
    vertical-align: top;
}

.post-layout {
    display: grid;
    grid-template-columns: max-content 1fr;

    &--left {
        width: auto;
        padding-right: 15px;
    }
    &--right { //TODO
        grid-column: 2;
        width: auto;
        flex-shrink: 1;
    }
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
