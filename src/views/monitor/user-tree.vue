<template>
  <bm-control class="user-tree"  :offset="offset">
    <div class="user-btn" :class="{'btn-new':show,'btn-old':!show}"  @click.stop="showBox"></div>

    <transition name="el-zoom-in-top">
      <div class="left-boxs" v-show="show">
        <ul class="list-top">
          <li @click.stop="autoPlay" style="border-top-left-radius: 5px; border-right: 1px solid #5470f3;">
            <img src="../../assets/images/icon03.png" class="img-icon" v-show="isPlay">
            <img src="../../assets/images/icon11.png" class="li-left">
            实时监控
          </li>
          <li @click.stop="returnPlay" style="border-top-right-radius: 5px;">
            <img src="../../assets/images/icon03.png" class="img-icon" v-show="!isPlay">
            <img src="../../assets/images/icon12.png" class="li-left">
            轨迹回放
          </li>
        </ul>
        <div class="tree">
          <div class="tree-top"><img src="../../assets/images/icon25.png"><span>绍兴昆仑燃气</span></div>
          <el-tree :data="options" @node-click="userClick" node-key="label" ref="positionTree" class="tree-item">
            <span class="custom-tree-node" slot-scope="{ node, data }" >
              <div :class="data.className"></div>
              <div class="tree-txt">
                <span class="status-tree">{{node.label}}</span>
                <div class="all-date" v-if="data.parentId==-1&&isPlay">查看全部</div>
                <span v-if="!data.officeName">{{data.active?'在线':'离线'}}</span>
              </div>
            </span>
          </el-tree>
        </div>
        <!-- <div class="tree" v-show="!isPlay">
          <div class="tree-top"><img src="../../assets/images/icon25.png"><span>绍兴昆仑燃气</span></div>
          <el-tree :data="options"  @node-click="playLine"   ref="playTree" class="tree-item">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div :class="data.className"></div>
              <div class="tree-txt">
                <span class="status-tree">{{node.label}}</span>
                <span v-if="!data.officeName">{{data.active?'在线':'离线'}}</span>
              </div>
            </span>
          </el-tree>
        </div> -->
      </div>
    </transition>
  </bm-control>
</template>

<script>
import {isEmpty} from '@/util/common'
import {personTree} from '@/api/user';
import {getLocation,getActive,getOutDevice} from '@/api/map';

