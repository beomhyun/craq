<template>
    <div>
        <div class="profile">
            <div class="profile__content">
                <figure class="profile__shape">
                    <img :src="getSrc(fileName)" alt="profile image" class="reset profile__img">
                    <figcaption class="profile__caption">{{fullName}}</figcaption>
                </figure>
                <div class="profile__text">
                    <p class="profile__text-heading">{{title}}</p>
                    <p class="profile__text-sub">{{subTitle}}</p>
                    <p class="profile__text-icon">
                    <template v-for="skill in skills">
                    <font-awesome-icon :icon="skill"></font-awesome-icon></template>
                    </p>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "HeaderProfileCard",
    props: [
        "fileName", "fullName", "title", "subTitle", "skills"
    ],
    methods: {
        getSrc(fileName) {
            return require('../assets/' + fileName);
        }

    },
    mounted() {
    }
}

</script>

<style lang="scss" scoped>
.temp {
    color: orangered;
}

.profile {
    width: 75%;
    margin: 0 auto;
    box-shadow: var(--shadow-md);
    background-color: alpha(var(--color-surface), .5);
    border-radius: 3px;
    padding: 6rem;
    padding-left: 9rem;
    transform: skewX(-12deg);
    &__content {
        transform: translateY(-3rem);
    }

    &__shape {
        position: relative;
        overflow: hidden;
        width: 15rem;
        height: 15rem;
        float: left;
        -webkit-shape-outside: circle(50% at 50% 50%);
        shape-outside: circle(50% at 50% 50%);
        transform: skewX(12deg);
        -webkit-clip-path: circle(50% at 50% 50%);
        clip-path: circle(50% at 50% 50%);
    }
    &__img {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 100%;
        transform: translate(-50%, -50%) scale(1.7);
        transition: all .5s;
        backface-visibility: hidden;
    }

    &__text {
        transform: skewX(12deg);

        &-heading {
            color: var(--color-on-surface);
            font-size: 2.5rem;
        }

        &-sub {
            font-size: 1.5rem;
            color: var(--color-on-surface-lighter);

        }
        &-icon {
            font-size: 3rem;
            color: var(--color-primary-darker);
            display: flex;
            justify-content: space-between;
        }
    }

    &__caption {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 20%);
        color: white;
        text-transform: uppercase;
        text-align: center;
        opacity: 0;
        transition: all .5s;
        backface-visibility: hidden;
    }
    &:hover &__caption {
        opacity: 1;
        transform: translate(-50%, -50%);
    }

    &:hover &__img {
        transform: translate(-50%, -50%) scale(1.4);
        filter: brightness(80%) blur(3px);
    }


}
</style>
