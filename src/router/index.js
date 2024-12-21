import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Catalogo from "@/views/Catalogo.vue";
import Login from "@/views/Login.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Catalogo",
    name: "Catalogo",
    component: Catalogo,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;