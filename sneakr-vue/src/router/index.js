import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Sneakers from '../views/Sneakers.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Collection from '../views/Collection.vue'
import SneakerDetails from '../views/SneakerDetails.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/sneakers', name: 'Sneakers', component: Sneakers },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/collection', name: 'Collection', component: Collection },
  { path: '/sneaker/:id', name: 'SneakerDetails', component: SneakerDetails },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router