<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">

                    <div id="question" class="question">
                        <div class="post-layout">
                            <div class="votecell post-layout--left">
                                <CodeDetailVote></CodeDetailVote>
                            </div>
                            <div class="postcell post-layout--right">
                                <div class="post-text" item-prop="text">
                                    <p>
                                    What's the best way to extend the User model (bundled with Django's authentication app) with custom fields? I would also possibly like to use the email as the username (for authentication purposes).
                                    </p>
                                    <p>
                                    I've already seen a few to do it, but can't decide on which one is the best.ways
                                    </p>
                                </div>
                                <CodeDetailTagList></CodeDetailTagList>
                                <div class="margin-bottom-xxxs">
                                    <div class="padding-top-xs margin-top-md flex flex-wrap justify-end items-start flex-gap-sm">
                                        <div class="margin-right-xs" style="flex: 1 1 100px">
                                            <div class="post-menu">
                                                <a href="">share</a>
                                                <span style="visibility: hidden;">|</span>
                                                <a href="">improve this question</a>

                                            </div>
                                        </div>
                                        <div class="post-signature">
                                            <div class="user-info">
                                                <div class="user-action-time">
                                                    <a href="" title="show all edits">edited
                                                        <span title="2019-1-1">2020-12-20</span>
                                                    </a>
                                                </div>
                                                <div class="user-gravatar32">
                                                    <span class="anonymous-gravatar"></span>
                                                </div>
                                                <div class="user-details">
                                                    userAnonymous
                                                    <div class="-flair"></div>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="post-signature owner">
                                            <div class="user-info">
                                                <div class="user-action-time">
                                                    <a href="" title="show all edits">edited
                                                        <span title="2019-1-1">2020-12-20</span>
                                                    </a>
                                                </div>
                                                <div class="user-gravatar32">
                                                    <a href="">
                                                    <span class="anonymous-gravatar" style="display:none;"></span>
                                                    <img src="../assets/3232placeholder.png" alt="" width="32" height="32">
                                                    </a>
                                                </div>
                                                <div class="user-details">
                                                    <a href="">D.Va HanaSong</a>
                                                    <div class="-flair">
                                                        <span class="reputation-score" title="reputation score">9,000</span>
                                                        <span title="helloworld">
                                                            <span class="badge"><font-awesome-icon :icon="['far', 'copyright']"></font-awesome-icon></span>
                                                            <span class="badgecount">20</span>
                                                        </span>
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import CodeDetailQuestionHeader from '@/components/CodeDetailQuestionHeader.vue';
import CodeDetailQuestionHeaderBottom from '@/components/CodeDetailQuestionHeaderBottom.vue';
import CodeDetailVote from '@/components/CodeDetailVote.vue';
import CodeDetailTagList from '@/components/CodeDetailTagList.vue';

export default {
    name: "CodeDetail",
    components: {
        CodeDetailQuestionHeader,
        CodeDetailQuestionHeaderBottom,
        CodeDetailVote,
        CodeDetailTagList
    }
}

</script>

<style scoped lang="scss">
#mainbar {
    width: calc(100%-300px-24px); //TODO
    float: left;
    margin: 0;
    padding: 0;
}

#question {
    clear: both;
}


.votecell {
    vertical-align: top;
    padding-right: 15px;
    width: auto;
}
.postcell {
    vertical-align: top;
}

.post {

    &-text {
        margin-bottom: 5px;
        word-wrap: break-word;
        font-size: 1rem; // TODO
        line-height: 1.3;
        font-family: Arial, "Helvetica Neue",Helvetica, sans-serif;

    }

    &-menu {
        padding: 0 3px 2px;
        display: inline-block;
        color: var(--color-contrast-medium);
    }
    &-signature {
        text-align: left;
        vertical-align: top;
        width: 200px;
        margin: 4px 0px;
    }
}

.user {

    &-info {
        box-sizing: border-box;
        padding: 5px 6px 7px 7px;
        width: 200px;
    }

    &-gravatar32 {
        float: left;
        width: 32px;
        height: 32px;
        border-radius: 1px;
    }
}

.anonymous-gravatar {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-position: 0 -400;
    background-image: url('../assets/anonymous.png'), none;
    background-size: contain;
}
.-flair {
    display: block;

    & > span:not(.reputation-score) {
        margin-right: 3px;
        margin-left: 2px;
        font-size: 13px;
    }
}

.post-layout {
    display: grid;
    grid-template-column: max-content 1fr;

    &--left {
        width: auto;
        padding-right: 15px;
    }
    &--right { //TODO
        grid-column: 2;
        width: auto;
        flex-shrink: 1;
    }
}
.badge {
    color: var(--color-primary-dark);
}

a {
    font-size: 12px;
    color: var(--color-tertiary-darker);

    &:hover {
        color: var(--color-tertiary); 
    }
}
.reputation-score {
    font-weight: bold;
    font-size: 12px;
    margin-right: 2px;
}


.owner {
    border-radius: 3px;
    background-color: var(--color-tertiary);
    color: var(--color-on-tertiary);
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
.ps-relative {
    position: relative !important;
}
.d-block {
    display: block !important;
}
</style>
