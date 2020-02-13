<template>
  <div>
    <div class="search-con search-con-top">
      <Form style="overflow: hidden">
          <div v-for="(item, index) in columns" :key="index" v-if="item.isSearch" class="fl">
            <FormItem :prop="item.key">
              <Input v-model="searchData[item.key]" v-if="item.searchFormItem === 'input'" type="text" :placeholder="`请输入${item.title}`"></Input>
              <Input v-model="searchData[item.key]" v-if="item.searchFormItem === 'password'" type="password" ></Input>
              <Select transfer v-model="searchData[item.key]" v-else-if="item.searchFormItem === 'select'" :placeholder="`请输入${item.title}`">
                <Option
                  v-for="(subItem, subIndex) in $getDicList(item.dic)"
                  :key="`${subIndex}_sub`"
                  :value="subItem.dicCode">{{subItem.dicValue}}
                </Option>
              </Select>
              <DatePicker type="datetimerange" transfer v-model="searchData[item.key]" v-else-if="item.searchFormItem === 'date'" @on-change="searchData[item.key]=$event" :placeholder="`请输入${item.title}`" format="yyyy-MM-dd HH:mm:ss" style="width: 300px"></DatePicker>
              <RadioGroup v-model="searchData[item.key]" v-else-if="item.searchFormItem === 'radio'">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
              </RadioGroup>
              <CheckboxGroup v-model="searchData[item.key]" v-else-if="item.searchFormItem === 'checkbox'" >
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
              </CheckboxGroup>
              <Input v-model="searchData[item.key]" v-else-if="item.searchFormItem === 'textarea'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="`请输入${item.title}`"></Input>
              <span v-else></span>
            </FormItem>
          </div>
          <div class="fl" v-for="(item, index) in operList" :key="`${index}_2`" style="height: 45px;overflow: hidden">
            <div class="tc fl" v-if="item === 'search'">
              <Button type="primary" @click="search" icon="ios-search"></Button>
            </div>
            <div class="tc fl" v-if="item === 'refresh'">
              <Button type="primary" @click="refresh" icon="md-refresh"></Button>
            </div>
            <div class="tc fl" v-if="item === 'cancelDelete'">
              <Button type="primary" icon="md-arrow-round-back">删除撤回</Button>
            </div>
            <div class="tc fl" v-if="item === 'commonAdd'">
              <Button type="primary" @click="handle('add')" icon="md-add">新增</Button>
            </div>
            <div class="tc fl" v-if="item === 'ruleAdd'">
              <Button type="primary" @click="handle('add')" icon="md-add">创建规则</Button>
            </div>
            <div class="tc fl" v-if="item === 'modelAdd'">
              <Button type="primary" @click="handle('add')" icon="md-add">创建模型</Button>
            </div>
            <div class="tc fl" v-if="item === 'syncModel'">
              <Button type="primary" >同步线上模型</Button>
            </div>
            <div class="tc fl" v-if="item === 'relate'">
              <Button type="primary" icon="md-add" @click="handle('add')">关联</Button>
            </div>
          </div>
      </Form>
    </div>
    <Table
      border
      stripe
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
      <Page show-total :current="current" :total="total" :page-size="pageSize" show-elevator @on-change="getCurrent" />
    <tables-handle
      :modal="modalInner.modal"
      :addTotal="addTotal"
      :addSelectColumns="addSelectColumns"
      :addSelectData ="addSelectData"
      :modalData="modalInner.modalData"
      :title="modalInner.title"
      :columns="columns"
      @changeModal="changeModal"
      @getFormData="getFormData"
      @getRowData="getRowData"
      @on-addPage="addPage"
      :formLabel="formLabel"
    ></tables-handle>
    <tables-details
      :modal="modalDetails.modal"
      :modalData="modalDetails.modalData"
      :title="modalDetails.title"
      :columns="columns"
      :formLabel="formLabel"
      @changeMoDetail="changeMoDetail"
    ></tables-details>
  </div>
