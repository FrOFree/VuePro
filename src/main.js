// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import './index.less';
// import './components/transfer/style.css';
import '@/assets/icons/iconfont.css';
import {Inspector} from './assets/js/DataInspector.js';

import {successFun} from '@/libs/tools.js';
import {getDicList, getDicLabel} from '@/libs/util.js';
import Format from '@/libs/format.js';// 全局校验文件

Vue.prototype.Inspector = Inspector;
Vue.prototype.$successFun = successFun;
Vue.prototype.$getDicList = getDicList;
Vue.prototype.$getDicLabel = getDicLabel;
Vue.prototype.$Format = Format;// 全局校验文件挂载在Vue上

// import gojs from 'gojs';
// Vue.prototype.go = gojs;
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock');

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
});
