import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//clipboard
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

//vue session
import VueSession from 'vue-session'
Vue.use(VueSession);
//end vue session

// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)
//end Froala

// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas} from '@fortawesome/free-solid-svg-icons'
import { far} from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon);
//end font awesome


//font awesome tester i tag  to svg
import {dom} from '@fortawesome/fontawesome-svg-core';
dom.watch()
//font awesome tester

//markdown View
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'

Vue.component('vue-simplemde', VueSimplemde)
//end markdown View

// axios
import axios from 'axios'

Vue.use({
  install(Vue) {
    Vue.prototype.$axios = axios.create({
      baseURL: 'http://15.164.153.221:9000/'
    })
  }
})

// end axios
// custom directive- focus
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})


// end custom directive

// filters
import moment from 'moment';


//let filters = {
//  formatDate: function(value) {
//    if (value) {
//      return moment(String(value)).format('MM/DD/YYYY hh:mm')
//    }
//  },
//  commaSep: function(val) {
//    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
//  }
//}
Vue.filter('formatDate', function(val) {
  return moment(String(val)).format('YYYY/MM/DD a hh:mm');
})
// {{date | formatDate}}

Vue.filter('commaSep', function(val) {
  return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

})
// {{num | commaSep}}
// end date format

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
