<template>
    <div class="question__header__bottom padding-bottom-xxxs margin-bottom-sm">
        <div class="margin-right-md margin-bottom-sm" title="hover-text">
            <span>asked</span>
            &nbsp;
            <time itemprop="created_at" datetime="2008-09-04T16:19:49">10years, 11months ago</time>
        </div>
        <div class="margin-right-md margin-bottom-sm" title="hover-text">
            <span>Active</span>
            &nbsp;
            <a href="">
                1month ago
            </a>
        </div>
        <div class="margin-bottom-sm" title="viewed xxxtimes">
            <span>Viewed</span>
            &nbsp; 192k times
        </div>
    </div>
</template>


<script>
export default {
    name: "CodeDetailQuestionHeaderBottom"
}


</script>


<style lang="scss" scoped>
.question__header__bottom {
    display: flex;
    flex-wrap: wrap;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--color-contrast-low);
}


</style>
