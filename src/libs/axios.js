import axios from 'axios';
// import config from '@/config';
// import {Modal} from 'iview'; // Modal 全局弹窗框
// let base = config.gateway;
// import store from '@/store';
// import { Spin } from 'iview';
class HttpRequest {
  constructor (baseUrl = '/') {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
      }
    };
    return config;
  }
  destroy (url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // if (url !== `${base}/authorize/login` && url !== `${base}/authorize/refreshToken`) {
      //   config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('accessToken');
      // }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      return config;
    }, error => {
      return Promise.reject(error);
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url);
      const { data, status } = res;
      return { data, status };
    }, error => {
      this.destroy(url);
      // if (error.response.status === 401) {
      //   // 返回 401 清除token信息并跳转到登录页面
      //   sessionStorage.removeItem('accessToken');
      //   sessionStorage.removeItem('refreshToken');
      //   Modal.error({
      //     title: '警告',
      //     content: '用户名或密码错误'
      //   });
      //   this.$router.replace({ path: 'login' });
      // };
      // 拦截500报错
      // if (error.response.status === 500) {
      //   Modal.error({
      //     title: '错误',
      //     content: '系统出现错误,操作失败！'
      //   });
      // }
      return Promise.reject(error);
    });
  }
  request (options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
