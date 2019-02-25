<template>

  <el-form :model="loginForm"
    status-icon
    :rules="rules"
    ref="loginForm">
    <div class="title-user">帐号登录</div>
    <el-form-item prop="phone">
      <el-input v-model="loginForm.phone" clearable prefix-icon="iconfont icon-yonghuming" placeholder="请输入用户名">
      </el-input>
    </el-form-item>

    <el-form-item prop="pass" :error="loginForm.errorMsg">
      <el-input type="password"
        v-model="loginForm.pass" placeholder="请输入密码"
        @keyup.enter.native="submitForm('loginForm')"
        clearable
        auto-complete="off">
        <i slot="prefix" class="iconfont icon-mima"></i>
      </el-input>
    </el-form-item>

    <el-checkbox-group class="go-password" v-model="checkList" @change="statusChange">
      <el-checkbox label="记住密码"></el-checkbox>
    </el-checkbox-group>

    <el-form-item>
      <button class="login-btn"  @click.prevent="submitForm('loginForm')">登 &nbsp; 录</button>
    </el-form-item>
  </el-form>

</template>

<script>
import jwt_decode from 'jwt-decode'
import {userLogin} from '@/api/user'
import {isEmpty} from '@/util/common'
export default {
  name: 'loginForm',
  data () {
    return {
      loginForm: {
        phone: '',
        pass: '',
        errorMsg: "",
      },
      rememberPwd:false,
      checkList: [],
      rules: {
        pass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          // {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号",trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    //用户登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //登录接口
          userLogin(this.loginForm.phone,this.loginForm.pass).then((res) => {
            // console.log('登录成功',res);
            const token =res.data;
            if(res.status==200){
              //token存储ls
              let curTime = new Date().getTime();
              localStorage.setItem('eleToken',token);
              localStorage.setItem('curTime',curTime);

              //记住用户名或密码
              localStorage.setItem('rememberUser',this.loginForm.phone);
              if(this.rememberPwd) {
                localStorage.setItem('rememberPwd',this.loginForm.pass);
              }

              //解析token
              const decode= jwt_decode(token);
              
              //token存储到vuex
              this.$store.dispatch('setLogin',!isEmpty(decode))
              this.$store.dispatch('setUser',decode)
              
              this.$router.push('/home');
            }else{
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false
        }
      });
    },
    statusChange(val){
      this.rememberPwd=false;
      if(!val.length){
        this.rememberPwd=false;
        localStorage.removeItem('rememberPwd')
      }
      if(val.length==1){
        this.rememberPwd=true
        localStorage.removeItem('rememberUser')
      }
    }
  },
  mounted(){
    this.checkList=[];
    this.loginForm.phone=localStorage.rememberUser?localStorage.rememberUser:'';
    this.loginForm.pass='';
    const isPwd = localStorage.rememberPwd ? true : false;
    if(isPwd){
      this.rememberPwd=true;
      this.checkList.push('记住密码');
      this.loginForm.pass=localStorage.rememberPwd;
    }
  }
}
</script>

<style lang="less" scoped>
.title-user{
  width: 100%;
  font-size: 20px;
  color: #333;
  text-align: left;
  margin-bottom: 20px;
}
.login-btn{
  width: 100%;
  height: 45px;
  margin-top: 30px;
  color: #fff;
  font-size: 16px;
  background: #607df5;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover{
    background: #607df5;
  }
}
.user-icon{
  width: 20px;
  height: 20px;
  background: url('../../assets/images/userIcon.png') no-repeat;
  background-size:100% 100%;
}

.go-password{
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>

