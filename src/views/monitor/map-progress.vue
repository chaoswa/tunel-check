<template>

  <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="offset">
    <div class="progress-item">
      <p>{{title}}巡检进度 &nbsp;{{`${(today+month)/2}%`}}</p>
      <div class="progress-bar">
        <a>本月阀井巡检</a>
        <div class="bar-back">
          <el-progress :percentage="today"  :stroke-width="12" color="#36c558"></el-progress>
          <div class="text">{{finishValve}}/{{pendingVavle}}</div>
        </div>
      </div>
      <div class="progress-bar">
        <a>今日管道巡检</a>
        <div class="bar-back">
          <el-progress :percentage="month"  :stroke-width="12" color="#36c558"></el-progress>
          <div class="text">{{finishPip}}/{{pendingPip}}</div>
        </div>
      </div>
    </div>
  </bm-control>

</template>

<script>
export default {
  name: 'mapProgress',
  props:{
    today:{  //今日巡检进度
      type:Number,
      default:10
    },
    month:{
      type:Number,
      default:10
    },
    finishPip:{  
      type:Number,
      default:10
    },
    pendingPip:{  
      type:Number,
      default:10
    },
    finishValve:{ 
      type:Number,
      default:10
    },
    pendingVavle:{ 
      type:Number,
      default:10
    },
    title:{  //本月巡检进度
      type:String,
      default:'整体'
    }
  },
  data () {
    return {
      offset:{width: 20, height: 10}
    }
  },
  computed: {
    getToday(){
      return `width:${this.today}%`
    },
    getMonth(){
      return `width:${this.month}%`
    },
  },
  methods: {
  },
  mounted(){

  }
}
</script>

<style lang="less">
.progress-item{
  width: 425px;
  height: 130px;
  background: #fff;
  &>p{
    font-size: 16px;
    padding-top: 20px;
    color: #333;
    text-align: center;
  }
}
.progress-bar{
  width: 90%;
  margin: 20px auto;
  display: flex;
  font-size: 14px;
  color: #666;
  justify-content: center;
  align-items: center;
  .bar-back{
    position: relative;
    width: 70%;
    margin-left: 10px;
    border-radius: 24px;
  }
  .text{
    position: absolute;
    top: 0;
    left: -15px;
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    width: 100%;
    height: 18px;
    text-align: center;
  }
  .bar-up{
    height: 100%;
    background: #36c558;
    border-radius: 24px;
  }
}
.el-progress-bar__outer{
  background: rgb(248,149,30);
}
</style>

