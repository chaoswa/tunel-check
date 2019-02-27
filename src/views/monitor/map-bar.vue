<template>
  <bm-control class="map-bar" anchor="BMAP_ANCHOR_TOP_LEFT" :offset="offset">
    <el-tooltip class="item" effect="dark" content="人员" placement="right">
      <div class="item" @click="changeMapDevice">
        <img src="../../assets/images/icon21.png" v-show="isDevice">
        <img src="../../assets/images/icon30.png" v-show="!isDevice">
        <!-- <span :class="{'btn-active':isDevice}">人员</span> -->
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="管线" placement="right">
      <div class="item" @click="changeMapPip">
        <img src="../../assets/images/icon22.png" v-show="isPip">
        <img src="../../assets/images/icon29.png" v-show="!isPip">
        <!-- <span :class="{'btn-active':isPip}">管线</span> -->
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="阀井" placement="right">
      <div class="item" @click="changeMapValve">
        <img src="../../assets/images/icon23.png" v-show="isValve">
        <img src="../../assets/images/valve01.png" v-show="!isValve">
        <!-- <span :class="{'btn-active':isValve}">阀井</span> -->
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="卫星" placement="right">
      <div class="item" @click="changeMapType">
        <img src="../../assets/images/icon28.png" v-show="!isType">
        <img src="../../assets/images/icon24.png" v-show="isType">
        <!-- <span :class="{'btn-active':isType}">卫星</span> -->
      </div>
    </el-tooltip>
    
    <el-tooltip class="item" effect="dark" content="巡检区" placement="right">
      <div class="item" @click="resave">
        <img src="../../assets/images/resave.png">
        <!-- <span class="btn-active">复位</span> -->
      </div>
    </el-tooltip>
    
  </bm-control>
</template>

<script>
export default {
  name: 'mapSpeed',
  data() {
    return {
      offset:{width: 30, height: 110},
      isType:false,
      isValve:false,
      isPip:true,
      isDevice:true
    };
  },
  methods: {
    changeMapType(){
      this.isType=!this.isType;
      this.$emit('changeMapType',this.isType)
    },
    changeMapValve(){
      this.isValve=!this.isValve;
      this.$emit('changeMapValve')
    },
    changeMapPip(){
      this.isPip=!this.isPip;
      this.$emit('changeMapPip')
    },
    changeMapDevice(){
      this.isDevice=!this.isDevice;
      this.$emit('changeMapDevice',this.isDevice)
    },
    setPipShow(){
      this.isPip=true
    },
    setValveShow(){
      this.isValve=true
    },
    setValveHide(){
      this.isValve=false
    },
    setDevice(){
      this.isDevice=true
      this.$emit('changeMapDevice',this.isDevice)
    },
    setDeviceHide(){
      this.isDevice=false
      this.$emit('changeMapDevice',this.isDevice)
    },
    resave(){
      this.$emit('resave')
    },
    allHide(){
      this.isPip=false
      this.isValve=false
      this.isDevice=false
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.map-bar{
  width: 50px;
  height: 220px;
  padding: 10px 0;
  background: #fff;
  box-shadow:0px 0px 1px #999;
  border-radius: 5px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
}
.item{
  width: 90%;
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 12px;
  color: #666;
  text-align: center;
  cursor: pointer;
  &>img{
    width: 25px;
    height: 25px;
    margin-bottom: 5px;
  }
}
.btn-active{
  color: #607df5;
}

</style>

