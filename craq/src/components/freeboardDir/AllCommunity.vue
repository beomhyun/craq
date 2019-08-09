<template>
  <div>
    <!-- <h5>All Community</h5> -->

    <div class="column">
        <!-- <h3>Bubble Chart</h3> -->

        <bar-chart class='barChart' :chart-data="datachart" :allpks="allpks"></bar-chart>
        <!-- <bar-chart v-else class='barChart' :chart-data="data_dark" :allpks="allpks"></bar-chart> -->
      </div>
  </div>

</template>


<script>
// import axios from 'axios'
import BarChart from '@/components/freeboardDir/BarChart.vue';
import { mapState } from 'vuex';
// var style = getComputedStyle(document.body);

export default {
  name : 'AllCommunity',
  components : {
    BarChart,
  },
  data() {
    return {
      // topic : [],
      datachart : null,
      // data_default : null,
      // data_dark : null,
      alltopics : [],
      allpks : [],
      myTheme : this.$store.state.theme
    }
  },
  async mounted() {
    await this.makeGraph()
    // console.log(this.style.getPropertyValue('--color-contrast-high'));
  },
  methods : {

    makeGraph() {
      this.$axios
      .get(`topics`)
      .then(res=> {
          this.alltopics = res.data;
           // console.log(this.alltopics);
          // alert(this.alltopics.data)
          var topics = [];
          var users = [];
          // var allpks = [];

          if(this.alltopics.length > 5) {
            for (var i = 0; i < 5; i++) {
              topics[i] = this.alltopics[i].TOPIC;
              users[i] = this.alltopics[i].SUBSCRIBES;
              this.allpks[i] = this.alltopics[i].PK;
            }
          }else {
            for (var i = 0; i < this.alltopics.length; i++) {
              topics[i] = this.alltopics[i].TOPIC;
              users[i] = this.alltopics[i].SUBSCRIBES;
              this.allpks[i] = this.alltopics[i].PK;
            }
          }
          console.log("state = " + this.$store.state.theme)
          // console.log(style.getPropertyValue('--color-contrast-high'));
          var color = 'green'
          // var fontC = "black"
          if(this.$store.state.theme === 'default') {
            // color = this.style.getPropertyValue('--color-primary')
            color = 'hsl(156, 99%, 46%)';
            // fontC = 'black';
          }else {
            // color = this.style.getPropertyValue('--color-primary-dark')
            color = 'hsl(321, 83%, 61%)';
            // fontC = 'white';
          }
          this.datachart = {
            labels: topics,
            datasets: [
                {
                  label: 'Subscribe',
                  backgroundColor: color,
                  borderWidth: 1,
                  data: users,
                }
            ],
          };
      });
    },
  },
  computed: mapState(['theme']),
  watch: {
    theme(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);
      this.makeGraph()
    },
  },
}

</script>

<style scoped lang="scss">
import
.barChart {
  color: var(--color-on-tertiary);
  background-color: var(--color-on-tertiary);
  borderColor : var(--color-on-tertiary);
  hoverBorderColor : var(--color-on-tertiary);
}


</style>
