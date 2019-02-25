<template>
  <div class="chart">

  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props:{
    finish:{
      type:Number,
      default:0
    },
    pending:{
      type:Number,
      default:0
    },
    title:String
  },
  components: {
  },
  data () {
    return {
      value01:0,
      value02:0
    }
  },
  methods: {
    initChart() {
      let data01=[`已巡检${this.title}`,`未巡检${this.title}`];
      let data02=`${this.title}巡检`;
      let datas=[
        {value:this.finish, name:`已巡检${this.title}`},
        {value:this.pending, name:`未巡检${this.title}`}
      ]
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        title:{
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: data01
        },
        series : [
            {
                name: data02,
                type: 'pie',
                radius : '55%',
                label: {
                    normal: {
                      formatter: '{b|{b}：}{c} {per|{d}%}',
                      backgroundColor: '#eee',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,
                      padding: [0, 4],
                      rich: {
                          a: {
                              color: '#999',
                              lineHeight: 22,
                              align: 'center'
                          },
                          hr: {
                              borderColor: '#aaa',
                              width: '100%',
                              borderWidth: 0.5,
                              height: 0
                          },
                          b: {
                              fontSize: 12,
                              lineHeight: 33
                          },
                          per: {
                              color: '#eee',
                              backgroundColor: '#334455',
                              padding: [2, 4],
                              borderRadius: 2
                          }
                      }
                  }
                },
                center: ['50%', '60%'],
                data:datas,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
            }
        ]
      })
    }
  },
  watch:{
    finish(newVal){
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

