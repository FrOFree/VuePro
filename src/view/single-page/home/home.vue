<template>
   <div class="main">
      <div class="list">
        <Input :rows="10" :maxlength="4000" v-model="show.content" show-word-limit type="textarea" placeholder="展示栏" readonly style="width: 100%" />
      </div>
      <div class="test">
        <Row>
          <Button @click="getByName" type="primary">测试后端</Button>
        </Row>
        <br>
        <Row>
          <Button @click="showIns" type="primary">操作手册</Button>
        </Row>
      </div>
   </div>
</template>

<script>
import {getByName} from '@/api/user';
export default {
  name: '',
  data () {
    return {
      show:{
        title:'',
        content:''
      },
      ins:'1.登陆用户名密码随意，登陆为模拟登陆\r\n2.客户模块分为从localStorage和远程服务读取数据（在左侧已展示），如远程服务有问题请在(localStorage)标识的页面演示'+
        '\r\n3.localStorage模式，初始数据用于测试，设置为不能删除，可以用新增数据进行删除操作'
    };
  },
  mounted(){
  },
  components: {},
  methods:{
    getByName(){
      getByName('lixl').then(res =>{
        this.show.content = JSON.stringify(res.data);
      })
      .catch(err =>{
        this.show.content = '测试失败：'+err
      });
    },
    showIns(){
      this.show.content = this.ins;
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
  .test{
    width:10%;
    margin-top: 5%;
    float: right;
  }
  .list{
    width:40%;
    height:90%;
    float:right;
    margin-right:5%;
    background-size: cover;
    background-color: rgba(0,0,0,0.5);
    padding: 15px;
    padding-top: 30px;
  }
  .list:after{
    padding: 15px;
    padding-top: 30px;
    -webkit-filter: blur(20px);
    -moz-filter: blur(20px);
    -ms-filter: blur(20px);
    -o-filter: blur(20px);
    filter: blur(20px); 
    background-attachment: fixed;
    background-size: cover;
    background-color: rgba(0,0,0,0.5);
  }
</style>
