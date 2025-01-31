import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";
import CuentaLayout from "@/layouts/CuentaLayout.vue";

// Vistas para usuarios regulares
import Home from "@/views/Home.vue";
import Contacto from "@/views/Contacto.vue";
import Catalogo from "@/views/Catalogo.vue";
import Carrito from "@/views/Carrito.vue";
import Address from "@/views/Address.vue";
import ConfirmOrder from "@/views/ConfirmOrder.vue";
import Success from "@/views/PaymentStatus/Success.vue";
import Cancel from "@/views/PaymentStatus/Cancel.vue";
import Cookies from "@/views/Cookies.vue";

// vistas del perfil de usuario Cuenta/
import PerfilUsuario from "@/components/Cuenta/PerfilUsuario.vue";
import HistorialCompras from "@/components/Cuenta/HistorialCompras.vue";
import Direcciones from "@/components/Cuenta/Direcciones.vue";
import Ayuda from "@/components/Cuenta/Ayuda.vue";
import ResPwd from "@/components/Cuenta/ResPwd.vue";
import ConfiguracionCuenta from "@/components/Cuenta/ConfiguracionCuenta.vue";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Error from "@/views/Error.vue";
import ServiceOut from "@/views/FueraDeServicio.vue";
import Reestablecer from "@/views/Reestablecer.vue";
import RequestRecoverPwd from "@/views/RequestRecoverPwd.vue";


// Vistas para administradores
import AdminLogin from "@/views/admin/AdminLogin.vue";
import AdminProducts from "@/views/admin/AdminProducts.vue";
import AdminDashboard from "@/views/admin/dashboard/AdminDashboard.vue";
import RecentOrder from "@/views/admin/dashboard/components/RecentOrder.vue";
import OrderDetails from "@/views/admin/dashboard/components/OrderDetails.vue";
import { fromJSON } from "postcss";
const routes = [
  // Rutas de usuarios regulares
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "catalogo", name: "Catalogo", component: Catalogo },
      { path: "contacto", name: "Contacto", component: Contacto },
      { path: "carrito", name: "Carrito", component: Carrito },
      { path: "cookies", name: "Cookies", component: Cookies },
      { path: "address", name: "Address", component: Address },
      { path: "ConfirmOrder", name: "ConfirmOrder", component: ConfirmOrder },
      { path: "Success", name: "Success", component: Success },
      { path: "Cancel", name: "Cancel", component: Cancel },
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
      { path: "/xqc/AdminLogin", name: "AdminLogin", component: AdminLogin },
    ],
  },
  {
    path: "/register",
    component: BlankLayout,
    children: [{ path: "", name: "Register", component: Register }],
  },
  {
    path: "/Reestablecer",
    component: BlankLayout,
    children: [{ path: "", name: "Reestablecer", component: Reestablecer }],
  },
  {
    path: "/RequestRecover",
    component: BlankLayout,
    children: [{ path: "", name: "RequestRecover", component: RequestRecoverPwd }],
  },

  // Rutas de administrador protegidas, ayudame a organizar bien
  {
    path: "/xqc",
    component: AdminLayout,
    children: [
      {
        path: "/AdminProducts",
        name: "AdminProducts",
        component: AdminProducts,
      },
      {
        path: "/Dashboard",
        component: AdminDashboard,
        children: [
          {
            path: "RecentOrder", // Ruta anidada bajo `/xqc/dashboard`
            name: "RecentOrder",
            component: RecentOrder,
          },
          {
            path: "OrderDetails/:id", // Ruta dinámica para detalles de orden
            name: "OrderDetails",
            component: OrderDetails,
            props: true, // Habilita el paso de `id` como prop
          },
        ],
      },
    ],
  },
  {
    path: "/fuera-de-servicio",
    name: "ServiceOut",
    component: ServiceOut,
  },
  {
    path: "/Cuenta",
    redirect: { name: "PerfilUsuario" },
    component: CuentaLayout,
    children: [
      {
        path: "",
        name: "PerfilUsuario",
        component: PerfilUsuario,
      },
      {
        path: "Historial",
        name: "HistorialCompras",
        component: HistorialCompras,
      },
      {
        path: "Direcciones",
        name: "Direcciones",
        component: Direcciones,
      },
      {
        path: "Configuracion",
        name: "ConfiguracionCuenta",
        component:ConfiguracionCuenta,
      },
      {
        path: "Ayuda",
        name: "Ayuda",
        component: Ayuda,
      },
      {
        path: "Reestablecer",
        name: "ResPwd",
        component: ResPwd,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
