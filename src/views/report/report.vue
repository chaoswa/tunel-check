<template>

    <el-container class="report">
      <el-aside width="210px">
        <div class="left-box">
          <ul class="report-bar">
            <li><router-link tag="div"  to="/home/report/record"><div>巡检记录</div></router-link></li>
            <li><router-link tag="div"  to="/home/report/valve"><div>阀井分配</div> </router-link></li>
            <li><router-link tag="div"  to="/home/report/pip"><div>管线分配</div> </router-link></li>
            <li><router-link tag="div"  to="/home/report/valveAly"><div>阀井巡检统计</div> </router-link></li>
            <li><router-link tag="div"  to="/home/report/pipAly"><div>管线巡检统计</div> </router-link></li>
            <li><router-link tag="div"  to="/home/report/personAly"><div>人员工作量分析</div> </router-link></li>
          </ul>
        </div>
      </el-aside>
      <el-main>
        <div class="right-box">
          <router-view/>
        </div>
      </el-main>
    </el-container>

</template>

<script>

export default {
  name: 'report',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted(){
    this.$emit('pageNum',1)
  }
}
</script>

<style lang="less" scoped>
.report{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f2f4f5;
}
.main{
  height: 100%;
}
.left{
  height: 100%;
}
.right{
  height: 100%;
}
.right-box{
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.left-box{
  height: 100%;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.report-title{
  padding-top: 30px;
  padding-left: 30px;
  text-align: left;
}
.report-bar{
  width: 100%;
  padding-top: 20px;
  &>li{
    width: 100%;
    cursor: pointer;
    color: #333;
    &>div{
      height: 60px;
      line-height: 60px;
      &>div{
        margin-left: 50px;
        text-align: left;
      };
    }
  }
}
.router-link-active{
  background:rgb(45, 140, 240);
  color: #fff;
}
</style>

