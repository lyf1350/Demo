import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
import vSelect from "vue-select";
import service from "./assets/js/service";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.component('v-select',vSelect);
if(store.state.user==null&&sessionStorage.getItem('user')!=null){
  store.commit('setValue',{name:'user',value:JSON.parse(sessionStorage.getItem('user'))});
  service.createWebSocket();
  service.init();
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

