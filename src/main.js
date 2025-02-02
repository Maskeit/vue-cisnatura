import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@/assets/scss/styles.scss";
import App from "./App.vue";
import router from "./router"; // Importa el router
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia); // Usa Pinia
app.use(router); // Usa Vue Router

app.mount("#app");
