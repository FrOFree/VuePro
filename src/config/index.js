export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '客户管理系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/api',
    // pro: '/'
    // dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    pro: '/api'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  // homeName: 'home',
  homeName: '客户维护',
  loginName: 'login',
  myDiagram: null,
  pageSize: 10,
  base: '/api'
};
