<template>
    <div class="card">

        <div class="info">
            <div class="info__column-left">
                <p>Answer</p>
                <p>View</p>
                <p>Helpful</p>
            </div>
            <div class="info__column-right">
                <p>100</p>
                <p>100</p>
                <p>100</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title"><h4> Title Lorem ipsum </h4></div>
            <div class="main__hashtag">
                <div class="btn btn--sm">HashTag</div>
  
            </div>
            <div>Created_at| Updated_at | Answered_at</div>
        </div>
        
        <div class="user">
            <div class="user__top">
                <div class="user__image">
                    Face
                </div>
                <div  class="user__name">
                    <h4>User Name</h4>
                    <p>User Mail</p>
                </div>
            </div>

            <div class="user__bottom">
                <div class="user__bottom-left">
                    <p>Score</p>
                    <p>Answers</p>
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
        border-radius: calc(var(--radius, 0.25em));
        display: flex;
        justify-content: space-between;
        background-color:var(--color-surface);
        color:var(--color-on-surface);
        margin-top: var(--space-xxxs);
        width: 100%;
        height: 120px;
    }

    .card:hover {
        background-color: var(--color-surface-dark);
    }

    .info {
        display: flex;
        justify-content: space-between;
        width: 140px;
        padding: var(--space-md);
        padding-right: var(--space-xxs); 

            &__column-right {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                color: var(--color-on-surface-lighter);
                }

            &__column-left {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                color: var(--color-on-surface-lighter);
                font-weight: bold;
                }
        }

    .main {
        flex: 1;
        padding: var(--space-xxs);;
        border-left: 1px solid var(--color-primary);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        &__title {
            font-size: calc(#{$--card-main-height} * 0.2);   
        }
        
    }

    .user {
            width: 200px;
            padding: var(--space-xs);
            border-left: 1px solid var(--color-primary);
                &__top {
                    display: flex;
                    font-weight: bold;
                }

                &__bottom {
                    display: flex;
                    justify-content: space-between;
                    margin-top: var(--space-xs);
                }

                &__image {
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    width: 50px;
                    height: 50px;
                }

                &__name {
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


