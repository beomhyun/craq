<template>
    <div class="post-text" item-prop="text">
        <p>
        What's the best way to extend the User model (bundled with Django's authentication app) with custom fields? I would also possibly like to use the email as the username (for authentication purposes).
        </p>
        <p>
        I've already seen a few to do it, but can't decide on which one is the best.ways
        </p>
    </div>
</template>

<script>
export default {
    name: "CodeDetailContent"
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
