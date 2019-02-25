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

      <el-form-item label="终端名称：" prop="deviceName" required>
        <el-col :span="24">
          <el-input v-model="taskForm.deviceName" placeholder="请输入终端名称"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="终端类型：" prop="deviceType" required>
        <el-col :span="24">
          <el-select v-model="taskForm.deviceType" placeholder="请选择设备终端" @change="typeChange">
            <el-option
              v-for="item in typeList"
              :key="item.deviceType"
              :label="item.deviceTypeName"
              :value="item.deviceType">
            </el-option>
          </el-select>
          
        </el-col>
      </el-form-item>

      <el-form-item label="终端编号：" prop="deviceCode" required>
        <el-col :span="24">
          <el-input v-model="taskForm.deviceCode" placeholder="请输入终端编号"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="终端型号：" prop="deviceStandard" required>
        <el-col :span="24">
          <el-input v-model="taskForm.deviceStandard" placeholder="请输入终端型号"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="终端序列号：" prop="deviceSid" required>
        <el-col :span="24">
          <el-input  v-model="taskForm.deviceSid" placeholder="请输入终端序列号"></el-input>
        </el-col>
      </el-form-item>

      <!-- <el-form-item label="COROS号：">
        <el-col :span="24">
          <el-input  v-model="taskForm.corosId" placeholder="请输入coros账户"></el-input>
        </el-col>
      </el-form-item> -->
      
      <el-form-item label="SIM号：">
        <el-col :span="24">
          <el-input  v-model="taskForm.simId" placeholder="请输入sim号"></el-input>
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
import {deviceSave,deleteDevice} from '@/api/manage';
import {startLoading,endLoading} from '@/util/common';
  export default {
    data(){
      return {
        taskForm: {
          deviceId:'',
          deviceName:'',
          deviceStandard:'',
          deviceType:'',
          deviceTypeName:'',
          deviceSid:'',
          corosId:'',
          simId:'',
          deviceCode:"",
          remark:''
        },
        typeList:[ //设备列表
          {deviceType:'01',deviceTypeName:'三防平板'},
          {deviceType:'02',deviceTypeName:'臂挂终端'},
          {deviceType:'03',deviceTypeName:'车载终端'}
        ],
        rules: {
          deviceName: [
            { required: true, message: '请输入终端名称', trigger: 'blur' },
          ],
          deviceStandard: [
            { required: true, message: '请输入终端型号', trigger: 'blur' },
          ],
          deviceType: [
            { required: true, message: '请输入终端类型', trigger: 'blur' },
          ],
          deviceCode: [
            { required: true, message: '请输入终端编号', trigger: 'blur' },
          ],
          deviceSid: [
            { required: true, message: '请输入终端序列号', trigger: 'blur' }
          ],
          // corosId: [
          //   { required: true, message: '请输入coros账户', trigger: 'blur' }
          // ],
          simId: [
            { required: true, message: '请输入sim号', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //关闭弹窗
      closeDetail(){
        this.$emit('closeDetail')
      },
      //提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(valid)
            this.saveDeviceInfo()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //保存设备信息
      saveDeviceInfo(){
        startLoading()
        deviceSave(this.taskForm).then(res=>{
          // console.log('保存信息',res)
          endLoading()
          if(res.status==200){
            this.$emit('editDevice')
            this.$message.success(res.message)
            this.resetForm()
          }else{
            this.$message.error(res.message)
          }
        }).catch(()=>{
          endLoading()
        })
      },
      //修改设备信息
      editInfo(row){
        console.log(row)
        this.taskForm=row
      },
      //删除用户
      toDeleteDevice(list){
        startLoading()
        deleteDevice(list).then(res=>{
          // console.log(res)
          endLoading()
          if(res.status==200){
            this.$emit('editDevice')
            this.$message.success(res.message)
            this.resetForm()
          }else{
            this.$message.error(res.message)
          }
        }).catch(()=>{
          endLoading()
        })
      },
      //设备型号改变时
      typeChange(val){
        // console.log(val)
        let index =this.typeList.findIndex((item)=>{
          return item.deviceType == val
        })
        this.taskForm.deviceTypeName=this.typeList[index].deviceTypeName
      },
      //重置表单
      resetForm() {
        this.$refs['taskForm'].resetFields()
        this.taskForm.corosId=''
        this.taskForm.deviceId=''
        this.taskForm.simId=''
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
