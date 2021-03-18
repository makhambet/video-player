<template>
  <div class="video-settings">
    <div class="video-settings__modal active">
      <h4 class="video-settings__title">
        <a @click="openMenu()">
          <svg
            v-show="sublistIndex"
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 1L1 6L6 11" stroke="white"/>
          </svg>
        </a>
        <span>{{ title }}</span>
        <span></span>
      </h4>
      <div class="video-settings__block">
        <ul class="video-settings__lists" :class="{'active-list': sublistIndex}">
          <li v-for="(list, index) in lists" :key="list.value" class="video-settings__list" @click="choose(list, index)">
            <span>{{ list.name }}</span>
            <span class="video-settings__list-value">
              {{ list.value }}
              <svg
                style="transform: rotate(180deg)"
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 1L1 6L6 11" stroke="white"/>
              </svg>
            </span>
          </li>
        </ul>
        <ul class="video-settings__lists" :class="{'active-sublist': !sublistIndex}">
          <li v-for="list in subLists[sublistIndex]" :key="list" class="video-settings__list" @click="setValue(list)">
            <span class="video-settings__list-value">
              <svg
                :style="{opacity: lastValue === list ? 1 : 0}"
                style="margin: 0 5px 0 0;"
                width="12"
                height="10"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 7.5L6.5814 15L17 1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ list }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Настройки',
      lists: [
        {
          name: 'Скорость воспроизведения',
          value: 'Обычная',
          sublistIndex: 'speed'
        },
        {
          name: 'Качество видео',
          value: '360p',
          sublistIndex: 'quality'
        }
      ],
      subLists: {
        speed: ['0.25', '0.5', '0.75', 'Обычная', '1.25', '1.5', '2'],
        quality: ['144p', '360p', '480p', '720p', '1080p']
      },
      sublistIndex: null,
      listIndex: null,
      lastValue: null
    }
  },
  computed: {
    VIDEO () {
      return this.$store.state.video.video
    }
  },
  methods: {
    choose (list, index) {
      this.title = list.name
      this.sublistIndex = list.sublistIndex
      this.listIndex = index
      this.lastValue = list.value
    },
    openMenu () {
      this.title = 'Настройки'
      this.sublistIndex = null
    },
    setValue (list) {
      this.lists[this.listIndex].value = list
      if (this.sublistIndex === 'speed') {
        if (list === 'Обычная') {
          list = 1
        }
        this.VIDEO.playbackRate = parseFloat(list)
      }
      this.openMenu()
    }
  }
}
</script>

<style scoped>
  .video-settings {
    width: 100%;
    position: relative;
    z-index: 2;
  }
  .video-settings__modal {
    position: absolute;
    width: 350px;
    bottom: 60px;
    right: 20px;
    background: rgba(0, 0, 0, .5);
    overflow: hidden;
  }
  .video-settings__title {
    display: flex;
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
  }
  .video-settings__lists {
    padding: 0;
    margin: 0;
    transform: translate3d(0, 0, 0);
    opacity: 1;
    visibility: visible;
    transition: all .2s;
    height: auto;
  }
  .video-settings__lists.active-list {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-30px, 0, 0);
    height: 0;
  }
  .video-settings__lists.active-sublist {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(30px, 0, 0);
  }
  .video-settings__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 13px;
  }
  .video-settings__list:hover {
    background: rgba(255, 255, 255, .1);
    cursor: pointer;
  }
  .video-settings__list-value {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .video-settings__list-value svg {
    margin-left: 5px;
  }
</style>
