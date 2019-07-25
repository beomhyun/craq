import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//vue session
import VueSession from 'vue-session'
Vue.use(VueSession);
//end vue session
// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faAddressCard, faSearch, faBell, faGlobe, faCheck, faExclamation} from '@fortawesome/free-solid-svg-icons'
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

library.add(faUserSecret, faAddressCard, faSearch, faBell, faGlobe, farBell, faCheck, faExclamation);
Vue.component('font-awesome-icon', FontAwesomeIcon);
//end font awesome


Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
