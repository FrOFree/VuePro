<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
      {{localKey}}
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
import users from './users.vue';
import '@/index.less';
import {login} from '@/api/user';
// import {getApi} from '@/api/data.js';
// import { mapActions } from 'vuex';
import { mapState,mapMutations } from 'vuex';


export default {
  components: {
    LoginForm
  },
  methods: {
    // ...mapActions([
    //   'handleLogin',
    //   'getUserInfo'
    // ]),
    handleSubmit ({ username, password }) {
      // loginIn({ username, password }).then(rst => {
      //   let {msg, code, data} = rst;
      //   if (this.$successFun(code)) {
      //     if (!(data.accessToken === undefined || data.refreshToken === undefined)) {
             //sessionStorage.setItem('accessToken', data.accessToken);
             //sessionStorage.setItem('refreshToken', data.refreshToken);
             //localStorage.token.setItem('userId',username);

            users.userss.userId = username;
            users.userss.passWord = password;
            login(users).then(res=>{
              users.userss.userName = res.data.data.userName;
              if (users.userss.userName == "" || users.userss.userName == null){

              }else{
                this.$Message.success("登录成功，用户："+res.data.data.userName);
                let x = this.initLocalKey();
                // console.log(x+',key:'+this.$store.state.localKey);
                console.log(x+',key:'+this.localKey);
                // this.setToken();
              }
              // this.$Format.loginFlag = true;
              // console.log(this.$Format.loginFlag);git 
              // this.$router.push({name: 'home'});
            }).catch(err=>{
              this.$Message.error("登录验证失败"+err);
            });

    }
  },
  computed:{
    ...mapState(['localKey']),
    ...mapMutations(['setToken','initLocalKey']),
    // localKey:state => state.localKey;
  }
};
</script>

<style>

</style>
