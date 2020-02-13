const btns = {
  edit: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        icon: 'md-create',
        style: 'margin-left:10px;background:#67c23a;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          sessionStorage.setItem('submitFlag', 'edit');
          vm.modalInner.title = '修改';
          vm.modalInner.modalData = params.row;
          vm.modalInner.modal = true;
        }
      }
    }, '编辑');
  },
  cancel: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '你确定要撤销吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-cancel', params);
          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        attrs: {
          size: 'small',
          icon: 'md-arrow-round-back',
          style: 'margin-left:10px;background:#409eff;' +
          'color:#fff;padding:2px 8px;'
        }
      }, '撤销')
    ]);
  },
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '你确定要删除吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params.row);
          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        attrs: {
          size: 'small',
          icon: 'ios-trash-outline',
          style: 'margin-left:10px;background:#f56c6c;' +
          'color:#fff;padding:2px 8px;'
        }
      }, '删除')
    ]);
  },
  cancleRelate: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '你确定要取消关联吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-cancle', params.row);
          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        attrs: {
          size: 'small',
          icon: 'ios-trash-outline',
          style: 'margin-left:10px;background:#f56c6c;' +
          'color:#fff;padding:2px 8px;'
        }
      }, '取消关联')
    ]);
  },
  detail: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        icon: 'ios-construct',
        style: 'margin-left:10px;background:#409eff;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          vm.$emit('on-detail', params.row);
        }
      }
    }, '配置');
  },
  resetPwd: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        style: 'margin-left:10px;background:#409eff;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          vm.$emit('on-resetPwd', params.row);
        }
      }
    }, '密码重置');
  },
  switch: (h, params, vm) => {
    var ob = '';
    if (params.row.userSts === '1') {
      ob = false;
    } else {
      ob = true;
    }
    return h('i-switch', {
      props: {
        size: 'large',
        value: ob
      },
      scopedSlots: {
        open: () => h('span', '正常'),
        close: () => h('span', '停用')
      },
      on: {
        'on-change': (value) => {
          if (value) {
            params.row.userSts = '0';
            vm.$emit('on-switch', params.row);
          } else {
            params.row.userSts = '1';
            vm.$emit('on-switch', params.row);
          }
        }
      }
    });
  },
  check: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        icon: 'ios-search',
        style: 'margin-left:10px;background:#409eff;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          vm.$emit('on-check', params.row);
        }
      }
    }, '查看');
  },
  lead: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        icon: 'ios-share-alt-outline',
        style: 'margin-left:10px;background:#FF7F00;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          vm.$emit('on-lead', params.row);
        }
      }
    }, '导入数据');
  },
  copy: (h, params, vm) => {
    return h('Button', {
      attrs: {
        size: 'small',
        icon: 'md-copy',
        style: 'margin-left:10px;background:#67c23a;' +
        'color:#fff;padding:2px 8px;'
      },
      on: {
        click: () => {
          vm.$emit('on-copy', params.row);
        }
      }
    }, '复制');
  }
};
export default btns;
