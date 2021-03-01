import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    video: null,
    isPlay: false,
    currentTime: null,
    duration: null,
    muted: false
  },
  mutations: {
    setVideo (state, payload) {
      state.video = payload
    },
    setIsPlay (state, payload) {
      state.isPlay = payload
    },
    setCurrentTime (state, payload) {
      state.currentTime = payload
    },
    setDuration (state, payload) {
      state.duration = payload
    },
    setMuted (state, payload) {
      state.muted = payload
    }
  },
  getters: {
    VIDEO: state => state.video,
    IS_PLAY: state => state.isPlay,
    CURRENT_TIME: state => state.currentTime,
    DURATION: state => state.duration,
    MUTED: state => state.muted
  },
  modules: {
  }
})
