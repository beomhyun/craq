<template>
    <div class="post-layout">
        <div class="votecell post-layout--left">
            <ArticleVote v-if="loaded" :vote="QUESTION[0].HELPFUL" :ward="QUESTION[0].WARDS" :question="!QUESTION[0].IS_ANSWER" v-bind="$props" :is_active="is_active"></ArticleVote>
        </div>
        <div class="postcell post-layout--right">
            <ArticleContent v-if="loaded" :body="VERSION[current].BODY"></ArticleContent>
            <ArticleTagList :content_pk="VERSION[current].PK"></ArticleTagList>
            <ArticleSignature @right="up" @left="down" :current="current" :creator="creator" :editor="editor" :created="created" :edited="edited"></ArticleSignature>
            <div style="grid-column: 1 / 3;"></div>
            <div class="post-layout--right">
                <ArticleComments v-bind="$props" :content_id="VERSION[current].PK"></ArticleComments>
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
    props: [
        "article_pk"
    ],
    data() {
        return {
            ANSWERS: [],
            QUESTION: [],
            VERSION: [{BODY:"loading"},{BODY:"loading"},{BODY:"loading"}],
            loaded: false,
            current: 0,
            creator: 0,
            editor: 0,
            selected: 0,
            created:"",
            edited:"",
        }
    },
    methods: {
        up: function() {
            if (this.current + 1 < this.VERSION.length) {
                this.current++;
                this.editor = this.VERSION[this.current].USER_PK
                this.edited = this.VERSION[this.current].CREATED_AT
            }
        },
        down: function() {
            if (this.current -1 > 2) {
                this.current--;
                this.edited = this.VERSION[this.current].CREATED_AT
                this.editor = this.VERSION[this.current].USER_PK
            }
        }

    },
    components: {
        ArticleContent,
        ArticleComments,
        ArticleVote,
        ArticleTagList,
        ArticleSignature,
    },
    mounted() {
        this.$axios.get(`questions/detail/${this.article_pk}`).then(res=>{
            const data = res.data.data;
            this.ANSWERS = data.ANSWERS;
            this.QUESTION = data.QUESTION;
            this.VERSION = this.VERSION.concat(data.VERSION);
            this.loaded = true;
            this.current = this.QUESTION[0].VERSION+2;
            this.creator = this.VERSION[3].USER_PK;
            this.editor = this.VERSION[this.current].USER_PK;
            this.edited = this.VERSION[this.current].CREATED_AT;
            this.created = this.VERSION[3].CREATED_AT;
            this.selected = 0;
            this.is_active = this.QUESTION[0].IS_ACTIVE;
        })
    },
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
