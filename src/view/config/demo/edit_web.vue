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
        <Form ref="ruleValidate" :model="editData" :rules="rules" :label-width="60">
            <FormItem label="Name" prop="userName">
                <Input v-model="editData.userName" placeholder="请选择特征英文名"/>
            </FormItem>
            <FormItem label="Age" prop="age">
                <Input v-model="editData.age" placeholder="请输入年龄"/>
            </FormItem>
            <FormItem label="Adress" prop="adress">
                <Input v-model="editData.address" placeholder="请输入地址" type ="textarea"/>
            </FormItem>
            <FormItem label="Remarks" prop="remarks">
              <Input v-model="editData.remarks" placeholder="备注" type="textarea"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="error" @click="_cancle">取消</Button>
            <Button type="primary" @click="_createApply">确定</Button>
        </div>
    </Modal>
</template>

<script>
import Format from '@/libs/format.js';
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
    },
    popOriData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      modalFlag: false,
      editData: {
        userName: '',
        age: '',
        address: '',
        date: '',
        remarks: ''
      },
      rules :{
        userName: [{ required: true, validator: Format.FormValidate.editData().name, trigger: 'change' }],
        age: [{ required: true, validator: Format.FormValidate.editData().age, trigger: 'change' }],
        date: [{ required: true, validator: Format.FormValidate.editData().date, trigger: 'change' }]
      }
    };
  },
  mounted(){
    // console.log(Format.FormValidate.editData().name);
  },
  methods: {
    // @_cancle点击取消按钮
    _cancle () {
      //this.modalFlag = false;
      //  取消修改，使用原始数据赋值
      this.popData.age = this.popOriData.age;
      this.popData.userName = this.popOriData.userName;
      this.popData.address = this.popOriData.address;
      this.popData.remarks = this.popOriData.remarks;
      this.$emit('changeModal', false);
    },
    // @_createApply点击提交按钮
    _createApply () {
      this.$refs.ruleValidate.validate((valid) =>{
        if (valid){
          this.$emit('updateData', this.editData);
          //this.modalFlag = false;
          // this.$Message.success('修改成功');
          // this.$emit('changeModal', false);
        }
      });
    }
  },
  watch: {
    modal (val) {
      this.modalFlag = val;
      this.editData = this.popData;
      //this.popOriData = this.popData;
      this.popOriData.age = this.popData.age;
      this.popOriData.userName = this.popData.userName;
      this.popOriData.address = this.popData.address;
      this.popOriData.remarks = this.popData.remarks;
    },
    modalFlag (val) {
      this.$emit('changeModal', val);
      this.editData = this.popData;
    }
  }
};
</script>

<style lang='less' scoped>
</style>
