<template>
    <Modal
        v-model="modalFlag"
        :mask-closable="false"
        :footer-hide="true">
        <div slot="header" style="fontSize:14px;fontWeight:bold">
            <span>密码修改</span>
        </div>
        <div class="changepwd">
            <div class="changepwd-con">
              <Form ref="changepwd" :model="changepwd" :rules="ruleCustom" :label-width="80">
                  <FormItem label="原密码" prop="userOldPasswd">
                      <Input type="password" v-model="changepwd.userOldPasswd"></Input>
                  </FormItem>
                  <FormItem label="新密码" prop="userNewPasswd">
                      <Input type="password" v-model="changepwd.userNewPasswd"></Input>
                  </FormItem>
                  <FormItem label="新密码" prop="userNewPwd">
                      <Input type="password" v-model="changepwd.userNewPwd"></Input>
                  </FormItem>
                  <FormItem>
                      <Button type="primary" @click="handleSubmit('changepwd')">提交</Button>
                      <Button @click="handleReset('changepwd')" style="margin-left: 8px">重置</Button>
                  </FormItem>
              </Form>
            </div>
        </div>
    </Modal>

</template>

<script>
// import { tcSysUsersPatchPwd } from '@/api/userManage';
export default {
  name: 'changePwd',
  props: {
    modal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const userOldPasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('新密码长度不足六位!'));
      } else {
        if (this.changepwd.userNewPwd !== '') {
          // 对第二个密码框单独验证
          this.$refs.changepwd.validateField('userNewPwd');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再一次输入新密码'));
      } else if (value !== this.changepwd.userNewPasswd) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      modalFlag: false,
      changepwd: {
        userNewPasswd: '',
        userNewPwd: '',
        userOldPasswd: ''
      },
      ruleCustom: {
        userOldPasswd: [
          { validator: userOldPasswd, trigger: 'blur' }
        ],
        userNewPasswd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        userNewPwd: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // tcSysUsersPatchPwd(this.changepwd).then(rst => {
          //   let {code, data} = rst.data;
          //   if (this.$successFun(code)) {
          //     if (data.errmessage === '密码修改成功') {
          //       this.$Message.info(data.errmessage);
          //       sessionStorage.removeItem('accessToken', '');
          //       sessionStorage.removeItem('refreshToken', '');
          //       this.$router.push({path: 'login'});
          //       this.modalFlag = false;
          //     } else {
          //       this.$Message.info('原密码错误');
          //     }
          //   } else {
          //     this.$Message.info('密码修改失败');
          //   }
          // });
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  },
  watch: {
    modal (val) {
      this.modalFlag = val;
    },
    modalFlag (val) {
      this.$emit('changeModal', val);
    }
  }
};
</script>

<style lang="less" scoped>
// .changepwd{
//     width: 100%;
//     height: 100%;
//     background-image: url('../../assets/images/wk.png');
//     background-size: cover;
//     background-position: center;
//     position: relative;
//     &-con {
//         position: absolute;
//         right: 30%;
//         top: 50%;
//         transform: translateY(-60%);
//         width: 600px;
//     }
// }
</style>

