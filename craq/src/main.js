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
import { faUserSecret, faAddressCard, faSearch, faBell, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faAddressCard, faSearch, faBell, faGlobe, farBell);
Vue.component('font-awesome-icon', FontAwesomeIcon);
//end font awesome


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
