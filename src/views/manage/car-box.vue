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

      <el-form-item label="车牌号：" prop="carNumber" required>
        <el-col :span="24">
          <el-input v-model="taskForm.carNumber" placeholder="请输入车牌号"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="车型：" prop="carType" required>
        <el-col :span="24">
          <el-input v-model="taskForm.carType" placeholder="请输入车型"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="单位班组：" prop="officeId" required>
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

      <el-form-item label="设备终端：" prop="deviceId" required>
        <el-col :span="24">
          <el-select v-model="deviceCode" placeholder="请选择设备终端" @change="typeChange">
            <el-option
              v-for="item in options"
              :key="item.deviceId"
              :label="item.deviceCode"
              :value="item.deviceCode">
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
import {findNotAssign,saveCar,deleteCar} from '@/api/manage';
import {startLoading,endLoading} from '@/util/common';
  export default {
    data(){
      return {
        taskForm: {
          "carId":"",  //车辆id 空:新增,
          "carNumber":"",  //车牌号
          "carType":"",    //车辆类型
          "officeId":"",    //所属班组id
          "deviceId":""     //车载终端id
        },
        office:[
          {id:'2',name:'巡检一班'},
          {id:'3',name:'巡检二班'}
        ],
        options:[],
        officeName:'',
        deviceCode:'',
        rules: {
          carNumber: [
            { required: true, message: '请输入车牌号', trigger: 'blur' },
          ],
          carType: [
            { required: true, message: '请输入车型', trigger: 'blur' },
          ],
          officeId: [
            { required: true, message: '请选择班组', trigger: 'change' }
          ],
          deviceId: [
            { required: true, message: '请选择设备', trigger: 'change' }
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
            console.log(valid)
            this.saveCarInfo();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //保存设备信息
      saveCarInfo(){
        startLoading()
        saveCar(this.taskForm).then(res=>{
          console.log('保存信息',res)
          endLoading()
          if(res.status==200){
            this.$emit('editCar')
            this.$message.success(res.message)
            this.resetForm()
          }else{
            this.$message.error(res.message)
          }
        }).catch(()=>{
          endLoading()
        })
      },
      //删除用户
      toDeleteCar(list){
        startLoading()
        deleteCar(list).then(res=>{
          // console.log(res)
          endLoading()
          if(res.status==200){
            this.$emit('editCar')
            this.$message.success(res.message)
            this.resetForm()
          }else{
            this.$message.error(res.message)
          }
        }).catch(()=>{
          endLoading()
        })
      },
      //可用终端查询
      getFindNotAssign(){
        findNotAssign().then(res=>{
          // console.log('可用终端',res)
          if(res.status==200){
            this.options=res.data
          }else{
            this.options=[]
          }
        })
      },
      //修改设备信息
      editInfo(row){
        console.log(row)
        this.officeName=row.officeName
        this.deviceCode=row.deviceCode
        this.taskForm.carId=row.carId
        this.taskForm.carNumber=row.carNumber
        this.taskForm.carType=row.carType
        this.taskForm.officeId=row.officeId
        this.taskForm.deviceId=row.deviceId
      },
      officeChange(val){
        let index = this.office.findIndex((item)=>{
          return item.name==val
        })
        this.taskForm.officeId=this.office[index].id
      },
      typeChange(val){
        let device = this.options.filter((item)=>{
          return item.deviceCode==val
        })
        this.taskForm.deviceId=device[0].deviceId
      },
      //重置表单
      resetForm() {
        this.$refs['taskForm'].resetFields()
        this.taskForm.carId=''
        this.officeName=''
        this.deviceCode=''
      }
    },
    mounted(){
      this.getFindNotAssign()
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
