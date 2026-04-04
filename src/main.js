import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap JS chargé globalement dans index.html
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import "./assets/main.css"
import './assets/script.js'
import './assets/style.css'
import './assets/style1.css'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // 👉 ajout Pinia
app.use(router)
app.use(ElementPlus)

app.mount('#app')
