<template>
    <div> <h1>Code-Q&A</h1> 
        <CodeDetailArticle></CodeDetailArticle>
    </div>
</template>

<script>
// question_id = this.$route.params.question_id
import CodeDetailArticle from '@/components/CodeDetailArticle';
export default {
    name: "CodeDetail",
    components: {
        CodeDetailArticle
    },
    data() {

        return {
            Question: {
                user:{
                    username:"kimsangkeun"
                },
                selected: 'num',
                content: [
                    {
                        title:"How to get a Free McDonald's",
                        body: "go and get them!!",
                        created_at: "2012-02-12",
                        user: "kimsangkeun",
                        is_removed: false,
                    },
                    {
                        title:"How to get a Free BergurKing",
                        body: "TripleXXX",
                        created_at: "2012-02-12",
                        user: "DJ KOO",
                        is_removed: false,
                    },
                ]
            },
            Answers: [
                {
                    user: "hi",
                    is_active: true,
                    selected: "idx",
                    content: [
                        {
                            title: "grab $5 from your pocket",
                            body: "SSSSSSSSSSSSSSSSSSSSSSSSSSEEAAAAAAAAAAA",
                            created_at: "2013-11-12",
                            user: "hi",
                        },

                        {
                            title: "grab $100 from your pocket",
                            body: "D.VA D.Va ddddvaaa",
                            created_at: "2013-11-12",
                            user: "hi",
                        }
                    ]
                }
            ]
        }
    }
}

</script>


<style scoped lang="scss">

</style>
