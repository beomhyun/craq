<template>
  <div>
    <!-- <h5>All Community</h5> -->

    <div class="column">
        <!-- <h3>Bubble Chart</h3> -->
        <bar-chart :chart-data="datacollection" :allpks="allpks"></bar-chart>
      </div>
  </div>

</template>


<script>
// import axios from 'axios'
import BarChart from '@/components/freeboardDir/BarChart.vue'

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
      allpks : []
    }
  },
  created() {
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    // }).
    // then((response) => {
    //
    // })
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
        this.datacollection = {
          labels: topics,
          // pks : allpks,
          datasets: [
              {
                label: 'Subscribe',
                // backgroundColor: '#333fff',
                // pointBackgroundColor: 'black',
                borderWidth: 1,
                // pointBorderColor: '#22EE99',
                data: users,
              }
            ]
        };
    });

  },
  methods : {

  }
}

</script>

<style scoped lang="scss">
</style>
