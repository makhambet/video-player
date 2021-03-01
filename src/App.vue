<template>
  <div id="app">
    <video-block
      :src="'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'"
      :poster="'https://www.searchenginejournal.com/wp-content/uploads/2018/10/How-to-Boost-Your-Images%E2%80%99-Visibility-on-Google-Images-760x400.png'"
    ></video-block>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    VideoBlock: () => ({
      component: import('@/components/video/index')
    })
  }
}
</script>

<style>
body {
}
</style>
