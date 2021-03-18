<template>
  <div v-show="HOVER_TIME!==null" class="canvas" :style="{left: leftWidth + '%'}">
    <canvas id="canvas" ref="canvas" />
    <video ref="hideVideo" controls :src="src" class="hideVideo" />
    <!--      <video id="video1" controls="" width="270"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.mp4" type="video/mp4"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.ogg" type="video/ogg"><source src="//msiter.ru/sites/default/files/msiter_files/mov_bbb.webm" type="video/webm"></video>-->
    <div class="progress-bar__skip-to-time">
      {{ hoverTimeFormat }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      hideVideo: null,
      canvas: null
    }
  },
  computed: {
    HOVER_TIME () {
      const time = this.$store.state.video.hoverTime
      if (time !== null) {
        this.capture(time)
      }
      return time
    },
    DURATION () {
      return this.$store.state.video.duration
    },
    hoverTimeFormat () {
      const time = this.formatTime(this.HOVER_TIME || 0)
      return `${parseInt(time.hours) ? time.hours + ':' : ''}${time.minutes}:${time.seconds}`
    },
    LONG_FORMAT_VIDEO () {
      return this.$store.state.video.longFormatVideo
    },
    leftWidth () {
      const time = this.$store.state.video.hoverTime
      return time * 100 / this.DURATION - (this.LONG_FORMAT_VIDEO ? 7 : 11.5)
    }
  },
  mounted () {
    this.hideVideo = this.$refs.hideVideo
    this.canvas = this.$refs.canvas
    // this.capture(this.HOVER_TIME)
  },
  methods: {
    formatTime (timeInSeconds) {
      const result = new Date((timeInSeconds || 0) * 1000).toISOString().substr(11, 8)
      return {
        hours: result.substr(0, 2),
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2)
      }
    },
    capture (e) {
      setTimeout(() => {
        this.hideVideo.currentTime = e
        this.canvas.getContext('2d').drawImage(this.hideVideo, 0, 0, 300, 150)
      }, 50)
    }
  }
}
</script>

<style scoped>
  .canvas {
    position: absolute;
    width: 200px;
    height: 125px;
    bottom: 60px;
    text-align: center;
    font-size: 12px;
    z-index: 2;
    /*display: none;*/
  }
  .progress-bar__container:hover .canvas {
    display: block;
  }
  .canvas video {
    display: none;
  }
  #canvas {
    width: 200px;
    height: 100px;
    border: 1px solid #FFFFFF;
  }
</style>
