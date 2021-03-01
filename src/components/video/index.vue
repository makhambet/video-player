<template>
  <div
    @mouseenter="showControls()"
    @mouseleave="hideControls()"
    @mousemove="mousemove()"
    class="video-block"
  >
    <top-block class="top-block" :class="{'top-block-active': showOptions}"></top-block>
    <video
      id="video"
      ref="video"
      tabindex="-1"
      class="video"
      controlslist="nodownload"
      :poster="poster"
      @click="togglePlay()"
      @loadedmetadata="initializeVideo()"
      @playing="onPlayingVideo()"
      @pause="onPausedVideo()"
      @timeupdate="updateTimeElapsed(), updateProgress()"
      @ended="endVideo()"
      @progress="onProgress"
      @waiting="onwaitingVideo()"
    >
      <source :src="src" type="video/mp4">
    </video>
    <center-block class="center-block" :class="{'center-block-active': showOptions}" @togglePlay="togglePlay()"></center-block>
    <bottom-block
      class="bottom-block"
      :class="{'bottom-block-active': showOptions}"
      @capture="capture"
      @togglePlay="togglePlay()"
      :loadPercentage="loadPercentage"
      :timeElapsed="timeElapsed"
      :timeDuration="timeDuration"
    ></bottom-block>

    <div class="canvas">
      <canvas id="canvas"></canvas>
      <video controls :src="src" ref="hideVideo" class="hideVideo"></video>
<!--      <video id="video1" controls="" width="270"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.mp4" type="video/mp4"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.ogg" type="video/ogg"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.webm" type="video/webm"></video>-->

    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
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
  },
  data() {
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
    ...mapGetters([
      'VIDEO',
      'IS_PLAY',
      'DURATION',
      'CURRENT_TIME'
    ])
  },
  methods: {
    togglePlay () {
      if (this.IS_PLAY) {
        this.VIDEO.pause()
      } else {
        this.VIDEO.play()
      }
      this.$store.commit('setIsPlay', !this.IS_PLAY)
    },
    toggleShowOptions() {
      this.showOptions = false
    },
    onPlayingVideo () {
      this.toggleShowOptions()
      this.$store.commit('setIsPlay', true)
    },
    onPausedVideo() {
      this.showOptions = true
      this.$store.commit('setIsPlay', false)
    },
    formatTime(timeInSeconds) {
      const result = new Date((timeInSeconds || 0) * 1000).toISOString().substr(11, 8)
      return {
        hours: result.substr(0, 2),
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
      };
    },
    updateTimeElapsed() {
      const time = this.formatTime(Math.round(this.VIDEO.currentTime))
      this.timeElapsed = `${parseInt(time.hours) ? time.hours + ':' : ''}${time.minutes}:${time.seconds}`
      this.$store.commit('setCurrentTime', this.VIDEO.currentTime)
    },
    updateProgress() {
      // this.seek.value = Math.floor(this.video.currentTime)
    },
    initializeVideo() {
      const videoDuration = Math.round(this.VIDEO.duration);
      const time = this.formatTime(videoDuration);
      this.timeDuration = `${parseInt(time.hours) ? time.hours + ':' : ''}${time.minutes}:${time.seconds}`
      this.$store.commit('setDuration', videoDuration)
      console.log('duration')
    },
    onProgress() {
      if (this.DURATION) {
        let range = 0
        const buffered = this.VIDEO.buffered
        let loadStartPercentage = buffered.start(range) / this.DURATION
        let loadEndPercentage = buffered.end(range) / this.DURATION
        this.loadPercentage = (loadEndPercentage - loadStartPercentage) * 100
      }
    },
    endVideo() {
      this.onPausedVideo()
    },
    onwaitingVideo() {
      console.log('Идет загрузка')
    },
    hideControls() {
      let width = window.outerWidth
      if(!this.VIDEO.paused && width > 579)
        this.showOptions = false
    },
    showControls() {
      let width = window.outerWidth
      if(width > 579 || this.showOptions) {
        this.showOptions = true
      }
    },
    mousemove() {
      if (this.mouseMoveTime) {
        this.showControls()
        clearTimeout(this.mouseMoveTime)
        this.mouseMoveTime = 0
      }
      else  {
        this.mouseMoveTime = setTimeout(() => {
          // if (this.VIDEO.played) {
            this.hideControls()
          // }
        }, 2000)
      }
    },
    capture(e) {
      console.log(e)
      this.hideVideo.currentTime = e
      let canvas = document.getElementById('canvas')
      canvas.getContext('2d').drawImage(this.hideVideo,5,5,260,125)
    }
  },
  components: {
    BottomBlock: () => ({
      component: import('./components/bottom')
    }),
    TopBlock: () => ({
      component: import('./components/top')
    }),
    CenterBlock: () => ({
      component: import('./components/center')
    })
  },
  mounted() {
    this.$store.commit('setVideo', this.$refs.video)
    this.hideVideo = this.$refs.hideVideo
  }
}
</script>

<style scoped>
  .video {
    width: 100%;
    height: 100%;
    outline: none;
    object-fit: cover;
    cursor: pointer;
  }
  .video-block {
    width: 900px;
    max-height: 504px;
    margin: 50px auto 0;
    position: relative;
    background: #15132F;
    border-radius: 5px;
    /*overflow: hidden;*/
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
</style>
