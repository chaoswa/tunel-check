<template>
  <div class="record">
    <el-form ref="form" :model="formData" label-width="80px" class="record-search" size="mini">
      <el-form-item label="请选择" class="form-time">
        <el-date-picker
          v-model="times"
          size="small"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="巡检类型" class="form-type">
        <el-select v-model="formData.checkType" size="small" style="marginLeft:10px" clearable  placeholder="--全部类型--">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="关键字" class="form-type">
        <el-input v-model="formData.keyWord" style="marginLeft:10px"></el-input>
      </el-form-item>
      <el-form-item label="巡检人" class="form-type">
        <el-input v-model="formData.checkUser" size="small" clearable placeholder="请输入巡检人姓名" style="marginLeft:10px"></el-input>
      </el-form-item> -->
      <el-form-item label="巡检结果" class="form-type">
        <el-select v-model="formData.checkResultStatus" size="small" style="marginLeft:10px" clearable  placeholder="--全部类型--">
          <el-option
            v-for="item in resultList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="search-btn" @click="search">搜索</div>
    </el-form>
    
    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      stripe
      style="width: 90%; height: 560px;"
      :header-cell-style="{background:'#f5f5f5',color:'#333',fontSize:'14px',textAlign: 'center'}"
      :cell-style="isCell">

      <el-table-column
        type="index"
        align="center"
        prop="index"
        label="序号">
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="设备类型">
        <template slot-scope="scope">{{ scope.row.checkType=='01'?'管线巡检':'阀井巡检'}}</template>
      </el-table-column>

      <el-table-column
        prop="checkObjectName"
        align="center"
        label="设备名称">
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="巡检人">
        <template slot-scope="scope">{{ scope.row.checkUserName}}</template>
      </el-table-column>
      <el-table-column
        prop="checkTime"
        align="center"
        label="巡检时间">
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="巡检结果">
        <template slot-scope="scope">
          <span :class="{'point-blue':scope.row.checkResultStatus!='0','point-red':scope.row.checkResultStatus=='0'}"></span>
          <span :class="{'item-color':scope.row.checkResultStatus=='0','item-nor':scope.row.checkResultStatus!='0'}" @click="handleErr(scope.$index, scope.row)">
            {{ scope.row.checkResultStatus=="0"?'异常':'正常'}}
          </span>
        </template>
      </el-table-column>

    </el-table>

    <transition name="fade">
      <div class="err-info" v-show="isErr" @click="closeErrInfo">
        <div class="err-content">
          <img src="../../assets/images/close.png" class="close-icon" @click.stop="closeErrInfo">
          <div class="info-item">
            <span class="info-span">设备类型：</span>
            <a>{{errDevice.checkType=='01'?'管线巡检':'阀井巡检'}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">设备说明：</span>
            <a>{{errDevice.checkObjectName}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">设备名称：</span>
            <a>{{errDevice.checkObjectType}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">巡检人：</span>
            <a>{{errDevice.checkUserName}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">巡检时间：</span>
            <a>{{errDevice.checkTime}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">异常描述：</span>
            <a>{{errDevice.checkResultDesc}}</a>
          </div>
          <div class="info-item">
            <span class="info-span">图片信息：</span>
            <a v-if="!errDevice.fileUrlList || !errDevice.fileUrlList.length">无</a>
          </div>
          
          <div class="img-info" v-show="errDevice.fileUrlList">
            <viewer class="my-img" :images="imgList">
              <img v-for="src in imgList" :src="src" :key="src">
            </viewer>
            <video class="my-video" :src="item" controls v-for="(item,index) in videoList" :key="index"></video>
            <!-- <img v-for="(item,index) in errDevice.fileUrlList" preview  preview-text="" :key="index" :src="item"> -->
          </div>
        </div>
      </div>
    </transition>

    <my-page
      v-if="data.length"
      class="my-page" 
      :page-size="pageSize" 
      :total="total"
      @sentPages="getPages">
    </my-page>

  </div>
</template>

<script>
import {recordList} from '@/api/report'
import MyPage from '@/components/my-page/toPage'
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'record',
  components:{
    MyPage
  },
  data () {
    return {
      data:[],
      videoList:[],
      imgList:[],
      allRecord:[],
      pageSize:9,
      total:0,
      times:['',''],
      isErr:false,
      typeList:[
        {label:'管线巡检',value:'01'},
        {label:'阀井巡检',value:'02'},
      ],
      resultList:[
        {label:'正常',value:'1'},
        {label:'异常',value:'0'},
      ],
      errDevice:{}, //异常阀井信息
      formData:{
        "checkTimeBegin":"",		//巡检时间
        "checkTimeEnd":'',
        "checkType":'',//”巡检类型”,
        "checkUser":'',  //巡检人员
        "checkResultStatus":'',		//巡检结果状态(正常/异常)
        "keyWord":''
      }
    }
  },
  methods: {
    //获取巡检记录
    getRecordList(){
      startLoading()
      recordList(this.formData).then(({status,data})=>{
        endLoading()
        if(status==200){
          console.log('巡检记录',data)
          this.allRecord=data
          this.getPages(1);
          this.total=data.length;
        }else{
          this.data=[]
        }
      }).catch(()=>{
        endLoading()
      })
    },
    closeErrInfo(event){
      if(event.target.className=="err-info" || event.target.className=="close-icon") this.isErr=false;
    },
    //每行表格样式
    isCell({row,column,rowIndex,columnIndex}){
      if(rowIndex%2==0){
        return 'background:#fff'
      }else{
        return 'background:#f7f7f7'
      }
    },
    getPages(page){
      this.data=this.allRecord.slice((page-1)*this.pageSize,this.pageSize*page)
    },
    search(){
      this.formData.checkTimeBegin=this.times[0];
      this.formData.checkTimeEnd=this.times[1];
      this.getRecordList();
    },
    //点击异常
    handleErr(index,row){
      this.errDevice=row;
      this.videoList=[]
      this.imgList=[]
      if(!this.errDevice.fileUrlList) return;
      this.errDevice.fileUrlList.forEach(element => {
        let fileHead = element.split('?')[0]
        let list = fileHead.split('.')
        let type = list[list.length-1]
        if(type=='mp4'){
          this.videoList.push(element)
        }else{
          this.imgList.push(element)
        }
      });
      this.isErr=true;
      // if(row.checkResultStatus=="0") {
      //   // console.log(row)
      //   this.errDevice=row;
      //   this.isErr=true;
      // }
    },
    dayDate(timestamp) {
      var date = new Date(timestamp);
      let D = date.getDate()< 10 ? '0'+date.getDate():date.getDate();
      return D;
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
    // 默认时间段数据初始化
    init(){
      let timestamp = new Date().getTime();
      let day=this.dayDate(timestamp)-1;
      this.startTime=this.formatDate(timestamp-1000*60*60*24*day);
      this.endTime=this.formatDate(timestamp);
      this.times=[this.startTime,this.endTime]
      this.formData.checkTimeBegin=this.times[0];
      this.formData.checkTimeEnd=this.times[1];
    }
  },
  mounted(){
    this.init();
    this.getRecordList()
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.record{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}
.item-color{
  color: red;
  cursor: pointer;
}
.item-nor{
  cursor: pointer;
}
.err-info{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.err-content{
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  width: 468px;
  height: 435px;
  padding: 40px;
  background: #fff;
  border-radius: 5px;
  box-shadow:0px 0px 1px #888;
}
.close-icon{
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.info-item{
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}
.info-span{
  color: #000;
}
.point-blue{
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border-radius: 100%;
  background: #607df5;
}
.point-red{
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border-radius: 100%;
  background: #ff2020;
}
.img-info{
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 230px;
  overflow-x: hidden;
  overflow-y: auto;
  .my-img{
    text-align: left;
  }
  img{
    width: 180px;
    height: 90px;
    margin: 5px;
    cursor: pointer;
  }
  .my-video{
    width: 180px;
    height: 90px;
    margin: 5px;
  }
}
</style>

