import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/index'
import store from './store'
import ZkTable from 'vue-table-with-tree-grid';

import ElementUI from 'element-ui';
import {Message} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/index.js';


import './assets/base.css'

import axios from 'axios';
//配置请求根路径
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1';
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
//在发送请求之前做一下请求预处理request，给发送的请求挂载一个请求头 Authorization
axios.interceptors.request.use(config=>{
  //console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config // 必须得返回这个回调函数出去，这个经过挂载了请求头的会掉函数才是用来和服务器发送请求的；
})
Vue.use(ElementUI);
Vue.prototype.$message=Message;
Vue.prototype.$axios=axios;
Vue.component('ZkTable', ZkTable)


// import {Button,Form,FormItem,Input

// } from 'element-ui';

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
