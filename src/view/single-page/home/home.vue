<template>
   <div class="main">
      <Button @click="test" type="primary">测试后端</Button>
   </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {};
  },
  mounted(){
  },
  components: {},
  method:{
    test(){

    }
  }
};
</script>

<style scoped lang="css">
  .main{
    width: 100%;
    height: 100%;
    background-image: url('../../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
  }
</style>
