<template>
    <div>
        <p>这里是登录页面！！</p>
        <hr/>
        <p @click="jumpPage()" class="button">点击这里返回home页</p>
    </div>
</template>

<script>

export default {
    data(){
        return {

        }
    },
    created(){

    },
    methods: {
      jumpPage() {
        window.location.href = '/home/home.html'
      }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button {
  cursor: pointer;
}

</style>
