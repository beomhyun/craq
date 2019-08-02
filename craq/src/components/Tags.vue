<template>
    <div>
        <div class="filler">

            <!-- Headline -->
            <div class="headline">
                {{currentRouteName}}
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
            <div class="pagenation">
                <ul v-for="(i, index) in (1,11)">
                    <li>{{index}}</li>
                </ul>
            </div>  <!-- pagenation -->

        </div> <!-- Container /div -->

    </div>  <!-- Filler -->
</template>

<script>
//import Card from '@/components/Card.vue';
//import Ask from '@/components/AskQuestion.vue';
import TagsCard from '@/components/TagsCard.vue';
//import axios from 'axios';
//const apiUrl = "https://jsonplaceholder.typicode.com/posts"
export default {
    name: "Tags",
    components: {
        //Card,
        //Ask,
        TagsCard
    },
    data() {
        return {
            messages: '',
            //latested: true,
            //cardLists: [],
            tags: [],
        }
    },
    computed: {
        currentRouteName() {
            console.log(this.$route.name);
            return this.$route.name;
        },
    },
    mounted () {
        console.log(this.$session.get('jwt'));
        this.$axios.get('tags').then(res=> {
            console.log(res);
            this.tags = res.data;
        }).catch(err=>console.log(err));
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

.pagenation {
    display: flex;
    justify-content: center;
    background-color: var(--color-background);
    margin-top: var(--space-lg);
    width: 100%;
    height: 30px;
    font-size: var(--text-lg)
}

.pagenation ul li{
    display: inline;
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
