import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
//import AdminLayout from "@/layouts/AdminLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

// Vistas para usuarios regulares
import Home from "@/views/Home.vue";
import Catalogo from "@/views/Catalogo.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

// Vistas para administradores
// import AdminDashboard from "@/views/admin/AdminDashboard.vue";
// import AdminProducts from "@/views/admin/AdminProducts.vue";
// import AdminLogin from "@/views/admin/AdminLogin.vue";

const routes = [
  // Rutas de usuarios regulares
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "catalogo", name: "Catalogo", component: Catalogo },
    ],
  },
  {
    path: "/login",
    component: BlankLayout, // Layout en blanco
    children: [
      { path: "", name: "Login", component: Login }, // Ruta para Login
    ],
  },
  {
    path: "/register",
    component: BlankLayout,
    children: [{ path: "", name: "Register", component: Register }],
  },
  // Rutas de administrador
  // {
  //   path: "/admin",
  //   component: AdminLayout,
  //   children: [
  //     { path: "", name: "AdminDashboard", component: AdminDashboard },
  //     { path: "products", name: "AdminProducts", component: AdminProducts },
  //   ],
  // },
  // Ruta de login para administrador
  // {
  //   path: "/admin/login",
  //   component: BlankLayout,
  //   children: [{ path: "", name: "AdminLogin", component: AdminLogin }],
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
