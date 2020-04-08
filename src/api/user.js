import axios from '@/libs/api.request';
import config from '@/config';
let gateway = config.gateway;
// export const getByNameBak = (params) =>{//测试查询
//   return axios.request({
//     url:'/user/name/'+params,
//     data: {},
//     method: 'get',
//     headers:{
//       'Content-type': 'application/x-www-form-urlencoded'
//     },
//   });
// };
export const getByName = (param) =>{//首页测试连接
  return axios.request({
    url:'/user/getName',
    params:{
      userId:param,
      passWord:'123456'
    },
    method: 'get',
  });
};
export const login = (param) =>{//登录
  console.log(param);
  return axios.request({
    url:'/user/VueLogin',
    data:param,
    method: 'post',
  });
};
// export const findByPage = (params) =>{//测试查询
//   return axios.request({
//     url:'/user/findByPage',
//     data: params,
//     method: 'post'
//   });
// };
// //在用
// export const getUserInfo = (params) => {
//   return axios.request({
//     url: '/user/getName',
//     data:params,
//     method: 'post'
//   });
// };

// export const updateById = (params => {
//   return axios.request({
//     url:'/user/updateUser',
//     data: params,
//     method: 'put'
//   });
// });

// export const deleteById = (params => {
//   return axios.request({
//     url:'/user/'+params,
//     data: {},
//     method: 'delete'
//   });
// });

// export const insert = (params => {
//   return axios.request({
//     url:'/user/insert',
//     data: params,
//     method: 'post'
//   });
// });