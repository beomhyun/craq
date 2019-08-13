<template>
    <div class="post-layout" :class="{'selected-answer': is_active,
                                      'targeted': 'a' + article_pk == $route.query.target}">
        <div class="votecell post-layout--left">
            <ArticleVote v-if="loaded" :vote="QUESTION[0].HELPFUL" :ward="QUESTION[0].WARDS" :question="!QUESTION[0].ARTICLE_PK" v-bind="$props" :is_active="is_active"></ArticleVote>
        </div>
        <div class="postcell post-layout--right">
            <ArticleContent v-if="loaded" :body="VERSION[current].BODY"></ArticleContent>
            <ArticleTagList :content_pk="VERSION[current].PK"></ArticleTagList>
            <ArticleSignature @right="up" @left="down" :current="current" :creator="creator" :editor="editor" :created="created" :edited="edited" :article_pk="article_pk" @selectVersion="selectVersion" :isAnswer="isAnswer"></ArticleSignature>
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
import swal from 'sweetalert';

export default {
    name: "Article",
    props: [
        "article_pk", "canSelected"
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
            isAnswer: false,
        }
    },
    watch: {
        'article_pk': function() {
            console.log('article');
            this.$forceUpdate();
        }
    },
    methods: {
        selectVersion(version) {
            this.$axios.put(`questions/${this.article_pk}/content/${this.VERSION[version].PK}`)
                .then(res=> {
                    console.log(res)
                    swal({  
                        title : "현재 버전으로 선택되었습니다!",
                        text:'이 창은 잠시 후 자동으로 사라집니다.',
                        icon: "success", 
                        className: "swal-modal",
                        button: false,
                        timer: 2000,
                    });
                })
        },
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
        if (this.canSelected !== undefined) {
            this.isAnswer = true
        }

        this.$axios.get(`questions/detail/${this.article_pk}`).then(res=>{
            const data = res.data.data;
            this.ANSWERS = data.ANSWERS;
            this.QUESTION = data.QUESTION;
            this.VERSION = this.VERSION.concat(data.VERSION);
            console.log(this.VERSION);
            console.log(this.QUESTION[0])
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
.selected-answer {
    outline: 3px alpha(var(--color-primary-light), .5) inset;
    outline-offset: 5px;

}
.targeted {
    background-color: alpha(var(--color-secondary), 0.2);
}

</style>
