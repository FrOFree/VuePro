<template>
   <Modal
        :width='400'
        class-name="content"
        v-model="modalFlag"
        :mask-closable="false"
        :closable="false"
    >
    <div slot="header" style="fontSize:14px;fontWeight:bold">
            <span>{{this.title}}</span>
        </div>
        <Form ref="ruleValidate" :model="editData" :label-width="60">
            <FormItem label="姓名" prop="name">
                <Input v-model="editData.name" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="年龄" prop="age">
                <Input v-model="editData.age" placeholder="请输入年龄"/>
            </FormItem>
            <FormItem label="地址" prop="add">
                <Input v-model="editData.address" placeholder="请输入地址"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="error" @click="nosure">取消</Button>
            <Button type="primary" @click="sure">确定</Button>
        </div>
    </Modal>
</template>

<script>
export default {
  name: 'editor',
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    popData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      modalFlag: false,
      editData: {
        name: '',
        age: '',
        address: ''
      },
      oldName: '',
      oldAge: '',
      oldAddress: ''
    };
  },
  mounted () {
      
  },
  methods: {
    //取消
    nosure () {
      this.modalFlag = false;
      this.editData.name = this.oldName;
      this.editData.age = this.oldAge;
      this.editData.address = this.oldAddress;
      this.$emit('changeModal', false);
    },
    // 确定
    sure () {
        if(this.title==='新增'){
            this.$emit('getAddData', this.editData);
            this.modalFlag = false;
            this.$Message.success('新增成功');
            this.$emit('changeModal', false);
        }else{
            this.modalFlag = false;
            this.$Message.success('修改成功');
            this.$emit('changeModal', false);
        }
    }
  },
  watch: {
    modal (val) {
      this.oldName = this.editData.name;
      this.oldAge = this.editData.age;
      this.oldAddress = this.editData.address;
      this.modalFlag = val;
      this.editData = this.popData;
    },
    modalFlag (val) {
      this.$emit('changeModal', val);
      this.editData = this.popData;
    }
  }
};
</script>

<style>

</style>