<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入您的用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form';
// import {loginIn} from '@/api/user';
// import {getApi} from '@/api/data.js';
import { mapActions } from 'vuex';
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ username, password }) {
      // loginIn({ username, password }).then(rst => {
      //   let {msg, code, data} = rst;
      //   if (this.$successFun(code)) {
      //     if (!(data.accessToken === undefined || data.refreshToken === undefined)) {
      //       sessionStorage.setItem('accessToken', data.accessToken);
      //       sessionStorage.setItem('refreshToken', data.refreshToken);
      //       this.$router.push({
      //         name: this.$config.homeName
      //       });
      //     } else {
      //       this.$router.push({
      //         name: this.$config.loginName
      //       });
      //     }
      //   } else {
      //     this.$Message.info(msg);
      //   }
      // });
    }
  }
};
</script>

<style>

</style>
