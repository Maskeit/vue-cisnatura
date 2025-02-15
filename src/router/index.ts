import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

// Vistas para usuarios regulares
import Contacto from "@/views/Client/Contacto.vue";
import Catalogo from "@/views/Client/Catalogo.vue";
import Carrito from "@/views/Client/Carrito.vue";
import Address from "@/views/Client/Address.vue";
import ConfirmOrder from "@/views/Client/ConfirmOrder.vue";
import Success from "@/views/Client/PaymentStatus/Success.vue";
import Cancel from "@/views/Client/PaymentStatus/Cancel.vue";
import Cookies from "@/views/Client/Cookies.vue";
import Cuenta from "@/views/Client/Cuenta.vue";
// vistas del perfil de usuario Cuenta/
import Ayuda from "@/components/Client/Cuenta/Ayuda.vue";
import ConfiguracionCuenta from "@/components/Client/Cuenta/ConfiguracionCuenta.vue";
import Direcciones from "@/components/Client/Cuenta/Direcciones.vue";
import HistorialCompras from "@/components/Client/Cuenta/HistorialCompras.vue";
import PerfilUsuario from "@/components/Client/Cuenta/PerfilUsuario.vue";
import ResPwd from "@/components/Client/Cuenta/ResPwd.vue";

import Login from "@/views/Client/Login.vue";
import Register from "@/views/Client/Register.vue";
import Error from "@/views/Error.vue";
import ServiceOut from "@/views/FueraDeServicio.vue";
import Reestablecer from "@/views/Client/Reestablecer.vue";
import RequestRecoverPwd from "@/views/Client/RequestRecoverPwd.vue";

// Layout de Admin
import AdminLayout from "@/layouts/AdminLayout.vue";
// Vistas para administradores
import AdminLogin from "@/views/Admin/AdminLogin.vue";
import Productos from "@/views/Admin/Productos.vue";
import Dashboard from "@/views/Admin/Dashboard.vue";
//Componentes de Dashboard
import RecentOrder from "@/components/Admin/Dashboard/RecentOrder.vue";
import OrderDetails from "@/components/Admin/Dashboard/OrderDetails.vue";
import Clientes from "@/components/Admin/Dashboard/Clientes.vue";

const adminRoutes = [
  { path: "Productos", name: "Productos", component: Productos },
  { path: "Dashboard", name: "Dashboard", component: Dashboard, children: [
    { path: "RecentOrder", name: "RecentOrder", component: RecentOrder },
    { path: "Clientes", name: "Clientes", component: Clientes },
    { path: "OrderDetails/:id", name: "OrderDetails", component: OrderDetails, props: true },
    { path: "", redirect: { name: "RecentOrder" } },
  ]},
];

const clientRoutes = [
  {
    path: "/", children: [
      { path: "", name: "Catalogo", component: Catalogo },
      { path: "contacto", name: "Contacto", component: Contacto },
      { path: "carrito", name: "Carrito", component: Carrito },
      { path: "cookies", name: "Cookies", component: Cookies },
      { path: "address", name: "Address", component: Address },
      { path: "confirm-order", name: "ConfirmOrder", component: ConfirmOrder },
      { path: "Success", name: "Success", component: Success },
      { path: "Cancel", name: "Cancel", component: Cancel },
      {
        path: "cuenta", component: Cuenta, children: [
          { path: "", name: "PerfilUsuario", component: PerfilUsuario },
          { path: "Historial", name: "HistorialCompras", component: HistorialCompras },
          { path: "Direcciones", name: "Direcciones", component: Direcciones },
          { path: "Configuracion", name: "ConfiguracionCuenta", component: ConfiguracionCuenta },
          { path: "Ayuda", name: "Ayuda", component: Ayuda },
          { path: "Reestablecer", name: "ResPwd", component: ResPwd },
          { path: '', redirect: { name: 'PerfilUsuario' } }
        ]
      },
    ]
  },
];

const LogRoutes = [
  {
    path: "/",
    component: BlankLayout,
    children: [
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
      { path: "Reestablecer", name: "Reestablecer", component: Reestablecer },
      { path: "RequestRecover", name: "RequestRecover", component: RequestRecoverPwd },
      { path: "xqc/AdminLogin", name: "AdminLogin", component: AdminLogin },
    ],
  },
];

const routes = [
  // Rutas de usuarios regulares
  {
    path: "/",
    component: MainLayout,
    children: clientRoutes,
  },
  // Rutas de Error
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
  // Ruta fuera de servicio
  {
    path: "/fuera-de-servicio",
    name: "ServiceOut",
    component: ServiceOut,
  },
  // Rutas de administradores
  {
    path: "/xqc",
    component: AdminLayout,
    children: adminRoutes,
  },
  // Rutas de login y registro para usuarios en general
  ...LogRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
