<template>
  <div class="top">
    <div class="top__content">
      <h1 class="top__title">
        {{ videoName || 'Название курса.Введение' }}
      </h1>
      <div class="top__info">
        <VideoInfoIcon />
      </div>
    </div>
  </div>
</template>

<script>
import VideoInfoIcon from '~~/assets/svg/video-info.svg?inline'

export default {
  components: {
    VideoInfoIcon
  },
  props: {
    videoName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
  .top {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    color: #FFFFFF;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%);
    border-radius: 5px;
    z-index: 1;
  }
  .top__content {
    padding: 17px 12px 0 19px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top__title {
    font-size: 14px;
    margin-top: 0;
  }
</style>
