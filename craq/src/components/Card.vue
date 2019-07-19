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
            <div>asd</div>
            <div>xzczxc</div>
        </div>
        <div class="user">asd</div>
        
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
        background-color: var(--color-primary);
        display: flex;
        justify-content: space-between;
        width: 140px;
        padding: var(--space-md);
        padding-right: 10px;

            &__column {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                margin: 1px;
                }
        }

    .main {
        flex: 1;
        padding: 20px;
        justify-content: space-between;
        background-color: var(--color-surface);

        &__title {
            font-size: calc(#{$--card-main-height} )
            
        }
        
    }

    .user {
            display: flex;
            justify-content: space-between;
            background-color: var(--color-secondary);
            width: 200px;
            padding: 20px;
        }
    
   
</style>


