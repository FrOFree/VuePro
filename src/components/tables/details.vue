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
           :formLabel="formLabel"
           :popData="popData"
           :ref="refs"
           :detail="true"
           :submitFlag="submitFlag"></forms>
    <div slot="footer">
      <Button type="primary" @click="_cancle">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import forms from '@/components/forms/formsDetail';
export default {
  name: 'add',
  components: {
    forms
  },
  inject: ['reload'],
  props: {
    formLabel: {
      type: Number,
      default: 100
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
      modalFlag: false,
      popData: {},
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
      this.$emit('changeMoDetail', val);
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
    }
  }
};
</script>
<style lang="css" scoped>
</style>
