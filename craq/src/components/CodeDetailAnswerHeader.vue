<template>
    <div id=answers-header>
        <div class="subheader answers-subheader">
            <h2 data-answercount="10">10 Answers</h2>
            <div>
                <div id="tabs">
                    <a href="">active</a>
                    <a href="">oldest</a>
                    <a href="" class="youarehere is-selected">votes</a>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
export default {
    name: "CodeDetailAnswerHeader"
}

</script>

<style lang="scss" scoped>
#answers-header {
    width: 100%;
    margin-top: 10px
}
.subheader {
    clear: both;
    box-sizing: content-box;
    margin-bottom: 10px;
    height: 40px;
    border-bottom: 1px solid var(--color-contrast-low);
    vertical-align: baseline;

    & h2 {
        color: var(--color-contrast-medium);
        margin-bottom: 0;
        font-weight: 400;
        float: left;
    }
}
#tabs {
    float: right;
    & a {
        margin-right: 0;
        padding-left: 8px;
        padding-right: 9px;
        position: relative;
        padding: 13px 10px;
        border: 1px solid transparent;
        font-size: 12px;
        float: left;
        color: var(--color-secondary-dark);
        cursor: pointer;

    }
}

.youarehere {
    font-weight: 400;
    border-color: var(--color-surface-light);
    border-bottom-color: var(--color-surface);
    cursor: default;
}

</style>
