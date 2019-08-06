<template>
    <div class="post-text" item-prop="text">
        <div v-html="body"></div>
    </div>
</template>

<script>
export default {
    name: "ArticleContent",
    props: [
        "body"
    ]
}

</script>

<style scoped lang="scss">
.post-text {
    margin-bottom: 5px;
    word-wrap: break-word;
    font-size: 1rem; // TODO
    line-height: 1.3;
    font-family: Arial, "Helvetica Neue",Helvetica, sans-serif;
}


</style>
