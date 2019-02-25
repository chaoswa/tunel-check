<template>
  <el-container style="height:100%">

    <el-header class="my-header" style="padding:0;height:61px;">
      <my-header ref="myHeader"></my-header>
    </el-header>

    <el-main style="padding:0;height:100%">
      <router-view @pageNum="pageNum"/>
    </el-main>
  </el-container>
</template>

<script>
import MyHeader from '@/components/my-header'
export default {
  name: 'home',
  components: {
    MyHeader
  },
  data () {
    return {
    }
  },
  methods: {
    pageNum(num){
      this.$refs.myHeader.changeCurrent(num);
    }
  }
}
</script>

<style lang="less" scoped>
.my-header{
  color: #fff;
  background:#fff;
  border-bottom: 1px solid #ddd;
}
</style>

