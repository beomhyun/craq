<template>
    <div class="modal" :class="{'modal__none': !show}">
        <div class="modal__background">
            <div class="modal__box">
                <div class="modal__content margin-bottom-sm padding-top-sm padding-x-md">
                    <h2>{{body}}</h2>
                </div>
                <div class="modal__btn btn btn--primary margin-bottom-sm" @click="clickEvent">
                    <h3>{{btntext}}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Modal",
    props: [
        "show",
        "body",
        "btntext"
    ],
    methods: {
        clickEvent(e) {
           this.$emit('clicked', true);
        }
    }
}

</script>

<style lang="scss" scoped>
.modal {
    transition: all 2s ease;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 5s ease;
    &__none {
        display: none;
    }
    &__background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: alpha(var(--color-accent), 0.5);
        z-index: 50;
    }

    &__box {
        position: absolute;
        box-shadow: var(--shadow-md);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: alpha(var(--color-surface), 0.8);
        border-radius: var(--radius-md);
        text-align: center;
    }
    &__content {
        text-align: center;
        color: var(--color-onsurface);

    }
    &__btn {


    }
}

</style>
