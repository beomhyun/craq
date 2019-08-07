<template>
    <nav class="pagination" aria-label="Pagination">
        <ol class="pagination__list flex flex-wrap flex-gap-xxs justify-center">
            <li :class="{'pagination__item--disabled': starter==0}">
                <a href="#0" class="pagination__item" aria-label="Go to previous page" @click.prevent="$emit('clicked', starter-chunkSize+1)">
                    <svg class="icon margin-right-xxxs" aria-hidden="true" viewBox="0 0 16 16"><title>Previous</title><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="9.5,3.5 5,8 9.5,12.5 "></polyline></g></svg>
                    <span>Prev</span>
                </a>
            </li>
            <template v-for="i in renderSize" v-key="i+starter">
                <li>
                    <a href="#0" class="pagination__item" aria-label="Go to page 1" @click.prevent="$emit('clicked', i+starter)" :class="{'pagination__item--selected': i==curPage}">{{i + starter}}</a>
                </li>
            </template>

            <template v-if="!isLast">
            <li>
                <span class="pagination__item pagination__item--ellipsis">...</span>
            </li>

            <li>
                <a @click.prevent="$emit('clicked', maxPage)" href="#0" class="pagination__item" aria-label="Go to page 20">{{maxPage}}</a>
            </li>
            </template>

            <li>
                <a href="#0" class="pagination__item" aria-label="Go to next page" :class="{'pagination__item--disabled': isLast}" @click.prevent="$emit('clicked', starter+chunkSize+1)">
                    <span>Next</span>
                    <svg class="icon margin-left-xxxs" aria-hidden="true" viewBox="0 0 16 16"><title>Next</title><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="6.5,3.5 11,8 6.5,12.5 "></polyline></g></svg>
                </a>
            </li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: "Paginator",
    props:[
        "chunkSize", "maxPage", "curPage"
    ],
    data() {
        return {
            starter: 0,
            renderSize: 0,
        }
    },
    watch: {
        $props: {
            handler() {
                this.update();

            },
            deep: true,
            immediate: true
        }

    },
    methods: {
        update() {
            this.starter = parseInt((this.curPage-1) / this.chunkSize) * this.chunkSize;
            this.renderSize = Math.min(this.maxPage - this.starter, this.chunkSize);
            console.log(this.isLast);
        }

    },
    computed: {
        isLast: function() {
            console.log(this.starter, this.chunkSize, this.maxPage);
            return (this.starter+this.chunkSize) >= this.maxPage;
        }
    }
}

</script>


<style lang="scss" scoped>
.pagination {


}

.pagination__list > li {
    display: inline-block; // flex fallback
}

// --split - push first + last item to sides
.pagination--split {
    .pagination__list {
        width: 100%;

        > *:first-child {
            margin-right: auto;
        }

        > *:last-child {
            margin-left: auto;
        }
    }
}

.pagination__item {
    display: inline-block; // flex fallback
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    line-height: 1;
    padding-top: var(--space-xs);
    padding-bottom: var(--space-xs);
    padding-left: calc(1.355 * var(--space-xs));
    padding-right: calc(1.355 * var(--space-xs));
    border-radius: var(--radius-md);
    text-decoration: none;
    height: 100%;

    &:hover {
        background-color: var(--color-contrast-lower);
    }

    &:active {
        background-color: var(--color-contrast-low);
    }
}

.pagination__item--selected {
    background-color: var(--color-primary);
    color: var(--color-white);
    @include fontSmooth;

    &:hover {
        background-color: var(--color-primary-light);
    }

    &:active {
        background-color: var(--color-primary-dark);
    }
}

.pagination__item--ellipsis {
    color: var(--color-contrast-high);

    &:hover, &:active {
        background-color: transparent;
    }
}

.pagination__item--disabled {
    opacity: 0.5;
    pointer-events: none;
}

// --jumper
.pagination__jumper {
    .form-control {
        width: 3.2em;
        margin-right: var(--space-xs);
        padding: var(--space-xs);
    }

    em {
        flex-shrink: 0;
        white-space: nowrap;
    }
}
</style>
