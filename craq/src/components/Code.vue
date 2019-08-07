<template>
    <div>
        <div class="filler">

            <!-- Headline -->
            <div class="headline">
                <div class="headline__title">{{currentRouteName}}</div>
                <router-link to="/askquestion"><div class="btn btn--primary" @click="askQuestion">Ask Question</div></router-link> </div> <!-- headline -->

            <!-- Filter && Card -->
            <div class="Code">
                <div class="Code__filter">
                    <div class="Code__filter-btn" :class="{'selected':query('order_by') =='PK'}" @click.prevent="sort('PK')">Latest</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='RELIABLE'}" @click.prevent="sort('RELIABLE')">Reliable</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='HELPFUL'}" @click.prevent="sort('HELPFUL')">Helpful</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='USER_ANSWER'}" @click.prevent="sort('USER_ANSWER')">Answer</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='VIEWS'}" @click.prevent="sort('VIEWS')">View</div>
                </div>  <!-- Filter /div -->

                <div class="Code__list" v-if="loaded">
                    <div :key="idx" v-for="(ask, idx) in asks" class="content">
                        <card class="shadow" :list="ask"/>
                    </div>
                </div>

            </div>
            <!-- end FILTER & CARD -->
            <!-- Pagenation -->
            <Paginator :chunkSize="5" :maxPage="maxPage" :curPage="curPage" @clicked="move"></Paginator>
            <!-- pagenation -->

        </div> <!-- Container /div -->
    </div>  <!-- Filler -->
</template>

<script>
//import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue'
const Card = () => ({
    component: import('@/components/Card.vue'),
    loading: Spinner,
    delay: 500
})
import Ask from '@/components/AskQuestion.vue';
import Paginator from '@/components/Paginator.vue';

export default {
    name: "Code",
    components: {
        Card,
        Ask,
        Paginator
    },
    data() {
        return {
            asks:  [],
            chunkSize: 5,
            maxPage: 1,
            curPage: 1,
            loaded: false,
        }
    },
    watch: {
        $route: function(a, b) {
            console.log('watched')
            this.update();
        }
    },
    methods: {
        askQuestion : function() {
            this.$router.push({name:'askquestion'});
            this.askquestion = true;
        },
        update() {
            this.$axios.get(`questions/search/${this.query('page')}?order_by=${this.query('order_by')}&search_text=${this.query('search_text')}`)
                .then(res=>{
                    console.log(res.data);
                    this.asks = res.data.data;
                    this.maxPage = res.data.max_page
                    this.curPage = this.query('page');
                    this.loaded = true;
                });
        },
        queryCheck(obj, key) {
            return Object.keys(obj).includes(key);
        },
        contains(key) {
            return this.queryCheck(this.$route.query, key);

        },
        query(key) {
            return this.$route.query[key];
        },
        move(page) {
            this.loaded = false;
            this.$router.push({
                name:'code',
                query: {
                    "page": page,
                    "order_by": this.query('order_by'),
                    "search_text": this.query('search_text')
                }
            })
        },
        sort(by) {
            this.loaded = false;
            this.$router.push({
                name:"code",
                query: {
                    "page": 1,
                    "order_by": by,
                    "search_text": this.query('search_text')

                }
            })
        },
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        inSearch() {
            return this.queryCheck(this.$route.query, 'search_text')
        }
    },
    mounted() {
        console.log(this.$route.query);
        if (!this.contains('page') || !this.contains('order_by')) {
            this.$router.push(
                {"name": "code",
                    "query": {
                        "order_by": "PK",
                        "page": 1,
                        "search_text": (this.contains('search_text') ? this.$route.query.search_text: "")
                    }

                }
            )
        } else {
            this.update();

        }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 75px;

    padding: var(--space-md);
    &__title {
        background-color: var(--color-surface);
        font-size: var(--text-xxl);
        text-transform: capitalize;
    }
}


.btn {
    cursor: pointer;
    width: 130px;
    height: 45px;

    display: flex;
    justify-content: center;
    align-items: center;

}

.btn:hover {
    background-color: var(--color-primary-darker);
    color: var(--color-on-primary-light);
}

.shadow {
    box-shadow: var(--shadow-sm);
    width: 100%;
    border: 1px solid var(--color-contrast-low);
    margin-bottom: var(--space-sm); }

.content {
    width: 100%;
}

.Code {
    user-select: none;
    display: flex;
    flex-direction: column;

    width: 100%;
    height: auto;
    background-color: var(--color-surface-light);
    padding: var(--space-md);

    &__filter {
        display: flex;

        &-btn {
            cursor: pointer;
            width: 130px;
            height: 45px;

            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            color: var(--color-contrast-high);            

            border-radius: var(--radius-sm);

            background-color: var(--color-surface-dark);
            margin-right: var(--space-sm);
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;
        top: -3px;

        width: 100%;
        height: 100%;
        background-color: var(--color-surface);

        border-bottom-left-radius:  var(--radius-sm);
        border-bottom-right-radius:  var(--radius-sm);
        border-top: 3px solid var(--color-tertiary);

        padding: var(--space-md);
    }
}

.Code__filter .selected {

    cursor: pointer;

    border-top: 3px solid var(--color-tertiary);
    border-left: 3px solid var(--color-tertiary);
    border-right: 3px solid var(--color-tertiary);
    color: var(--color-on-surface);
    font-weight: bold;
    background-color: var(--color-surface);

    z-index: 1;
}
</style>
