<template>
  <div>
    <p>this is demo page.</p>
    <p>i am {{auth}}</p>
    <img src="./images/123.jpg" alt="">
    <div @click='pageJump()' class="jump">
      点击这里去登录页
    </div>
    <hr/>
    <div>
      <router-link to="/A">点击这里切换路由A</router-link>
      <router-link to="/B">点击这里切换路由B</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        auth: '康强'
      }
    },
    methods: {
      pageJump () {
        console.log(1)
        window.location.href = '/login/login.html'
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .jump {
    cursor: pointer;
    color: lightpink;
  }
</style>

