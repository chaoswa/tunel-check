<template>
  <el-container class="teams">
    <el-aside width="320px" class="aside-left">
      <el-collapse class="team-tree" v-model="activeNames">
        <el-collapse-item title="绍兴昆仑燃气" name="1">
          <el-tree ref="tree" :data="options" node-key="id" :default-expanded-keys="keys" :default-checked-keys='keys' highlight-current @node-click="officeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class='group-class'></span>
              <span>{{data.officeName}}</span>
            </span>
          </el-tree>
        </el-collapse-item>
      </el-collapse>
    </el-aside>

    <el-main style="margin: 0px;padding:0px;" class="main-right">
      <div class="main-top">
        <img src="../../assets/images/icon35.png">
        部门人员
      </div>

      <div class="main-bar">
        <div class="bar-btn" @click="addPerson">
          <a class="el-icon-plus"></a>
          <span>添加成员</span>
        </div>
        <div class="bar-btn" @click="deleUser">
          <a class="el-icon-delete"></a>
          <span>批量删除</span>
        </div>
      </div>
      <div class="main-tab">
        <el-table
          :data="data"
          tooltip-effect="dark"
          stripe
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#f5f5f5',color:'#333'}">
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
            prop="name"
            label="姓名">
          </el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            label="用户名">
            <template slot-scope="scope">{{ scope.row.username}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            label="单位班组">
            <template slot-scope="scope">{{ scope.row.officeName}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="position"
            label="职务">
          </el-table-column>

          <el-table-column
            align="center"
            prop="deviceName"
            label="配发PAD终端">
          </el-table-column>

          <el-table-column
            align="center"
            prop="attr5"
            label="配发臂挂终端">
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
      </div>

      <my-page
        v-if="total>0"
        class="my-page" 
        :page-size="pageSize" 
        :total="total"
        @sentPages="getPages">
      </my-page>

      <transition name="move">
        <team-box v-show="showDailog" ref="teamBox" @editPerson="editPerson"  @closeDetail="showDailog=false"></team-box>
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

    </el-main>
  </el-container>
</template>

<script>
import {officeTree,personList} from '@/api/manage';
import MyPage from '@/components/my-page/toPage'
import TeamBox from './team-box'
import {isEmpty} from '@/util/common'
import {startLoading,endLoading} from '@/util/common';
export default {
  name: 'teams',
  data () {
    return {
      activeNames: ['1'],
      options:[],
      data:[],
      allValve:[],
      pageSize:10,
      total:0,
      keys:[],
      list:[],
      showDailog:false,
      centerDialogVisible: false,
      multipleSelection:[] //勾选中的列表
    }
  },
  components:{
    MyPage,
    TeamBox
  },
  methods: {
    //人员查询查询
    getPersonList(id){
      startLoading()
      personList(id).then(({status,data})=>{
        endLoading()
        if(status==200){
          // console.log('人员查询',data)
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
    //获取部门树
    getOfficeTree(){
      startLoading()
      officeTree().then(res=>{
        endLoading()
        // console.log(res)
        this.options=res.data
        this.$nextTick(() =>{
          this.$store.dispatch('setOffice',res.data[0]);
          this.keys=[res.data[0].id]
        })
        this.getPersonList(res.data[0].id);
      }).catch(()=>{
        endLoading()
      })
    },
    //添加人员成功后
    editPerson(){
      this.getOfficeTree()
    },
    //点击选择班组
    officeClick(data){
      // console.log(data)
      this.$store.dispatch('setOffice',data);
      this.getPersonList(data.id)
    },
    //分页
    getPages(page){
      this.data=this.allValve.slice((page-1)*this.pageSize,this.pageSize*page)
    },
    //添加人员
    addPerson(){
      this.showDailog=true;
      this.$refs.teamBox.resetForm()
    },
    //勾选的设备
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //批量删除用户
    deleUser(){
      if(!this.multipleSelection.length) return;
      this.list = [];
      this.multipleSelection.forEach((item)=>{
        this.list.push(item.id)
      })
      // console.log('勾选的设备',this.list)
      this.centerDialogVisible=true 
    },
    //修改
    handleEdit(index,row){
      this.showDailog=true
      this.$refs.teamBox.editInfo(row)
    },
    //确定删除
    comfimDelete(){
      this.centerDialogVisible=false 
      this.$refs.teamBox.toDeletePerson(this.list);
    },
    //删除
    handleDelete(index,row){
      // console.log(row)
      this.centerDialogVisible=true 
      this.list = [row.id];
    }
  },
  mounted(){
    this.getOfficeTree()
  }
}
</script>

<style lang="less" scoped>
@import "./style/index";
.teams{
  height: 100%;
  background: rgb(242,244,245);
}
.aside-left{
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-right: 10px;
  background: #fff;
}
.aside-top{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
  margin-top: 20px;
  background: #2d8cf0;
}
.team-tree{
  width: 280px;
  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
  }
  .group-class{
    width: 13px;
    height: 13px;
    margin-right: 5px;
    background: url('../../assets/images/icon34.png') no-repeat;
    background-size:100% 100%;
  }
  .tree-txt{
    height: 15px;
    line-height: 15px;
  }
}

.main-right{
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: #fff;
  overflow: hidden;
}
.main-top{
  display: flex;
  align-items: center;
  width: 95%;
  height: 40px;
  text-align: left;
  line-height: 40px;
  font-size: 16px;
  color: #333;
  margin-top: 20px;
  &>img{
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}

</style>

