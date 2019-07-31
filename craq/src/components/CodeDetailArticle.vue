<template>
    <div class="main">
        <CodeDetailArticleTitle :title="'titlehedassdfre'"></CodeDetailArticleTitle>
        <div class="wrapper">
            <CodeDetailArticleTopBar></CodeDetailArticleTopBar>
            <CodeDetailArticleContent></CodeDetailArticleContent>
            <h3>Edit | Delete| Singo | Created at < History No> Username</h3>
        </div>
        <button class="btn btn--primary">Comments</button>
    </div>
</template>

<script>
import CodeDetailArticleTitle from '@/components/CodeDetailArticleTitle.vue';
import CodeDetailArticleTopBar from '@/components/CodeDetailArticleTopBar.vue';
import CodeDetailArticleContent from '@/components/CodeDetailArticleContent.vue';
import CodeDetailArticleSubBar from '@/components/CodeDetailArticleSubBar.vue';
export default {
    name: "CodeDetailArticle",
    components: {
        CodeDetailArticleTitle,
        CodeDetailArticleContent,
        CodeDetailArticleTopBar,
        CodeDetailArticleSubBar
    },
    props: [

    ]
}

</script>


<style>
.main {
    width: 90%;
    display: flex;
    flex-direction: column;
}

</style>
