<script>
import { Bar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins
export default {
  extends: Bar,
  mixins: [ reactiveProp ],
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
    this.renderChart(this.chartData, this.options)
  },
  methods : {
    handle (point, event) {
      const item = event[0]
      this.$router.push(`/freeboard/${item.topic}`)
    }
  }
}
</script>
