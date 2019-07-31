<template>
    <div class="userCard">
        <div class="userImg">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="">
        </div>

        <div class="userInfo">
            <div class="userInfo__Top">
                <div class="userInfo__Top-grade">
                    <div class="btn btn--xs btn--primary">ADMIN</div>
                </div>
                <div class="userInfo__Top-name">
                    
                </div>
                <div class="userInfo__Top-mail">

                </div>
            </div>
            <div class="userInfo__Middle">
                <div class="userInfo__Middle-follow">
                    
                </div>
                <div class="userInfo__Middle-mail">

                </div>
                <div class="userInfo__Middle-follow">

                </div>
            </div>
            <div class="userInfo__Bottom">
                <div class="userInfo__Bottom-Score">

                </div>        
                <div class="userInfo__Bottom-Answer">

                </div>        
            </div>
         </div>
    </div>
</template>
<script>
export default {
    name: 'UserCard'
}
</script>
<style lang="scss" scoped>
.userCard {
    width: 300px;
    height: 120px;
    display: flex;

    margin: var(--space-xxs);
    border: 1px solid var(--color-contrast-low);
}
.userImg {
    width: 120px;
}


</style>



