<template>
  <div>
    <div class="column">
        <bar-chart class='barChart' :chart-data="datachart" :allpks="allpks"></bar-chart>
      </div>
  </div>
</template>


<script>
import BarChart from '@/components/freeboardDir/BarChart.vue';
import { mapState } from 'vuex';

export default {
  name : 'AllCommunity',
  components : {
    BarChart,
  },
  data() {
    return {
      datachart : null,
      alltopics : [],
      allpks : [],
      myTheme : this.$store.state.theme
    }
  },
  async mounted() {
    await this.makeGraph()
  },
  methods : {

    makeGraph() {
      this.$axios
      .get(`topics`)
      .then(res=> {
          this.alltopics = res.data;
          var topics = [];
          var users = [];

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
          var color = 'green'
          if(this.$store.state.theme === 'default') {
            color = 'hsl(156, 99%, 46%)';
          }else {
            color = 'hsl(321, 83%, 61%)';
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
</style>
