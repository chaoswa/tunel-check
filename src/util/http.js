/**
 * axios全局配置，包括验证校验及错误处理
 */
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'


let CancelToken = axios.CancelToken; //取消重复请求
let cancel;

// 创建axios实例
const service = axios.create({
    // baseURL: apiConfig.baseURL // api的base_url
    // timeout: 5000 // 请求超时时间
});

// axios.defaults.timeout = 5000;
// http request 拦截器
//添加一个请求拦截器
service.interceptors.request.use(
    config => {

        //取消重复请求
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        })

        //token是否存在
        if(localStorage.eleToken){
            //设置token
            config.headers.Authorization = localStorage.eleToken;
        }

        return config
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
    response => {
        //获取错误状态码
        const {status}= response.data;
        if(status==40301){
            Message.error('token失效,请重新登录')
            //清除token
            localStorage.removeItem('eleToken')
            //跳转到登录
            router.push('/login')
        }
        return response.data;
    },
    error => {
        Message.error({
            message:error.response.statusText,
            center:true
        })

        //获取错误状态码
        const {status}= error.response;

        //如果token失效
        if(status==40301){
            Message.error('token失效,请重新登录')
            //清除token
            localStorage.removeItem('eleToken')
            //跳转到登录
            router.push('/login')
        }
        return Promise.reject(error);
    }
)


export default service