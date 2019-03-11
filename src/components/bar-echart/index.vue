<template>
  <div class="chart">

  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props:{
    barKey:{
      type:Array,
      default:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    barVal:{
      type:Array,
      default:[10, 52, 200, 334, 390, 330, 220]
    },
    title:String
  },
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    initChart() {
      let txt = `${this.title.split('(')[0]}故障次数统计`;
      let data01 = this.barKey;
      let data02 = this.barVal;
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        title: {
          text: txt
        },
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : data01,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:`${this.title.split('(')[0]}故障`,
            type:'bar',
            barWidth: '40%',
            data:data02
          }
        ]
      })
    }
  },
  watch:{
    barVal(newVal){
      this.initChart()
    },
  },
  mounted(){
    this.initChart()
  }
}
</script>

<style lang="less" scoped>
.chart{
  width: 100%;
  height: 100%;
}
</style>

