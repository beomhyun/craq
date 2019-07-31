<template>
    <h1 class="main">{{ title }}</h1>
</template>
<script>
export default {
    name: "CodeDetailArticleTitle",
    props: [
        "title"
    ]
}

</script>

<style lang="scss" scoped>
.main {
    background-color: blue;
}

</style>
