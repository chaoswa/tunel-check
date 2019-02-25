<template>
  <el-container style="height:100%">

    <el-header style="padding:0;">
      
    </el-header>

    <el-main style="padding:0;height:100%;background:rgb(56,107,205);">
      <el-row  type="flex" align="middle" justify="center" class="content">
        <el-col :span="12"><div class="title">燃气管线智慧巡检平台</div></el-col>
        <el-col :span="4"><register-form></register-form></el-col>
      </el-row>
    </el-main>

    <el-footer style="padding:0;">Footer</el-footer>

  </el-container>
</template>

<script>
import MyHeader from '@/components/my-header'
import RegisterForm from './registerForm'
export default {
  name: 'register',
  components: {
    MyHeader,
    RegisterForm
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
  .title{
    font-size: 40px;
    color: #fff;
    font-weight: 700;
  }
}
</style>

