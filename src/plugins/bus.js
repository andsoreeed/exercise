import Vue from 'vue'

Vue.prototype.$bus = new Vue();


// this.$bus.$emit('alert-message', {
//   messages: 提示訊息
//   dismissSecs: 顯示時間(預設5秒),
//   type: 提示樣式 secondary/success/danger/warning,
// });