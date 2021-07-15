import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mitt from 'mitt'//事件总线
import installElementPlus from './plugins/element'
// 设置全局的css样式
import './assets/css/icon.css'
const app = createApp(App)
app.config.globalProperties.$bus = new mitt();//绑定事件总线
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')