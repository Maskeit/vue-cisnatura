import { createApp } from 'vue'
import '@/assets/scss/styles.scss';
import App from './App.vue'
import router from "./router"; // Importa el router
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css'; // Estilo del editor

const app = createApp(App);
app.use(router); // Usa Vue Router
app.component('QuillEditor', QuillEditor);

app.mount("#app");