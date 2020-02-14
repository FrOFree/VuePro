const regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
const email = /^(\w+\.?)*\w+@(?:\w+\.)\w+$/;
const tel = /^1[345789]\d{9}$/;
// const fax = /^(\d{3,4}-)?\d{7,8}$/;
// const name = /^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/;
const name = /^[\w\u4e00-\u9fa5]{2,15}$/;
const age = /^[0-9]{1,3}?$/;//年龄
const date = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

const pwd = /^[a-zA-Z0-9]{4,16}$/;
const idNo = /^[a-zA-Z0-9]{1,32}$/;// 证件编号
const roleId = /^[a-zA-Z0-9]{1,8}$/; // 角色编号
const accId = /^[0-9]{3}$/; // 子账户编号
const feeDisc = /^[0-1]{1}([.]([0-9]){1,2})?$/; // 费用折扣规则 小数后0-2位
// const bCard = /^([1-9]{1})(\d{14}|\d{18})$/;
const ruWeight = /^[1-9][0-9]?$/; // 权重 1-99
const ruPri = /^[1-9][0-9]?$/; // 优先级 1-99
// const loginName = /^\w+$/; // 编码  只能是英文下划线
const ruName = /^[a-zA-Z0-9_]{2,20}$/; // 编码  只能是英文下划线
const ruCname = /^[\\(\\)\\_\u4e00-\u9fa5_a-zA-Z0-9]+$/; // 名称  只能是中文,数字,英文
const ruChname = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/; // 规则编码  只能是中文,数字,英文
const version = /^[0-9]+\.[0-9]+\.[0-9]+$/; // 版本号 1.0.0
// const phone = /^[0-9a-zA-Z_]{1,}$/; // 登录用户名
const ruOrd = /^\d+(\.{0,1}\d+){0,1}$/; // 失效周期以及超时时间 非负数
const ordinalNum = /^\d+(\.{0,1}\d+){0,1}$/; // 排列序号 非负数
// const rate = /-?\d+[.]*\d*%?/g; // 只能是数字和百分比
const organization = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/; // 机构  只能是中文,数字,英文
const number = /^.*[^\d].*$/; // 编号 不能是纯数字
const per = /-?\d+[.]*\d*%?$/;

