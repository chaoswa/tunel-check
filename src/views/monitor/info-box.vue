<template>
  <bm-control class="map-info" anchor="BMAP_ANCHOR_TOP_RIGHT"  :offset="offset">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <div class="info-title">
      <img src="../../assets/images/valve03.png">
      <a>阀井信息</a>
    </div>
    <div class="info-item">
      <span class="info-span">阀井名称：</span>
      <a>{{valveInfo.valveName}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">阀井类型：</span>
      <a>{{valveInfo.valveType}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">位置描述：</span>
      <a>{{valveInfo.locationDesc}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">检查人员：</span>
      <a>{{valveInfo.checkRecordList[0].checkUserName}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">检查状态：</span>
      <a>异常</a>
    </div>

    <div class="info-item">
      <span class="info-span">检查时间：</span>
      <a>{{valveInfo.checkRecordList[0].checkTime}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">异常类型：</span>
      <a>{{getErrType}}</a>
    </div>
    
    <div class="info-item">
      <span class="info-span">异常描述：</span>
      <a>{{valveInfo.checkRecordList[0].checkResultDesc}}</a>
    </div>
    <div class="info-item">
      <span class="info-span">相关图片：</span>
      <a v-if="!valveInfo.checkRecordList[0].fileUrlList || !valveInfo.checkRecordList[0].fileUrlList.length">无</a>
    </div>

    <div class="img-info" v-if="valveInfo.checkRecordList[0].fileUrlList&&valveInfo.checkRecordList[0].fileUrlList.length">
      <img v-for="(item,index) in valveInfo.checkRecordList[0].fileUrlList" preview :key="index" :src="item">
    </div>

    <div class="info-item">
      <span class="info-span">相关视频：</span>
      <a>无</a>
    </div>
  </bm-control>

</template>

<script>
 
  export default {
    props:{
      valveInfo:Object
    },
    data(){
      return {
        offset:{width: 0, height: 150},
        errType:[
          {id:'01',type:'泄露'},
          {id:'02',type:'锈蚀损伤'},
          {id:'03',type:'占压(用)'},
          {id:'04',type:'安全标识损坏'},
          {id:'05',type:'设施遗失、隐埋'},
          {id:'06',type:'压力异常'},
          {id:'07',type:'流量异常'},
          {id:'08',type:'危机燃气设施的行为'},
        ],
      }
    },
    computed:{
      getErrType(){
        let type = this.errType.filter((item)=>{
          return item.id==this.valveInfo.checkRecordList[0].checkResultType
        })
        return type[0].type
      }
    },
    methods:{
      closeDetail(){
        this.$emit('closeDetail')
      }
    }
  }
</script>

<style scoped lang="less">
.map-info{
  position: relative;
  width: 405px;
  height: 100%;
  padding: 20px;
  background: #fff;
  box-shadow:0px 0px 1px #999;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.info-title{
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  width: 100%;
  &>img{
    margin-right: 5px;
  }
}
.info-item{
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}
.info-span{
  color: #000;
}
.close-icon{
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.img-info{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  &>img{
    width: 180px;
    height: 180px;
    margin: 5px;
    cursor: pointer;
  }
}
</style>
