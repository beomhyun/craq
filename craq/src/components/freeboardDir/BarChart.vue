<script>
import { Bar, mixins } from 'vue-chartjs'
import { mapState } from 'vuex';

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
              beginAtZero: true,
              // fontColor : "black"
            },
            gridLines: {
              display: false,
              // color: "black"
            }
          }],
          xAxes: [ {
            ticks: {
              // fontColor : "black"
            },
            gridLines: {
              display: false,
              // color: "black"
            }
          }]
        },
        legend: {
          display: true,
          color: "red"
        },
        responsive: true,
        maintainAspectRatio: false,
        onClick : this.handle,
        // borderColor
      }
    }
  },
  mounted () {
    console.log(this.allpks);
    this.colorChange();
    this.renderChart(this.chartData, this.options)
  },
  methods : {
    handle (point, event) {
      const item = event[0]
      var label = item['_model'].label
      var nowPK = this.allpks[item['_index']];
      this.$router.push(`/freeboard/${nowPK}`)
    },
    colorChange() {
      if(this.$store.state.theme === 'default') {
        // color = this.style.getPropertyValue('--color-primary')
        // color = 'hsl(156, 99%, 46%)';
        // fontC = 'black';
        // console.log(this.options);
        this.options.scales.yAxes[0].ticks.fontColor = 'black';
        this.options.scales.xAxes[0].ticks.fontColor = 'black';
        this.options.scales.yAxes[0].gridLines.color = 'black';
        this.options.scales.xAxes[0].gridLines.color = 'black';
      }else {
        // console.log(this.options);
        // color = this.style.getPropertyValue('--color-primary-dark')
        // color = 'hsl(321, 83%, 61%)';
        // fontC = 'white';
        this.options.scales.yAxes[0].ticks.fontColor = 'white';
        this.options.scales.xAxes[0].ticks.fontColor = 'white';
        this.options.scales.yAxes[0].gridLines.color = 'white';
        this.options.scales.xAxes[0].gridLines.color = 'white';
      }
    }
  },
  computed: mapState(['theme']),
  watch: {
    theme(newValue, oldValue) {
      // console.log(`Barchart Updating from ${oldValue} to ${newValue}`);
      // console.log(this.options);
      this.colorChange()
      this.renderChart(this.chartData, this.options)
    },
  },
}
</script>
