<template>
    <AskQuestion v-if="loaded" :editQuestion="$route.params.editQuestion" :questionData ="questionData"/>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import AskQuestion from "@/components/AskQuestion.vue";
// const AskQuestion = () => ({
//     component: import("@/components/AskQuestion.vue"),
//     loading: Spinner,
//     delay: 500
// });
export default {
    name : 'codeImprove',
    components : {
        AskQuestion,
        Spinner
    },
    data() {
        return {
            questionData : {
                QUESTION : '',
                VERSION : [{BODY:"loading"},{BODY:"loading"},{BODY:"loading"}],
                current : 0
            },
            loaded: false,
        }   
    },
    mounted() {
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

