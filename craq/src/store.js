import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: "default",
    isLogin: false,
  },
  mutations: {
    toggleTheme (state) {
      if (state.theme === "default") {
          state.theme = "dark"
      } else {
        state.theme = "default";
      }
    },
    toggleIsLogin(state) {
      state.isLogin = !state.isLogin;
    }
  },
  actions: {

  }
})
