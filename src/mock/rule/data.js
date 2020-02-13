import Mock from 'mockjs';
import { doCustomTimes } from '@/libs/util';
// 规则列表
export const getRuleOper = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      num: '11',
      eName: 'juxinni',
      cDesc: '自有身份证',
      level: '11',
      type: 'Time',
      stytem: 'String',
      sts: '基础数据',
      version: '网络',
      createTime: '@date',
      updataTime: '@data'
    }));
  });
  return tableData;
};
// 三方特征
export const getTriparFeature = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      eDesc: 'juxinni',
      cDesc: '自有身份证',
      dataName: 'Time',
      rule: '//',
      cleanType: 'toInt',
      nullMeans: '',
      default: ''
    }));
  });
  return tableData;
};
// 自有数据
export const getSelfData = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      dId: '11',
      type: 'function',
      content: 'getJobName',
      params: 'applyrisk'
    }));
  });
  return tableData;
};
// 三方数据
export const getTriparData = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      dId: '11',
      dataName: 'jxl',
      slotName: 'jxl',
      http: 'reportUrl',
      reqType: '',
      desc: '',
      dataType: '聚合接口'
    }));
  });
  return tableData;
};

