<template>
    <form class="expandable-search" action="" :class="{'noShow': !show}" @submit.prevent="nothing">
        <input class="form-control" type="search" name="q" id="header-search" @blur="onBlur" :class="{'noShow' : !show}" v-model="raw" @keyup.enter.prevent="search">
    </form>

</template>

<script>
export default {
    name: "NavBarSearch",
    props: [
        "show"
    ],
    methods: {
        onBlur() {
            this.show = false;
            this.$emit('onBlur');
        },
        search() {
            this.$router.push({
                name:"code",
                query: {
                    page: 1,
                    order_by: "PK",
                    search_text: this.raw
                }
            })
        },
        nothing() {

        }
    },
    data() {
        return {
            hashtags: [],
            q: "",
            raw: "",
        }
    },
}

</script>


<style scoped lang="scss">
$--expandable-search-size: 1em;

.expandable-search {
    position: relative;
    display: inline-block;
    font-size: $--expandable-search-size;

    .form-control {
        background-color: transparent;
        border-color: var(--color-primary);
        color: transparent;
        width: 0.1px;
        height: 2.2em;
        padding: 0;
        overflow: hidden;
        opacity: 1;
        transition: all .3s var(--ease-out);

        &:focus {
            width: 30em;
            padding: 0 2.2 0 var(--space-xs);
            background-color: var(--color-surface-light);
            color: var(--color-on-surface-light);
        }

        &::-webkit-search-decoration,
        &::-webkit-search-cancel-button,
        &::-webkit-search-results-button,
        &::-webkit-search-results-decoration {
            display: none;
        }
    }
}
.noShow {
    opacity: 0;
}
</style>
