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
                <Input v-model="editData.name" placeholder="请选择特征英文名"></Input>
            </FormItem>
            <FormItem label="年龄" prop="age">
                <Input v-model="editData.age" placeholder="请选择特征英文名"></Input>
            </FormItem>
            <FormItem label="住址" prop="address">
                <Input v-model="editData.address" placeholder="请选择特征英文名"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="error" @click="_cancle">取消</Button>
            <Button type="primary" @click="_createApply">确定</Button>
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
  inject: ['reload'],
  data () {
    return {
      modalFlag: false,
      editData: {
        name: '',
        age: '',
        address: ''
      }
    };
  },
  mounted () {},
  methods: {
    // @_cancle点击取消按钮
    _cancle () {
      this.modalFlag = false;
      this.$emit('changeModal', false);
      // this.reload();
    },
    // @_createApply点击提交按钮
    _createApply (name) {
      this.$emit('getAddData', this.editData);
      this.modalFlag = false;
      this.$Message.success('新增成功');
      this.$emit('changeModal', false);
    }
  },
  watch: {
    modal (val) {
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

<style lang='less' scoped>
</style>
