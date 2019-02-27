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

      <el-form-item label="成员姓名：" prop="name" required>
        <el-col :span="24">
          <el-input v-model="taskForm.name" placeholder="请输入姓名"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="用户名：" prop="username" required>
        <el-col :span="24">
          <el-input v-model="taskForm.username" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="性别：" prop="sex">
        <el-col :span="24">
          <el-select v-model="taskForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexList"
              :key="item.id"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      
      <el-form-item label="联系电话：" prop="mobilePhone" >
        <el-col :span="24">
          <el-input v-model="taskForm.mobilePhone" placeholder="请输入手机号码"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="单位班组：">
        <el-col :span="24">
          <el-input  :value="$store.state.office.officeName" :disabled="true"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="职务：" prop="position">
        <el-col :span="24">
          <el-input  v-model="taskForm.position" placeholder="请输入职务"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="PAD终端：" prop="deviceCode" >
        <el-col :span="24">
          <el-select v-model="taskForm.deviceCode" placeholder="请选择PAD终端" @change="typeChange">
            <el-option
              v-for="item in optionsPad"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceCode">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="臂挂终端：" prop="attr5" >
        <el-col :span="24">
          <el-select v-model="taskForm.attr5" placeholder="请选择臂挂终端" @change="typeChange2">
            <el-option
              v-for="item in optionsHand"
              :key="item.deviceId"
              :label="item.deviceName"
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
import {findNotAssign,addPerson,deletePerson} from '@/api/manage';
import {startLoading,endLoading} from '@/util/common';
  export default {
    data(){
      return {
        taskForm: {
          id:'',
          name:'',
          username:'',
          officeId:'',
          position:'',
          deviceCode:'',
          sex:'',
          deviceId:'',
          mobilePhone:'',
          attr1:'',
          attr2:'',
          attr3:'',
          attr4:'',
          attr5:''
        },
        options:[], //可用的设备列表
        optionsPad:[],//可用的平板设备列表
        optionsHand:[],//可用的臂挂设备列表        
        sexList:[
          {id:'01',label:'男'},
          {id:'02',label:'女'}
        ],
        rules: {
          name: [
            { required: true, message: '请输入成员姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          mobilePhone: [
            {required: false, message: '请输入手机号码', trigger: 'blur'},
            {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号",trigger: 'blur'}
          ],
          // position: [
          //   { required: false, message: '请输入职务', trigger: 'blur' }
          // ],
          // sex: [
          //   { required: false, message: '请输入性别', trigger: 'change' }
          // ],
          deviceCode: [
            { required: false, message: '请选择平板终端', trigger: 'change' }
          ],
          attr5: [
            { required: false, message: '请选择壁挂终端', trigger: 'change' }
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
            startLoading()
            this.taskForm.officeId=this.$store.state.office.id;
            addPerson(this.taskForm).then(res=>{
              // console.log('添加成员',res)
              endLoading()
              if(res.status==200){
                this.$emit('editPerson')
                this.$message.success('保存成功')
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
      //删除用户
      toDeletePerson(list){
        startLoading()
        deletePerson(list).then(res=>{
          // console.log(res)
          endLoading()
          if(res.status==200){
            this.$emit('editPerson')
            this.$message.success('保存成功')
          }else{
            this.$message.error(res.message)
          }
        }).catch(()=>{
          endLoading()
        })
      },
      //修改设备信息
      editInfo(row){
        // console.log(row)
        this.taskForm=row
      },
      typeChange(val){
        let device = this.optionsPad.filter((item)=>{
          return item.deviceCode==val
        })
        this.taskForm.deviceId=device[0].deviceId
        //this.taskForm.attr1
        this.taskForm.attr2=device[0].corosId
        // console.log(this.taskForm.deviceId)
      },
      typeChange2(val){
        let device = this.optionsHand.filter((item)=>{
          return item.deviceCode==val
        })

        
        this.taskForm.attr3=device[0].deviceId
        //this.taskForm.attr1
        this.taskForm.attr4=device[0].corosId
        // console.log(this.taskForm.deviceId)
        this.taskForm.attr5=device[0].deviceName
      },
      //可用终端查询
      getFindNotAssign(){
        findNotAssign().then(res=>{
          // console.log('可用终端',res)
          if(res.status==200){
            this.options=res.data;
            this.optionsPad=[];
            this.optionsHand=[];
            for(var item in res.data)
            {
              if(res.data[item].deviceType=="01"){
                this.optionsPad.push(res.data[item]);
              }else if(res.data[item].deviceType=="02"){
                this.optionsHand.push(res.data[item]);
              }
            }
            console.log(this.optionsPad);
            console.log(this.optionsHand);
          }else{
            this.options=[]
          }
        })
      },
      //重置表单
      resetForm() {
        this.taskForm.id=''
        this.taskForm.deviceId=''
        this.$refs['taskForm'].resetFields();
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
