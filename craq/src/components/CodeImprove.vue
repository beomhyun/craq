<template>
    <div>
        <AskQuestion v-if="loaded&&editQuestion" :editQuestion="editQuestion" :questionData ="questionData"/>
        <CodeAnswer v-if="loaded&&$route.params.editAnswer" :editAnswer="$route.params.editAnswer" :question_pk ="question_pk" :questionData="questionData" :answerData="answerData" :isAnswer="isAnswer"/>
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
// import AskQuestion from "@/components/AskQuestion.vue";
const AskQuestion = () => ({
    component: import("@/components/AskQuestion.vue"),
    loading: Spinner,
    delay: 500
});
const CodeAnswer = () => ({
    component: import("@/components/CodeAnswer.vue"),
    loading: Spinner,
    delay: 500
});
export default {
    name : 'codeImprove',
    props: [
        'editQuestion', 'question_pk', 'isAnswer'
    ],
    components : {
        AskQuestion,
        CodeAnswer,
        Spinner
    },
    data() {
        return {
            questionData : {
                QUESTION : '',
                VERSION : [{BODY:"loading"},{BODY:"loading"},{BODY:"loading"}],
                current : 0
            },
            answerData : {
                QUESTION : '',
                VERSION : [{BODY:"loading"},{BODY:"loading"},{BODY:"loading"}],
                current : 0
            },
            loaded: false,
        }   
    },
    mounted() {
        if (this.$route.params.editAnswer) {
            this.$axios.get("questions/detail/" + this.isAnswer.QST_PK).then(res=>{    
                const data = res.data.data;
                this.questionData.QUESTION = data.QUESTION;
                this.questionData.VERSION = this.questionData.VERSION.concat(data.VERSION);
                this.questionData.current = this.questionData.QUESTION[0].VERSION+2;
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@",res)
                console.log("$&%^*&%#$$^&(*&^%#$@#",this.question_pk)
                this.$axios.get("questions/detail/" + this.question_pk).then(res =>{
                    const askdata = res.data.data;
                    this.answerData.QUESTION = askdata.QUESTION;
                    this.answerData.VERSION = this.answerData.VERSION.concat(askdata.VERSION);
                    this.answerData.current = this.answerData.QUESTION[0].VERSION+2;
                    this.loaded = true;
                })
            })
        }
        if (!(this.$route.params.editAnswer)) {
            this.$axios.get("questions/detail/" + this.question_pk).then(res=>{
                const data = res.data.data;
                this.questionData.QUESTION = data.QUESTION;
                this.questionData.VERSION = this.questionData.VERSION.concat(data.VERSION);
                this.questionData.current = this.questionData.QUESTION[0].VERSION+2;
                this.loaded = true;
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

