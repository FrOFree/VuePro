<template>
<div style="width:800px;margin: 0 auto;padding-top:20px">
  <Form :model="tableData">
        <Row :gutter="20">
          <Col span="14">
            <FormItem>
              <!-- <Select clearable v-model="refuse.reqCode" placeholder="请选择产品名" >
                <Option v-for="item in prodNameList" :value="item.prodNo" :key="item.prodName">{{ item.prodName }}</Option>
              </Select> -->
              <Input v-model="tableData.name" placeholder="请输入姓名" />
              <!-- <Input style="" v-model="refuse.reqCode" placeholder="请输入风控产品编码"></Input> -->
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem>
              <Button @click="add" type="primary">新增</Button>
            </FormItem>
          </Col>
        </Row>
  </Form>
    <Table :columns="columns" :data="data" border></Table>
    <add @getAddData="getAddData" @changeModal="changeModal" :title="popData.title" :modal="popData.modal" :popData="popData.editData"></add>
</div>
</template>
<script>
import add from './add';
export default {
  components: {
    add
  },
  data () {
    return {
      tableData: {
        name: ''
      },
      columns: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: '操作',
          width: 120,
          render: (h, params) => {
            return h('div', [
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
              }, '删除')
            ]);
          }

        }
      ],
      data: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      popData: {
        modal: false,
        title: '',
        editData: {}
      }
    };
  },
  methods: {
    add () {
      this.popData.modal = true;
      this.popData.title = '新增';
    },
    remove (index) {
      this.data.splice(index, 1);
    },
    changeModal (param) {
      this.popData.modal = param;
    },
    getAddData (param) {
      console.log(param);
      this.data.push(param);
    }
  }
};
</script>
