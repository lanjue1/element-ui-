import Vue from 'vue'
import VueRouter from 'vue-router'


const Login =()=>import ('views/login/login.vue')
const Home =()=>import('views/home/Home.vue')
const Welcome =()=>import('views/home/welcome.vue')
const User =()=>import('views/user/user.vue')

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
      {path:'/users',component:User}
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