export default {
  name: 'userTree',
  data() {
    return {
      isPlay:true,
      show:false,
      expand:true,
      options:[],
      offset:{width: 20, height: 20},
      allDevice:[],
      newLocation:[]
    };
  },
  methods: {
    //设置定时器实时获取树状节点
    intervalGetPersonTree(){
      let that =this;
      if(that.treeInterVal) clearInterval(that.treeInterVal);
      that.getPersonTree();
      that.treeInterVal=setInterval(async()=>{
        let allDevice=that.$store.state.map.allDevice;
        let activeList=await that.interValLinePerson(allDevice)
        // console.log('在线人员',activeList)
        this.changeTreeInfo(activeList);
        // this.changePlayInfo(activeList);
      },10000)
    },
    //获取树状节点
    getPersonTree(){
      let that=this;
      this.allDevice=[];
      personTree().then(({status,data})=>{
        if(status==200){   
          that.options=that.initPersonOrCar(data);
          // console.log('人员车辆树',this.options);  
        }else{
          that.options=[];
        }
      })
    },
    //展开所有节点
    expandTree(){
      for(var i=0;i<this.$refs.playTree.store._getAllNodes().length;i++){
        this.$refs.playTree.store._getAllNodes()[i].expanded=this.expand;
      }
    },
    userClick(data){
      this.isPlay?this.handleNodeClick(data):this.playLine(data)
    },
    //点击人员树，获取信息
    handleNodeClick(data) {
      // console.log(data)
      this.$emit('deviceLocation',data)
    },
    //点击播放轨迹
    playLine(data){
      // console.log(data);
      if(data.officeName) return;
      this.$emit('playLocation',data);
    },

    //点击树状列表显示隐藏
    showBox(){
      this.show=!this.show;
      this.$emit('outProgress')
    },

    //初始化人员车辆树的数据结构
    initPersonOrCar(array){
      array.forEach((item) => {
        if(item.officeName){
          Object.assign(item, {
            className:'group-class',
            label:item.officeName,
          })
          let userList=item.userList.filter((val)=>{
            return val.id!='';
          })

          userList.forEach((val)=>{
            this.getActivePerson(val,item);
          });

          let carList=item.carList.filter((val)=>{
            return val.carId!='';
          })

          carList.forEach((val)=>{
            this.getActiveCar(val,item);
          });
          
          let list = userList.concat(carList);
          item.children = item.children.concat(list);
          this.allDevice=this.allDevice.concat(list);
          //保存所有设备信息
          this.$store.dispatch('map/getAllDevice',this.allDevice);

          delete item.carList
          delete item.userList
          if(item.children.length>0){
            item.children=this.initPersonOrCar(item.children);
          }
        }
      });
      return array
    },

    //在线和离线数据格式化
    initActiveOrOut(datas,arr,status){
      let arrayList=[];
      datas.forEach(item=>{
        let list=false
        arr.forEach(value=>{
          if(value.deviceSid == item.entity_name){
            value.isBiGua=false
            list=value
          }
          if(value.armSid == item.entity_name){
            value.isBiGua=status=='active'?true:false
            list=value
          }
        })
        if(!list) return;
        let data = Object.assign({},list);
        if(status=='active'){
          let user = Object.assign(data,{
            active:true,
            lng:item.latest_location.longitude,
            lat:item.latest_location.latitude,
            loc_time:item.latest_location.loc_time,
            latest_location:item.latest_location,
            className:item.carId?'active-car':'active-user'
          })
          let index = arrayList.findIndex(item=>item.label==user.label)
          if(index>=0) {
            arrayList.splice(index,1,user)
          }else{
            arrayList.push(user);
          };
        }else{
          let user = Object.assign(data,{
            active:false,
            lng:item.latest_location.longitude,
            lat:item.latest_location.latitude,
            loc_time:item.latest_location.loc_time,
            latest_location:item.latest_location,
            className:item.carId?'out-car':'out-user'
          })
          let index = arrayList.findIndex(item=>item.label==user.label)
          if(index>=0 && arrayList[index].latest_location<item.latest_location) {
            arrayList.splice(index,1,user)
          }
          if(index<0){
            arrayList.push(user);
          };
        }
      })
      return arrayList;
    },

    //定时获取在线人员
    async interValLinePerson(arr){
      let list = [];
      let out=[];
      let all=[];
      let timestamp =parseInt( (new Date().getTime() / 1000)-60);
      let res= await getActive(timestamp)
      let activeList = res.status==0?res.entities:[];
      list=this.initActiveOrOut(activeList,arr,'active');
      let resOut= await getOutDevice(timestamp)
      let resOutList = resOut.status==0?resOut.entities:[];
      out=this.initActiveOrOut(resOutList,arr,'out');
      all = list.concat(out);
      // console.log(list)
      //  console.log(out)
      let newList=arr.map(item=>{
        let data=all.filter(value=>{
          return item.label==value.label
        })
        if(data.length){
          return data[0]
        }else{
          return item
        }
      })
      //实时刷新设备在地图上的位置
      if(!this.$store.state.rePlay){
        this.$emit('setNewPosition',newList);
      }
      return list
    },

    //动态改变树形控件在线位置数据
    changeTreeInfo(arr){
      if(!this.$refs.positionTree) return;
      let list = this.$refs.positionTree.data[0].children;
      list.forEach((item,index)=>{
        if(item.officeName){
          let children = item.children;
          children.forEach((child,i)=>{
            let user = Object.assign({},child);

            if(!arr.length){
              child.active=false 
              child.className=child.carId?'out-car':'out-user' 
              return;
            }

            let indexChild = arr.findIndex((value)=>{
              return value.label==child.label
            })
            
            if(indexChild>=0){
              // this.$refs.positionTree.remove(child)
              // this.$refs.positionTree.append(Object.assign(user,{
              //   active:true,
              //   isBiGua:arr[indexChild].isBiGua,
              //   className:child.carId?'active-car':'active-user'
              // }),children)
              // child.active=true 
              // child.className=child.carId?'active-car':'active-user' 
              // child.isBiGua=arr[indexChild].isBiGua
              children.splice(i,1,Object.assign(user,{
                active:true,
                isBiGua:arr[indexChild].isBiGua,
                className:child.carId?'active-car':'active-user'
              }))
            }else{
              // this.$refs.playTree.remove(child)
              // this.$refs.playTree.append(Object.assign(user,{
              //   active:false,
              //   className:child.carId?'out-car':'out-user' 
              // }),children)
              child.active=false 
              child.className=child.carId?'out-car':'out-user' 
            }
          })
        }else{
          let indexFrist = arr.findIndex((value,i)=>{
            return value.label==item.label
          })
          if(indexFrist>=0){
            item.active=true
            item.className=item.carId?'active-car':'active-user'
          }else{
            item.active=false
            item.className=item.carId?'out-car':'out-user'
          }
        }
      })
    },
    //动态改变树形控件回放在线人员数据
    changePlayInfo(arr){
      if(!this.$refs.playTree) return;
      let list = this.$refs.playTree.data[0].children;
      list.forEach((item,index)=>{
        if(item.officeName){
          let children = item.children;
          children.forEach((child,i)=>{
            let user = Object.assign({},child);

            if(!arr.length){
              child.active=false 
              child.className=child.carId?'out-car':'out-user' 
              return;
            }

            let indexChild = arr.findIndex((value,i)=>{
              return value.label==child.label
            })

            if(indexChild>=0){
              // child.active=true 
              // child.className=child.carId?'active-car':'active-user' 
              // child.isBiGua=arr[indexChild].isBiGua
              // this.$refs.playTree.remove(child)
              // this.$refs.playTree.append(Object.assign(user,{
              //   active:true,
              //   isBiGua:arr[indexChild].isBiGua,
              //   className:child.carId?'active-car':'active-user'
              // }),children)
              children.splice(i,1,Object.assign(user,{
                active:true,
                isBiGua:arr[indexChild].isBiGua,
                className:child.carId?'active-car':'active-user'
              }))
            }else{
              // this.$refs.playTree.remove(child)
              // this.$refs.playTree.append(Object.assign(user,{
              //   active:false,
              //   className:child.carId?'out-car':'out-user' 
              // }),children)
              child.active=false 
              child.className=child.carId?'out-car':'out-user' 
            }
          })
        }else{
          let indexFrist = arr.findIndex((value,i)=>{
            return value.label==item.label
          })
          if(indexFrist>=0){
            item.active=true
            item.className=item.carId?'active-car':'active-user'
          }else{
            item.active=false
            item.className=item.carId?'out-car':'out-user'
          }
        }
      }) 
    },
    //获取在线人员
    getActivePerson(val,item){
      let entity_name=val.deviceSid;
      getLocation(entity_name).then(res=>{
        if(res.status==0){
          let latest_location = res.latest_point;
          let time = latest_location.loc_time;
          Object.assign(val, {
            className:this.getOnlineStatus(time)?'active-user':'out-user',
            label:val.name,
            office:item.officeName,
            active:this.getOnlineStatus(time)
          },{
            "lng":latest_location.longitude,
            "lat":latest_location.latitude
          },latest_location)
        }else{
          Object.assign(val, {
            className:'out-user',
            label:val.name,
            office:item.officeName,
            active:false
          })
        }
      })
    },
    //获取在线车辆
    getActiveCar(val,item){
      let entity_name=val.deviceSid;
      getLocation(entity_name).then(res=>{
        if(res.status==0){
          let latest_location = res.latest_point;
          let time = latest_location.loc_time;
          Object.assign(val, {
            className:this.getOnlineStatus(time)?'active-car':'out-car',
            label:val.carNumber,
            office:item.officeName,
            active:this.getOnlineStatus(time)
          },{
            "lng":latest_location.longitude,
            "lat":latest_location.latitude
          },latest_location)
        }else{
          Object.assign(val, {
            className:'out-car',
            label:val.carNumber,
            office:item.officeName,
            active:false
          })
        }
      })
    },
    /**
   * 判断当前设备是否在线，规则是最后上传的轨迹点
   * 时间在当前系统时间五分钟内判断为在线，否则为离线
   */
    getOnlineStatus(time) {
      var status = 0;
      var timestamp =parseInt( new Date().getTime() / 1000);
      var timeDiff = ((timestamp - time) /60).toFixed(1);
      status = timeDiff >= 2 ? false : true;
      return status;
    },
    autoPlay(){
      this.isPlay=true
      this.$store.dispatch('setActions','REALTIME');
      this.$emit('showProgress',this.isPlay)
    },
    returnPlay(){
      this.isPlay=false
      this.$store.dispatch('setActions','REPLAY');
      // this.expandTree()
      this.$emit('showProgress',this.isPlay)
    },
  },
  mounted(){
    this.intervalGetPersonTree();
  },
  destroyed(){
    if(this.treeInterVal) clearInterval(this.treeInterVal);
  }
}
</script>

