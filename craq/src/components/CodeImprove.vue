<template>
    <div>
        <AskQuestion v-if="loaded&&$route.params.editQuestion" :editQuestion="$route.params.editQuestion" :questionData ="questionData"/>
        <CodeAnswer v-if="loaded&&$route.params.editAnswer" :editAnswer="$route.params.editAnswer" :question_pk ="$route.params.question_pk" :questionData="questionData" />
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
            this.$axios.get("questions/detail/" + this.$route.params.question_pk).then(res=>{    
                const data = res.data.data;
                this.questionData.QUESTION = data.QUESTION;
                this.questionData.VERSION = this.questionData.VERSION.concat(data.VERSION);
                this.questionData.current = this.questionData.QUESTION[0].VERSION+2;
                this.$axios.get("questions/detail/" + res.data.ANSWERS.PK).then(res =>{
                    const data = res.data.data;
                    this.answerData.QUESTION = data.QUESTION;
                    this.answerData.VERSION = this.questionData.VERSION.concat(data.VERSION);
                    this.answerData.current = this.questionData.QUESTION[0].VERSION+2;
                })
                this.loaded = true;
            })
        }
        this.$axios.get("questions/detail/" + this.$route.params.question_pk).then(res=>{
            const data = res.data.data;
            this.questionData.QUESTION = data.QUESTION;
            this.questionData.VERSION = this.questionData.VERSION.concat(data.VERSION);
            this.questionData.current = this.questionData.QUESTION[0].VERSION+2;
            this.loaded = true;
        })
    }
}
</script>

<style lang="scss" scoped>

</style>

