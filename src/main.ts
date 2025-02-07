import { createApp, type App as VueApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@/assets/scss/styles.scss";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app: VueApp<Element> = createApp(App);
app.use(pinia);
app.use(router);

app.mount("#app");