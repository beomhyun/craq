<template>
    <div class="margin-bottom-xxxs">
        <div class="padding-top-xs margin-top-md flex flex-wrap justify-end items-start flex-gap-sm">
            <div class="margin-right-xs" style="flex: 1 1 100px">
                <div class="post-menu">
                    <a @click.prevent="toClip">share</a>
                    <span style="visibility: hidden;">|</span>
                    <span class="improve_btn" @click="codeImprove">edit</span>
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
import swal from 'sweetalert';
import ArticleSignatureCard from '@/components/ArticleSignatureCard.vue';
export default {
    name: "ArticleSignature",
    props: [
        "current", "creator","created", "editor", "edited", "article_pk", "isAnswer"
    ],
    components: {
        ArticleSignatureCard
    },
    methods: {
        toClip: function() {
            this.$clipboard(window.location.href);
            swal({
                title:"copied to clipboard",
                text:"share",
                icon: "success",
                button: false,
                timer: 2000
            })

            
        },
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
            if (this.isAnswer.check == true) {
                this.$router.push({
                    "name": "Improve",
                    params : { question_pk : this.article_pk, editAnswer : true, isAnswer : this.isAnswer}
                })

            }
            if (this.isAnswer.check == false) {
                this.$router.push({
                    "name": "Improve",
                    params : { question_pk : this.article_pk, editQuestion : true,}
                })

            } 
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
