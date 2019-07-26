<template>
    <div class="heading text-center">
        <p class="heading__title">
        {{title}}
        </p>
        <p class="heading__sub">
        {{sub}}
        </p>
    </div>
</template>

<script>
export default {
    name: "HeaderHeading",
    props: [
        "title", "sub"
    ]
}

</script>

<style lang="scss" scoped>
.heading {
    &__title {
        font-size: 5rem;
        color: var(--color-secondary);
        letter-spacing: 1rem;
        text-transform: uppercase;
    }

    &__sub {
        font-size: 1.2rem;
        color: var(--color-on-surface-lighter);
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.3rem;
        
    }
}

</style>
