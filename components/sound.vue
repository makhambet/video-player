<template>
  <div class="sound">
    <div class="sound__icon" @click="muteVideo()">
      <VideoSoundMuteIcon v-show="MUTED || VOLUME === 0" data-title="Отключить звук" />
      <VideoSoundQuiterIcon v-show="!MUTED && VOLUME > 0 && VOLUME <= 0.3" data-title="Отключить звук" />
      <VideoSoundLouderIcon v-show="!MUTED && VOLUME > 0.3 && VOLUME < 0.6" data-title="Отключить звук" />
      <VideoSoundUnmuteIcon v-show="!MUTED && VOLUME >= 0.6 " data-title="Отключить звук" />
    </div>
    <div
      class="sound-line"
      @click="setVolume"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <div class="sound-line__progressbar-seek" />
      <div class="sound-line__volume" :style="{width: volumeWidth + '%'}" />
    </div>
  </div>
</template>

<script>
import VideoSoundLouderIcon from '~~/assets/svg/video-sound-louder.svg?inline'
import VideoSoundQuiterIcon from '~~/assets/svg/video-sound-quiter.svg?inline'
import VideoSoundMuteIcon from '~~/assets/svg/video-sound-mute.svg?inline'
import VideoSoundUnmuteIcon from '~~/assets/svg/video-sound-unmute.svg?inline'

export default {
  components: {
    VideoSoundLouderIcon,
    VideoSoundQuiterIcon,
    VideoSoundMuteIcon,
    VideoSoundUnmuteIcon
  },
  data () {
    return {
      volumeWidth: 100,
      volumeValue: 1,
      videoBlockLeft: null,
      onHoverVolume: false
    }
  },
  computed: {
    VIDEO () {
      return this.$store.state.video.video
    },
    MUTED () {
      return this.$store.state.video.muted
    },
    VOLUME () {
      return this.$store.state.video.volume
    }
  },
  mounted () {
    const width = 105 // Растояние между блоком видео и progressBar`а звука
    this.videoBlockLeft = this.VIDEO.getBoundingClientRect().left + width
  },
  methods: {
    muteVideo () {
      this.VIDEO.muted = !this.VIDEO.muted
      this.$store.commit('video/setMuted', this.VIDEO.muted)
      // this.$store.commit('video/setVolume', 0.5)
    },
    onMouseMove (e) {
      const soundBlockWidth = 50
      this.volumeValue = (e.pageX - this.videoBlockLeft) / soundBlockWidth
      if (this.volumeValue > 1) { this.volumeValue = 1 } else if (this.volumeValue < 0.1) { this.volumeValue = 0 }
      if (this.onHoverVolume) {
        this.setVolume()
      }
    },
    setVolume () {
      this.volumeWidth = this.volumeValue * 100
      this.VIDEO.volume = this.volumeValue
      this.$store.commit('video/setVolume', this.volumeValue)
    },
    onMouseDown () {
      this.onHoverVolume = true
    },
    onMouseUp () {
      this.onHoverVolume = false
    }
  }
}
</script>

<style scoped>
  .sound {
    display: flex;
    align-items: center;
  }
  .sound-line {
    width: 0;
    margin-left: 10px;
    position: relative;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in, width 0.2s ease-in;
  }
  .sound:hover .sound-line {
    width: 50px;
    opacity: 1;
    visibility: visible;
  }
  .sound-line__progressbar-seek {
    width: 50px;
    height: 3px;
    background: #737373;
    position: relative;
  }
  .sound-line__volume {
    position: absolute;
    height: 100%;
    top: -1px;
    background: #FFFFFF;
  }
  .sound-line__volume:after {
    position: absolute;
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50% 50%;
    background: #FFFFFF;
    top: -5px;
    right: -8px;
  }
  .sound__icon {
    width: 18px;
    height: 18px;
  }
</style>
