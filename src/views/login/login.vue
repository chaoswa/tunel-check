<template>
  <el-container style="height:100%">

    <el-header style="padding:0;">
      <div class="header-top">
        <div class="middle-header">
          <img class="icon" src="../../assets/images/logo.png">
        </div>
      </div>
    </el-header>

    <el-main style="padding:0;height:100%;" class="login-main">
      <div class="middle-header">
        <img class="icon-bg" src="../../assets/images/loginIcon.png">
        <div class="login-box">
          <div class="form-top">燃气管线智慧巡检云平台</div>
          <div class="login-form">
            <login-form></login-form>
          </div>
        </div>
      </div>
      <div class="my-footer">
        Copyright &copy; 2018-2022 绍兴中石油昆仑燃气有限公司 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 技术支持：武汉导航院绍兴院有限公司
      </div>
    </el-main>

    <!-- <el-footer style="padding:0;height:40px;  line-height: 40px; color:#666;fontSize:14px;">
      Copyright &copy; 2018-2022 绍兴中石油昆仑燃气有限公司 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 技术支持：武汉导航院
    </el-footer> -->

  </el-container>
</template>

<script>
import MyHeader from '@/components/my-header'
import LoginForm from './loginForm'
export default {
  name: 'home',
  components: {
    MyHeader,
    LoginForm
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.content{
  height: 100%;
  color: #fff;
}
.login-main{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  background: url('../../assets/images/background.png') no-repeat;
  background-size:100% 100%;
}
.title{
  font-size: 40px;
  font-weight: 700;
}
.header-top{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
}
.middle-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1230px;
  height: 100%;
  &>img{
    width: 260px;
    height: 45px;
  }
  &>.icon-bg{
    width: 601px;
    height: 578px;
  }
}
.login-box{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  width: 450px;
  height: 550px;
}
.login-form{
  padding: 50px;
  width: 350px;
  height: 300px;
  border-radius: 5px;
  background: #fff;
  box-shadow:0px 0px 1px #666;
}
.form-top{
  margin: 30px 0;
  font-size: 40px;
  color: #fff;
  font-weight: bold;
}


.right{
  width: 100%;
  height: 60px;
  display: flex;
  font-size: 18px;
  color: #333;
  line-height: 60px;
  justify-content: space-around;
  align-items: center;
}
.titles{
  margin-left: 10px;
  font-size: 20px;
  color: #333;
}
.icon{
  width: 47px;
  height: 42px;
  margin-left: 30px;
}
.txt{
  font-size: 10px;
  padding-top: 2px;
}
.my-footer{
  height:40px;
  line-height: 40px; 
  color:#fff;
  font-size: 14px;
}
</style>

