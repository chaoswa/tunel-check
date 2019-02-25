import http from '@/util/http'
const Qs = require('qs');

//部门树
export function officeTree() {
  let url= '/api/admin/office/tree'
  return http.get(url)
}

//巡检人员查询
export function personList(officeId="") {
  let url= '/api/admin/office/list'
  let data = {
    officeId
  }
  return http.post(url,data)
}

//添加巡检人员
export function addPerson(data) {
  let url= '/api/admin/office/employee/save'
  return http.post(url,data)
}
//删除巡检人员
export function deletePerson(list) {
  return http({
    url: '/api/admin/office/employee/delete',
    method: 'POST',
    data:list,
    headers:{
      'Content-Type':'application/json'
    }
  })
}

//巡检终端查询
export function deviceList(deviceType="",keyWord="") {
  let url= '/api/lbs/device/list'
  let data = {
    deviceType,
    keyWord
  }
  return http.post(url,data)
}

//巡检终端查询
export function deviceSave(data) {
  let url= '/api/lbs/device/save'
  return http.post(url,data)
}

//删除终端
export function deleteDevice(list) {
  return http({
    url: '/api/lbs/device/delete',
    method: 'POST',
    data:list,
    headers:{
      'Content-Type':'application/json'
    }
  })
}

//车辆查询
export function carList(carNumber="",carType="") {
  let url= '/api/lbs/car/list'
  let data = {
    carNumber,
    carType
  }
  return http.post(url,data)

}

//车辆保存
export function saveCar(data) {
  let url= '/api/lbs/car/save'
  return http.post(url,data)
}

//删除车辆
export function deleteCar(list) {
  return http({
    url: '/api/lbs/car/delete',
    method: 'POST',
    data:list,
    headers:{
      'Content-Type':'application/json'
    }
  })
}

//可用终端查询
export function findNotAssign() {
  let url= '/api/lbs/device/findNotAssign'
  let data = {}
  return http.post(url,data)
}