<style lang="less">
.el-tree-node__content{
  height: 34px;
}
.user-tree{
  position: relative;
}
.user-btn{
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  transition: all .5s ease;
}
.btn-new{
  background: url('../../assets/images/icon06.png') no-repeat;
  background-size:100% 100%;
}
.btn-old{
  background: url('../../assets/images/icon07.png') no-repeat;
  background-size:100% 100%;
}
.tree-top{
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 14px;
  margin-top: 15px;
  color: #333;
  width: 100%;
  &>img{
    width: 14px;
    height: 14px;
    margin: 0 5px;
  }
}
.tree{
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 515px;
  overflow-x: hidden;
  overflow-y: auto;
}
.tree-item{
  width: 80%;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  background: transparent;
}
.left-boxs{
  position: absolute;
  left: 100px;
  top: 0;
  height: 560px;
  width: 320px;
  border-radius: 5px;
  background: #f9fcff;
  box-shadow:0px 0px 1px #000;
}
.list-top{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  background: #607df5;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  &>li{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    height: 30px;
    cursor: pointer;
  }
}
.li-left{
  width: 14px;
  height: 16px;
  margin-right: 5px;
}
.list-top>.play-active{
  background: rgb(0, 0, 255);
}
.img-icon{
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: -10px;
  left: 70px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tree-txt{
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 150px;
  height: 15px;
  line-height: 15px;
}
.all-date{
  position: absolute;
  right:-50px;
  font-size: 12px;
  color: #333;
}
.group-class{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon08.png') no-repeat;
  background-size:100% 100%;
}
.child-person{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon09.png') no-repeat;
  background-size:100% 100%;
}
.active-car{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon10.png') no-repeat;
  background-size:100% 100%;
}
.out-car{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon27.png') no-repeat;
  background-size:100% 100%;
}
.active-user{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon26.png') no-repeat;
  background-size:100% 100%;
}
.out-user{
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: url('../../assets/images/icon09.png') no-repeat;
  background-size:100% 100%;
}
.el-tree-node__content:hover{
  background-color: #ececec;
}
.el-tree-node:focus>.el-tree-node__content{
  background-color: #ececec;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