const loginFlag = false;//是否登陆状态
const loginedFlag = false;//是否登陆过
let FormValidate = (function () {
  function FormValidate () {}
  // From表单验证规则  可用于公用的校验部分
  FormValidate.Form = function () {
    return {
      // 姓名的验证规则
      Email: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        if (!email.test(value)) {
          callback(new Error('请输入正确的邮箱!'));
        } else {
          callback();
        }
      },
      // 身份证的验证规则
      ID: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('身份证不能为空'));
        }
        if (!regId.test(value)) {
          callback(new Error('请输入正确的二代身份证号码'));
        } else {
          callback();
        }
      },
      // 电话号码的验证
      Tel: (rule, value, callback) => {
        if (value && !tel.test(value)) {
          return callback(new Error('请正确填写电话号码'));
        } else {
          callback();
        }
      }
    };
  };

  /**
     * UserName表单验证规则  用于校验登录中用户名和密码
     */

  FormValidate.validate = function () {
    return {
      // 用户名的验证规则
      userName: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        if (!name.test(value)) {
          callback(new Error('用户名不合法'));
        } else {
          callback();
        }
      },
      // 用登录密码的验证规则
      passWord: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('密码不能为空！'));
        }
        if (!pwd.test(value)) {
          callback(new Error('请输入正确的密码!'));
        } else {
          callback();
        }
      },
      // 公司地址验证规则
      compName: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('公司地址不能为空！'));
        } else {
          callback();
        }
      },
      idNo: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('证件编号不能为空！'));
        } else if (!idNo.test(value)) {
          return callback(new Error('请输入正确的证件编号！'));
        } else {
          callback();
        }
      },
      roleId: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('角色编号不能为空！'));
        } else if (!roleId.test(value)) {
          return callback(new Error('角色ID应为1到8纯数字'));
        } else {
          callback();
        }
      },
      roleName: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('角色名不能为空'));
        }
        if (!name.test(value)) {
          callback(new Error('角色名位4到16位!'));
        } else {
          callback();
        }
      },
      roleNick: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('昵称不能为空'));
        }
        if (!name.test(value)) {
          callback(new Error('昵称为4到16位!'));
        } else {
          callback();
        }
      },
      accId: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('账户ID不能为空！'));
        } else if (!accId.test(value)) {
          return callback(new Error('账户ID应为3纯数字'));
        } else {
          callback();
        }
      },
      feeDisc: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('费用折扣不能为空！'));
        } else if (!feeDisc.test(value)) {
          return callback(new Error('费用折扣应为0-1纯数字且小数不能超过两位'));
        } else {
          callback();
        }
      },
      ruWeight: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('权重不能为空！'));
        } else if (!ruWeight.test(value)) {
          return callback(new Error('权重应为1-99'));
        } else {
          callback();
        }
      },
      ruPri: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('优先级不能为空！'));
        } else if (!ruPri.test(value)) {
          return callback(new Error('优先级应为1-99'));
        } else {
          callback();
        }
      }
    };
  };

  // FromTwo表单验证规则  用于FromTwo表单个性化的校验
  FormValidate.FormTwo = function () {
    return {
      // 传真的校验规则
      Fax: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('传真不能为空'));
        }
        if (value.length > 32) {
          callback(new Error('公司名称不能大于32个字符'));
        } else {
          callback();
        }
      },
      version: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('版本号不能为空'));
        }
        if (!version.test(value)) {
          callback(new Error('版本号格式错误,例:1.0.0'));
        } else {
          callback();
        }
      },
      // 英文名下划线和数字
      ruName: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('编码不能为空'));
        }
        if (!ruName.test(value)) {
          callback(new Error('格式应为英文加下划线且长度为2-20'));
        } else {
          callback();
        }
      },
      phone: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('登录用户名不能为空'));
        }
        if (!ruChname.test(value)) {
          callback(new Error('登录用户名不能包含特殊字符'));
        } else {
          callback();
        }
      },
      loginCnName: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('姓名不能为空'));
        }
        if (!ruChname.test(value)) {
          callback(new Error('姓名不能包含特殊字符'));
        } else {
          callback();
        }
      },
      loginName: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('登录名不能为空'));
        }
        if (!ruName.test(value)) {
          callback(new Error('登录名不能包含特殊字符'));
        } else {
          callback();
        }
      },
      // 后台返回数据超时时间为数字类型 前端接收数字类型报错
      ruOrd: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为0且不能为空'));
        }
        if (!ruOrd.test(value)) {
          callback(new Error('请输入0以上的正整数'));
        } else {
          callback();
        }
      },
      ordinalNum: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('排列序号不能为空'));
        }
        if (!ordinalNum.test(value)) {
          callback(new Error('请输入包括0以上的正整数'));
        } else {
          callback();
        }
      },
      ruCname: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空且不能包含特殊字符'));
        }
        if (!ruCname.test(value)) {
          callback(new Error('不能包含特殊字符'));
        } else {
          callback();
        }
      },
      organization: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('合作机构不能为空且不能包含特殊字符'));
        }
        if (!organization.test(value)) {
          callback(new Error('不能包含特殊字符'));
        } else {
          callback();
        }
      },
      ruChname: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空且不能包含特殊字符'));
        }
        if (!ruChname.test(value)) {
          callback(new Error('不能包含特殊字符'));
        } else {
          callback();
        }
      },
      number: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('样本编号不能为空且不能是纯数字'));
        }
        if (!number.test(value)) {
          callback(new Error('样本编号不能是纯数字'));
        } else {
          callback();
        }
      },
      per: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('预警值只能是数字和百分比数字'));
        }
        if (!per.test(value)) {
          callback(new Error('预警值只能是数字和百分比数字'));
        } else {
          callback();
        }
      }
    };
  };
  FormValidate.editData = function () {
    return {
      // 姓名的验证规则
      Email: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        if (!email.test(value)) {
          callback(new Error('请输入正确的邮箱!'));
        } else {
          callback();
        }
      },
      // 身份证的验证规则
      ID: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('身份证不能为空'));
        }
        if (!regId.test(value)) {
          callback(new Error('请输入正确的二代身份证号码'));
        } else {
          callback();
        }
      },
      // 电话号码的验证
      Tel: (rule, value, callback) => {
        if (value && !tel.test(value)) {
          return callback(new Error('请正确填写电话号码'));
        } else {
          callback();
        }
      },
      // 用户名的验证规则
      name: function (rule, value, callback) {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        if (!name.test(value)) {
          callback(new Error('用户名不合法'));
        } else {
          callback();
        }
      },
      age: function(rule , value , callback){
        if(!value){
          return callback(new Error('年龄不能为空'));
        }
        if (!age.test(value)){
          callback(new Error('年龄不合法'));
        }else{
          callback();
        }
      },
      date: function(rule , value , callback){
        if(!value){
          return callback(new Error('日期不能为空'));
        }
        if (!date.test(value)){
          callback(new Error('日期不合法'));
        }else{
          callback();
        }
      }
    };
  };

  return FormValidate;
}());
exports.FormValidate = FormValidate;
