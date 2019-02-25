const state = {
  allDevice:[], //所以设备信息
  device:{},
  pointsList:[],
  personTree:[],
  linePer:{},
  entityName:''
}

const mutations = {
  GET_ALL_DEVICE(state,data){
    state.allDevice=data
  },
  GET_DEVICE(state,data){
    state.device=data
  },
  GET_POINTS_LIST(state,data){
    state.pointsList=data
  },
  GET_PERSON_TREE(state,data){
    state.personTree=data
  },
  GET_LINE_PER(state,data){
    state.linePer=data
  },
  GET_ENTITYNAME(state,data){
    state.entityName=data
  },
};


const actions = {
  getAllDevice:({commit},data)=>{
    commit('GET_ALL_DEVICE',data)
  },
  getDevice:({commit},data)=>{
    commit('GET_DEVICE',data)
  },
  getPointsList:({commit},data)=>{
    commit('GET_POINTS_LIST',data)
  },
  getPersonTree:({commit},data)=>{
    commit('GET_PERSON_TREE',data)
  },
  getLinePer:({commit},data)=>{
    commit('GET_LINE_PER',data)
  },
  setEntityName:({commit},data)=>{
    commit('GET_ENTITYNAME',data)
  }
};


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
