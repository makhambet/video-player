<template>
  <div class="top">
    <div class="top__content">
      <h1 class="top__title">Название курса. Введение</h1>
      <div class="top__info">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 11C21 16.5228 16.5228 21 11 21C5.47717 21 1 16.5228 1 11C1 5.47717 5.47717 1 11 1C16.5228 1 21 5.47717 21 11ZM12 5V7H10V5H12ZM12 17V9H10V17H12Z" fill="#EAEAEA"/>
          <path d="M11 21.5C16.799 21.5 21.5 16.799 21.5 11C21.5 5.20103 16.799 0.5 11 0.5C5.20103 0.5 0.5 5.20103 0.5 11C0.5 16.799 5.20103 21.5 11 21.5ZM11.5 5.5V6.5H10.5V5.5H11.5ZM10.5 9.5H11.5V16.5H10.5V9.5Z" stroke="black" stroke-opacity="0.1"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {

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