<template>
  <div class="center" @click="$emit('togglePlay')">
    <VideoStartIcon v-if="!CURRENT_TIME && !LOAD_VIDEO" />
    <div v-if="CURRENT_TIME && !LOAD_VIDEO" class="center__icons-block" :class="{'center__icons-animate-block': show}">
      <VideoPlayIcon data-title="Воспроизвести видео" class="center__icons" :class="{'center__icons-animate': show==='play'}" />
      <VideoPauseIcon data-title="Остановить видео" class="center__icons" :class="{'center__icons-animate': show==='pause'}" />
    </div>
    <div v-if="LOAD_VIDEO" class="center__loader">
      <Spinner :font-size="32" />
    </div>
  </div>
</template>

<script>
import VideoStartIcon from '~~/assets/svg/video-start.svg?inline'
import VideoPlayIcon from '~~/assets/svg/video-play.svg?inline'
import VideoPauseIcon from '~~/assets/svg/video-pause.svg?inline'

export default {
  components: {
    VideoPlayIcon,
    VideoPauseIcon,
    VideoStartIcon
  },
  data () {
    return {
      show: null
    }
  },
  computed: {
    CURRENT_TIME () {
      return this.$store.state.video.currentTime
    },
    IS_PLAY () {
      return this.$store.state.video.isPlay
    },
    LOAD_VIDEO () {
      return this.$store.state.video.loadVideo
    }
  },
  watch: {
    IS_PLAY () {
      this.animateIcons(this.IS_PLAY)
    }
  },
  methods: {
    animateIcons (isPlay) {
      if (isPlay) {
        this.show = 'play'
      } else {
        this.show = 'pause'
      }
      setTimeout(() => {
        this.show = null
      }, 500)
    }
  }
}
</script>

<style scoped>
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .center__icons-block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 80px;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s ease-in-out, tranform 0.2s ease;
  }
  .center__icons-animate-block {
    opacity: 1;
    transform: scale(1);
  }
  .center__icons {
    transform: scale(1.5);
    transition: opacity 0.6s ease-in-out, tranform 0.6s ease;
    opacity: 0;
    width: 0;
    height: 0;
  }
  .center__icons-animate {
    opacity: 1;
    width: auto;
    height: auto;
  }
</style>
