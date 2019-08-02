<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader :title="question.versions.slice(-1)[0].TITLE"></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom 
                 :created_at="question.versions[0].CREATED_AT"
                 :updated_at="question.versions.slice(-1)[0].CREATED_AT"
                ></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">

                    <div id="question" class="question">
                        <Article></Article>
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
                user_pk: 0,
                user_name: "test",
                answers: 0,
                helpful: 0,
                pk: 0,
                wards: 0,
                answers: 0,
                versions: [
                    {
                        PK: 0,
                        VERSION: 0,
                        TITLE: '',
                        BODY: '',
                        USER_PK:'',
                        USER_NAME: 0,
                        CREATED_AT: '',
                    }

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
            const data = res.data;
            let question = data.question[0]
            //console.log(question);
            this.question.user_name = question.USER_NAME;
            //TODO user_pk
            this.question.pk = question.PK;
            this.wards = question.WARDS;
            
            let qversions = data.versions;
            //console.log(qversions);
            //question versions
            this.question.versions = qversions;
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
