<template>
  <div class="device">

    <p class="title-person">巡检终端管理</p>

    <div class="main-bar">
      <div class="bar-btn" @click="addDevice">
        <a class="el-icon-plus"></a>
        <span>添加终端</span>
      </div>
      <div class="bar-btn" @click="deleDevice">
        <a class="el-icon-delete"></a>
        <span>批量删除</span>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      stripe
      @selection-change="handleSelectionChange"
      style="width: 90%;  height: 580px;"
      :header-cell-style="{background:'#f5f5f5',color:'#333'}"
      :cell-style="isCell">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column
        type="index"
        align="center"
        prop="index"
        label="序号">
      </el-table-column>

      <el-table-column
        align="center"
        prop="deviceCode"
        label="终端编号">
      </el-table-column>

      <el-table-column
        align="center"
        prop="deviceName"
        label="终端名称">
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="类型">
        <template slot-scope="scope">{{ scope.row.deviceTypeName}}</template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="deviceStandard"
        label="型号">
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="序列号">
        <template slot-scope="scope">{{ scope.row.deviceSid}}</template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="corosId"
        label="COROS帐号">
      </el-table-column> -->

      <el-table-column
        align="center"
        prop="simId"
        label="SIM卡号">
      </el-table-column>

      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <span class="edtior-icon" @click="handleEdit(scope.$index, scope.row)"></span>
          <span class="dele-icon" @click="handleDelete(scope.$index, scope.row)"></span>
        </template>
      </el-table-column>

    </el-table>

    <my-page
      v-if="data.length"
      class="my-page" 
      :page-size="pageSize" 
      :total="total"
      @sentPages="getPages">
    </my-page>

    <transition name="move">
        <device-box v-show="showDailog" ref="deviceBox" @editDevice="editDevice"  @closeDetail="showDailog=false"></device-box>
    </transition>

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>确定删除数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfimDelete">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {deviceList} from '@/api/manage';
import MyPage from '@/components/my-page/toPage'
import {isEmpty} from '@/util/common'
import DeviceBox from './device-box'
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'deviceManage',
  data () {
    return {
      data:[],
      time:'',
      allValve:[],
      pageSize:10,
      total:0,
      centerDialogVisible:false,
      showDailog:false,
      multipleSelection:[],
      list:[]
    }
  },
  components:{
    MyPage,
    DeviceBox
  },
  methods: {
    //终端查询
    getDeviceList(){
      startLoading()
      deviceList().then(({status,data})=>{
        endLoading()
        if(status==200){
          // console.log('终端查询',data)
          this.allValve=data;
          this.getPages(1);
          this.total=data.length;
        }else{
          this.data=[]
        }
      }).catch(()=>{
        endLoading()
      })
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
      this.data=this.allValve.slice((page-1)*this.pageSize,this.pageSize*page)
    },
    //添加设备
    addDevice(){
      this.showDailog=true;
      this.$refs.deviceBox.resetForm()
    },
    //勾选的设备
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    editDevice(){
      this.getDeviceList()
    },
    //删除设备
    deleDevice(){
      if(!this.multipleSelection.length) return;
      this.list = [];
      this.multipleSelection.forEach((item)=>{
        this.list.push(item.deviceSid)
      })
      this.centerDialogVisible=true
    },
    //修改
    handleEdit(index,row){
      this.showDailog=true
      this.$refs.deviceBox.editInfo(row)
    },
    //确定删除
    comfimDelete(){
      this.centerDialogVisible=false 
      this.$refs.deviceBox.toDeleteDevice(this.list);
    },
    //删除
    handleDelete(index,row){
      // console.log(row)
      this.list = [row.deviceSid];
      this.centerDialogVisible=true
    }
  },
  mounted(){
    this.getDeviceList()
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.device{
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}
.title-person{
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}
.record-search{
  width: 90%;
  margin: 15px 0;
}
.time{
  display: flex;
  align-items: center;
  height: 50px;
  &>span{
    font-size: 18px;
    padding: 0 10px;
  }
}
.form-span{
  display: inline-block;
  width: 100px;
}
</style>

