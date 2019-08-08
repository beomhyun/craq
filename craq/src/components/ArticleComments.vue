<template>
    <div>
        <div class="comments">
            <ul class="comments-list">
                <template v-for="comment in comments">
                    <ArticleCommentsCard :comment="comment"></ArticleCommentsCard>
                </template>
            </ul>
        </div>
        <div>
            <a class="comments-link" href="" title="avoid answering questions in comments" @click.prevent="addComment=!addComment" >
                add a comment
            </a>
            <ArticleCommenter v-bind="$props" v-if="addComment" @clicked="update"></ArticleCommenter>
        </div>
    </div>

</template>

<script>
import ArticleCommentsCard from '@/components/ArticleCommentsCard.vue';
import ArticleCommenter from '@/components/ArticleCommenter.vue';
export default {
    name: "ArticleComments",
    data() {
        return {
            comments: [],
            addComment: false
        }
    },
    props: [
        "article_pk", "content_id"
    ],
    components: {
        ArticleCommentsCard,
        ArticleCommenter,
    },
    methods: {
        update: function() {
            this.$axios.get(`comments/articles/${this.article_pk}`).then(res=>{
                this.comments = res.data.data;
                console.log('update');
            })
            this.addComment = false;
        },
    },
    mounted() {
        this.update()
    }
}
</script>

<style scoped lang="scss">
.comments {
    //   width: 660px; //TODO
    margin-top: var(--space-md);
    padding-bottom: var(--space-xxxs);
    border-top: 1px solid var(--color-contrast-low);

    &-list {
        > li {
            display: grid;
            grid-template-columns: max-content 1fr;
            list-style-type: none;
        }
        margin: 0;
    }
    &-link {
        padding: 0 3px 2px 3px;
        font-size: 12px;
        color: var(--color-tertiary-dark);
        cursor: pointer;
    }
}


</style>
