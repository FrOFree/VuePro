<template>
    <Modal
        :width='400'
        class-name="content"
        v-model="modalFlag_add"
        :mask-closable="false"
        :closable="false"
    >
        <div slot="header" style="fontSize:14px;fontWeight:bold">
            <span>{{this.title_add}}</span>
        </div>
        <Form ref="ruleValidate" :model="addData" :rules="rules" :label-width="60">
            <FormItem label="姓名" prop="name">
                <Input v-model="addData.name" placeholder="请选择特征英文名"/>
            </FormItem>
            <FormItem label="年龄" prop="age">
                <Input v-model="addData.age" placeholder="请选择特征英文名"/>
            </FormItem>
            <FormItem label="地址" prop="address">
              <Input v-model="addData.address" placeholder="" type="textarea"/>
            </FormItem>
            <FormItem label="日期" prop="date">
              <Input v-model="addData.date" placeholder="请选择日期" type="date"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="error" @click="_cancle_add">取消</Button>
            <Button type="primary" @click="_createApply_add">确定</Button>
        </div>
    </Modal>
</template>

<script>
import Format from '@/libs/format.js';
export default {
  name: '',
  props: {
    modal_add: {
      type: Boolean,
      default: false
    },
    title_add: {
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
      modalFlag_add: false,
      addData: {
        name: '',
        age: '',
        address: '',
        date: ''
      },
      rules: {
        name: [{ required: true, validator: Format.FormValidate.editData().name, trigger: 'change' }],
        age: [{ required: true, validator: Format.FormValidate.editData().age, trigger: 'change' }],
        date: [{ required: true, validator: Format.FormValidate.editData().date, trigger: 'change' }]
      }
    };
  },
  mounted () {},
  methods: {
    // @_cancle点击取消按钮
    _cancle_add () {
      this.$emit('changeModal2', false);
    },
    // @_createApply点击提交按钮
    _createApply_add () {
      this.$refs.ruleValidate.validate((vali) => {
        if(vali){
          this.$emit('getAddData2', this.addData);
          this.$Message.success('新增成功');
          this.$emit('changeModal2', false);
        }
      })
    }
  },
  watch: {
    modal_add (val) {
      this.modalFlag_add = val;
      //this.addData = this.popData;
      //this.popOriData = this.popData;
    },
    modalFlag_add (val) {
      this.$emit('changeModal2', val);
      this.addData = this.popData;
    }
  }
};
</script>

<style lang='less' scoped>
</style>
