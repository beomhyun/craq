<template>
    <div>
      <div class="filler">
        
        <div class="container" v-if="!askquestion">

          <!-- Headline -->
          <div class="headline">
            {{currentRouteName}}
          </div> <!-- headline -->

           <!-- Filter && Card -->
          <div class="subnav">
            <div class="subnav__filter">
              <div class="btn btn--sm" :class="{'subnav__filter-seleted': latested}">Latest</div>
              <div class="btn btn--sm">Reliable</div>
              <div class="btn btn--sm">Helpful</div>
              <div class="btn btn--sm">Answer</div>
              <div class="btn btn--sm">View</div>
            </div>
            <div class="filter__ask">
              <div class="btn btn--md btn--primary" @click="askQuestion">Ask Question</div>
            </div>
          </div> <!-- Filter /div -->
          
          <div v-for="a in 5">
            <router-link to="/">
             <Card class="shadow"/>
            </router-link>
          </div>  <!-- v-for -->

          <!-- Pagenation -->
          <div class="pagenation">
            <ul v-for="(i, index) in (1,11)">
              <li>{{index}}</li>
            </ul>
          </div>  <!-- pagenation -->
        
        </div> <!-- Container /div -->

        <div v-else>
          <ask @childs-event="parentsMethod"/>
        </div>

      </div>  <!-- Filler -->
    </div>
</template>

<script>
import Card from '@/components/Card.vue';
import Ask from '@/components/AskQuestion.vue';

export default {
    name: "User",
    components: {
      Card,
      Ask,
    },
    data() {
      return {
        askquestion: false,
        options: [
          {
            value : "option1"
          },
          {
            value : "option2"
          },
          {
            value : "option3"
          },
        ],
        latested: true
      }
    },
    props: [
        'id'
    ],
    mounted() {
      this.askquestion = false
    },
    methods: {
      askQuestion : function() {
      this.$router.push({name:'askquestion'});
      this.askquestion = true;
      },
      parentsMethod: function(askquestion) {
      this.askquestion = askquestion // 자식으로 부터받은 메시지를 사용
      }
    },
    computed: {
      currentRouteName() {
        console.log(this.$route.name);
        return this.$route.name;
      },
    }
}

</script>

<style scoped lang="scss">
// Test End
.filler {
  height: 1000px;
  width: auto;
  background-color: var(--color-background);
}
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}

.headline {
  background-color: var(--color-surface);
  padding: var(--space-xs);
  width: 890px;
  height: 75px;
  font-size: var(--text-xxl);
  text-transform: capitalize;
}

.pagenation {
  display: flex;
  justify-content: center;
  background-color: var(--color-surface);
  margin-top: var(--space-lg);
  width: 890px;
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
  background-color: var(--color-surface);
  width: 890px;
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

.shadow {
  width: 890px;
  box-shadow: var(--shadow-md);
}

</style>
