<template>

  <el-form :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm">
    <div class="title-user">设置新密码</div>
    <el-form-item prop="oldPass">
      <el-input v-model.number="loginForm.oldPass" clearable placeholder="旧密码">
      </el-input>
    </el-form-item>

    <el-form-item prop="newPass" :error="loginForm.errorMsg">
      <el-input type="password"
        v-model="loginForm.newPass" placeholder="新密码"
        @keyup.enter.native="submitForm('loginForm')"
        clearable
        auto-complete="off">
      </el-input>
    </el-form-item>

    <div class="new-password" @click.prevent="forgetPassWord($event)">取消设置新密码 ></div>

    <el-form-item>
      <el-button plain class="login-btn" @click.native.prevent="submitForm('loginForm')">登录</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import jwt_decode from 'jwt-decode'
import {modifyPwd} from '@/api/user'
import {isEmpty} from '@/util/common'
export default {
  name: 'registerForm',
  data () {
    return {
      loginForm: {
        oldPass: '',
        newPass: '',
        errorMsg: "",
      },
      rules: {
        oldPass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        newPass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //用户登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //登录接口
          modifyPwd(this.loginForm.oldPass,this.loginForm.newPass).then((res) => {
            // console.log('修改密码成功',res);
            if(res.rel){
              this.$router.push('/login')
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
    forgetPassWord(ev) {
      ev.stopPropagation();
      this.$router.push('/login')
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.title-user{
  width: 100%;
  font-size: 18px;
  color: #fff;
  margin-bottom: 20px;
}
.login-btn{
  width: 100%;
}
.new-password{
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #fff;
  margin-bottom: 20px;
  cursor: pointer;
}
</style>

