<template>
  <div class="monitor">

    <el-row class="main">

      <el-col :span="24" class="right">
        <div class="right-box" ref="mapBox">
          <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @zoomend="syncCenterAndZoom" @dragend="dragend" :map-type="mapType">

            <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="offset"></bm-navigation>

            <!-- 任务进度组件 -->
            <map-progress :today="today" :month="month" :title="title" :finishPip="finishPip" :pendingPip="pendingPip" :finishValve="finishValve" :pendingVavle="pendingVavle"></map-progress>

            <!-- 人员车辆树和轨迹回放Tab -->
            <user-tree @showProgress="showProgress" ref="userTree" @setNewPosition="setNewPosition" @deviceLocation="deviceLocation" @playLocation="playLocation" @outProgress="outProgress"></user-tree>

            <!-- 轨迹播放进度条 -->
            <map-speed  ref="mapSpeed" v-show="progressShow" @playShuLu="playShuLu" @notSearchLine="notSearchLine" @changePercent="changePercent"></map-speed>
            
            <!-- 定位 -->
            <map-bar @changeMapType="changeMapType" ref="mapBar" @resave="resave" @changeMapValve="changeMapValve" @changeMapPip="changeMapPip" @changeMapDevice="changeMapDevice"></map-bar>

            <!-- 管道线路 -->
            <bm-polyline v-for="(item,index) in linePath" :key="index+0.1" ref="allPip" @click="clickPiper(item)" :path="item" :stroke-color="pipColor(item)" :stroke-opacity="0.8" :stroke-weight="6"></bm-polyline>

            <!-- 阀井点 -->
            <bm-marker v-for="(item) in allValve" ref="allValve" :icon="valveIcon(item)" :key="item.id" :position="item"  @click="clickHandler(item)"></bm-marker>

            <!-- 管道错误点 -->
            <bm-marker v-for="(item,index) in linePoint" ref="linePoint" :key="index+0.7" :position="item" :icon="iconLinePoint" @click="clickLinePoint(item)"></bm-marker>

            <!-- 人员和设备 -->
            <bm-marker v-for="(item,index) in allDevice" ref="allDevice" :rotation="item.latest_location&&item.carId?item.latest_location.direction:0" :icon="deviceIcon(item)" :key="index+0.3" :position="item"  @click="clickDevice(item)">
              <bm-label :content="item.label"
                :labelStyle="{color: '#fff', fontSize : '12px',background:'#626160',border:'none',  padding: '5px',borderRadius: '5px'}" 
                :offset="{width: -13, height: -30}"/>
            </bm-marker>

            <!-- 阀井信息框 -->
            <bm-info-window :position="currentPoint" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
              <div class="info-window" v-if="currentPoint.proType=='finish'">
                <div class="info-title">
                  <img src="../../assets/images/valve02.png"  v-if="currentPoint.checkRecordList[0].checkResultStatus==1">
                  <img src="../../assets/images/valve03.png"  v-else>
                  <div class="title-editor" @click="editorValve(currentPoint)"><a>阀井信息</a><a>编辑信息</a></div>
                </div>
                <div class="info-item">
                  <span class="info-span">阀井名称：</span>
                  <a>{{currentPoint.valveName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">阀井类型：</span>
                  <a>{{currentPoint.valveType}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">位置描述：</span>
                  <a>{{currentPoint.locationDesc}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">检查人员：</span>
                  <a>{{currentPoint.checkRecordList[0].checkUserName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">检查状态：</span>
                  <a>{{currentPoint.checkRecordList[0].checkResultStatus==1?'正常':'异常'}}</a>
                </div>

                <div class="info-item">
                  <span class="info-span">检查时间：</span>
                  <a>{{currentPoint.checkRecordList[0].checkTime}}</a>
                </div>
                
                <div class="info-item" v-if="currentPoint.checkRecordList[0].checkResultStatus!=1">
                  <span class="info-span">异常描述：</span>
                  <a>{{currentPoint.checkRecordList[0].checkResultDesc}}</a>
                </div>

                <div class="info-footer" @click="openDetailValve" v-if="currentPoint.checkRecordList[0].checkResultStatus!=1">
                  <a>查看详情</a>
                </div>
              </div>

              <div class="info-window" v-if="currentPoint.proType=='pending'">
                <div class="info-title">
                  <img src="../../assets/images/valve04.png">
                  <div class="title-editor" @click="editorValve(currentPoint)"><a>阀井信息</a><a>编辑信息</a></div>
                </div>
                <div class="info-item">
                  <span class="info-span">阀井名称：</span>
                  <a>{{currentPoint.valveName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">阀井类型：</span>
                  <a>{{currentPoint.valveType}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">所属区域：</span>
                  <a>{{currentPoint.locationDesc}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">检查状态：</span>
                  <a>未检查</a>
                </div>
              </div>
            </bm-info-window>

            <!-- 管线信息框 -->
            <bm-info-window :position="currentPip"  :show="pipWindow.show" @close="pipWindowClose" @open="pipWindowOpen">
              <div class="info-window" v-if="currentPip.proType=='finish'">
                <div class="info-title">
                  <img src="../../assets/images/icon22.png">
                  <div class="title-editor" @click="editorPip(currentPip)"><a>管线信息</a><a>编辑信息</a></div>
                </div>
                <div class="info-item">
                  <span class="info-span">管线名称：</span>
                  <a>{{currentPip.pipelineName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">管线类型：</span>
                  <a>{{currentPip.pipelineType}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">位置描述：</span>
                  <a>{{currentPip.locationDesc}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">检查人员：</span>
                  <a>{{currentPip.checkRecordList[0].checkUserName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">最后检查时间：</span>
                  <a>{{currentPip.checkRecordList[currentPip.checkRecordList.length-1].checkTime}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">最后检查状态：</span>
                  <a>{{currentPip.checkRecordList[currentPip.checkRecordList.length-1].checkResultStatus==1?'正常':'异常'}}</a>
                </div>
              </div>

              <div class="info-window" v-if="currentPip.proType=='pending'">
                <div class="info-title">
                  <img src="../../assets/images/icon22.png">
                  <div class="title-editor" @click="editorPip(currentPip)"><a>管线信息</a><a>编辑信息</a></div>
                </div>
                <div class="info-item">
                  <span class="info-span">管线名称：</span>
                  <a>{{currentPip.pipelineName}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">管线类型：</span>
                  <a>{{currentPip.pipelineType}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">所属区域：</span>
                  <a>{{currentPip.locationDesc}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">检查状态：</span>
                  <a>未检查</a>
                </div>
              </div>
            </bm-info-window>

            <!-- 人员和车辆信息框 -->
            <bm-info-window :position="devicePoint"  :show="deviceWindow.show" @close="deviceWindowClose" @open="deviceWindowOpen">
              <div class="info-window">
                <div class="info-title">
                  <img src="../../assets/images/icon10.png"  v-show="devicePoint.carId&&devicePoint.active">
                  <img src="../../assets/images/icon26.png"  v-show="!devicePoint.carId&&devicePoint.active">
                  <img src="../../assets/images/icon09.png"  v-show="!devicePoint.carId&&!devicePoint.active">
                  <img src="../../assets/images/icon27.png"  v-show="devicePoint.carId&&!devicePoint.active">
                  <a>{{devicePoint.label}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">用户名：</span>
                  <a>{{devicePoint.label}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">巡检班组：</span>
                  <a>{{devicePoint.office}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">状态：</span>
                  <a>{{devicePoint.active || devicePoint.isBiGua?'在线':'离线'}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">设备ID：</span>
                  <a>{{devicePoint.deviceSid}}</a>
                </div>
                <div class="info-item" v-if="!devicePoint.carId">
                  <span class="info-span">手机：</span>
                  <a>{{devicePoint.mobilePhone}}</a>
                </div>
                <div class="info-item" v-if="devicePoint.carId">
                  <span class="info-span">型号：</span>
                  <a>{{devicePoint.carType}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">最后定位时间：</span>
                  <a v-if="devicePoint.latest_location">{{devicePoint.latest_location.loc_time | getLocalTime}}</a>
                  <a v-else>{{devicePoint.loc_time | getLocalTime}}</a>
                </div>
                <div class="info-item">
                  <span class="info-span">最后定位设备：</span>
                  <a v-if="devicePoint.carId">车载终端</a>
                  <a v-else>{{(devicePoint.lastDevice || devicePoint.isBiGua)?'臂挂终端':'PAD终端'}}</a>
                </div>
                <div class="info-footer">
                  <div class="info-footer-item" v-if="!devicePoint.carId" @click="playLineGame(devicePoint,'BG')">
                    <img src="../../assets/images/icon31.png">
                    <a> 臂挂轨迹</a>
                  </div>
                  <div class="info-footer-item" @click="playLineGame(devicePoint,'PAD')">
                    <img src="../../assets/images/icon31.png">
                    <a>{{devicePoint.carId?' 车载轨迹':' Pad轨迹'}}</a>
                  </div>
                </div>
              </div>
            </bm-info-window>

            <!-- 问题阀井的信息框 -->
            <transition name="move">
              <info-box v-if="isDetailValve" :valveInfo="currentPoint" @closeDetail="isDetailValve=false"></info-box>
            </transition>
            <!-- 问题管线的信息框 -->
            <transition name="move">
              <pip-box v-if="isDetailPip" :pipInfo="currentLinePoint" @closeDetail="isDetailPip=false"></pip-box>
            </transition>

            <!-- 阀井编辑的信息框 -->
            <transition name="move">
              <valve-editor ref="valveBox" v-show="isValveEditor" @editValveSucc="editValveSucc" @closeDetail="isValveEditor=false"></valve-editor>
            </transition>
            <!-- 管线编辑的信息框 -->
            <transition name="move">
              <pip-editor ref="pipBox" v-show="isPipEditor" @editPipline="editPipline" @closeDetail="isPipEditor=false"></pip-editor>
            </transition>

            <!-- 路书 -->
            <bm-polyline :path="item" v-for="(item,index) in otherPolylinePath"  stroke-color="blue" :stroke-opacity="1" :stroke-weight="6" ></bm-polyline>
            <bm-marker :position="position" ref="runMarker" :icon="iconLuShu" :rotation="rotation"></bm-marker>
            <bm-marker :position="polylinePath[0]"  ref="startMarker" :icon="startIcon"></bm-marker>
            <bm-marker :position="polylinePath[polylinePath.length-1]" ref="endMarker" :icon="endIcon"></bm-marker>

          </baidu-map>
        </div>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import {BmlLushu} from 'vue-baidu-map'
import MapProgress from './map-progress'
import UserTree from './user-tree'
import MapSpeed from './map-speed'
import InfoBox from './info-box'
import PipBox from './pip-box'
import MapBar from './map-bar'
import ValveEditor from './valve-editor'
import PipEditor from './pip-editor'
import {progressCheck,getLocation,getTrack} from '@/api/map';
import {getAngle,startLoading,endLoading} from '@/util/common';

const HYBRID='BMAP_HYBRID_MAP'
const NORMAL='BMAP_NORMAL_MAP'
export default {
  name: 'monitor',
  components: {
    BmlLushu,
    MapProgress,
    UserTree,
    MapSpeed,
    MapBar,
    InfoBox,
    PipBox,
    ValveEditor,
    PipEditor
  },
  data () {
    return {
      zoom:14,
      today:0,
      month:0,
      offset:{width: 30, height: 110},
      title:'整体',
      isPlay:false,
      isRuning:false,
      isValveEditor:false,
      isPipEditor:false,
      progressShow:false,
      isDetailValve:false,
      isDetailPip:false,
      canToggle:true,
      mapType:NORMAL,
      otherPolylinePath:[],
      center:{lng: 120.680, lat: 30.211}, //地图中心点
      iconLuShu:{
        url: require('../../assets/images/carOn.png'),
        size: {width: 20, height: 40},
        opts: {anchor: {width: 10, height:13}}
      },
      iconLinePoint: {
        url: require('../../assets/images/icon36.png'),
        size: {width: 28, height: 49},
        opts: {anchor: {width: 27, height:13}}
      },
      iconOn: {
        url: require('../../assets/images/carOn.png'),
        size: {width: 20, height: 40},
        opts: {anchor: {width: 10, height:13}},
        name:'car'
      },
      iconOff: {
        url: require('../../assets/images/carOff.png'),
        size: {width: 20, height: 40},
        opts: {anchor: {width: 10, height:13}}
      },
      activeIcon: {
        url: require('../../assets/images/person.png'),
        size: {width: 28, height: 49},
        name:'person'
      },
      startIcon: {
        url: require('../../assets/images/startPoint.png'),
        size: {width: 28, height: 49},
      },
      endIcon: {
        url: require('../../assets/images/endPoint.png'),
        size: {width: 28, height: 49},
      },
      outIcon: {
        url: require('../../assets/images/person01.png'),
        size: {width: 28, height: 49},
        opts: {anchor: {width: 27, height:13}}
      },
      finishPip:0,
      pendingPip:0,
      finishValve:0,
      pendingVavle:0,
      linePath: [], //管线的坐标点集合
      linePoint:[], //管线异常点
      allDevice:[],
      polylinePath: [{lng: 0, lat: 0}], //路书的坐标点集合
      allValve:[],//所有阀井数据
      currentPoint:{lng: 116.404, lat: 39.915}, //阀井信息框坐标
      currentPip:{lng: 116.404, lat: 39.915}, //管线信息框坐标
      currentLinePoint:{lng: 116.404, lat: 39.915}, //管线信息框坐标
      devicePositon:{lng: 116.404, lat: 39.915}, //人员和车辆坐标
      devicePoint:{}, //人员和车辆坐标
      deviceInfo:{},//人员和车辆信息
      infoWindow: {  //信息框内容
        show: false,
        contents: ''
      },
      deviceWindow:{
        show:false
      },
      pipWindow:{
        show:false
      },
      normalIcon:{
        url: require('../../assets/images/valve01.png'),
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      succIcon:{
        url: require('../../assets/images/valve02.png'),
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      otherIcon:{
        url: require('../../assets/images/valve03.png'),
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      errIcon:{
        url: require('../../assets/images/valve04.png'),
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      rotation:0,
      position:{},
      index:0,
      speed:80,  //路书播放速度
      progressSpeed:0.05
    }
  },
  filters:{
		getLocalTime(nS) {     
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
    }
	},

  computed: {
  },
  methods: {

    //地图实例初始化成功
    async handler ({BMap, map}) {
      //获取任务进度和状态
      this.allDevice=[]
      let pipeline=[];
      let valveCheck=[];
      startLoading();
      try {
        let result = await progressCheck();
        // console.log('初始进度',result);
        endLoading();
        if(result.status==200){
          
          let valve_check=result.data.valve_check_process;
          let pipeline_check=result.data.pipeline_check_process;
          this.finishPip=pipeline_check.finish.length?pipeline_check.finish.length:0;
          this.pendingPip=pipeline_check.pending.length?pipeline_check.pending.length:0;
          this.finishValve=valve_check.finish.length?valve_check.finish.length:0;
          this.pendingVavle=valve_check.pending.length?valve_check.pending.length:0;
          valveCheck=this.progressDataInit(valve_check);
          pipeline=this.progressDataInit(pipeline_check);

          //管线异常点
          this.linePoint =this.getLinePoints(pipeline_check.finish);
          this.linePoint.push(this.getLinePoints(pipeline_check.pending));
          //设置进度
          this.month=parseInt(pipeline_check.progress);
          this.today=parseInt(valve_check.progress);
        }else{
          endLoading();
        }
      } catch(err) {
        endLoading();
      }
      
      //序列化阀井
      this.allValve=this.initPosData(valveCheck);

      //序列化管线
      let lineArray = this.initLineData(pipeline);
      this.linePath = this.getPipArr(lineArray);

      // 获取所有设备信息
      this.allDevice=this.$store.state.map.allDevice;
      // console.log('设备',this.allDevice)

      //监听阀井显示隐藏
      this.$nextTick(()=>{
        this.toggleValveShow()
      })
    },
    resave(){
      this.center={lng: 120.680, lat: 30.211}
      this.zoom=14      
    },
    //编辑阀井
    editorValve(data){
      this.isValveEditor=true
      this.$refs.valveBox.editInfo(data)
    },
    editValveSucc(data){
      this.currentPoint=Object.assign(this.currentPoint,data)
    },
    //编辑管线
    editorPip(data){
      this.isPipEditor=true
      // console.log('**********',data)
      this.$refs.pipBox.editInfo(data)
    },
    editPipline(data){
      this.currentPoint=Object.assign(this.currentPip,data)
    },

    //进度数据序列化
    progressDataInit(data){
      let finish=data.finish;
      // let pending=data.pending;
      let pending=this.deleFinish(finish,data.pending);
      finish.forEach((item)=>{
        Object.assign(item, {proType:'finish'})
      })
      pending.forEach((item)=>{
        Object.assign(item, {proType:'pending'})
      })
      return finish.concat(pending);
    },
    //过滤
    deleFinish(data,list){
      data.forEach(item=>{
        list.forEach((value,index)=>{
          if(value.id==item.id){
            list.splice(index,1)
          }
        })
      })
      return list
    },
    //获取管线异常点
    getLinePoints(data){
      let arr=[];
      data.forEach(item=>{
        item.checkRecordList.forEach(value=>{
          if(value.checkResultStatus==0){
            Object.assign(value, {lng:value.lon})
            arr.push(value)
          }
        })
      })
      return arr
    },

    //地图拖拽监听
    dragend(e){
      this.center=e.target.point
    },

    //地图缩放时触发监听事件
    syncCenterAndZoom(e){
      this.zoom = e.target.getZoom();
      if(!this.$refs.allValve) return;
      this.toggleValveShow();
    },

    //切换阀井的显示隐藏
    toggleValveShow(){
      if(!this.canToggle) return;
      if(this.zoom>=16){
        this.$refs.mapBar.setValveShow()
        this.$refs.allValve.forEach((item)=>{
          item.originInstance.show()
        })
      }else{
        this.$refs.mapBar.setValveHide()
        this.$refs.allValve.forEach((item)=>{
          item.originInstance.hide()
        })
      }
    },
    startEndPointHide(){
      this.$refs.startMarker.originInstance.hide();
      this.$refs.endMarker.originInstance.hide();
    },
    startEndPointShow(){
      this.$refs.startMarker.originInstance.show();
      this.$refs.endMarker.originInstance.show();
    },
    //拖动进度条改变进度
    changePercent(per){
      // this.index = Math.ceil((this.polylinePath.length-1)*(per/100));
      let linePer=this.$store.state.map.linePer
      linePer.forEach(item=>{
        if(per>=item.start && per<=item.end){
          let percent = (per-item.start)/(item.end-item.start);
          this.index = Math.ceil((this.polylinePath.length-1)*percent);
        }
      })
      this.$refs.mapSpeed.setPlay();
      this.playGame();
    },
    //实时刷新所有设备的动态位置
    setNewPosition(device){
      this.allDevice=[];
      setTimeout(()=>{
        this.allDevice=device;
      },120)
    },

    //点击获取人员和车辆状态信息
    deviceLocation(data){
      // console.log(data)
      this.clearPositonInterVal() //清除实时位置监控
      if(data.officeName){ //如果点击的是部门则查询进度
        // 查询进度
        let id= data.id==1?"":data.id;
        this.getProgressTask(id);
        this.title=data.id==1?'整体':data.officeName;
      }else{       //否则定位人或车的位置
        this.$refs.mapBar.setDevice();
        let deviceItem = this.$refs.allDevice;
        deviceItem.forEach((item)=>{
          item.originInstance.show();
        })
        this.getLastInfo(data)
        //清除轨迹相关
        this.clearSpeedBar()
        this.progressShow=false 
      }
    },

    // 最后定位信息
    getLastInfo(data){
      let user = Object.assign({},data);
      getLocation(data.armSid).then(res=>{
        let location1=res.status==0? res.latest_point:{loc_time:0};
        getLocation(data.deviceSid).then(res=>{
          let location2 = res.status==0? res.latest_point:{loc_time:0};
          let latest_location=location1.loc_time-location2.loc_time>=0?location1:location2
          let newPosition=Object.assign(user,{
            lat:latest_location.latitude,
            lng:latest_location.longitude,
            loc_time:latest_location.loc_time,
            lastDevice:location1.loc_time-location2.loc_time>=0?true:false
          })
          if(latest_location.loc_time==0){
            this.$message.warning('设备未激活');
            return
          }
          this.center = {lng: latest_location.longitude, lat: latest_location.latitude};
          this.clickDevice(newPosition);
        })
      })
    },
    //清除实时位置监控
    clearPositonInterVal(){
      if(this.positionInterVal) clearInterval(this.positionInterVal);
    },

    // 查询任务进度
    getProgressTask(id){
      let pipeline=[];
      let valveCheck=[];
      this.finishPip=0
      this.pendingPip=0
      this.finishValve=0
      this.pendingVavle=0
      startLoading()
      progressCheck(id).then(({status,data})=>{
        // console.log('巡检进度',data)
        endLoading()
        if(status==200){
          let valve_check=data.valve_check_process;
          let pipeline_check=data.pipeline_check_process;
          this.finishPip=pipeline_check.finish.length?pipeline_check.finish.length:0;
          this.pendingPip=pipeline_check.pending.length?pipeline_check.pending.length:0;
          this.finishValve=valve_check.finish.length?valve_check.finish.length:0;
          this.pendingVavle=valve_check.pending.length?valve_check.pending.length:0;
          valveCheck=this.progressDataInit(valve_check);
          pipeline=this.progressDataInit(pipeline_check);

          //管线异常点
          this.linePoint =this.getLinePoints(pipeline_check.finish);
          
          //设置进度
          this.month=parseInt(pipeline_check.progress);
          this.today=parseInt(valve_check.progress);
        }
        //序列化阀井
        this.allValve=this.initPosData(valveCheck);
        //序列化管线
        let lineArray = this.initLineData(pipeline);
        this.linePath = this.getPipArr(lineArray);
        this.$nextTick(()=>{
          this.toggleValveShow();
        })
      }).catch(()=>{
        endLoading()
      })
    },
    startRun(arr){
      if(this.isRuning) return;
      if(this.runLuShu) clearInterval(this.runLuShu);
      let linePer=this.$store.state.map.linePer
      let item=this.otherPolylinePath[arr];
      let durationTime=linePer[arr].end-linePer[arr].start;
      let num=this.polylinePath.findIndex(val=>{
        return val.create_time==item[0].create_time
      })
      this.index=num
      this.position=this.polylinePath[num]
 
      let speed = ((this.speed*(durationTime/this.progressSpeed))/this.polylinePath.length).toFixed(2)
      //如果播放结束后继续点击播放
      if(this.index>=this.polylinePath.length-1){
        this.index=0;
      }
      this.runLuShu=setInterval(()=>{
        this.index+=1;
        //设置随路段旋转
        if(this.iconLuShu.name=="car"){
          this.rotation=this.polylinePath[this.index].direction;
        }
        this.position=this.polylinePath[this.index];
        //播放停止
        if(this.index+1>=this.polylinePath.length){
          this.index=this.polylinePath.length-1
          this.position=this.polylinePath[this.polylinePath.length-1];
          clearInterval(this.runLuShu);
        }
      },speed)
      
    },
    stopRun(index){
      if(!this.isRuning) return;
      if(index>=0){
        let item=this.otherPolylinePath[index];
        let num=this.polylinePath.findIndex(val=>{
          return val.create_time==item[item.length-1].create_time
        })
        this.index=num
        this.position=this.polylinePath[num]
      }
      clearInterval(this.runLuShu);
    },

    //路书播放事件
    playGame(){
      if(this.mapInterval) clearInterval(this.mapInterval);
      let progress=this.$store.state.progress
      let linePer=this.$store.state.map.linePer
      progress>=100?this.progress=0:this.progress=progress;
      //设置定时器
      this.mapInterval=setInterval(()=>{
        this.progress+=this.progressSpeed;
        let lastTime = linePer[linePer.length-1].end;
        let isStart=linePer.findIndex(( item, index, array )=>{ 
          return this.progress>=item.start && this.progress<=item.end; 
        })
        if(isStart>=0){
          this.startRun(isStart)
          this.isRuning=true;
        }else{
          let num = linePer.findIndex((item,index,array)=>{
            let current = index+1>=(array.length-1)?array.length-1:index+1
            return this.progress>=item.end && this.progress<=array[current].start
          })
          this.stopRun(num)
          this.isRuning=false;
        }
        if(this.progress<linePer[0].start){
          this.index=0;
        }
        if(this.progress>=100){
          this.$store.dispatch('setProgress',100)
          this.$refs.mapSpeed.setPause();
          clearInterval(this.mapInterval);
        }
        this.$store.dispatch('setProgress',this.progress);
      },this.speed)

    },

    playLocation(data){
      if(this.mapInterval) clearInterval(this.mapInterval);
      this.position={lng: data.lng, lat: data.lat}
      this.rotation=0;
      
      if(data.carId) this.iconLuShu = this.iconOn;
      else this.iconLuShu = this.activeIcon;
      //清空轨迹回放的路线
      this.$store.dispatch('map/getPointsList',[]);
      //重置轨迹回放的路线和进度条
      this.$refs.userTree.returnPlay()
      this.clearSpeedBar()
      this.$store.dispatch('map/getDevice',data);
      
      this.progressShow=true;

      this.$refs.runMarker.originInstance.show();
      this.getLastInfo(data)
      //清除地图上其他图层
      this.hideAllMarker();

    },


    //点击人员或车辆，播放相应的轨迹
    playLineGame(data,name){
      console.log('轨迹播放',data,name)
      if(this.mapInterval) clearInterval(this.mapInterval);
      this.position={lng: data.lng, lat: data.lat}
      this.rotation=0;
      
      if(data.carId) this.iconLuShu = this.iconOn;
      else this.iconLuShu = this.activeIcon;
      //清空轨迹回放的路线
      this.$store.dispatch('map/getPointsList',[]);
      console.log(this.$store.state.actionName)
      if(this.$store.state.actionName=='REALTIME'){
        let entity_name = name == 'PAD'?data.deviceSid:data.armSid;
        let time = new Date().getTime();
        let h = this.formatDate(time);
        let newTime =Math.floor((time-(h*1000*60*60))/100000)*100000
        let start_time=Math.floor((newTime+1000*60*60*24)/1000);
        let end_time=start_time-(60*60*24);
        getTrack(entity_name,end_time,start_time).then(res=>{
          if(res.status==0){
            if(!res.points.length) {
              this.$message.warning('没有查询到轨迹');
              return
            }
            this.clearTraceAndSearch(data,name)
          }else{
            this.$message.warning('没有查询到轨迹');
          }
        })
      }else{
        this.clearTraceAndSearch(data,name)
      }
    },

    //重置轨迹回放参数，并查询新的轨迹
    clearTraceAndSearch(data,name){
      this.$refs.userTree.returnPlay()
      this.clearSpeedBar()
      this.$store.dispatch('map/getDevice',data);
      this.progressShow=true;
      this.$refs.runMarker.originInstance.show();
      this.$refs.mapSpeed.initNowDate(name);
      //清除地图上其他图层
      this.hideAllMarker();
    },
    //隐藏所有图层
    hideAllMarker(){
      let valveItem = this.$refs.allValve;
      this.$refs.mapBar.setDeviceHide();
      this.deviceWindowClose()
      valveItem.forEach((item)=>{
        item.originInstance.hide();
      })
    },
    //路书暂停事件
    pauseGame(){
      clearInterval(this.mapInterval);
    },
    //播放和暂停
    playShuLu(val,points){
      this.isPlay=val
      this.polylinePath=points;
      // console.log('***',points)
      if(points.length) this.startEndPointShow()
      let list = this.getSpacePointIndex(points);
      let array = this.sliceLinePath(list,points);
      this.otherPolylinePath=array;
      this.position=this.polylinePath[0];
      this.center=this.polylinePath[0];
      if(val){
        //开始播放
        this.playGame();
      }else{
        //暂停播放
        this.pauseGame();
      }
    },

    notSearchLine(){
      this.startEndPointHide()
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

    //切换卫星地图
    changeMapType(val){
      val?this.mapType=HYBRID:this.mapType=NORMAL;
    },
    //切换显示隐藏阀井
    changeMapValve(){
      let valveItem = this.$refs.allValve;
      valveItem.forEach((item)=>{
        if(item.originInstance.isVisible()){
          this.canToggle=true
          item.originInstance.hide()
        }else{
          this.canToggle=false
          item.originInstance.show();
        }
      })
    },
    //切换设备的显示隐藏
    changeMapDevice(data){
      let deviceItem = this.$refs.allDevice;
      deviceItem.forEach((item)=>{
        data?item.originInstance.show():item.originInstance.hide();
      })
      
    },
    //切换管线显示隐藏
    changeMapPip(){
      let pipItem = this.$refs.allPip;
      let linePoint = this.$refs.linePoint;
      pipItem.forEach((item)=>{
        item.originInstance.isVisible()?item.originInstance.hide():item.originInstance.show();
      })
      linePoint.forEach((item)=>{
        item.originInstance.isVisible()?item.originInstance.hide():item.originInstance.show();
      })
    },

    //阀井图标设置
    valveIcon(item){
      if(item.proType=="finish"){
        if(item.checkRecordList[0].checkResultStatus==="0"){
          return this.otherIcon
        }else{
          return this.succIcon
        }
      }else{
        return this.errIcon
      }
    },
    //管线颜色样式
    pipColor(item){
      let pip = item[0];
      if(pip.proType=="finish"){
        if(pip.checkRecordList[0].checkResultStatus==="0"){
          return 'green'
        }else{
          return 'green'
        }
      }else{
        return 'rgb(248,149,30)'
      }
    },
    //人员和车辆图标设置
    deviceIcon(item){
      if(item.carId){
        if(item.active){
          return this.iconOn;
        }else{
          return this.iconOff;
        }
      }else{
        if(item.active){
          return this.activeIcon;
        }else{
          return this.outIcon;
        }
      }
    },
    //点击管线
    clickPiper(info){
      // console.log('管线信息',info)
      let index=Math.floor(info.length/2);
      this.currentPip=info[index];
      this.pipWindowOpen()
    },
    //点击管线上的问题点
    clickLinePoint(item){
      // console.log(item)
      this.currentLinePoint=item;
      this.isDetailPip=true
    },
    //点击阀井事件显示信息框
    clickHandler (info) {
      // console.log('阀井信息',info)
      this.isDetailValve=false;
      this.currentPoint=info;
      this.infoWindowOpen()
    },
    //打开异常阀井信息框
    openDetailValve(){
      this.isDetailValve=true;
      this.infoWindowClose();
    },
    //点击人员或车辆显示信息框
    clickDevice(item){
      // console.log('****',this.$refs.allDevice)
      // console.log('点击',item)
      this.devicePositon={lng: item.lng, lat: item.lng};
      this.devicePoint=item;
      this.deviceWindowOpen()
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
    //关闭信息框
    infoWindowClose (e) {
      this.infoWindow.show = false
    },
    deviceWindowClose(){
      this.deviceWindow.show = false
    },
    deviceWindowOpen(){
      this.deviceWindow.show = true
    },
    pipWindowClose(){
      this.pipWindow.show = false
    },
    pipWindowOpen(){
      this.pipWindow.show = true
    },
    // 打开信息框
    infoWindowOpen (e) {
      this.infoWindow.show = true
    },
    //退出轨迹回放
    outProgress(){
      this.clearSpeedBar();
      this.clearPositonInterVal()
    },
    //轨迹回放时进度条的显示和隐藏
    showProgress(val){
      this.progressShow=!val
      this.$refs.mapBar.setDevice();
      if(!val) this.clearPositonInterVal()
      if(!this.progressShow) this.clearSpeedBar();
    },
    //重置关于轨迹回放的值
    clearSpeedBar(){
      this.index=0;
      this.polylinePath=[];
      this.otherPolylinePath=[]
      this.$refs.runMarker.originInstance.hide();
      this.$store.dispatch('setProgress',0)
      if(this.mapInterval) clearInterval(this.mapInterval);
      // this.center={lng: 120.680, lat: 30.211};
      this.$refs.mapSpeed.clearAll();
      this.$refs.mapBar.setPipShow();
      let pipItem = this.$refs.allPip;
      let linePoint = this.$refs.linePoint;
      this.startEndPointHide();
      this.$store.dispatch('map/setEntityName','');
      this.$store.dispatch('setRePlay',false)
      pipItem.forEach((item)=>{
        item.originInstance.show();
      })
      linePoint.forEach((item)=>{
        item.originInstance.show();
      })
    },
    //获取管线数组
    getPipArr(array){
      let list = [];
      array.forEach(element => {
        element.pipelinePointsBaidu.forEach((item)=>{
          list.push(item.points)
        })
      });
      return list
    },
    //序列号阀井坐标点格式
    initPosData(data){
      data.forEach(val=>{
        Object.assign(val, {lng:val.lon})
      })
      return data
    },
    //序列管线格式
    initLineData(data){
      data.forEach(element => {
        element.pipelinePointsBaidu=JSON.parse(element.pipelinePointsBaidu);
        element.pipelinePointsBaidu.forEach(item=>{
          item.points.forEach(value=>{
            Object.assign(value, {lng:value.lon,proType:element.proType},{
              id:element.id,
              locationDesc:element.locationDesc,
              officeId:element.officeId,
              pipelineName:element.pipelineName,
              pipelineType:element.pipelineType,
              regionId:element.regionId,
              checkRecordList:element.proType=="finish"?element.checkRecordList:[]
            });
          })
        })
      });
      return data
    }

  },
  mounted(){
    if(this.mapInterval) clearInterval(this.mapInterval);
    this.clearPositonInterVal()
  },
  destroyed(){
    if(this.mapInterval) clearInterval(this.mapInterval);
    this.clearPositonInterVal()
  }
}
</script>

<style lang="less" scoped>
.monitor{
  width: 100%;
  height: 100%;
}
.main{
  height: 100%;
}
.left{
  height: 100%;
}
.right{
  height: 100%;
}
.right-box{
  height: 100%;
  background: #eee;
  overflow: hidden;
}
.map {
  width: 100%;
  height: 100%;
}
.info-window{
  width: 300px;
  margin-top: 10px;
  background: #fff;
  font-size: 12px;
  color: #666;
}
.info-item{
  width: 100%;
  margin-bottom: 10px;
}
.info-title{
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  color: #333;
  &>img{
    margin-right: 5px;
  }
}
.title-editor{
  width: 90%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.info-span{
  display: inline-block;
  text-align: right;
  width: 90px;
}
.info-footer{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
}
.info-footer-item{
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  cursor: pointer;
}
//move
.move-enter-active, .regitWrap .move-leave-active {
  transition: all 0.3s linear;
  transform: translate3d(0, 0, 0);
}
.move-enter, .regitWrap .move-leave {
  transform: translate3d(100%, 0, 0);
}
</style>

