<template>
    <div class="card">

        <div class="info">
            <div class="info__column">
                <p>answer</p>
                <p>view</p>
                <p>helpful</p>
            </div>
            <div class="info__column">
                <p>100</p>
                <p>100</p>
                <p>100</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title">Title Lorem ipsum</div>
            <div class="main__hashtag">
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
                <div class="btn btn--sm">hash tag</div>
            </div>
            <div>created_at | updated_at | answered_at</div>
        </div>
        
        <div class="user">
            <div class="user__top">
                <div class="user__image">
                    User Img
                </div>
                <div  class="user__name">
                    <p>User name</p>
                    <p>User E-mail</p>
                </div>
            </div>

            <div class="user__bottom">
                <div>
                    <p>Point</p>
                    <p>Answer</p>
                </div>
                <div>
                    <p>10000</p>
                    <p>100</p>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'Card'
}
</script>

<style  lang="scss" scoped>
$--card-main-height: 120px;
    .card {
        display: flex;
        justify-content: space-between;
        background-color: red;
        margin-top: var(--space-xxxs);
        width: 890px;
        height: 120px;
    }

    .info {
        background-color: var(--color-surface);
        display: flex;
        justify-content: space-between;
        width: 140px;
        padding: var(--space-md);
        padding-right: var(--space-xxs);;    

            &__column {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                }
        }

    .main {
        flex: 1;
        padding: var(--space-xxs);;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        background-color: var(--color-surface);

        &__title {
            font-size: calc(#{$--card-main-height} * 0.2);   
        }
        
    }

    .user {
            background-color: var(--color-surface);
            width: 200px;
            padding: var(--space-xs);
                &__top {
                    display: flex;
                }

                &__bottom {
                    display: flex;
                    justify-content: space-between;
                }

                &__image {
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    width: 50px;
                    height: 50px;
                }

                &__name {
                    background-color: var(--color-surface);
                    width: auto;
                    margin: auto;
                }
        }
    .btn {
        background-color: var(--color-tertiary);
        margin: var(--space-xxxs);
        color: var(--color-on-tertiary);
    }
</style>


