<template>
  <div>
    <!-- <h5>All Community</h5> -->

    <div class="column">
        <!-- <h3>Bubble Chart</h3> -->

        <bar-chart class='barChart' :chart-data="datacollection" :allpks="allpks"></bar-chart>
      </div>
  </div>

</template>


<script>
// import axios from 'axios'
import BarChart from '@/components/freeboardDir/BarChart.vue'
var style = getComputedStyle(document.body);

export default {
  name : 'AllCommunity',
  components : {
    BarChart,
  },
  data() {
    return {
      // topic : [],
      datacollection : null,
      alltopics : [],
      allpks : [],
      myTheme : this.$store.state.theme
    }
  },
  created() {
    this.makeGraph()
    console.log(this.style.getPropertyValue('--color-contrast-high'));
  },
  methods : {
    getToggleColor() {
      if(this.$store.state.theme === 'default') {
        return 'green'
      }else {
        return 'pink'
      }
    },
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

          // console.log(topics);
          // console.log(users);
          // console.log("myTheme = " + this.myTheme)
          // console.log("state = " + this.$store.state.theme)
          console.log(style.getPropertyValue('--color-contrast-high'));
          this.datacollection = {
            labels: topics,
            // pks : allpks,
            datasets: [
                {
                  label: 'Subscribe',
                  // backgroundColor: style.getPropertyValue('--color-on-background'),
                  // pointBackgroundColor: 'black',
                  borderWidth: 1,
                  // pointBorderColor: '#22EE99',
                  data: users,
                }
              ]
          };
      });
    },
    graphColorChange() {
      // var myTheme = this.$store.state.theme;
      console.log("myTheme" + this.myTheme)
      console.log("state" + this.$store.state.theme)
      if(this.myTheme !== this.$store.state.theme) {
        this.makeGraph()
        this.myTheme = this.$store.state.theme;
      }
    }
  },
  computed() {

    this.graphColorChange()
  }
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
