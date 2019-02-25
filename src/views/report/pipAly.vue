<template>
  <div class="pip">
    <el-row type="flex" justify="center" class="item">
      <el-col :span="10" class="item">
        <div class="data">
          <span>选择日期 :</span>
          <el-date-picker
            v-model="pieTime"
            value-format="yyyy-MM-dd"
            type="date"
            @change="changePie"
            placeholder="选择月">
          </el-date-picker>
        </div>
        <div class="echarts-pie">
          <pie-echart v-if="pieShow" :finish="finish"  :title='pieTitle' :pending="pending"></pie-echart>
        </div>
      </el-col>
      <el-col :span="14" class="item">
        <div class="data">
          <span>选择日期 :</span>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-MM-dd"
            type="date"
            @change="changeStart"
            placeholder="开始月">
          </el-date-picker>
          <a class="time-span">至</a>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-dd"
            type="date"
            @change="changeEnd"
            placeholder="结束月">
          </el-date-picker>
        </div>
        <div class="echarts-bar">
          <bar-echart v-if="barShow" :title='pieTitle' :barKey="barKey" :barVal="barVal"></bar-echart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieEchart from '@/components/pie-echart/index'
import BarEchart from '@/components/bar-echart/index'
import {pipSumByDo,pipSumByMatters} from '@/api/analysis'
import {isEmpty,startLoading,endLoading} from '@/util/common';
export default {
  name: 'anaPip',
  components: {
    PieEchart,
    BarEchart
  },
  data () {
    return {
      pieTitle:'管线(条)',
      barKey:[],
      barVal:[],
      pieShow:false,
      barShow:false,
      finish:0,
      pending:0,
      pieTime:'',
      startTime:'',
      endTime:''
    }
  },
  methods: {
    //管线统计
    getPipSumByDo(){
      // startLoading()
      pipSumByDo(this.pieTime).then(({status,data})=>{
        endLoading()
        if(status==200){
          this.finish= data.finish
          this.pending= data.pending
          this.pieShow=true
        }else{
          this.finish= 0
          this.pending= 0
          this.pieShow=true
        }
      }).catch(()=>{
        endLoading()
        this.finish= 0
        this.pending= 0
        this.pieShow=true
      })
    },
    //管线故障
    getSumByMatters(){
      startLoading()
      pipSumByMatters(this.startTime,this.endTime).then(({status,data})=>{
        endLoading()
        let dateList = this.dateListInit(new Date(this.startTime).getTime(),new Date(this.endTime).getTime());
        if(status==200){
          this.dataInit(data,dateList);
          this.barShow=true
        }else{
          this.barKey=[];
          this.barVal=[];
          this.barShow=true
        }
      }).catch(()=>{
        endLoading()
        this.barKey=[];
        this.barVal=[];
        this.barShow=true
      })
    },
    dataInit(data,list){
      let key=[]
      let value=[]
      list.forEach(element => {
        data.forEach(item=>{
          if(item.checkDate==element.time){
            element.val=item.matters
          }
        })
        key.push(element.time);
        value.push(element.val)
      });
      this.barKey=key
      this.barVal=value
    },
    changePie(){
      this.pieTime=isEmpty(this.pieTime)?'':this.pieTime
      if(!this.pieTime) return;
      this.getPipSumByDo();
    },
    changeStart(){
      this.startTime=isEmpty(this.startTime)?'':this.startTime
      if(this.startTime!=''&&this.endTime!=''){
        this.getSumByMatters();
      }
    },
    changeEnd(){
      this.endTime=isEmpty(this.endTime)?'':this.endTime
      if(this.startTime!=''&&this.endTime!=''){
        this.getSumByMatters();
      }
    },
    formatDate(timestamp) {
      var date = new Date(timestamp);
      let Y = date.getFullYear();
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      let D = date.getDate()< 10 ? '0'+date.getDate():date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return `${Y}-${M}-${D}`;
    },
    //时间轴格式化
    dateListInit(start,end){
      let arr=[];
      let day = 1000*60*60*24;
      let durantion = end - start;
      let len = durantion/day;
      for(let i = 0;i<=len;i++){
        arr.push({
          time:this.formatDate(end-day*i),
          val:0
        })
      }
      return arr.reverse();
    },
    // 默认时间段数据初始化
    init(){
      let timestamp = new Date().getTime();
      this.pieTime=this.formatDate(timestamp)
      this.startTime=this.formatDate(timestamp-1000*60*60*24*7);
      this.endTime=this.formatDate(timestamp);
      this.barKey=this.dateListInit(timestamp-1000*60*60*24*7,timestamp);
    }
  },
  mounted(){
    this.init();
    this.getPipSumByDo()
    this.getSumByMatters()
  }
}
</script>

<style lang="less" scoped>
.pip{
  height: 100%;
}
.item{
  height: 100%;
}
.data{
  padding-top: 40px;
  font-size: 14px;
  color: #000;
  &>span{
    margin-right: 20px;
  }
}
.time-span{
  margin:0 20px;
}
.echarts-pie{
  margin: 50px auto;
  width: 500px;
  height: 400px;
}
.echarts-bar{
  margin: 50px auto;
  width: 80%;
  height: 400px;
}
</style>

