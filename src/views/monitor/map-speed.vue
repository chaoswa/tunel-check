<template>
  <bm-control class="map-bar" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="offset">
    <div  class="content">
      <div class="search-name" v-if="$store.state.map.device.label">
        <a v-if="$store.state.map.device.carId">{{`${this.$store.state.map.device.label} 车载终端 轨迹查询`}}</a>
        <a v-if="statusType&&!$store.state.map.device.carId">{{`${this.$store.state.map.device.label} ${statusType=="PAD"?'PAD终端':'臂挂终端'} 轨迹查询`}}</a>
      </div>
      <div class="time">
        <span>请选择</span>
        <el-date-picker
          @change="timeChange"
          v-model="time"
          type="date"
          size="small"
          value-format="timestamp"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
    
      <div class="search-btn">
        <div class="pause-btn" @click="search">搜索</div>
        <div class="play-btn" @click="play">{{!isPlay?'播放':'暂停'}}</div>
      </div>
    
      <div class="search-bar">
        <div class="search-rule">
          <div class="rule-item" v-for="(item,index) in timelist" :key="index"><i class="rule-num">{{item}}</i></div>
          <div class="rule-line" v-for="(item,index) in lineList" :key="index+0.1" :style="lineStyle(item)"></div>
        </div>
        <progress-bar class="bar" :value="$store.state.progress"  @sendProgerss="sendProgerss"></progress-bar>
      </div>
     
    </div>
  </bm-control>
</template>

