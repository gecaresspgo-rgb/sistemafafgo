import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// A linha abaixo desabilita a regra do ESLint apenas para a próxima linha de código.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(Toast as any, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
})

app.mount('#app')
