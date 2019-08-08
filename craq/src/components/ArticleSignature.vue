<template>
    <div class="margin-bottom-xxxs">
        <div class="padding-top-xs margin-top-md flex flex-wrap justify-end items-start flex-gap-sm">
            <div class="margin-right-xs" style="flex: 1 1 100px">
                <div class="post-menu">
                    <a href="">share</a>
                    <span style="visibility: hidden;">|</span>
                    <a href="">improve this question</a>
                    <span style="visibility: hidden;">|</span>
                    <span style="visibility: hidden;">|</span>
                    <a @click.prevent="left"><</a>
                    <span style="visibility: hidden;">|</span>
                    <a @click.prevent class="none">{{current-2}}</a>
                    <span style="visibility: hidden;">|</span>
                    <a @click.prevent="right">></a>

                </div>
            </div>
            <ArticleSignatureCard v-bind="$props" :primary="true"></ArticleSignatureCard>
            <ArticleSignatureCard v-bind="$props" :primary="false"></ArticleSignatureCard>
        </div>
    </div>

</template>

<script>
import ArticleSignatureCard from '@/components/ArticleSignatureCard.vue';
export default {
    name: "ArticleSignature",
    props: [
        "current", "creator","created", "editor", "edited"
    ],
    components: {
        ArticleSignatureCard
    },
    methods: {
        right: function() {
            this.$emit('right');
        },
        left: function() {
            this.$emit('left');
        }
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
a {
    cursor: pointer;
}
.none {
    cursor: unset;
}
</style>
