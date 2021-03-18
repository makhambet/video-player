<template>
  <div
    class="progress-bar"
    @click="skipToTime"
    @mousemove="showHover"
    @mouseleave="hideHover"
  >
    <div
      class="progress-bar__container"
    >
      <div class="progress-bar__seek" :style="{width: width + '%'}" />
      <div class="progress-bar__load" :style="{width: loadPercentage + '%'}" />
      <div class="progress-bar__skip-to" :style="{width: hoverWidth + '%'}">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loadPercentage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      hoverWidth: 0,
      videoBlockLeft: null,
      videoBlockWidth: null,
      hoverTime: 0
    }
  },
  computed: {
    width () {
      return (this.CURRENT_TIME / this.DURATION * 100) || 0
    },
    VIDEO () {
      return this.$store.state.video.video
    },
    DURATION () {
      return this.$store.state.video.duration
    },
    CURRENT_TIME () {
      return this.$store.state.video.currentTime
    },
    LONG_FORMAT_VIDEO () {
      return this.$store.state.video.longFormatVideo
    }
  },
  watch: {
    LONG_FORMAT_VIDEO () {
      this.calculateBlock()
    },
    $route () {
      this.calculateBlock()
      this.$store.commit('video/setCurrentTime', 0)
    }
  },
  mounted () {
    this.calculateBlock()
  },
  methods: {
    showHover (e) {
      this.hoverWidth = ((e.pageX - this.videoBlockLeft) * 100 / this.videoBlockWidth)
      this.hoverTime = this.hoverWidth / 100 * this.DURATION
      this.$store.commit('video/setHoverTime', this.hoverTime)
    },
    hideHover () {
      this.hoverWidth = 0
      this.$store.commit('video/setHoverTime', null)
    },
    skipToTime () {
      this.VIDEO.currentTime = this.hoverTime
      this.$store.commit('video/setCurrentTime', this.hoverTime)
    },
    calculateBlock () {
      this.videoBlockLeft = this.VIDEO.getBoundingClientRect().left + 10
      this.videoBlockWidth = this.VIDEO.getBoundingClientRect().width - 22
    }
  }
}
</script>

<style scoped>
  .progress-bar {
    width: 100%;
    height: 3.5px;
    margin-bottom: 10px;
    position: relative;
    padding: 5px 0;
    cursor: pointer;
  }
  .progress-bar__container {
    width: 100%;
    height: 100%;
    background: rgba(234, 234, 234, 0.2);
    position: relative;
  }
  .progress-bar__seek {
    position: absolute;
    background: linear-gradient(136.67deg, #FF409A 8.34%, #C438EF 95.26%);
    left: 0;
    top: 0;
    height: 100%;
    z-index: 3;
  }
  .progress-bar__seek:after {
    background: linear-gradient(136.67deg, #FF409A 8.34%, #C438EF 95.26%);
    width: 10px;
    height: 10px;
    border-radius: 50% 50%;
    content: '';
    position: absolute;
    top: -2px;
    right: -5px;
    opacity: 0;
  }
  .progress-bar:hover .progress-bar__seek {
    height: 5px;
    top: -1px;
  }
  .progress-bar:hover .progress-bar__seek:after {
    opacity: 1;
  }
  .progress-bar__load, .progress-bar__skip-to {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(234, 234, 234, 0.5);
    z-index: 1;
    /*transition: width 0.1s ease;*/
  }
  .progress-bar__skip-to {
    background: rgba(234, 234, 234, 0.7);
    z-index: 2;
    height: 5px;
    top: -1px;
  }
</style>
