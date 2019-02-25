<template>
  <div id="app" @click="clicked">
    <router-view/>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import {isEmpty} from '@/util/common'
import {locationTime} from '@/config/config'

export default {
  name: 'myApp',
  data () {
    return {
      lTime: new Date().getTime(), // 最后一次点击的时间
      ctTime: new Date().getTime(), //当前时间
      tOut: 1000*60*30   //超时时间30分钟
    }
  },
  methods: {
    clicked () {
      this.lTime = new Date().getTime()  //当界面被点击更新点击时间
    }
  },
  created(){
    if(this.timer) clearInterval(this.timer);
    this.timer=setInterval(()=>{
      this.cTime = new Date().getTime()
      let current = this.cTime-this.lTime;
      if(current>this.tOut) { 
        this.$message.error('token失效,请重新登录')
        //清除token
        localStorage.removeItem('eleToken')
        //跳转到登录
        this.$router.push('/login')
        clearInterval(this.timer)
      }
    },1000)
  },
  mounted(){
    
    const token =localStorage.eleToken || false;

    if(!token) return;
    //解析token
    const decode= jwt_decode(token);
    
    //token存储到vuex
    this.$store.dispatch('setLogin',!isEmpty(decode))
    this.$store.dispatch('setUser',decode)

  }
}
</script>

<style lang="less">
html,body{
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
