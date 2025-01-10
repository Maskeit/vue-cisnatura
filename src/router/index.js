import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
//import AdminLayout from "@/layouts/AdminLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

// Vistas para usuarios regulares
import Home from "@/views/Home.vue";
import Catalogo from "@/views/Catalogo.vue";
import Carrito from "@/views/Carrito.vue";
import Address from "@/views/Address.vue";
import ConfirmOrder from "@/views/ConfirmOrder.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Error from "@/views/Error.vue";
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
      { path: "carrito", name: "Carrito", component: Carrito },
      { path: "address", name: "Address", component: Address },
      { path: "ConfirmOrder", name: "ConfirmOrder", component: ConfirmOrder}
    ],
  },
  {
    path: "/Error",
    name: "Error",
    component: Error,
    props: (route) => ({
      errorCode: route.query.code || 404,
      errorMessage: route.query.message || "Página no encontrada",
    }),
  },
  // Catch-all para rutas no definidas
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: "Error",
      query: { code: 404, message: "Página no encontrada" },
    },
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
