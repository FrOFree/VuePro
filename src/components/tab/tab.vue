<template>
<div class="tabStyle">
    <Tabs type="card" @on-click="upTabData">
        <TabPane v-for="item in label" :key="item.index" :label="item.title">
            <div v-if="item.tabPaneType === 'table'">
                <Table :columns="item.content.columns" :data="item.content.data"></Table>
            </div>
            <div v-if="item.tabPaneType === 'text'">
                {{item.content.text}}
            </div>
        </TabPane>
    </Tabs>
</div>
</template>
<script>
export default {
  props: {
    label: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {};
  },
  methods: {
    upTabData (index) {
      this.$emit('on-tabIndex', index);
    }
  }
};
</script>
<style scoped lang="css">
.tabStyle /deep/ .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-container {
    /* 改变高度 */
    height: 40px;
    line-height: 28px;
}
.tabStyle /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
  background: #fff;
}
.tabStyle /deep/ .ivu-tabs-nav-container {
    font-weight:bold;
}
.tabStyle /deep/ .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    margin-right: 0;
    /* 改变高度 border存在要1像素的高度 应-1 */
    height: 39px;
    border-radius: 0;
    /* 改变宽度 */
    padding: 5px 20px 5px;
}
.tabStyle /deep/ .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
    /* 改变高度 */
    height: 40px;
}

/* 去掉table的左右border */
.tabStyle /deep/ .ivu-table-wrapper {
    border: none;
}
.tabStyle /deep/ .ivu-table:before {
    content:'';
    width:100%;
    height:0;
    position:absolute;
    left:0;
    bottom:0;
    z-index:1
}
.tabStyle /deep/ .ivu-table:after {
    content:'';
    width:0;
    height:100%;
    position:absolute;
    top:0;
    right:0;
    z-index:3
}
.tabStyle /deep/ .ivu-table th {
    /* 表头背景颜色和字体颜色 */
    background-color: #ffffff;
    color: gray;
}
</style>
