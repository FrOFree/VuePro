<template>
  <div>
    <div class="user_list">
      <Form :model="queryData">
        <Row :gutter="5">
          <Col span="19">
            <FormItem>
              <Input v-model="queryData.name" placeholder="姓名查询,点击结果列表获取对应详情" />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Button @click="reinit" type="primary">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table :columns="columns" :data="data" @on-row-click="show" border></Table>
    </div>
    <div class="user_show">
     <Form ref="ruleValidate" :model="userData"  :label-width="60">
        <FormItem label="UserId" prop="userId">
          <Input v-model="userData.userId" placeholder="点击左侧列表可展示对应信息" readonly/>
          </FormItem>      
        <FormItem label="UserName" prop="userName">
          <Input v-model="userData.userName" placeholder="" readonly/>
        </FormItem>
        <FormItem label="Age" prop="age">
          <Input v-model="userData.age" placeholder="" readonly/>
        </FormItem>
        <FormItem label="Adress" prop="adress">
            <Input v-model="userData.address" placeholder="" type ="textarea" readonly/>
        </FormItem>
        <FormItem label="Remarks" prop="remarks">
          <Input v-model="userData.remarks" placeholder="" type="textarea" readonly/>
        </FormItem>
        </Form>
    </div>
  </div> 
</template>

<script>
import {findByPage,getByName} from '@/api/user';
import Vue from 'vue';
import Qs from 'qs';
export default {
  name: '',
  data () {
    return {
      age: 0,
      userData: {
        userId: '',
        userName: '',
        age: '',
        address: '',
        remarks: ''
      },
      queryData:{
        name: ''
      },
      data:[],
      columns:[
        {title:'名称',key:'userName'}
      ]
    };
  },
  components: {},
  mounted(){
    if(typeof(this.$route.params.param) == 'undefined'){
      this.$Message.error("无参数数据，可在左侧查询");
    }else{
      this.userData = this.$route.params.param;
      this.queryData.name = this.userData.userName; 
    }
    this.reinit();
  },
  methods: {
    person () {
      setInterval(() => {
        this.age++;
        console.log(this.age);
      }, 1000);
    },
    reinit (){//动态加载数据，用于模拟查询功能
      this.data = [];
      getByName(this.queryData.name).then(res =>{
        if(res.data.data === ""){

        }else{
          this.data.push(res.data.data);
        }
      })
      .catch(err =>{
          this.$Message.error("查询失败 " + err);
          console.log(err);
      });
    },
    show(row){
      this.userData = row;
    }
  }
};
</script>

<style scoped lang="less">
.user_show{
  width:50%;
  margin-left:5%;
  margin-top:5%;
  float:left;

}
.user_list{
  width: 18%;
  height:100%;
  margin-left:2%;
  margin-top:5%;
  float:left;
  border-right:palegoldenrod 1px;
}
</style>
