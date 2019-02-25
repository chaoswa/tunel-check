import http from '@/util/http'

//人员工作量统计
export function sumByWorkload(checkTime="") {
  let url= '/api/lbs/user/sumByWorkload'
  let data = {
    checkTime	 //巡检月份 “2019-01”
  }
  return http.post(url,data)
}

//阀井统计统计
export function sumByDo(checkTime="") {
  let url= '/api/lbs/valve/sumByDo'
  let data = {
    checkTime	 //巡检月份 “2019-01”
  }
  return http.post(url,data)
}
//管线统计统计
export function pipSumByDo(checkTime="") {
  let url= '/api/lbs/pipeline/sumByDo'
  let data = {
    checkTime	 //巡检月份 “2019-01”
  }
  return http.post(url,data)
}

//阀井故障统计
export function sumByMatters(beginTime,endTime) {
  let url= '/api/lbs/valve/sumByMatters'
  let data = {
    beginTime,    //起始月份  2018-01-01
		endTime,	//截止月份 2018-12-31
  }
  return http.post(url,data)
}
//阀井故障统计
export function pipSumByMatters(beginTime,endTime) {
  let url= '/api/lbs/pipeline/sumByMatters'
  let data = {
    beginTime,    //起始月份  2018-01-01
		endTime,	//截止月份 2018-12-31
  }
  return http.post(url,data)
}
