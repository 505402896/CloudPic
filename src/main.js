import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import scroll from 'vue-seamless-scroll'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(scroll)
new Vue({
  render: h => h(App)
}).$mount('#app')
