<template>
  <div class="valve">
    <el-form ref="form" :model="formData" label-width="80px" class="record-search" size="mini">
      <el-form-item label="按类型" class="form-type">
        <el-select v-model="formData.valveType"  clearable  placeholder="--全部类型--">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="按班组" class="form-type">
        <el-select v-model="formData.officeId"  clearable  placeholder="--全部类型--">
          <el-option
            v-for="item in officeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" class="form-type">
        <el-input v-model="formData.keyWord"  clearable placeholder="请输入关键字"></el-input>
      </el-form-item>
      <div class="search-btn" @click="search">搜索</div>
    </el-form>


    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      stripe
      style="width: 90%;"
      :header-cell-style="{background:'#f5f5f5',color:'#333'}"
      :cell-style="isCell">

      <el-table-column
        align="center"
        prop="valveType"
        label="设备类型">
      </el-table-column>


      <el-table-column
        align="center"
        prop="valveName"
        label="设备名称">
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="对应商户">
        <template slot-scope="scope">{{ scope.row.bizPoint}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="regionName"
        label="所属片区">
      </el-table-column>

      <el-table-column
        align="center"
        prop="officeName"
        label="巡检班组">
      </el-table-column>

      <el-table-column
        align="center"
        prop="masterName"
        label="班组负责人">
      </el-table-column>

      <el-table-column
        align="center"
        prop="checkCycle"
        label="检查频率">
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
      <valve-box v-show="showDailog" ref="valveBox" @editValve="editValve"  @closeDetail="showDailog=false"></valve-box>
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
import {valveList} from '@/api/map';
import MyPage from '@/components/my-page/toPage'
import ValveBox from './valve-box'
import {deleteValve} from '@/api/report';
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'valve',
  data () {
    return {
      data:[],
      time:'',
      allValve:[],
      pageSize:9,
      total:0,
      taskType:'',
      showDailog:false,
      centerDialogVisible:false,
      list:'',
      officeList:[
        {label:'巡检一班',value:'2'},
        {label:'巡检二班',value:'3'},
      ],
      typeList:[
        {label:'球阀',value:'01'},
        {label:'闸阀',value:'02'},
      ],
      formData:{
        "valveType":'',
        "officeId":'', 
        "keyWord":''
      }
    }
  },
  components:{
    MyPage,
    ValveBox
  },
  methods: {
    //阀井分配查询
    getValveList(form){
      startLoading()
      valveList(form.valveType,form.officeId,form.keyWord).then(({status,data})=>{
        endLoading()
        if(status==200){
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

    search(){
      this.getValveList(this.formData);
    },

    getPages(page){
      this.data=this.allValve.slice((page-1)*this.pageSize,this.pageSize*page)
    },
    //修改
    handleEdit(index,row){
      this.showDailog=true
      this.$refs.valveBox.editInfo(row)
    },
    //修改成功后
    editValve(){
      this.getValveList(this.formData)
    },
    //删除
    handleDelete(index,row){
      console.log(row)
      this.centerDialogVisible=true 
      this.list = row.id;
    },
    //确定删除
    comfimDelete(){
      this.centerDialogVisible=false
      startLoading()
      deleteValve(this.list).then(res=>{
        endLoading()
        if(res.status==200){
          this.getValveList(this.formData)
          this.$message.success('删除成功')
        }else{
          this.$message.error(res.message)
        }
      }).catch(()=>{
        endLoading()
      }) 
    },
  },
  mounted(){
    this.getValveList(this.formData)
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.valve{
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
</style>

