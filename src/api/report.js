import http from '@/util/http'

//巡检记录
export function recordList(data) {
  let url= '/api/lbs/check/record/list'
  return http.post(url,data)
}

//阀井任务分配保存
export function saveValve(data) {
  let url= '/api/lbs/valve/assign/save'
  return http.post(url,data)
}

//阀井删除
export function deleteValve(id) {
  let url= '/api/lbs/valve/assign/delete'
  let data = {
    "valveId":id
  }
  return http.post(url,data)
}

//管线任务分配保存
export function savePipeline(data) {
  let url= '/api/lbs/pipeline/assign/save'
  return http.post(url,data)
}

//管线删除
export function deletePipeline(id) {
  let url= '/api/lbs/pipeline/assign/delete'
  let data = {
    "pipelineId":id
  }
  return http.post(url,data)
}
