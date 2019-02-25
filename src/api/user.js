import http from '@/util/http'

// 登录
export function userLogin(username, password) {
    let url= '/api/auth/jwt/token'
    let data = {
      username,
      password
    };
    return http.post(url,data)
}

// 修改密码
export function modifyPwd(oldPwd, newPwd) {
  let url= '/api/admin/user/front/modifyPwd'
  let data = {
    oldPwd,
    newPwd
  };
  return http.post(url,data)
}

//所属部门和车辆信息树
export function personTree(keyWord="") {
  let url= '/api/admin/user/front/tree/officeAndCar'
  let data = {
    keyWord
  };
  return http.post(url,data)
}