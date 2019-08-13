<template>
    <div class="alert"
         :class="[
         {'alert--primary': noty.type==2},
         {'alert--secondary': noty.Type==1},
         {'alert--tertiary': noty.type=='user'},
         {'alert--not-active': noty.is_active}
         ]
         " 
         @click.prevent="onGo">
        <div class="flex items-center justify-between">
            <div class="alert__content items-center">

                <!--<p>
                <font-awesome-icon icon="bell" class="icon"></font-awesome-icon>
                <strong>{{noty.type}}</strong></p>
                <p>{{noty.title}}</p>
                -->
                <p>{{noty.body}}</p>
                <!--<p>{{noty.author}}</p> -->
            </div>
            <button class="reset alert__close-btn">
                <font-awesome-icon @click.stop="onClose" icon="times" class="icon close-btn"></font-awesome-icon>
            </button>
        </div>
    </div>
</template>

<script>
import VClamp from 'vue-clamp';
export default {
    name: "Noty",
    props: [
        "noty"
    ],
    methods: {
        onGo() {
            this.$emit("onGo");
        },
        onClose() {
            this.$emit('onClose');
        }
    }

}

</script>


<style lang="scss" scoped>
.alert {
    padding: var(--space-xs) var(--space-sm);
    background-color: alpha(var(--color-primary), 0.2);
    border-radius: var(--radius-md);
    color: var(--color-on-surface);
    width: 100%;
    &__content {
    }
    &__link-icon {
        margin-left: var(--space-xxs);
        cursor: pointer;
    }

    &__close-btn {
        display: inline-block;
        flex-shrink: 0;
        margin-left: var(--space-sm);

        .icon {
            display: block;
        }
    }

    // colors
    &--primary {
        background-color: alpha(var(--color-primary), 0.4);
    }
    &--secondary {
        background-color: alpha(var(--color-secondary), 0.4);
    }
    &--tertiary {
        background-color: alpha(var(--color-tertiary), 0.6);
    }
    &--not-active {
        filter: grayscale(100%); 
        opacity: 0.5;
    }
}
.alert__content p {
    width: 20%;
}
.close-btn {
    z-index: 99;
}

</style>
