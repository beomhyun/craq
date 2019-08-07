<template>
    <li class="comment">
        <div class="comment-actions">
            <div class="comment-score">{{comment.USER}}</div>
        </div>
        <div class="comment-text">
            <div class="comment-body">
                <span class="comment-copy">{{comment.BODY}}</span>
                -
                <a class="comment-user" href="">{{comment.USERNAME}}</a> &nbsp;
                <span class="comment-date">
                    <a class="comment-link" href="">
                        <span class="absoluteTime">{{comment.CREATED_AT | formatDate}}</span>

                    </a>

                </span>

            </div>
        </div>
    </li>
</template>

<script>
export default {
    name: "ArticleCommentsCard",
    props: [
        "comment"
    ]
}

</script>


<style lang="scss" scoped>
.comment {
    display: content;
    &-actions {
        width: auto;
        grid-template-columns: repeat(2, max-content);
        align-content: flex-start;
        flex-shrink: 0;
    }

    &-score {
        width: auto;
        min-width: 16px;
        display: inline-block;
        padding-right: 4px;
    }
    &-text {
        transition: background-color linear 2s;
        min-width: 0;
        flex-basis: 0;
        padding-left: 6px;
        padding-right: 6px;
        font-size: 13px;
        line-height: 1.3;
        flex-grow: 1;

    }
    &-body {
        word-wrap: break-word;
        padding: 3px 3px 3px 3px;
    }

    &-copy {
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 13px;
        line-height: 1.3 !important;
    }
    &-user {
        white-space: nowrap;        
        padding: 0;
        color: var(--color-tertiary-darker);
        cursor: pointer;
        text-decoration: none;
    }
    &-date {
        border-bottom: none;
        color: var(--color-contrast-medium);
    }
    &-score {
        font-size: 12px;
        line-height: 1.3;
        color: var(--color-primary-dark);
    }
}
</style>
