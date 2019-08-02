<template>
    <div class="question__header__bottom padding-bottom-xxxs margin-bottom-sm">
        <div class="margin-right-md margin-bottom-sm" title="hover-text">
            <span>asked</span>
            &nbsp;
            <time itemprop="created_at" datetime="created_at">{{created_at|formatDate}}</time>
        </div>
        <div class="margin-right-md margin-bottom-sm" title="hover-text">
            <span>Active</span>
            &nbsp;
            <a href="">
                {{updated_at | formatDate}}
            </a>
        </div>
        <div class="margin-bottom-sm" title="viewed xxxtimes">
            <span>Viewed</span>
            &nbsp; {{views | commaSep}} times
        </div>
    </div>
</template>


<script>
export default {
    name: "CodeDetailQuestionHeaderBottom",
    data() {
        return {
        }
    },
    props:[
        "created_at", "updated_at", "views"
    ],
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
