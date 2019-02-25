import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'

Vue.use(Vuex);

const types = {
  SET_LOGIN:"SET_LOGIN",
  SET_USER:"SET_USER"
}

const state = {
  isLogin:false,
  user:{},
  progress:0,
  actionName:'REALTIME',
  rePlay:false,
  office:{} //系统管理选中的office
}

const mutations = {
  [types.SET_LOGIN](state,isLogin){
    state.isLogin=isLogin
  },
  [types.SET_USER](state,user){
    if(user) state.user=user
    else state.user={}
  },
  SET_PROGRESS(state,data){
    state.progress=data
  },
  SET_OFFICE(state,data){
    state.office=data
  },
  SET_REPLAY(state,data){
    state.rePlay=data
  },
  SET_ACTION_NAME(state,data){
    state.actionName=data
  }
}

const actions = {
  //设置登录状态
  setLogin:({commit},isLogin)=>{
    commit(types.SET_LOGIN,isLogin)
  },
  //设置用户信息
  setUser:({commit},user)=>{
    commit(types.SET_USER,user)
  },
  setProgress:({commit},data)=>{
    commit('SET_PROGRESS',data)
  },
  //
  setOffice:({commit},data)=>{
    commit('SET_OFFICE',data)
  },
  setRePlay:({commit},data)=>{
    commit('SET_REPLAY',data)
  },
  setActions:({commit},data)=>{
    commit('SET_ACTION_NAME',data)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: vuexModules
})
