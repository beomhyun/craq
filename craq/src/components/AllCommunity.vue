<template>
  <div>
    <h5>All Community</h5>

    <div class="column">
        <h3>Bubble Chart</h3>
        <bar-chart :chart-data="datacollection"></bar-chart>
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
      topic : [],
      datacollection : null,
      tmpData : [
        {
          topic : 'Lorem ipsum dolor1',
          body : 'Lorem ipsum dolor1',
          users : '500'
        },
        {
          topic : 'Lorem ipsum dolor2',
          body : 'Lorem ipsum dolor2',
          users : '400'
        },
        {
          topic : 'Lorem ipsum dolor3',
          body : 'Lorem ipsum dolor3',
          users : '100'
        },
        {
          topic : 'Lorem ipsum dolor4',
          body : 'Lorem ipsum dolor4',
          users : '70'
        },
        {
          topic : 'Lorem ipsum dolor5',
          body : 'Lorem ipsum dolor5',
          users : '50'
        },
        {
          topic : 'Lorem ipsum dolor6',
          body : 'Lorem ipsum dolor6',
          users : '30'
        },
        {
          topic : 'Lorem ipsum dolor7',
          body : 'Lorem ipsum dolor7',
          users : '20'
        },
        {
          topic : 'Lorem ipsum dolor8',
          body : 'Lorem ipsum dolor8',
          users : '20'
        }

      ]
    }
  },
  created() {
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    // }).
    // then((response) => {
    //
    // })
    this.fillData()
  },
  methods : {
    fillData () {
      var topics = [];
      var users = [];

      if(this.tmpData.length > 5) {
        for (var i = 0; i < 5; i++) {
          topics[i] = this.tmpData[i].topic
          users[i] = this.tmpData[i].users
        }
      }else {
        for (var i = 0; i < this.tmpData.length; i++) {
          topics[i] = this.tmpData[i].topic
          users[i] = this.tmpData[i].users
        }
      }

      this.datacollection = {
        labels: topics,
          datasets: [
            {
              label: 'All Boards',
              backgroundColor: '#333fff',
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#22EE99',
              data: users,
            }
          ]
      }
    }
  }
}

</script>

<style>
</style>
