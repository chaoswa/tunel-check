import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import '@/assets/reset/reset.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {locationTime} from '@/config/config'
import '@/assets/fontIcon/iconfont.css'

Vue.use(ElementUI);

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap,{
  ak:"ViICnYek9o8z6zQRM5gYBF2KQrmpqiZd"
})

Vue.config.productionTip = false



router.beforeEach((to, from, next) => {
  let newTime = new Date().getTime();
  if(newTime-localStorage.curTime>locationTime) localStorage.removeItem('eleToken');
  const isLogin = localStorage.eleToken ? true : false;
  
  if (to.path == "/login") {
    next()
  }else if(to.path =="/register"){
    next()
  }else{
    isLogin ? next() : next({path: "/login", replace: true})
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
