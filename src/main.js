import { createApp } from 'vue'
import '@/assets/scss/styles.scss';
import App from './App.vue'
import router from "./router"; // Importa el router

const app = createApp(App);
app.use(router); // Usa Vue Router
app.mount("#app");