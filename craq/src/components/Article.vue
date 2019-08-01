<template>
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
</template>


<script>
import CodeDetailVote from '@/components/CodeDetailVote.vue';
import CodeDetailTagList from '@/components/CodeDetailTagList.vue';
import CodeDetailQuestionSignature from '@/components/CodeDetailQuestionSignature';
import CodeDetailComments from '@/components/CodeDetailComments.vue';
import CodeDetailContent from '@/components/CodeDetailContent.vue';

export default {
    name: "Article",
    components: {
        CodeDetailContent,
        CodeDetailComments,
        CodeDetailVote,
        CodeDetailTagList,
        CodeDetailQuestionSignature,
    }
}

</script>

<style lang="scss" scoped>
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

</style>
