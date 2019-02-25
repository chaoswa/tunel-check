<template>
  <div class="slider" ref="slider" @click="progressClick" @mousemove="progressMove" @mouseenter="enter" @mouseleave="leave">
    <div class="process" :style="{width}"></div>
    <div class="thunk" ref="trunk" :style="{left}">
      <div class="block"></div>
    </div>
    <div class="pro-time" v-show="isEnter" ref="timeMsg">
      {{time}}
      <div class="time-row"></div>
    </div>
  </div>
</template>

<script>
const ALL_TIME = 60*60*24;
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      min:0,
      max:100,
      isEnter:false,
      slider:null,        //滚动条DOM元素
      thunk:null,         //拖拽DOM元素
      per:0,     //当前值
      time:'00:00'
    }
  },
  methods: {
    enter(){
      this.isEnter=true
    },
    leave(){
      this.isEnter=false
    },
    progressClick(e){
      const rect = this.$refs.slider.getBoundingClientRect()
      const offsetWidth =Math.min(this.$refs.slider.clientWidth, Math.max(0, e.x - rect.left))
      var scale = offsetWidth / this.slider.offsetWidth;
      this.per = ((this.max - this.min) * scale + this.min).toFixed(3);
      this.per = Math.max(this.per,this.min);
      this.per = Math.min(this.per,this.max);
      this.$emit('sendProgerss',this.per);
    },
    progressMove(e){
      if(!this.isEnter) return;
      const rect = this.$refs.slider.getBoundingClientRect()
      const offsetWidth =Math.min(this.$refs.slider.clientWidth, Math.max(0, e.x - rect.left))
      var scale = offsetWidth / this.slider.offsetWidth;
      let per = ((this.max - this.min) * scale + this.min).toFixed(3);
      per = Math.max(per,this.min);
      per = Math.min(per,this.max);
      this.$refs.timeMsg.style.left=`${per}%`;
      let time = per*0.01*ALL_TIME
      this.timeInit(time);
    },
    timeInit(time){
      let h = Math.floor(time/(60*60));
      let m = Math.floor((time-h*60*60)/60);
      let hh = h<10?`0${h}`:h;
      let mm = m<10?`0${m}`:m;
      this.time=`${hh}:${mm}`;
    }
  },
  mounted(){
    this.slider = this.$refs.slider;
    this.thunk = this.$refs.trunk;
    var _this = this;
    this.thunk.onmousedown = function (e) {
        var width = parseInt(_this.width);
        var disX = e.clientX;
        document.onmousemove = function(e){
            // value, left, width
            // 当value变化的时候，会通过计算属性修改left，width

            // 拖拽的时候获取的新width
            var newWidth = e.clientX - disX + width;
            // 拖拽的时候得到新的百分比
            var scale = newWidth / _this.slider.offsetWidth;
            _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min);
            _this.per = Math.max(_this.per,_this.min);
            _this.per = Math.min(_this.per,_this.max);
        }
        document.onmouseup = function(){
          _this.$emit('sendProgerss',_this.per);
          document.onmousemove = document.onmouseup = null;
        }
      return false;
    }
  },
  computed:{
    scale(){
      return (this.per - this.min) / (this.max - this.min);
    },
    width(){
      if(this.slider){
        return this.slider.offsetWidth * this.scale + 'px';
      }else{
        return 0 + 'px'
      }
    },
    left(){
      if(this.slider){
        return this.slider.offsetWidth * this.scale -  this.thunk.offsetWidth/2  + 'px';
      }else{
        return 0 + 'px'
      }
    }
  },
  watch:{
    value(newPercent) {  //当前值
      newPercent>this.max?this.per=100:this.per=newPercent;
    }
  }
}
</script>

<style lang="less" scoped>
  .slider{
    position:relative;
    margin:20px 0;
    width:95%;
    height:10px;
    // background:#e4e7ed;
    border-radius:5px;
    cursor:pointer
  }
  .slider .process{
    position:absolute;
    left:0;
    top:0;
    width:112px;
    height:10px;
    border-radius:5px;
    // background:#4a6afb
  }
  .slider .thunk{
    position:absolute;
    left:100px;
    top:-5px;
    width:20px;
    height:20px
  }
  .slider .block{
    width:15px;
    height:15px;
    border-radius:50%;
    border:2px solid #4a6afb;
    background:rgba(255,255,255,1);
    transition:.2s all
  }
  .slider .tips{
    position:absolute;
    left:-7px;
    bottom:30px;
    min-width:15px;
    text-align:center;
    padding:4px 8px;
    background:#000;
    border-radius:5px;
    height:24px;
    color:#fff
  }
  .slider .tips i{
    position:absolute;
    margin-left:-5px;
    left:50%;
    bottom:-9px;
    font-size:16px;
    color:#000
  }
  .slider .block:hover{
    transform:scale(1.1);opacity:.6
  }
  .pro-time{
    position: absolute;
    width: 40px;
    height: 20px;
    margin-left: -17px;
    top: -49px;
    line-height: 20px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border-radius: 3px;
    background: rgba(0, 0, 0, .7);
  }
  .time-row{
    position: absolute;
    bottom: -9px;
    left: 12px;
    width:13px;
    height: 12px;
    background: url('../../assets/images/sanjiao.png') no-repeat;
    background-size:100% 100%;
    opacity: 0.7;
  }
</style>

