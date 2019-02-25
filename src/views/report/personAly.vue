<template>
  <div class="person">
    <el-form ref="form" label-width="80px" class="record-search" size="mini">
      <el-form-item label="按月份" class="form-type">
        <el-date-picker
          v-model="time"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
          type="month"
          @change="change"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      stripe
      style="width: 90%;  height: 580px;"
      :header-cell-style="{background:'#f5f5f5',color:'#333'}"
      :cell-style="isCell">

      <el-table-column
        align="center"
        prop="officeName"
        label="班组">
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="员工姓名">
        <template slot-scope="scope">{{ scope.row.userName}}</template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="阀井巡检工作量(个)">
        <template slot-scope="scope">{{ scope.row.checkValve}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="checkPipeline"
        label="管线巡检工作量(条)">
      </el-table-column>
      <el-table-column
        align="center"
        prop="workDays"
        label="考勤天数(天)">
      </el-table-column>

      <el-table-column
        align="center"
        prop="checkLength"
        label="里程数(公里)">
      </el-table-column>

    </el-table>

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
import {sumByWorkload} from '@/api/analysis';
import MyPage from '@/components/my-page/toPage'
import {isEmpty} from '@/util/common'
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'person',
  components: {
  },
  data () {
    return {
      data:[],
      time:'',
      allValve:[],
      pageSize:10,
      total:0,
      taskType:'',
      officeList:[
        {label:'巡检一班',value:'2'},
        {label:'巡检二班',value:'3'},
      ],
      typeList:[],
    }
  },
  components:{
    MyPage
  },
  methods: {
    //管线分配查询
    getSumByWorkload(){
      startLoading()
      sumByWorkload(this.time).then(({status,data})=>{
        endLoading()
        if(status==200){
          // console.log(data)
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
    change(){
      this.time=isEmpty(this.time)?'':this.time
      this.getSumByWorkload();
    },
    getPages(page){
      this.data=this.allValve.slice((page-1)*this.pageSize,this.pageSize*page)
    },
    formatDate(timestamp) {
      var date = new Date(timestamp);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      let D = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return Y+M;
    },
  },
  mounted(){
    let timestamp = new Date().getTime();
    this.time=this.formatDate(timestamp);
    this.getSumByWorkload()
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.person{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}
</style>

