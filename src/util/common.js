import { Loading } from 'element-ui'

/* 判断浏览器和设备的类型方法 */
export const browser = {
  version: function() {
      const userAgent = navigator.userAgent;
      return {
          /* 判断是否是ios */
          ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          /* 判断是否是Android */
          android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1,

          /* 判断是否是移动端 */
          mobilePhone: !!userAgent.match(/AppleWebKit.*Mobile.*/),

          /* IE内核 */
          trident: userAgent.indexOf('Trident') > -1,
          /* opera内核 */
          presto: userAgent.indexOf('Presto') > -1,
          /* 苹果、谷歌内核 */
          webkit: userAgent.indexOf('AppleWebKit') > -1,
          /* 火狐内核 */
          gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1,


          /* 判断是否是IPone手机或者QQHD浏览器 */
          iphone: userAgent.indexOf('iPhone') > -1,
          /* 判断是否是iPad */
          iPad: userAgent.indexOf('iPad') > -1,

          /* 判断是否是web应用程序(能够让用户完成某些特定任务的网站)，没有头部和底部 */
          webApp: userAgent.indexOf('Safari'),
          /* 是否是微信 */
          weixin: userAgent.indexOf('MicroMessenger'),
          /* QQ */
          QQ: userAgent.match(/\sQQ/i) == ' qq',
     }
  }(),
  /* 判断浏览器使用的语言:navigator.language除IE浏览器外的浏览器使用的语言， 
   * navigator.browserLanguageIE浏览器使用的语言 
   */
  browserLanguage: (navigator.language || navigator.browserLanguage).toLowerCase()
};


/* 判断是否为空值得方法 */
export function isEmpty(value){
  return (
    value===undefined || value===null || 
    (typeof value ==="object" && Object.keys(value).length===0) ||
    (typeof value ==="string" && value.trim().length===0) 
  )
}

// 判断两个定位点与x轴的夹角
export function getAngle(start,end){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
  let px= start.lng;
  let py=start.lat;
  let mx= end.lng;
  let my=end.lat;
  var x = Math.abs(px-mx);
  var y = Math.abs(py-my);
  var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
  var cos = y/z;
  var radina = Math.acos(cos);//用反三角函数求弧度
  var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

  if(mx>px&&my>py){//鼠标在第四象限
    angle = 180 - angle;
  }

  if(mx==px&&my>py){//鼠标在y轴负方向上
    angle = 180;
  }

  if(mx>px&&my==py){//鼠标在x轴正方向上
    angle = 90;
  }

  if(mx<px&&my>py){//鼠标在第三象限
    angle = 180+angle;
  }

  if(mx<px&&my==py){//鼠标在x轴负方向
    angle = 270;
  }

  if(mx<px&&my<py){//鼠标在第二象限
    angle = 360 - angle;
  }
  return angle;
}


//请求时的加载动画
let loading
export function startLoading(){
  loading=Loading.service({
    text:'拼命加载中...',
    fullscreen: false,
    background:'rgba(225, 225, 225, 0)'
  })
}
export function endLoading() { 
  loading.close();
}
//时间戳和时间格式转换
export function formatDate(timestamp) {
  var date = new Date(timestamp);
  let Y = date.getFullYear();
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}
