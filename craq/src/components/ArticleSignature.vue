<template>
    <div class="margin-bottom-xxxs">
        <div class="padding-top-xs margin-top-md flex flex-wrap justify-end items-start flex-gap-sm">
            <div class="margin-right-xs" style="flex: 1 1 100px">
                <div class="post-menu">
                    <a href="">share</a>
                    <span style="visibility: hidden;">|</span>
                    <span class="improve_btn" @click="codeImprove">improve this question</span>
                    <span style="visibility: hidden;">|</span>
                    <span style="visibility: hidden;">|</span>
                    <a @click.prevent="left"><</a>
                    <span style="visibility: hidden;">|</span>
                    <a @click.prevent="selectVersion" class="none">{{current-2}}</a>
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
        "current", "creator","created", "editor", "edited", "article_pk"
    ],
    components: {
        ArticleSignatureCard
    },
    methods: {
        selectVersion: function() {
            this.$emit('selectVersion', this.current);

        },
        right: function() {
            this.$emit('right');
        },
        left: function() {
            this.$emit('left');
        },
        codeImprove() {
            this.$router.push({
                "name": "Improve",
                params : { question_pk : this.article_pk, editQuestion : true,}
            })
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
        font-size: var(--text-lg);
    }
}
a {
    cursor: pointer;
}
.none {
    cursor: unset;
}

.improve_btn {
    user-select: none;
    cursor: pointer;
}
</style>
