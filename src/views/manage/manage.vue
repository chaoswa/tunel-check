<template>
    <el-container class="manage">
      <el-aside width="210px">
        <div class="left-box">
          <ul class="manage-bar">
            <li><router-link tag="div"  to="/home/manage/teams"><div>组织机构管理</div></router-link></li>
            <li><router-link tag="div"  to="/home/manage/device"><div>巡检终端管理</div></router-link></li>
            <li><router-link tag="div"  to="/home/manage/car"><div>巡检车辆管理</div></router-link></li>
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
  name: 'manage',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted(){
    this.$emit('pageNum',2)
  }
}
</script>

<style lang="less" scoped>
.manage{
  width: 100%;
  height: 100%;
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
.manage-title{
  padding-top: 30px;
  padding-left: 30px;
  text-align: left;
}
.manage-bar{
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

