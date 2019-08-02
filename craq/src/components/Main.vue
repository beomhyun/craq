<template>
    <div class="main">
        <div class="headline">
            <h1>Welcome To CRAQ</h1>
        </div>
        <div class="content">
            <div class="content__menu">
                <div class="notice">
                    Notice
                    <div v-for="i in 10">
                        <span>공지사항이 들어갈 위치</span>
                    </div>
                </div>
                <div class="code">
                    Code Questions
                    <div v-for="i in 10">
                        <span>질문들이 들어갈 위치</span>
                    </div>
                </div>
            </div>
            <div class="content__menu">
                <div class="Community">
                    Tree
                    <div v-for="i in 10">
                        <span>자유게시판이 들어갈 위치</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Main"
}

</script>

<style scoped lang="scss">
.headline {
    width: 100%;
    text-align: center;
}
.content {
    display: flex;
    justify-content: center;
    padding: var(--space-md);
    background-color: var(--color-surface-light);
    
    &__menu {
        margin-left: var(--space-sm);
    }
}

.notice {
    width: 500px;
    height: 600px;
    background-color: var(--color-surface);
    padding: var(--space-sm);
    margin-bottom: var(--space-sm);
}

.code {
    width: 500px;
    height: 400px;
    background-color: var(--color-surface);
    padding: var(--space-sm);
    margin-bottom: var(--space-sm);
}

.Community {
    width: 500px;
    height: 1000px;
    padding: var(--space-sm);
    background-color: var(--color-surface);
    margin-bottom: var(--space-sm);
}
</style>
