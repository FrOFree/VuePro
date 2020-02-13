<template>
  <Modal
    :width='600'
    class-name="content"
    v-model="modalFlag"
    :mask-closable="false"
  >
    <div slot="header" style="fontSize:14px;fontWeight:bold">
      <span>选择数据</span>
    </div>
    <Table :columns="addSelectColumns"
           :data="dataCurrent"
           @on-row-click="getRowData"
           highlight-row
    ></Table>
    <Page show-total :total="addTotal" :page-size="pageSize" show-elevator @on-change="getCurrent" />
  </Modal>
</template>
<script>
export default {
  name: 'add-select',
  components: {
  },
  inject: ['reload'],
  props: {
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
    modal: {
      type: Boolean,
      default: false
    }
    // modalData: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data () {
    return {
      pageSize: this.$config.pageSize,
      modalFlag: false,
      dataCurrent: [],
      refs: 'handle',
      submitFlag: false
    };
  },
  watch: {
    modal (val) {
      this.modalFlag = val;
      // 如果是编辑页面，则赋值反显信息
      this.dataCurrent = this.addSelectData;
    },
    modalFlag (val) {
      this.$emit('changeAddModal', val);
    },
    addSelectData (val) {
      this.dataCurrent = val;
    }
  },
  methods: {
    // 点击取消按钮
    _cancle () {
      this.modalFlag = false;
    },
    // 点击提交按钮
    _createApply () {
      // 提交
      this.submitFlag = !this.submitFlag;
    },
    getRowData (row) {
      this.$emit('getRowData', row);
    },
    getCurrent (index) {
      this.$emit('on-addPage', index);
    }

  }
};
</script>
<style lang="css" scoped>
</style>
