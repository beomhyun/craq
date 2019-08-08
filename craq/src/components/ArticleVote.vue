<template>
    <div class="voting-container">
        <button class="reset btn-vote">
            <font-awesome-icon icon="chevron-up"></font-awesome-icon>
        </button>
        <div class="vote-count" itemprop="upvoteCount" data-value="408">
            408
        </div>
        <button class="reset btn-vote">
            <font-awesome-icon icon="chevron-down"></font-awesome-icon>

        </button>
        <button class="reset">
            <div class="btn-vote--small">
                <font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon>
            </div>
            <div>162</div>

        </button>

    </div>
</template>

<script>
export default {
    name: "ArticleVote",
}

</script>

<style lang="scss" scoped>
.voting-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
}
.btn-vote {
    font-size: 1.5rem;
    &--small {
        font-size: 1.2rem;
    }
}

</style>
