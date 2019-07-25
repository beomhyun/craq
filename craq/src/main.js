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
import { faUserSecret, faAddressCard, faSearch, faBell, faGlobe, faCheck, faExclamation, faTimes, faPlane} from '@fortawesome/free-solid-svg-icons'
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faAddressCard, faSearch, faBell, faGlobe, farBell, faCheck, faExclamation, faTimes, faPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);
//end font awesome
//font awesome tester i tag  to svg
import {dom} from '@fortawesome/fontawesome-svg-core';
dom.watch()
//font awesome tester


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