<script>
import ProgressBar from '@/components/progress-bar/index'
import {isEmpty} from '@/util/common'
import {getTrack} from '@/api/map';
import {startLoading,endLoading} from '@/util/common';
const PIX = 120; // 进度条上一像素的宽度为120秒
export default {
  name: 'mapSpeed',
  data() {
    return {
      isPlay:false,
      offset:{width: 40, height: 40},
      time:'',
      statusType:"",
      game:true,
      timelist:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
      lineList:[],
      pageSize:0  //百度轨迹点的分页大小
    };
  },
  components:{
    ProgressBar
  },
  methods: {
    async play(){
      let pointList=this.$store.state.map.pointsList;
      if(isEmpty(pointList)){
        // if(isEmpty(this.time)) return;
        // let entity_name=this.$store.state.map.device.deviceSid;
        // if(!entity_name) {
        //   this.$message.warning('没有查询到轨迹');
        //   return;
        // }
        // let start_time=Math.floor((this.time+1000*60*60*24)/1000);
        // let end_time=start_time-(60*60*24);
        
        // this.getAllTrack(entity_name,end_time,start_time);
      }else{
        this.game=true
        this.isPlay=!this.isPlay;
        this.$emit('playShuLu',this.isPlay,pointList);
        this.getLineWidth(pointList)
      }
    },

    search(){
      if(isEmpty(this.time)) return;
      let entity_name=this.$store.state.map.entityName;
      if(!entity_name) {
        this.$emit('notSearchLine');
        this.$message.warning('没有查询到轨迹');
        return;
      }
      let start_time=Math.floor((this.time+1000*60*60*24)/1000);
      let end_time=start_time-(60*60*24);
      
      this.getAllTrack(entity_name,end_time,start_time);
    },
    //查询路径
    async getAllTrack(entity_name,end_time,start_time){
      startLoading()
      let list =[]
      try {
        let result = await getTrack(entity_name,end_time,start_time,1);
        if(result.status==0){
          if(!result.points.length) {
            this.$message.warning('没有查询到轨迹');
            this.$emit('notSearchLine');
            endLoading()
            return
          }
          let pageSize =Math.ceil(result.total/1000)
          for(let i =1; i<=pageSize;i++){
            let res = await getTrack(entity_name,end_time,start_time,i);
            if(res.status===0){
              list = list.concat(res.points);
            }
          }
          endLoading()
          // console.log('轨迹',result)
          // this.isPlay=!this.isPlay;
          let points = this.initPosData(list);
          // console.log('轨迹点',points)
          this.game=true
          this.$store.dispatch('setRePlay',true)
          this.$store.dispatch('map/getPointsList',points);
          this.$emit('playShuLu',false,points);
          this.getLineWidth(points)
        }else{
          endLoading()
          this.game=false
          // this.$message.error(result.message)
          this.$emit('notSearchLine');
          this.$message.warning('没有查询到轨迹');
        }
      } catch(err) {
        endLoading();
      }
    },

    lineStyle(item){
      // console.log(item)
      return {"width":`${(item.end-item.start)/120}px`,"left":this.lineLeftSet(item.start*1000)+'%'}
    },

    lineLeftSet(timestamp){
      var date = new Date(timestamp);
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let count = h*60*60 + m*60+s;
      let per = (count/(24*60*60)*100).toFixed(3);
      return per
    },

    getLineWidth(points){
      let list = [];
      let startPoints=[];
      let pointsList = this.getSpacePointIndex(points);
      let array = this.sliceLinePath(pointsList,points);
      array.forEach((item)=>{
        list.push({
          start:item[0].loc_time,
          end:item[item.length-1].loc_time,
          per:this.lineLeftSet(item[item.length-1].loc_time*1000)-this.lineLeftSet(item[0].loc_time*1000)
        });
        startPoints.push({start:this.lineLeftSet(item[0].loc_time*1000),end:this.lineLeftSet(item[item.length-1].loc_time*1000)})
      })
      this.lineList = list;
      // console.log('111',startPoints)
      this.$store.dispatch('map/getLinePer',startPoints);
    },

    //获取路径上两点相隔5分钟以上的点的下标
    getSpacePointIndex(list){
      let indexList=[0]
      for(let i=0;i<list.length-1;i++){
        let space = list[i+1].loc_time-list[i].loc_time;
        if(space>=60*5) indexList.push(i);
      }
      return indexList;
    },

    //将路径根据相隔5分钟以上的点的下标分成几条线段
    sliceLinePath(list,points){
      list.push(points.length-1);
      let array = [];
      for(let i=0;i<list.length-1;i++){
        let start = list[i]==0?list[i]:list[i]+1;
        let end = list[i+1]+1;
        array.push(points.slice(start,end));
      }
      return array;
    },
    //选择时间
    timeChange(val){
      this.time=val
      this.isPlay=false;
      this.$store.dispatch('map/getPointsList',[]);
      this.$emit('playShuLu',this.isPlay,[]);
    },
    //拉动进度条改变进度
    sendProgerss(per){
      if(isEmpty(this.time)) return;
      if(!this.game) return;
      this.isPlay=false;
      this.$store.dispatch('setProgress',per)
      this.$emit('changePercent',per)
    },
    setPlay(){
      this.isPlay=true;
    },
    setPause(){
      this.isPlay=false;
    },
    //序列号阀井坐标点格式
    initPosData(data){
      data.forEach(val=>{
        Object.assign(val, {lng:val.longitude,lat:val.latitude})
      })
      return data
    },
    clearAll(){
      this.time='';
      this.lineList=[];
      this.$store.dispatch('map/getDevice',[]);
      this.$store.dispatch('map/getPointsList',[]);
    },
    formatDate(timestamp) {
      var date = new Date(timestamp);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      let D = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return h;
    },
    // 初始化查询日期
    initNowDate(name){
      let time = new Date().getTime();
      let h = this.formatDate(time);
      let newTime =Math.floor((time-(h*1000*60*60))/100000)*100000
      this.time = newTime;
      this.isPlay=false;
      this.lineList=[];
      this.statusType='';
      if(isEmpty(this.time)) return;
      let entity_name = name == 'PAD'?this.$store.state.map.device.deviceSid:this.$store.state.map.device.armSid;
      this.statusType=name;
      this.$store.dispatch('map/setEntityName',entity_name);
      if(!entity_name) {
        this.$message.warning('没有查询到轨迹');
        return;
      }
      let start_time=Math.floor((this.time+1000*60*60*24)/1000);
      let end_time=start_time-(60*60*24);
      
      this.getAllTrack(entity_name,end_time,start_time);
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="less" scoped>
.map-bar{
  min-width: 1200px;
  height: 52px;
  background: #fff;
  box-shadow:0px 0px 1px #000;
  border-radius: 5px;
}
.content{
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.search-name{
  height: 42px;
  font-size: 14px;
  line-height: 42px;
  color: #666;
  margin: 0 20px;
}
.search-btn{
  display: flex;
  align-items: center;
  height: 42px;
  font-size: 14px;
  color: #666;
  margin: 0 10px;
}
.time{
  display: flex;
  align-items: center;
  height: 42px;
  font-size: 14px;
  color: #666;
  &>span{
    padding: 0 10px;
  }
}
.middle{
  margin-left: 10px;
}
.time-pick{
  width: 75%;
}
.bar{
  width: 721px;
  margin-left: 10px;
}
.play-btn{
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #666;
  border-radius: 5px;
  cursor: pointer;
}
.pause-btn{
  width: 50px;
  height: 30px;
  margin-right: 20px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #666;
  border-radius: 5px;
  cursor: pointer;
}
.back-btn{
  width: 30px;
  height: 30px;
  background: url('../../assets/images/back.png') no-repeat;
  background-size:100% 100%;
  margin: 0 10px;
  cursor: pointer;
}
.go-btn{
  width: 30px;
  height: 30px;
  background: url('../../assets/images/go.png') no-repeat;
  background-size:100% 100%;
  cursor: pointer;
}
.search-bar{
  position: relative;
  margin: 0 20px;
}
.search-rule{
  width: 721px;
  height: 10px;
  position: absolute;
  top: 20px;
  left: 10px;
  z-index: 0;
  display: flex;
}
.rule-item{
  position: relative;
  border-bottom: 1px solid #c2c2c4;
  border-top: 1px solid #c2c2c4;
  border-left: 1px solid #a3a3a4;
  width: 29px;
  background-color: #c2c2c4
}
.rule-num{
  position: absolute;
  font-size: 13px;
  top: 14px;
  right: -4px;
  color: #222;
}
.rule-line{
  position: absolute;
  top: 0;
  z-index: 1;
  height: 10px;
  background-color: blue;
}
</style>

