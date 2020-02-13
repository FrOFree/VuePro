<template>
<div style="width:95%;margin:2% auto;padding-top:20px">
  <Form :model="tableData">
        <Row :gutter="20">
          <Col span="5">
            <FormItem>
              <!-- <Select clearable v-model="refuse.reqCode" placeholder="请选择产品名" >
                <Option v-for="item in prodNameList" :value="item.prodNo" :key="item.prodName">{{ item.prodName }}</Option>
              </Select> -->
              <Input v-model="tableData.name" placeholder="请输入姓名" />
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
import add from './add';
import editList from './edit';
import staticData from '@/assets/data/static_data.js'
export default {
  components: {
    editList,
    add
  },
  data () {
    return {
      tableData: {
        name: '',
        age: 0,
        address: '',
        date: ''
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
          key: 'name',
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
                  this.$router.push({name: 'manage',params:{'param':param.row} });
                }
              }
            } , param.row.name)
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
            title: 'Date',
            key: 'date',
            width: '200px'
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
              h('Button', {
                style: {
                  marginRight: '5px',
                  'margin-left': '5px',
                  'background': '#f56c6c',
                  color: '#fff',
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
      if (user.hideflag){//如果是被标记可以删除的数据
        user.name = '';
        this.reset(user);
      }
      this.data.splice(index, 1);
    },
    init (){//初始化加载数据
      if(window.localStorage.getItem('users') == null ){
        //组装JSON
        let json = JSON.parse("[]");
        staticData.data.filter(item => {
          json.push(item);
        });
        window.localStorage.setItem('users',JSON.stringify(json));

        console.log('读取静态文件设置本地数据');
        //模拟查询，初始化加载原始数据，第一次从静态文件取数据
        this.finalData = staticData.data;
        this.data = staticData.data;
      }else{
        console.log('获取localStorage设置本地数据');
        this.finalData = JSON.parse(window.localStorage.getItem('users'));
        this.data = this.finalData;
      }
    },
    reinit (){//动态加载数据，用于模拟查询功能
      this.data = [];
      this.finalData.filter(item => {
        if(item.name.includes(this.tableData.name)){
          //item.hideflag = true;
          this.data.push(item);
        }
      })
    },
    reset (user) {//数据内容维护后，改写localstorage（静态文件中数据属性hideFlag为false的除外）
      let local = JSON.parse(window.localStorage.getItem('users'));
      let new_or_not = local.some(item => {
        return item.key.toString() == user.key.toString();
      });
      if(new_or_not){
        if (user.name == ''){//客户名被置空则为删除操作
          local.splice(local.findIndex(item => {
            item.key == user.key
          }),1);
        }else {//修改
          local.splice(local.findIndex(item => {
            item.key == user.key
          }),1,user);
        }
      }else{//新增
        local.push(user);
      }
      window.localStorage.setItem('users',JSON.stringify(local));
    },
    changeModal (param) {
      this.popData.modal = param;
    },
    updateData (param) {
      this.reset(param);
      //持久层操作
        //XXXXXXX
      //
    },
    changeModal2 (param) {
      this.popData_add.modal_add = param;
    },
    getAddData2 (param) {//新增
      param.key = Math.random().toString(36);
      param.hideflag = true;//可删除
      // this.finalData.push(param);
      this.data.push(param);
      this.popData_add.editData = {};
      this.reset(param);
    }
  }
};
</script>
