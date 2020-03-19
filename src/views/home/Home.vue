<template>
  <div class="home">
    Home
    <el-button type="primary" plain @click="exit">退出</el-button>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {
   
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  },
}
</script>
<style lang="scss" scoped>



</style>
