<template>
    <div class="card">
        <div class="info">
            <div class="info__column-left">
                <p>Answer</p>
                <p>View</p>
                <p>Helpful</p>
            </div>
            <div class="info__column-right">
                <p>{{list.USER_ANSWERS}}</p>
                <p>{{list.VIEWS}}</p>
                <p>{{list.HELPFUL}}</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title"><h4> <VClamp autoresize :max-lines="1">{{list.TITLE}} </VClamp></h4></div>
            <div class="main__hashtag">
                <VClamp autoresize :max-lines="3">{{list.BODY}}</VClamp>
            </div>
       </div>
        
        
    </div>
</template>
<script>
import VClamp from 'vue-clamp'

export default {
    name: 'Card',
    components: {
        VClamp
    },
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


