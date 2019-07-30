<template>
    <div class="p-table">
        <div class="p-table__item p-table__item--popular col-4@md">
            <div class="flex justify-between items-center margin-bottom-xxs">
                <h4 class="p-table__title"><v-clamp autoresize :max-lines="1">{{title}}</v-clamp></h4>
                <span class="p-table__badge">{{id}}</span>
            </div>

            <div class="p-table__count margin-bottom-sm"><span>#151</span> <i>/ view1</i></div>

            <ul class="p-table__features margin-bottom-md">
                <li>css : 1000</li>
                <li>Html5: 500</li>
                <li>Cpp: 10000</li>
                <li>Java: 50</li>
                <li>VueJs: 50000</li>
            </ul>

            <div class="margin-top-auto"><a href="#0" class="btn btn--primary btn--md width-100%">redirect</a></div>
        </div>
    </div>
</template> 

<script>
import VClamp from 'vue-clamp'
export default {
    name: "TagsCard",
    props: [
        "title", "body", "id"
    ],
    components: {
        VClamp
    }
}

</script>


<style lang="scss" scoped>
.p-table {
    &__item {
        background-color: var(--color-background);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        display: flex;
        flex-direction: column;

        &--popular {
            background-color: var(--color-surface);
            color: var(--color-on-surface);
            border: 2px solid var(--color-primary-dark);
        }

    }

    &__badge {
        font-size: var(--text-sm);
        background-color: var(--color-contrast-high);
        color: var(--color-bg);
        border-radius: var(--radius-sm);
    }

    &__count {
        span {
            font-size: var(--text-xxxl);
            font-weight: bold;
        }
    }

    &__features {
        li {
            margin-bottom: var(--space-xs);
        }
    }

}
.btn--primary {
    background-color: var(--color-primary-dark);
}
</style>
