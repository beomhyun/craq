<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader :title="question.VERSIONS.slice(-1)[0].TITLE"></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom 
                 :created_at="'2019-07-24T06:10:42.000Z'"
                 :updated_at="'2019-07-24T06:10:42.000Z'"
                 :views="1234"
                 ></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">

                    <div id="question" class="question">
                        <Article 
                                       :article="question"
                                       ></Article>
                    </div>
                    <div id="answers">
                        <CodeDetailAnswerHeader></CodeDetailAnswerHeader>
                        <Article></Article>
                        <div class="separator"></div>
                        <Article></Article>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import CodeDetailQuestionHeader from '@/components/CodeDetailQuestionHeader.vue';
import CodeDetailQuestionHeaderBottom from '@/components/CodeDetailQuestionHeaderBottom.vue';
import Article from '@/components/Article.vue';
import CodeDetailAnswerHeader from '@/components/CodeDetailAnswerHeader.vue';

export default {
    name: "CodeDetail",
    components: {
        CodeDetailAnswerHeader,
        CodeDetailQuestionHeader,
        CodeDetailQuestionHeaderBottom,
        Article,
    },
    data() {
        return {
            question: {
                USER_PK: 0,
                USER_NAME: "test",
                ANSWERS: 0,
                HELPFUL: 0,
                PK: 0,
                WARDS: 0,
                VIEWS: 0,
                VERSIONS: [
                    {
                        PK: 0,
                        TITLE: "",
                        BODY: "",
                        HASHTAG: "",
                        USER_PK: 0,
                        USER_NAME: "",
                    },
                    {
                        PK: 0,
                        TITLE: "",
                        BODY: "",
                        HASHTAG: "",
                        USER_PK: 0,
                        USER_NAME: "",
                    },
                ],
            },
            answers: [

            ]

        }
    },
    props: [
        "pk"
    ],
    mounted() {
        this.$axios.get(`questions/detail/${this.pk}`, {headers: {'user_token': this.$session.get('jwt')
        }}).then((res) => {
            const data = res.data.data;
            let question = data.QUESTION[0];
        }
        )
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

.separator {
    margin: 30px 1px;
    height: 0px;
    border-bottom: 1px solid var(--color-contrast-low);

}
</style>
