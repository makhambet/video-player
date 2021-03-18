<template>
  <div class="bottom">
    <ProgressBar :src="src" :load-percentage="loadPercentage" />
    <div class="bottom__content">
      <div class="bottom__left">
        <div
          class="bottom__toggle-play"
          @click="$emit('togglePlay')"
        >
          <VideoPlayIcon v-show="!IS_PLAY" data-title="Воспроизвести видео" />
          <VideoPauseIcon v-show="IS_PLAY" data-title="Остановить видео" />
        </div>
        <div class="bottom__next-video" @click="nextVideo()">
          <VideoNextIcon data-title="Следующее видео" />
        </div>
        <Sound />
        <div class="bottom__timer">
          <time class="time-elapsed">
            {{ timeElapsed || '00:00' }}
          </time>
          <time class="duration">
            {{ timeDuration || '00:00' }}
          </time>
        </div>
      </div>
      <div class="bottom__right">
        <div style="display: none" class="bottom__subtitles">
          <VideoSubtitlesIcon data-title="Включить субтитры" />
        </div>
        <div class="bottom__settings">
          <VideoSettingIcon data-title="Настройки" @click="showSettings()" />
        </div>
        <div class="bottom__view" @click="setLongFormatVideo()">
          <VideoLongIcon v-show="!changeFormatVideo" />
          <VideoShortIcon v-show="changeFormatVideo" />
        </div>
        <div class="bottom__pip" @click="togglePip()">
          <VideoPipIcon data-title="PIP" />
        </div>
        <div class="bottom__fullscreen" @click="toggleFullScreen()">
          <VideoFullvisionIcon data-title="Полноэкранный режим" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPauseIcon from '~~/assets/svg/video-pause.svg?inline'
import VideoNextIcon from '~~/assets/svg/video-next.svg?inline'
import VideoPlayIcon from '~~/assets/svg/video-play.svg?inline'
import VideoSubtitlesIcon from '~~/assets/svg/video-subtitles.svg?inline'
import VideoSettingIcon from '~~/assets/svg/video-setting.svg?inline'
import VideoLongIcon from '~~/assets/svg/video-long.svg?inline'
import VideoShortIcon from '~~/assets/svg/video-short.svg?inline'
import VideoPipIcon from '~~/assets/svg/video-pip.svg?inline'
import VideoFullvisionIcon from '~~/assets/svg/video-fullvision.svg?inline'

export default {
  components: {
    VideoPlayIcon,
    VideoNextIcon,
    VideoPauseIcon,
    VideoSubtitlesIcon,
    VideoSettingIcon,
    VideoLongIcon,
    VideoShortIcon,
    VideoPipIcon,
    VideoFullvisionIcon,
    ProgressBar: () => ({
      component: import('./progressBar')
    }),
    Sound: () => ({
      component: import('./sound')
    })
  },
  props: {
    timeElapsed: {
      type: String,
      default: '00:00'
    },
    timeDuration: {
      type: String,
      default: '00:00'
    },
    loadPercentage: {
      type: Number,
      default: 0
    },
    src: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      videoBlockLeft: 0,
      videoBlockWidth: 0,
      img: null,
      changeFormatVideo: false
    }
  },
  computed: {
    VIDEO () {
      return this.$store.state.video.video
    },
    IS_PLAY () {
      return this.$store.state.video.isPlay
    },
    MUTED () {
      return this.$store.state.video.muted
    },
    DURATION () {
      return this.$store.state.video.duration
    },
    CURRENT_TIME () {
      return this.$store.state.video.currentTime
    }
  },
  mounted () {
    this.VIDEO.addEventListener('keydown', this.keyboardShortcuts)
  },
  methods: {
    muteVideo () {
      this.VIDEO.muted = !this.VIDEO.muted
      this.$store.commit('video/setMuted', this.VIDEO.muted)
      // this.$store.commit('video/setVolume', 0.5)
    },
    nextVideo () {
      console.log('go to the next video')
    },
    toggleFullScreen () {
      this.VIDEO.removeAttribute('playsinline')
      if (this.VIDEO.webkitSupportsFullscreen) {
        this.VIDEO.webkitEnterFullscreen()
      }
      // if (this.VIDEO.requestFullscreen) this.VIDEO.requestFullscreen()
    },
    async togglePip () {
      try {
        if (this.VIDEO !== document.pictureInPictureElement) {
          await this.VIDEO.requestPictureInPicture()
        } else {
          await document.exitPictureInPicture()
        }
      } catch (error) {
        console.error(error)
      }
    },
    showSettings () {
      this.$store.commit('video/setOpenSettings', true)
    },
    setLongFormatVideo () {
      this.changeFormatVideo = !this.changeFormatVideo
      this.$store.commit('video/setLongFormatVideo', this.changeFormatVideo)
    },
    onRightButton (timer = 5) {
      if (this.VIDEO.currentTime < this.DURATION - timer) {
        this.VIDEO.currentTime += timer
      } else {
        this.VIDEO.currentTime = this.DURATION
      }
    },
    onLeftButton (timer = 5) {
      if (this.VIDEO.currentTime >= timer) {
        this.VIDEO.currentTime -= timer
      } else {
        this.VIDEO.currentTime = 0
      }
    },
    keyboardShortcuts (e) {
      const { key } = e
      switch (key) {
        case 'k':
          this.$emit('togglePlay')
          break
        case ' ':
          e.preventDefault()
          this.$emit('togglePlay')
          break
        case 'm':
          this.muteVideo()
          break
        case 'f':
          this.toggleFullScreen()
          break
        case 'p':
          this.togglePip()
          break
        case 'l':
          this.onRightButton(10)
          break
        case 'j':
          this.onLeftButton(10)
          break
        case 'ArrowRight':
          e.preventDefault()
          this.onRightButton(5)
          break
        case 'ArrowLeft':
          e.preventDefault()
          this.onLeftButton(5)
          break
        case 'F5':
          break
      }
      this.$emit('showOptions')
    }
  }
}
</script>

<style scoped>
  .bottom {
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    position: absolute;
    padding: 0 10px 11px;
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5) 100%);
    background-blend-mode: multiply;
    border-radius: 5px;
  }
  .bottom__content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .bottom__left, .bottom__right {
    display: flex;
    align-items: center;
  }
  .bottom__right > div:not(:last-child), .bottom__left > div:not(:last-child) {
    margin-right: 16px;
  }
  .bottom__left > div, .bottom__right > div {
    cursor: pointer;
  }
  .bottom__timer {
    font-size: 14px;
    color: #EAEAEA;
  }
  .bottom__timer time:first-child {
    margin-right: 5px;
  }
  .bottom__timer time:first-child:after {
    content: '/';
    margin: 0 0 0 5px;
  }
</style>
