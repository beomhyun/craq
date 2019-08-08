<template>
    <div class="post-taglist flex flex-column flex-gap-xs">
        <div class="d-block ps-relative">
            <a class="post-tag" href="" rel="tag">
                django
            </a>
            <a class="post-tag" href="" rel="tag">
                django
            </a>
            <a class="post-tag" href="" rel="tag">
                django
            </a>
            <a class="post-tag" href="" rel="tag">
                django
            </a>
            <a class="post-tag" href="" rel="tag">
                django
            </a>
            <a class="post-tag" href="" rel="tag">
                django
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "ArticleTagList"
}

</script>

<style lang="scss" scoped>

.post {

    &-taglist {

    }

    &-tag {
        font-size: 12px;
        color: var(--color-tertiary-darker);
        background-color: var(--color-tertiary-lighter);
        border-color: var(--color-tertiary-lighter);
        padding: .4em .5em;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        text-decoration: none;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-radius: var(--radius-md);
        overflow: hidden;
        transition: all .15s ease;
        margin: 2px 2px 2px 0;

        &:hover {
            color: var(--color-tertiary-darker);
            background-color: var(--color-tertiary);
            border-color: var(--color-tertiary);
            text-decoration: none;
        }
    }
}

</style>
