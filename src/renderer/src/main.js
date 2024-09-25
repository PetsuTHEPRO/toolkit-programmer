import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons/css/boxicons.min.css';

import App from './App.vue'
import router from '@renderer/router'
import store from '@renderer/stores/sistema'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(createPinia())
app.use(Toast);
app.use(router)
app.use(store)

app.mount('#app')

