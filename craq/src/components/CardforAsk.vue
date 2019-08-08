<template>
    <div class="card">
        <div class="info">
            <div class="info__column-left">
                <p>Answer</p>
                <p>View</p>
                <p>Helpful</p>
            </div>
            <div class="info__column-right">
                <p>{{list.cardInfo.Answer}}</p>
                <p>{{list.cardInfo.View}}</p>
                <p>{{list.cardInfo.Helpful}}</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title"><h4> {{list.cardMain.Title}} </h4></div>
            <div class="main__hashtag">
                <div>{{list.cardMain.Content}}</div>
            </div>
       </div>


    </div>
</template>
<script>
export default {
    name: 'Card',
    props: [
        'list'
    ],
    data() {
        return {

        }
    },

}
</script>

<style  lang="scss" scoped>
$--card-main-height: 120px;

    .card {
        border-radius: calc(var(--radius, 0.25em));
        display: flex;
        justify-content: space-between;
        background-color:var(--color-surface-lighter);
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
                text-align: end;
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
        width: 100%;
        padding: var(--space-xxs);
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &__title {
            font-size: calc(#{$--card-main-height} * 0.2);
        }
        &__hashtag {
            width: 100%;
        }

    }
</style>
