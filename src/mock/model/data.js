import Mock from 'mockjs';
import { doCustomTimes } from '@/libs/util';
// 模型列表
export const getModelList = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      Id: '1',
      modelName: 'P_A',
      author: 'LF',
      belong: '新客',
      reference: '500',
      sts: '有效',
      time: '@date'
    }));
  });
  return tableData;
};
