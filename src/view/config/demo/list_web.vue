<template>
<div style="width:95%;margin:2% auto;padding-top:20px">
  <Form :model="tableData">
        <Row :gutter="20">
          <Col span="5">
            <FormItem>
              <!-- <Select clearable v-model="refuse.reqCode" placeholder="请选择产品名" >
                <Option v-for="item in prodNameList" :value="item.prodNo" :key="item.prodName">{{ item.prodName }}</Option>
              </Select> -->
              <Input v-model="tableData.userName" placeholder="请输入姓名" />
              <!-- <Input style="" v-model="refuse.reqCode" placeholder="请输入风控产品编码"></Input> -->
            </FormItem>
          </Col>
          <Col span="17">
            <FormItem>
              <Button @click="reinit" type="primary">查询</Button>
            </FormItem>
          </Col>
          <Col span="1">
            <FormItem>
              <Button @click="add" type="primary">新增</Button>
            </FormItem>
          </Col>
        </Row>
  </Form>
    <Table :columns="columns" :data="data" border></Table>
    <add @getAddData2="getAddData2" @changeModal2="changeModal2" :title_add="popData_add.title_add" :modal_add="popData_add.modal_add" :popData="popData_add.editData"></add>
    <edit-list @updateData="updateData" @changeModal="changeModal" :title="popData.title" :modal="popData.modal" :popData="popData.editData"></edit-list>
</div>
</template>
<script>
import add from './add_web';
import editList from './edit_web';
import staticData from '@/assets/data/static_data.js'
import {findByPage,updateById,getByName,deleteById,insert} from '@/api/user';
import Vue from 'vue';
import Qs from 'qs';
Vue.prototype.$qs = Qs;

export default {
  components: {
    editList,
    add
  },
  data () {
    return {
      tableData: {
        userId:'',
        userName: '',
        age: 0,
        address: '',
        date: '',
        remarks: '',
        ctTime: ''
      },
      pageSize:2,
      columns: [
        {
          title: '序号',
          key: 'index',
          type: 'index',
          width: '70px' 
        },
        {
          title: 'Name',
          key: 'userName',
          width: '300px',
          render:(h,param) =>{
            return h('a',{
              style: {
                textDecoration: 'underline'
              },
              herf: '/home',
              on: {
                'click': () =>{
                  // this.hanleLink(param.row)
                  this.$router.push({name: '客户信息(后端)',params:{'param':param.row} });
                }
              }
            } , param.row.userName)
          }
        },
        {
          title: 'Age',
          key: 'age',
          width: '90px'
        },
        {
          title: 'Address',
          key: 'address',
          // width: '400px'
        },
        {
            // title: 'Date',
            // key: 'date',
            // width: '200px'
            title: 'Remarks',
            key: 'remarks',
            width: '200px'
        },
        {
          title: 'CtTime',
          key : 'ctTime'
        },
        {
          title: '操作',
          width: 200,
          render: (h, params) => {
            return h('div', 
              {
                style: {
                  width: '350px'
                }
              },
              [
              (params.row.age >= 40) && h('Button', {
                style: {
                  marginRight: '5px',
                  'margin-left': '5px',
                  'background': '#f56c6c',
                  color: '#111',
                  'padding': '2px 8px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '确认删除',
                      content: '<p>是否确认删除？</p>',
                      onOk: () => {
                        this.remove(params.index);
                      },
                      onCancel: () => {
                        this.$Message.info('取消删除');
                      }
                    });
                  }
                }
              }, '删除'),
              (params.row.age < 40) && h('Button', {
                        style: {
                            marginRight: '5px',
                            'margin-left': '5px',
                            'background': '#f56',
                            color: '#fff',
                            'padding': '2px 8px'
                        },
                        on: {
                        click: () => {
                            this.$Modal.confirm({
                              title: '确认置为失效',
                              content: '<p>是否确认置失效(无失效状态，直接删除)？</p>',
                              onOk: () => {
                                this.remove(params.index);
                              },
                              onCancel: () => {
                                this.$Message.info('取消操作');
                              }
                            });
                        }
                        }
              }, '失效'),
              h('Button', {
                        style: {
                            marginRight: '0px',
                            'margin-left': '5px',
                            'background': '#f56',
                            color: '#fff',
                            'padding': '2px 8px'
                        },
                        on: {
                        click: () => {
                            this.popData.modal = true;
                            this.popData.title = '修改';
                            this.popData.editData = params.row;
                        }
                        }
                }, '编辑')
            ]);
          }

        }
      ],
      finalData: [],
      data: [],
      popData: {
        modal: false,
        title: '',
        editData: {}
      },
      popData_add: {
        modal_add: false,
        title_add: '',
        editData: {}
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    add () {
      this.popData_add.modal_add = true;
      this.popData_add.title_add = '新增';
    },
    remove (index) {
      let user = this.data[index];
      deleteById(user.userId).then(res => {
        if(res.data.code == '1003'){
          this.$Message.error(res.data.msg);
        }else{
          this.$Message.success('删除成功');
          this.init();
        }
        console.log(res);
      }).catch(err => {
        this.$Message.error('删除报错：'+ err);
        console.log(err);
      });
    },
    init (){//初始化加载数据
      let json = JSON.parse("{}");
      json.pageNo = 1;
      json.pageSize = 10;
      this.data = [];
      // console.log(JSON.stringify(json));
      let param = this.$qs.stringify(json);
      findByPage(param).then (res =>{
        // console.log(res.data.data);
        this.data = res.data.data;
      }).catch(err => {
        this.$Message.error("查询失败 " + err);
        console.log(err);
      }); 
    },
    reinit (){//动态加载数据
      this.data = [];
      if(this.tableData.userName == "" ||this.tableData.userName == null){
        this.init();
      }else{
        getByName(this.tableData.userName).then(res =>{
          if(res.data.data === ""){
  
          }else{
            this.data.push(res.data.data);
          }
        })
        .catch(err =>{
            this.$Message.error("查询失败 " + err);
            console.log(err);
        });
      }
    },
    reset (user) {
      updateById(user).then (res =>{
        // console.log(res);
        this.$Message.success('修改成功');
        this.changeModal(false);
      }).catch(err => {
        console.log(err);
        this.$Message.error('修改失败:' + err);
      }); 
    },
    changeModal (param) {
      this.popData.modal = param;
    },
    updateData (param) {
      //持久层操作
      this.reset(param);
    },
    changeModal2 (param) {
      this.popData_add.modal_add = param;
    },
    getAddData2 (param) {//新增
      param.userId = Math.random().toString(36);
      
      insert(param).then(res => {
        this.$Message.success('新增成功');
        this.changeModal2(false);
        this.popData_add.editData = {};
        // this.reset(param);
        this.init();
      }).catch(err => {
        this.$Message.error('新增报错:'+err);
      });

    }
  }
};
</script>
