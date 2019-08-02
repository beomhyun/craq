<script>
import { Bar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins
export default {
  extends: Bar,
  mixins: [ reactiveProp ],
  props : [
    'allpks'
  ],
  data () {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        onClick : this.handle
      }
    }
  },
  mounted () {
    console.log(this.allpks);
    this.renderChart(this.chartData, this.options)
  },
  methods : {
    handle (point, event) {
      const item = event[0]
      // console.log(point);
      // console.log(event[0]);
      var label = item['_model'].label
      // console.log()
      // console.log('_model')
      var nowPK = this.allpks[item['_index']];
      this.$router.push(`/freeboard/${nowPK}`)
    }
  }
}
</script>
