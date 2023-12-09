import { createApp } from "vue";
import "./assets/style.scss";
import App from "./App.vue";
// vue router
import router from "./router/index.js";
// vuetify
import { vuetify } from "./plugin/vuetify.js";

const app = createApp(App);

app.use(vuetify);
app.use(router).mount("#app");
