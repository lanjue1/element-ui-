import Vue from 'vue'
import VueRouter from 'vue-router'


const Login =()=>import ('views/login/login.vue')
const Home =()=>import('views/home/Home.vue')
const Welcome =()=>import('views/home/welcome.vue')
const Users =()=>import('views/user/user.vue')
const Rights =()=>import('views/right/rights.vue')
const Roles =()=>import('views/right/roles.vue')
const GoodsCate =()=>import('views/goods/goodsCate.vue')
const GoodsParams =()=>import('views/goods/goodsParams.vue')
const GoodsList =()=>import('views/goods/goodsList.vue')
const GoodsAdd =()=>import('views/goods/goodsAdd.vue')

Vue.use(VueRouter)

const routes = [
  {path:'',redirect:'/home'},
  {
    path: '/login',
    name: 'Login',    
    component: Login
  },{
    path: '/home',
    name: 'Home',    
    component: Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component: Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:GoodsCate},
      {path:'/params',component:GoodsParams},
      {path:'/goods',component:GoodsList},
      {path:'/goods/add',component:GoodsAdd}



    ]
  },
  

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
