<template>
    <div class="post-layout">
        <div class="votecell post-layout--left">
            <ArticleVote></ArticleVote>
        </div>
        <div class="postcell post-layout--right">
            <ArticleContent></ArticleContent>
            <ArticleTagList></ArticleTagList>
            <ArticleSignature></ArticleSignature>
            <div style="grid-column: 1 / 3;"></div>
            <div class="post-layout--right">
                <ArticleComments></ArticleComments>
            </div>
        </div>
    </div>
</template>


<script>
import ArticleVote from '@/components/ArticleVote.vue';
import ArticleContent from '@/components/ArticleContent.vue';
import ArticleTagList from '@/components/ArticleTagList.vue';
import ArticleSignature from '@/components/ArticleSignature';
import ArticleComments from '@/components/ArticleComments.vue';

export default {
    name: "Article",
    components: {
        ArticleContent,
        ArticleComments,
        ArticleVote,
        ArticleTagList,
        ArticleSignature,
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
