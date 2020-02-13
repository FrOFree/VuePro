<template>
  <div id="app">
    <div>
        <form action="">
            <Input v-model="value" placeholder="输入姓名--区分大小写" style="width: 300px" />
            <Button @click="show" type="primary">查询</Button>
        </form>
    </div>
      <div>
        <div>
          <Button @click="add" type="primary">新增</Button>
        </div>
        <Table border :columns="columns12" :data="data6">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="error" size="small" style="margin-right: 5px" @click="update(row)">update</Button>
            <Button type="error" size="small" @click="remove(index)">Delete</Button>
        </template>
    </Table>
      </div>
      <update-list @getAddData="getAddData" @changeModal="changeModal" :title="popData.title" :modal="popData.modal" :popData="popData.editData"></update-list>
  </div>
</template>

<script>
import updateList from './update'
export default {
  data () {
            return {
                value: '',
                popData: {
                    modal: false,
                    title: '',
                    editData: {}
                },
                columns12: [
                    {
                        title: 'Name',
                        slot: 'name'
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
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                data6: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park'
                    }
                ]
            }
        },
        components: {
            updateList
        },
        methods: {
            show () {
                // this.$Modal.info({
                //     title: 'User Info',
                //     content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                // })
                let len = this.data6.length
                for(let i=len;i>0;i--){
                    if(this.data6[i-1].name.indexOf(this.value)>-1){
                        
                    }else{
                        this.data6.splice(i-1, 1);
                    }
                }

            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            update (params) {
                this.popData.modal = true;
                this.popData.title = '编辑';
                this.popData.editData = params;
            },
            add () {
        this.popData.modal = true;
        this.popData.title = '新增';
        this.popData.editData = {};
    },
    changeModal (param) {
      this.popData.modal = param;
    },
    getAddData (param) {
      this.data6.push(param);
    }
        }
}
</script>

<style scoped lang="css">

</style>