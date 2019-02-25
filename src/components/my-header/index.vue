<template>
  <div class="header-top">
    <div style="width:400px;">
      <div class="left">
        <img class="icon" src="../../assets/images/icon05.png">
        <ul class="title">
          <li>燃 气 管 线 智 慧 巡 检 平 台</li>
          <li class="txt">Intelligent inspection of gas pipeline cloud platform</li>
        </ul>
      </div>
    </div>
    <div style="width:600px;">
      <ul class="right">
        <li v-for="(item,index) in tabs" class="right-item" :class="{'active-item':currentIndex==index}" :key="index" @click="goTabPath(index,item)">
          <img :src="item.icon" class="right-icon" :class="{'report-icon':index==1,'manage-icon':index==2}" v-show="currentIndex!=index">
          <img :src="imgs[index]" class="right-icon" :class="{'report-icon':index==1,'manage-icon':index==2}" v-show="currentIndex==index">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'myHeader',
  components: {
  },
  data () {
    return {
      currentIndex:0,
      tabs:[
        {name:'综合监控',path:'/home/monitor',icon:require('../../assets/images/icon18.png')},
        {name:'巡检管理',path:'/home/report',icon:require('../../assets/images/icon14.png')},
        // {name:'统计分析',path:'/home/analysis',icon:require('../../assets/images/icon15.png')},
        {name:'系统管理',path:'/home/manage',icon:require('../../assets/images/icon16.png')},
      ],
      imgs:[
        require('../../assets/images/icon13.png'),
        require('../../assets/images/icon19.png'),
        // require('../../assets/images/icon20.png'),
        require('../../assets/images/icon17.png')
      ]
    }
  },
  methods: {
    goTabPath(index,item){
      this.currentIndex=index;

      this.$router.push(item.path)
    },
    changeCurrent(num){
      this.currentIndex=num
    }
  }
}
</script>

<style lang="less" scoped>
.header-top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.left{
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
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
.icon{
  width: 47px;
  height: 42px;
  margin-left: 30px;
}
.title{
  margin-left: 10px;
  font-size: 20px;
  color: #333;
}
.txt{
  font-size: 10px;
  padding-top: 2px;
}
.right-item{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  cursor: pointer;
  box-sizing: border-box;
  border-bottom: 2px solid #fff;
}
.active-item{
  border-bottom: 2px solid #607df5;
  color: #607df5;
}
.right-icon{
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.report-icon{
  width: 23px;
  height: 19px;
}
.manage-icon{
  width: 19px;
  height: 19px;
}
</style>

