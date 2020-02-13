<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <ChangePass @changeModal="changeModal" :modal="pwdData.modal"></ChangePass>
  </div>
</template>

<script>
import './user.less';
import { mapActions } from 'vuex';
// import ChangePwd from '@/view/login/changePwd.vue';
import ChangePass from '../../../../view/login/changePwd';
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  components: {
    ChangePass
  },
  data () {
    return {
      pwdData: {
        modal: false
      }
    };
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      // this.handleLogOut().then(() => {
      //   this.$router.push({
      //     name: 'login'
      //   });
      // });
      sessionStorage.setItem('accessToken', []);
      sessionStorage.setItem('refreshToken', []);
      this.$router.push({
        name: 'login'
      });
    },
    // 修改密码
    changePwd () {
      this.pwdData.modal = true;
    },
    message () {
      this.$router.push({
        name: 'message_page'
      });
    },
    handleClick (name) {
      switch (name) {
      case 'logout': this.logout();
        break;
      case 'message': this.message();
        break;
      case 'changePwd': this.changePwd();
        break;
      }
    },
    changeModal (param) {
      this.pwdData.modal = param;
    }
  }
};
</script>
