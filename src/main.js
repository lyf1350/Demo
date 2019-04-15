import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
import vSelect from "vue-select";
import service from "./assets/js/service";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueUploadComponent  from "vue-upload-component";
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
Vue.use(BootstrapVue);
Vue.component('file-upload', VueUploadComponent);
Vue.config.productionTip = false;
Vue.component('v-select',vSelect);
Vue.component('datepicker',Datepicker);
function dateFormatter(value){
  if (value != null) return moment(value).format('YYYY-MM-DD HH:mm:ss');
  else return "";
}

Vue.filter('dateFormatter',dateFormatter);
Vue.prototype.dateFormatter=dateFormatter;
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

