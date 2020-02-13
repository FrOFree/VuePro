<template>
  <Modal
    :width='600'
    class-name="content"
    v-model="modalFlag"
    :mask-closable="false"
  >
    <div slot="header" style="fontSize:14px;fontWeight:bold">
      <span>{{title}}</span>
    </div>
    <forms :columns="columns"
           :popData="popData"
           :ref="refs"
           :formLabel="formLabel"
           @on-addSelctData="addSelctData"
           @on-success="onSuccess"
           :submitFlag="submitFlag"></forms>
    <div slot="footer">
      <Button type="error" @click="_cancle" style="background:#fff;border:1px solid #eee;color:#000">取消</Button>
      <Button type="primary" @click="_createApply" style="background:#409eff">确定</Button>
    </div>
    <add-select-data
      :modal="nextModal.modal"
      :addTotal="addTotal"
      :addSelectData="addSelectData"
      :addSelectColumns="addSelectColumns"
      @changeAddModal="changeAddModal"
      @getRowData="getRowData"
      @on-addPage="addPage"
    ></add-select-data>
  </Modal>
</template>
<script>
import forms from '@/components/forms/forms';
import Tables from '@/components/tables/commonTables.vue';
import AddSelectData from '@/components/tables/AddSelectData';
export default {
  name: 'add',
  components: {
    forms,
    Tables,
    AddSelectData
  },
  inject: ['reload'],
  props: {
    formLabel: {
      type: Number,
      default: 100
    },
    /*
   二级弹窗数据begin
   **/
    addTotal: 0,
    addSelectColumns: {
      type: Array,
      default () {
        return [];
      }
    },
    addSelectData: {
      type: Array,
      default () {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    modal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    modalData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      keyValue: {},
      nextModal: {
        modal: false
      },
      modalFlag: false,
      popData: {},
      popRules: {},
      refs: 'handle',
      submitFlag: false
    };
  },
  watch: {
    modal (val) {
      this.modalFlag = val;
      // 如果是编辑页面，则赋值反显信息
      this.popData = this.modalData;
    },
    modalFlag (val) {
      this.$emit('changeModal', val);
    },
    modalData (val) {
      this.popData = this.modalData;
    },
    deep: true,
    immediate: true
  },
  methods: {
  // 点击取消按钮
    _cancle () {
      this.modalFlag = false;
      this.reload();
    },
    // 点击提交按钮
    _createApply () {
    // 提交
      this.submitFlag = !this.submitFlag;
    },
    onSuccess (val) {
      let {formData, valid} = val;
      if (valid) {
        this.$emit('getFormData', formData);
      } else {
        this.$Message.error('校验不通过');
      }
    },
    addSelctData (parram) {
      this.keyValue = parram;
      this.nextModal.modal = true;
    },
    changeAddModal (val) {
      this.nextModal.modal = val;
    },
    getRowData (row) {
      let params = {};
      // key为目标键
      for (let key in this.keyValue) {
        params[key] = row[this.keyValue[key]];
      }
      this.$emit('getRowData', params);
    },
    addPage (index) {
      this.$emit('on-addPage', index);
    }
  }
};
</script>
<style lang="css" scoped>
</style>
