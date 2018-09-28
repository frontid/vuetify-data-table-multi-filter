import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import MultiFiltersPlugin from './plugins/MultiFilters'
import App from './App.vue'

Vue.config.productionTip = false;

Vue.use(MultiFiltersPlugin);

new Vue({
  render: h => h(App)
}).$mount('#app');
