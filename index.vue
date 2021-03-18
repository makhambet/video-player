<template>
  <div class="video-content" :class="{'long-format-video': LONG_FORMAT_VIDEO}">
    <div
      class="video-block"
      @mouseenter="showControls()"
      @mouseleave="hideControls()"
      @mousemove="mousemove()"
    >
      <top-block :video-name="videoName" class="top-block" :class="{'top-block-active': showOptions}" />
      <video
        id="video"
        ref="video"
        tabindex="-1"
        class="video"
        controlslist="nodownload"
        :poster="poster"
        playsinline
        :src="src"
        @click="togglePlay()"
        @loadedmetadata="initializeVideo()"
        @playing="onPlayingVideo()"
        @pause="onPausedVideo()"
        @timeupdate="updateTimeElapsed(), updateProgress()"
        @ended="endVideo()"
        @progress="onProgress()"
        @waiting="onWaitingVideo()"
      >
      </video>
      <center-block class="center-block" :class="{'center-block-active': showOptions}" @togglePlay="togglePlay()" />
      <Settings v-show="OPEN_SETTINGS" />
      <bottom-block
        v-if="VIDEO"
        class="bottom-block"
        :class="{'bottom-block-active': showOptions}"
        :load-percentage="loadPercentage"
        :time-elapsed="timeElapsed"
        :time-duration="timeDuration"
        :src="src"
        @togglePlay="togglePlay()"
        @showOptions="showOptionsOnAction"
      />
      <div v-show="OPEN_SETTINGS" class="close" @click="$store.commit('video/setOpenSettings', false)"></div>
    </div>
    <Preview :src="src"/>
  </div>
</template>

<script>

export default {
  components: {
    BottomBlock: () => ({
      component: import('./components/bottom')
    }),
    TopBlock: () => ({
      component: import('./components/top')
    }),
    CenterBlock: () => ({
      component: import('./components/center')
    }),
    Settings: () => ({
      component: import('./components/settings')
    }),
    Preview: () => ({
      component: import('./components/preview')
    })
  },
  props: {
    src: {
      type: String,
      default: '',
      required: true
    },
    poster: {
      type: String,
      default: '',
      required: true
    },
    videoName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      video: null,
      showOptions: true,
      mouseMoveTime: 0,
      timeElapsed: null,
      timeDuration: null,
      loadPercentage: 0,
      hideVideo: null
    }
  },
  computed: {
    // ...mapState({
    //   VIDEO: 'video/VIDEO',
    //   IS_PLAY: 'video/IS_PLAY',
    //   DURATION: 'video/DURATION',
    //   CURRENT_TIME: 'video/CURRENT_TIME'
    // })
    VIDEO () {
      return this.$store.state.video.video
    },
    IS_PLAY () {
      return this.$store.state.video.isPlay
    },
    DURATION () {
      return this.$store.state.video.duration
    },
    CURRENT_TIME () {
      return this.$store.state.video.currentTime
    },
    OPEN_SETTINGS () {
      return this.$store.state.video.openSettings
    },
    LONG_FORMAT_VIDEO () {
      return this.$store.state.video.longFormatVideo
    },
    LOAD_VIDEO () {
      return this.$store.state.video.loadVideo
    }
  },
  mounted () {
    this.$store.commit('video/setVideo', this.$refs.video)
  },
  methods: {
    togglePlay () {
      if (this.IS_PLAY) {
        this.VIDEO.pause()
      } else {
        this.VIDEO.play()
      }
      this.$store.commit('video/setIsPlay', !this.IS_PLAY)
    },
    toggleShowOptions () {
      this.showOptions = false
    },
    onPlayingVideo () {
      this.$store.commit('video/setLoadVideo', false)
      setTimeout(() => {
        this.toggleShowOptions()
      }, 500)
      this.$store.commit('video/setIsPlay', true)
    },
    onPausedVideo () {
      this.showOptions = true
      this.$store.commit('video/setIsPlay', false)
    },
    showOptionsOnAction () {
      this.showOptions = true
      setTimeout(() => {
        if (this.IS_PLAY) {
          this.showOptions = false
        }
      }, 800)
    },
    formatTime (timeInSeconds) {
      const result = new Date((timeInSeconds || 0) * 1000).toISOString().substr(11, 8)
      return {
        hours: result.substr(0, 2),
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2)
      }
    },
    updateTimeElapsed () {
      if (!this.VIDEO) {
        return
      }
      const time = this.formatTime(Math.round(this.VIDEO.currentTime))
      this.timeElapsed = `${parseInt(time.hours) ? time.hours + ':' : ''}${time.minutes}:${time.seconds}`
      this.$store.commit('video/setCurrentTime', this.VIDEO.currentTime)
    },
    updateProgress () {
      // this.seek.value = Math.floor(this.video.currentTime)
    },
    initializeVideo () {
      this.$store.commit('video/setLoadVideo', false)
      const videoDuration = Math.round(this.VIDEO.duration === Infinity ? 0 : this.VIDEO.duration)
      const time = this.formatTime(videoDuration)
      this.timeDuration = `${parseInt(time.hours) ? time.hours + ':' : ''}${time.minutes}:${time.seconds}`
      this.$store.commit('video/setDuration', videoDuration)
    },
    onProgress () {
      if (this.DURATION) {
        const range = 0
        const buffered = this.VIDEO.buffered
        const loadStartPercentage = buffered.start(range) / this.DURATION
        const loadEndPercentage = buffered.end(range) / this.DURATION
        this.loadPercentage = (loadEndPercentage - loadStartPercentage) * 100
      }
    },
    endVideo () {
      this.onPausedVideo()
    },
    onWaitingVideo () {
      this.$store.commit('video/setLoadVideo', true)
    },
    hideControls () {
      const width = window.outerWidth
      if (this.VIDEO && !this.VIDEO.paused && width > 579 && !this.OPEN_SETTINGS && !this.LOAD_VIDEO) { this.showOptions = false }
    },
    showControls () {
      const width = window.outerWidth
      if (width > 579 || this.showOptions) {
        this.showOptions = true
      }
    },
    mousemove () {
      if (this.mouseMoveTime) {
        this.showControls()
        clearTimeout(this.mouseMoveTime)
        this.mouseMoveTime = 0
      } else {
        this.mouseMoveTime = setTimeout(() => {
          // if (this.VIDEO.played) {
          this.hideControls()
          // }
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
  .video-content {
    position: relative;
    width: calc(100% - 420px);
    height: auto;
  }
  .video-content.long-format-video {
    width: 100%;
    height: 500px;
  }
  .video {
    width: 100%;
    height: 100%;
    outline: none;
    object-fit: cover;
    cursor: pointer;
    margin: auto;
  }
  .video-block {
    width: 100%;
    height: 100%;
    margin-top: 21px;
    position: relative;
    background: #15132F;
    border-radius: 5px;
    overflow: hidden;
    z-index: 2;
  }
  .top-block {
    transform: translateY(-100px);
  }
  .bottom-block {
    transform: translateY(100px);
  }
  .top-block, .bottom-block, .center-block {
    transition: transform .2s ease-in, opacity .2s ease-in;
    opacity: 0;
  }
  .top-block-active, .bottom-block-active, .center-block-active {
    transform: translateY(0);
    opacity: 1;
  }
  .hideVideo {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
  .video:-webkit-full-screen {
    width: 100%;
  }
</style>
