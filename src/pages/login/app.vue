<template>
    <div>
        <p>这里是登录页面！！</p>
        <hr/>
        <p @click="jumpPage()">点击这里返回home页</p>
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
        window.location.href = 'http://192.168.1.138:8080/home/home.html'
      }
    }
}
</script>

<style scoped>


</style>
