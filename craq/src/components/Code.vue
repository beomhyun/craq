<template>
    <div>
      <div class="filler">
        
        <div class="container">

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
              <div class="btn btn--md btn--primary">Ask Question</div>
            </div>
          </div> <!-- Filter /div -->
          
          <div v-for="a in 5">
            <router-link to="/">
             <Card class="shadow"/>
            </router-link>
          </div>  <!-- v-for -->

          <!-- Pagenation -->
          <div class="pagenation">
            <pre>1 2 3 4 5 6 7 8 9 10</pre>
          </div>  <!-- pagenation -->
        
        </div> <!-- Container /div -->
      </div>  <!-- Filler -->
    </div>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
    name: "User",
    components: {
      Card,
    },
    data() {
      return {
        latested: true,
      }
    },
    props: [
        'id'
    ],
    computed: {
      currentRouteName() {
        console.log(this.$route.name);
        return this.$route.name;
      },
    }
}

</script>

<style scoped lang="scss">
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
  padding: 20px;
  width: 890px;
  height: 75px;
  font-size: 30px;
  text-transform: capitalize;
}

.pagenation {
  display: flex;
  justify-content: center;
  background-color: var(--color-surface);
  margin-top: var(--space-xxxs);
  width: 890px;
  height: 30px;
  font-size: 20px;
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
    }
    &__filter-seleted {
      background-color: var(--color-primary);
    }
}


.shadow {
  box-shadow: var(--shadow-md);
}

</style>
