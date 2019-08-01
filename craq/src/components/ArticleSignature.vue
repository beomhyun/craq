<template>
    <div class="margin-bottom-xxxs">
        <div class="padding-top-xs margin-top-md flex flex-wrap justify-end items-start flex-gap-sm">
            <div class="margin-right-xs" style="flex: 1 1 100px">
                <div class="post-menu">
                    <a href="">share</a>
                    <span style="visibility: hidden;">|</span>
                    <a href="">improve this question</a>

                </div>
            </div>
            <CodeDetailQuestionSignatureCard></CodeDetailQuestionSignatureCard>
        </div>
    </div>

</template>

<script>
import ArticleSignatureCard from '@/components/ArticleSignatureCard.vue';
export default {
    name: "ArticleSignature",
    components: {
        ArticleSignatureCard
    }
}

</script>

<style scoped lang="scss">


.post {
    &-menu {
        padding: 0 3px 2px;
        display: inline-block;
        color: var(--color-contrast-medium);
        font-size: 13px;
    }
}
</style>
