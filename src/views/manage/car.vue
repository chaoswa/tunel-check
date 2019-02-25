<template>
  <div class="car" ref="carBox">

    <p class="title-person">巡检终端管理</p>

    <div class="main-bar">
      <div class="bar-btn" @click="addCar">
        <a class="el-icon-plus"></a>
        <span>添加车辆</span>
      </div>
      <div class="bar-btn" @click="deleCar">
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
        prop="carNumber"
        label="车牌号">
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="车型">
        <template slot-scope="scope">{{ scope.row.carType}}</template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="单位班组">
        <template slot-scope="scope">{{ scope.row.officeId==2?'巡检一班':'巡检二班'}}</template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="安装终端">
        <template slot-scope="scope">{{ scope.row.deviceName}}</template>
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
      <car-box v-show="showDailog" ref="carBoxs" @editCar="editCar" @closeDetail="showDailog=false"></car-box>
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
import {carList} from '@/api/manage';
import MyPage from '@/components/my-page/toPage'
import {isEmpty} from '@/util/common'
import CarBox from './car-box'
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'carManage',
  components: {
  },
  data () {
    return {
      data:[],
      time:'',
      list:[],
      allValve:[],
      pageSize:10,
      total:0,
      showDailog:false,
      centerDialogVisible:false,
      multipleSelection:[]
    }
  },
  components:{
    MyPage,
    CarBox
  },
  methods: {
    //车辆查询
    getCarList(){
      startLoading()
      carList().then(({status,data})=>{
        endLoading()
        if(status==200){
          // console.log('车辆查询',data)
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
    //添加车辆
    addCar(){
      this.showDailog=true;
    },
    //勾选的设备
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //删除勾选的车辆
    deleCar(){
      if(!this.multipleSelection.length) return;
      // console.log('勾选的车辆',this.multipleSelection)
      this.list = [];
      this.multipleSelection.forEach((item)=>{
        this.list.push(item.carId)
      })
      this.centerDialogVisible=true 
    },
    editCar(){
      this.getCarList()
    },

    //修改
    handleEdit(index,row){
      this.showDailog=true
      this.$refs.carBoxs.editInfo(row)
    },
    //确定删除
    comfimDelete(){
      this.centerDialogVisible=false 
      console.log(this.list)
      this.$refs.carBoxs.toDeleteCar(this.list);
    },
    //删除
    handleDelete(index,row){
      this.centerDialogVisible=true
      this.list = [row.carId]; 
    }
  },
  mounted(){
    this.getCarList()
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.car{
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

