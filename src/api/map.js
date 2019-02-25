import http from '@/util/http'

// const AK = 'Bg8vjzYCUouhe4lGEQj0qd0X2lqMEm1o'
// const SERVICE_ID = '208211'
const AK = '2IWuotDxpEfAbXXYC8t40DjqBIrHPF1X'
const SERVICE_ID = '208620'

//获取轨迹接口
export function getTrack(entity_name="863846021897220",start_time="1545896728",end_time="1545898728",page="1"){
    return http({
        url: '/app/track/gettrack',
        method: 'GET',
        params: {
            ak:AK,
            service_id:SERVICE_ID,
            entity_name,
            start_time,
            end_time,
            is_processed:1,
            process_option:'need_denoise=1,radius_threshold=20,need_vacuate=1,need_mapmatch=1',
            supplement_mode:'no_supplement',
            page_index:page,
            page_size:1000
        },
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

//获取实时位置
export function getLocation(entity_name="863846021897220"){
    let currentTime=new Date().getTime() / 1000;
    return http({
        url: '/app/track/getlatestpoint',
        method: 'GET',
        params: {
            ak:AK,
            service_id:SERVICE_ID,
            entity_name,
            time:currentTime
        },
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

//查询是否在线
export function getActive(time){
    let currentTime=new Date().getTime() / 1000;
    return http({
        url: '/app/entity/list',
        method: 'GET',
        params: {
            ak:AK,
            service_id:SERVICE_ID,
            filter:`active_time:${time}`,
            t:currentTime
        },
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
//查询是否在线
export function getOutDevice(time){
    let currentTime=new Date().getTime() / 1000;
    return http({
        url: '/app/entity/list',
        method: 'GET',
        params: {
            ak:AK,
            service_id:SERVICE_ID,
            filter:`inactive_time:${time}`,
            t:currentTime
        },
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

//整体巡检进度
export function progressCheck(officeId="") {
    let url= '/api/lbs/check/progress'
    let data = {
        officeId,   //巡检班组
    };
    return http.post(url,data)
}

//阀井任务分配查询
export function valveList(valveType="",officeId="",keyWord="") {
    let url= '/api/lbs/valve/assign/list'
    let data = {
        valveType,   //阀井类型 球阀:01,闸阀:02
        officeId,   //巡检班组
        keyWord	//关键词
    };
    return http.post(url,data)
}

//管线任务分配查询
export function pipelineList(officeId="",keyWord="") {
    let url= '/api/lbs/pipeline/assign/list'
    let data = {
        officeId,   //巡检班组
        keyWord	//关键词
    };
    return http.post(url,data)
}