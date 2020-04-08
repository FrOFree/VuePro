import Vue from 'vue';
import Vuex from 'vuex';

import user from './module/user';
import app from './module/app';
// import loading from './module/loading'
import Fingerprint2 from 'fingerprintjs2';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    localKey: '1'
  },
  mutations: {
    setToken(state,token){
      state.token =token;
      localStorage.setItem("token",token.token);
    },
    disToken(state,token){
      state.token = '';
      localStorage.removeItem("token");
    },
    initLocalKey(state){
      
      let res = Fingerprint2.get(function (components) {
        // console.log(components) // an array of components: {key: ..., value: ...}
        let values = components.map(function (component) { return component.value });
        let murmur = Fingerprint2.x64hash128(values.join(''), 31);
        console.log(murmur);//在这里就是打印的浏览器指纹
      });
      state.localKey = res;
      return '1';
    }
  },
  actions: {
    //
  },
  modules: {
    user,
    app
    // loading
  }
});
