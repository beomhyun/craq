<template>
    <div>
        <div class="filler">

            <!-- Headline -->
            <div class="headline">
                TAGS
            </div> <!-- headline -->

            <!-- Filter && Card -->
            <div class="subnav">
                <div class="subnav__filter">
                    <div class="btn btn--sm">Latest</div>
                    <div class="btn btn--sm">Reliable</div>
                    <div class="btn btn--sm">Helpful</div>
                    <div class="btn btn--sm">Answer</div>
                    <div class="btn btn--sm">View</div>
                </div>
            </div> <!-- Filter /div -->

            <div class="grid  grid-gap-xl margin-lg">
                <template v-for="tag in tags" v-key="i">
                    <TagsCard class="col-3" :tag="tag"></TagsCard>
                </template>
            </div>


            <!-- Pagenation -->
            <Paginator :chunkSize="chunkSize" :maxPage="maxPage" :curPage="curPage" @clicked="move"></Paginator>
            <!-- pagenation -->

        </div> <!-- Container /div -->

    </div>  <!-- Filler -->
</template>

<script>
//import Card from '@/components/Card.vue';
//import Ask from '@/components/AskQuestion.vue';
import TagsCard from '@/components/TagsCard.vue';
import Paginator from '@/components/Paginator.vue';
//import axios from 'axios';
//const apiUrl = "https://jsonplaceholder.typicode.com/posts"
export default {
    name: "Tags",
    components: {
        TagsCard,
        Paginator,
    },
    data() {
        return {
            messages: '',
            tags: [],

            //paginations
            chunkSize: 5,
            maxPage: 1,
            starter: 0,
            renderSize: 1,
            curPage: 1,
        }
    },
    watch: {
        '$route': function (to, from) { // wathcing query changes
            this.update();
        }
    },
    methods: {
        move(page) {
            this.$router.push({
                "name": "tags",
                "query": {
                    "page": page
                }
            })
        },
        update() {
            this.$axios.get(`tags/mains/${this.$route.query.page}`).then(res=>{
                this.maxPage = res.data.maxPage;
                this.tags = res.data.data;
                this.starter = parseInt((this.$route.query.page - 1) / this.chunkSize) * this.chunkSize;
                this.renderSize = Math.min(this.maxPage - this.starter, this.chunkSize);
                this.curPage = this.$route.query.page;
            })
        }
    },
    mounted() {
        if (!this.$route.query.page) {
            this.$router.push({name:"tags", query: {page: 1}});
        }
        this.update();
    }
}

</script>

<style scoped lang="scss">
// Test End
.filler {
    width: auto;
    background-color: var(--color-background);
}

.headline {
    background-color: var(--color-background);
    padding: var(--space-xs);
    width: 100%;
    height: 75px;
    font-size: var(--text-xxl);
    text-transform: capitalize;
}


.subnav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-background);
    border-radius: var(--radius-sm);
    width: 100%;
    font-size: 20px;
    padding-left: 20px;
    padding-right: 20px;

    &__filter {
        background-color: var(--color-surface);
        color: var(--color-on-surface);
    }
    &__filter-seleted {
        background-color: var(--color-primary);
        color: var(--color-on-primary)
    }
}

.btn {
    margin-right: var(--space-xxs);
}

.btn:hover {
    background-color: var(--color-primary-light);
    color: var(--color-on-primary-light);
}

.shadow:hover {
    cursor: pointer;
}

</style>
