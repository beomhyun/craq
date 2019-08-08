<template>
    <div class="p-table">
        <div class="p-table__item p-table__item--popular col-4@md">
            <div class="flex justify-between items-center margin-bottom-xxs">
                <h4 class="p-table__title"><v-clamp autoresize :max-lines="1">{{tag.TITLE}}</v-clamp></h4>
                <span class="p-table__badge">{{  }}</span>
            </div>

            <div class="p-table__count margin-bottom-sm"><span>{{tag.COUNT}}</span> <i>/ tagged</i></div>

            <ul class="p-table__features margin-bottom-md">
                <template v-for="topfive in topfives">
                    <li>{{topfive.TITLE}} : {{topfive.COUNT}}</li>
                </template>
                <template v-for="i in (5-topfives.length)">
                    <li>&nbsp;</li>
                </template>
            </ul> 
            <div class="margin-top-auto"><a href="#0" class="btn btn--primary btn--md width-100%" @click.prevent="goSearch(tag.TITLE)">redirect</a></div>
        </div>
    </div>
</template> 

<script>
import VClamp from 'vue-clamp'
export default {
    name: "TagsCard",
    props: [
        "tag"
    ],
    components: {
        VClamp
    },
    data() {
        return {
            topfives: []
        }
    },
    methods: {
        goSearch: function(tag) {
            this.$router.push({
                name:'code',
                query: {
                    search_text:'[' + tag + ']'
                }
            })
        } 
    },
    mounted() {
        this.$axios.get(`tags/relation/topfive/${this.tag.PK}`).then((res) => {
            this.topfives = res.data.data; 
        })
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
