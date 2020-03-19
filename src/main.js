import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/index'
import store from './store'

import ElementUI from 'element-ui';
import {Message} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/index.js';

import './assets/base.css'

import axios from 'axios';
//配置请求根路径
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1';
Vue.use(ElementUI);
Vue.prototype.$message=Message;
Vue.prototype.$axios=axios;


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