</template>
<script>
import TablesHandle from './handle.vue';
import handleBtns from './handle-btns';
import TablesDetails from './details.vue';
import './index.less';
export default {
  name: 'Tables',
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
    addDefault: {
      type: Object,
      default: () => ({})
    },
    /*
   二级弹窗数据end
   **/
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 1
    },
    operList: {
      type: Array,
      default () {
        return [];
      }
    },
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return '';
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      pageSize: this.$config.pageSize,
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: '',
      modalInner: { // 编辑新增弹窗内容
        modal: false,
        title: '',
        modalData: {}
      },
      modalDetails: {
        modal: false,
        title: '详情',
        modalData: {}
      },
      searchData: {}
    };
  },
  components: {
    TablesHandle,
    TablesDetails
  },
  created () {
    for (let [, value] of this.columns.entries()) {
      // 当前是非操作按钮
      if (value.key !== 'handle') {
        this.modalInner.modalData[value.key] = null;
      }
    }
  },
  methods: {
    handle (flag) {
      sessionStorage.setItem('submitFlag', flag);
      if (flag === 'add') {
        this.modalInner.modal = true;
        this.modalInner.title = '新增';
        this.modalInner.modalData = this.addDefault;
      } else {
        this.modalInner.modal = true;
        this.modalInner.title = '修改';
        this.modalInner.modalData = {};
      }
    },
    refresh () {
      this.$emit('on-refresh');
    },
    changeModal (val) {
      this.modalInner.modal = val;
    },
    getFormData (val) {
      if (sessionStorage.getItem('submitFlag') === 'add') {
        this.$emit('on-add', val);
      } else {
        this.$emit('on-edit', val);
      }
    },
    search () {
      let params = {};
      for (let key in this.searchData) {
        if (this.searchData[key]) {
          params[key] = this.searchData[key];
        }
      }
      this.$emit('on-search', params);
    },
    onEdit () {
      this.modalInner.modal = true;
    },
    getCurrent (index) {
      this.$emit('on-getPage', index);
    },
    // suportEdit (item) {
    //   item.render = (h, params) => {
    //     return h('div', {
    //       props: {
    //         params: params,
    //         value: this.insideTableData[params.index][params.column.key],
    //         edittingCellId: this.edittingCellId,
    //         editable: this.editable
    //       },
    //       on: {
    //         // 'input': val => {
    //         //   this.edittingText = val;
    //         // },
    //         // 'on-start-edit': (params) => {
    //         //   this.edittingCellId = `editting-${params.index}-${params.column.key}`;
    //         //   this.$emit('on-start-edit', params)
    //         // }
    //         // 'on-cancel-edit': (params) => {
    //         //   this.edittingCellId = '';
    //         //   this.$emit('on-cancel-edit', params)
    //         // },
    //         // 'on-save-edit': (params) => {
    //         //   this.value[params.row.initRowIndex][params.column.key] = this.edittingText;
    //         //   this.$emit('input', this.value);
    //         //   this.$emit('on-save-edit', Object.assign(params, {value: this.edittingText}));
    //         //   this.edittingCellId = '';
    //         // }
    //       }
    //     });
    //   };
    //   return item;
    // },
    surportHandle (item) {
      let options = item.options || [];
      let insideBtns = [];
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item]);
      });
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h('div', btns.map(item => item(h, params, this)));
      };
      return item;
    },
    setDetail (item) {
      item.render = (h, params) => {
        return h('a', {
          on: {
            click: () => {
              this.modalDetails.modal = true;
              this.modalDetails.modalData = params.row;
            }
          }
        }, params.row[item.key]);
      };
      return item;
    },
    handleColumns (columns) {
      for (let [, item] of columns.entries()) {
        let res;
        if (item.noTable) {
        } else {
          res = item;
          if (item.key === 'handle') res = this.surportHandle(res);
          if (item.detail) res = this.setDetail(res);
          this.insideColumns.push(res);
        }
      }
      // this.insideColumns = columns.map((item, index) => {
      //   let res = item;
      //   // if (res.editable) res = this.suportEdit(res, index);
      //   if (res.noTable) {
      //   } else {
      //
      //   }
      // });
      // console.log(this.insideColumns);
    },
    // setDefaultSearchKey () {
    //   this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    // },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value;
    },
    // handleSearch () {
    //   this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    // },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params);
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow();
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow);
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row);
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row);
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection);
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection);
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order);
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row);
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index);
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index);
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status);
    },
    getRowData (row) {
      this.modalInner.modalData = Object.assign({}, this.modalInner.modalData, row);
      // console.log(this.modalInner.modalData);
    },
    addPage (index) {
      this.$emit('on-addPage', index);
    },
    changeMoDetail (val) {
      this.modalDetails.modal = val;
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns);
      // this.setDefaultSearchKey()
    },
    value () {
      this.handleTableData();
      // if (this.searchable) this.handleSearch()
    }
  },
  mounted () {
    this.handleColumns(this.columns);
    // this.setDefaultSearchKey();
    this.handleTableData();
  }
};
</script>
<style lang="less">
  .ivu-table-top{
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .ivu-table th {
    background: #ffffff;
  }
  .ivu-page{
    margin-top: 10px;
    text-align: right;
  }
  .fl{
    float:left;
    margin-right:10px;
    height: 45px;
    button{
      background: #409eff;
      border:1px solid #409eff;
    }
  }
</style>
