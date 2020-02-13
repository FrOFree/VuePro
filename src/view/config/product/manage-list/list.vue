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
        <FormItem label="Key" prop="key">
          <Input v-model="userData.key" placeholder="点击左侧列表可展示对应信息" readonly/>
          </FormItem>      
        <FormItem label="Name" prop="name">
          <Input v-model="userData.name" placeholder="" readonly/>
        </FormItem>
        <FormItem label="Age" prop="age">
          <Input v-model="userData.age" placeholder="" readonly/>
        </FormItem>
        <FormItem label="Adress" prop="adress">
            <Input v-model="userData.address" placeholder="" type ="textarea" readonly/>
        </FormItem>
        <FormItem label="Date" prop="date">
          <Input v-model="userData.date" placeholder="请选择日期" type="date" readonly/>
        </FormItem>
        </Form>
    </div>
  </div> 
</template>

<script>
export default {
  name: '',
  data () {
    return {
      age: 0,
      userData: {
        key: '',
        name: '',
        age: '',
        address: '',
        date: ''
      },
      queryData:{
        name: ''
      },
      data:[],
      columns:[
        {title:'名称',key:'name'}
      ]
    };
  },
  components: {},
  mounted(){
    if(typeof(this.$route.params.param) == 'undefined'){
      
    }else{
      this.userData = this.$route.params.param;
      this.queryData.name = this.userData.name; 
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
      JSON.parse(window.localStorage.getItem('users')).filter(item => {
        if(item.name.includes(this.queryData.name)){
          this.data.push(item);
        }
      })
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
