<template>
    <div class="base">
        <div class="header">
            <div class="header__sign-up">
                <SignForm/>
            </div>
        </div>
        <div class="header__feature">
            <HeaderFeature/>
        </div>
        <div class="header__profile">
            <HeaderProfile/>
        </div>
    </div>
</template>

<script>
import SignForm from '@/components/SignForm.vue'
import HeaderFeature from '@/components/HeaderFeature.vue'
import HeaderProfile from '@/components/HeaderProfile.vue'
export default {
    name: "Header",
    components: {
        SignForm,
        HeaderFeature,
        HeaderProfile
    }
}

</script>


<style lang="scss" scoped>
.base {
    background-color: var(--color-surface);
}
.header {
    height:50rem;
    background-image: linear-gradient(to right bottom,
    alpha(var(--color-surface-lighter), 0.5),
    alpha(var(--color-surface-darker), 0.5)),
    url(../assets/header.jpg);
    background-size: cover;
    background-position: top;
    position: relative;

    &__sign-up {
        position: absolute;
        top:10%;
        right:2em;
        width: 35%;
    }

    &__feature {
        height: 80rem;
        background-color: var(--color-surface);
        margin-top: -10rem;
        transform: skewY(-7deg);
        & > * {
            transform: skewY(7deg);
        }
    }

    &__profile {
        height: 100rem;
        padding: 5rem 0rem;
        background-image: linear-gradient(to right bottom,
        alpha(var(--color-surface-light), 0.9),
        alpha(var(--color-surface-darker), 0.9)),
        url('../assets/Profile.gif') ;
        background-size: cover;
        background-position: center;

        transform: skewY(-7deg);
        & > * {
            transform: skewY(7deg);
        }
    }
}


</style>
