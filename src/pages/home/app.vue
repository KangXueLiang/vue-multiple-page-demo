<template>
  <div class="wrap">
    <h1>this is home page.</h1>
    <p>i am {{auth}}</p>
    <hello></hello>
    <img src="./images/123.jpg" alt="" style="width:200px;">
    <div @click='pageJump()' class="jump">
      点击这里跳转页面
    </div>
    <hr/>
    <p>以下是路由功能展示</p>
    <div>
      <router-link to="/A">点击这里切换路由A</router-link>
      <router-link to="/B">点击这里切换路由B</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Hello from '@/components/HelloWorld.vue'
  export default {
    data () {
      return {
        auth: '康强'
      }
    },
    components: {
      Hello
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
  .wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .jump {
    cursor: pointer;
    color: rgb(207, 110, 125);
  }

</style>

