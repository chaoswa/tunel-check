<template>
  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="120px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="管线类型：">
        <el-col :span="24">
          <el-input v-model="taskForm.pipelineType"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="管线名称：">
        <el-col :span="24">
          <el-input v-model="taskForm.pipelineName"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="所属片区：" prop="locationDesc" required>
        <el-col :span="24">
          <el-select v-model="taskForm.locationDesc" placeholder="请选择片区" @change="regionChange">
            <el-option
              v-for="item in region"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item label="巡检班组：" prop="officeId" required>
        <el-col :span="24">
          <el-select v-model="officeName" placeholder="请选择班组" @change="officeChange">
            <el-option
              v-for="item in office"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

    </el-form>

    <div class="footer-btn">
      <el-button @click="closeDetail">取 消</el-button>
      <el-button type="primary" @click="submitForm('taskForm')">确 定</el-button>
    </div>
  </div>

</template>

<script>
import {savePipeline} from '@/api/report';
import {startLoading,endLoading} from '@/util/common';
  export default {
    data(){
      return {
        taskForm: {
          id:'',
          regionId:'',
          pipelineName:'',
          pipelineType:'',
          locationDesc:'',
          officeId:'',
          checkCycle:""
        },
        officeName:'',
        region:[
          {id:'1',name:'北区'},
          {id:'2',name:'南区'}
        ],
        office:[
          {id:'2',name:'巡检一班'},
          {id:'3',name:'巡检二班'}
        ],
        rules: {
          pipelineType: [
            { required: true, message: '请选择管线类型', trigger: 'blur' }
          ],
          pipelineName: [
            { required: true, message: '请选择管线名称', trigger: 'blur' }
          ],
          locationDesc: [
            { required: true, message: '请选择片区', trigger: 'blur' }
          ],
          officeId: [
            { required: true, message: '请选择班组', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //关闭弹窗
      closeDetail(){
        this.$emit('closeDetail')
      },
      //修改设备信息
      editInfo(row){
        console.log(row)
        this.taskForm.id=row.id
        this.taskForm.pipelineName=row.pipelineName
        this.taskForm.pipelineType=row.pipelineType
        this.taskForm.locationDesc=row.locationDesc
        this.taskForm.checkCycle=row.checkCycle
        this.taskForm.regionId=row.regionId
        this.taskForm.officeId=row.officeId
        this.officeName=row.officeName
      },
      //提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            startLoading();
            console.log(valid,this.taskForm)
            savePipeline(this.taskForm).then(res=>{
              console.log(res)
              endLoading()
              if(res.status==200){
                this.$emit('editPipline')
                this.$message.success('保存成功')
                this.closeDetail()
                this.resetForm();
              }else{
                this.$message.error(res.message)
              }
            }).catch(()=>{
              endLoading()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      regionChange(val){
        let index = this.region.findIndex((item)=>{
          return item.name==val
        })
        this.taskForm.regionId=this.region[index].id
      },
      officeChange(val){
        let index = this.office.findIndex((item)=>{
          return item.name==val
        })
        this.taskForm.officeId=this.office[index].id
      },
      //重置表单
      resetForm() {
        this.officeName=''
        this.$refs['taskForm'].resetFields();
      }
    },
    mounted(){
    }
  }
</script>

<style scoped lang="less">
.add-info{
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background: #fff;
  box-shadow:0px 0px 1px #999;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
}
.close-icon{
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.demo-ruleForm{
  margin-top: 40px;
}
.footer-btn{
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  &>button{
    margin: 0 30px;
  }
}
</style>
