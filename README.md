# iview+vue前端框架

### 准备工作

1.安装node.js   < https://nodejs.org/en/ >我们在命令提示符或者终端输入`node -v`，应该看到类似的输出说明安装成功：

```bash
C:\>node -v
v10.13.0
```



2.安装npm，（npm已经在Node.js安装的时候顺带装好了。我们在命令提示符或者终端输入`npm -v`，应该看到类似的输出输出说明安装成功：

```bas
C:\>npm -v
6.4.1
```

3.配置git

- 安装git
- 通过git下载项目

#### 开发工具

- vscode
- webstorm

## install

```bush
# install dependencies
npm install
```

### run

#### Development

```b
npm run dev
```

#### production(Build)

```b
npm run build
```

### 功能

- 登录/登出
- 组件
  - 带条件的表格（搜索，新增和编辑）
  - tab页
- 错误页面能
  - 403页面
  - 404页面
  - 500页面
- 高级路由
  - 动态路由
  - 带参数的路由
- 收缩侧边栏
- tag标签导航
- 面包屑导航
- 全屏/退出全屏

### 文件结构

```shell
├── build  项目构建配置
├── config  开发相关配置
├── public  打包所需静态资源
└── src
    ├── api  请求
    └── assets  项目静态资源
        ├── images  图片资源
    ├── components  业务组件
    ├── config  项目运行配置
    ├── libs  封装工具函数
    ├── locale  多语言文件
    ├── mock  mock模拟数据
    ├── router  路由配置
    ├── store  Vuex配置
    ├── view  页面文件
    └── tests  测试相关
```

### 表格组件用法

#### 说明

此组件是在iview UI的table基础上封装的组件，所以iviewUI的table属性，通用。

#### 使用

```
<template>
        <tables ref="tables"
        	v-model="tableData"
        	:columns="columns"
              :operList="operList"
              @on-delete="handleDelete"
              @on-add="addData"
              @on-search="search"
              @on-refresh="refresh"
              @on-cancel="cancel"
              @on-edit="editData">
       </tables>
</template>
```

```
import Tables from '@/components/tables/commonTables.vue'
export default {
  name: 'tables_page',
  components: {
    Tables
  }
}
```

### API

##### Tables props

| 属性      | 说明                                                         | 类型  | 默认值 |
| --------- | ------------------------------------------------------------ | ----- | :----- |
| tableData | 显示的结构化数据                                             | Array | []     |
| columns   | 表格列的配置描述，具体项见后文                               | Array | []     |
| operList  | 操作列表（可选项<br /> search：查询，<br />commonAdd： 新增，<br />refresh：刷新，<br /> ruleAdd：规则新增，<br />cancelDelete：撤销删除） | Array | []     |
|           |                                                              |       |        |

##### columns

| 参数           | 说明                                       | 类型    | 默认值 | 是否必填 |
| -------------- | ------------------------------------------ | ------- | ------ | -------- |
| title          | 列头显示文字                               | String  | #      | 是       |
| key            | 对应列内容的字段名                         | String  | #      | 是       |
| ellipsis       | 开启后，文本将不换行，超出部分显示为省略号 | Boolean | false  | 否       |
| searchFormItem | 此字段在新增和编辑框中要显示的表单形式     | String  | #      | 是       |
| isSearch       | 此字段是否需要查询                         | Boolean | false  | 否       |
| rules          | 此字段对应的校验，校验规则通iview表单校验  | Array   | []     | 否       |
| noAdd          | 此字段是否在新增时出现                     | Boolean | false  | 否       |
| noEdit         | 此字段是否在编辑时出现                     | Boolean | false  | 否       |

##### Table events

| 事件名     | 说明                                         | 返回值             |
| ---------- | -------------------------------------------- | ------------------ |
| on-delete  | 单击某一行时删除时触发                       | 当前行的所有信息   |
| on-add     | 点击新增弹窗的确定按钮，校验通过后触发的函数 | 当前新增的信息     |
| on-search  | 点击表格组件中查询按钮时触发                 | 当前查询条件的组合 |
| on-refresh | 点击刷新按钮时触发                           | 无                 |
| on-cancel  | 点击新增或者编辑页面的取消时触发             | 当前行的所有信息   |
| on-edit    | 点击编辑弹窗的确定按钮，校验通过后触发的函数 | 当前编辑的信息     |

#### tab组件用法

#### 说明

此组件是在iview UI的tab基础上封装的组件，所以iviewUI的tab属性，通用。

#### 使用

```bas
<template>
       <Tab :label="label" @tabIndex="tabIndex"></Tab>
</template>
```

```ba
import Tab from '@/components/tab/tab';
export default {
  name: 'tabs',
  components: {
    Tab
  }
}
```

### API

##### Tab props

| 属性  | 说明                   | 类型  | 默认值 |
| ----- | ---------------------- | ----- | :----- |
| label | 选项卡信息，具体见后文 | Array | []     |

<template>
        <tables ref="tables"
        	v-model="tableData"
        	:columns="columns"
              :operList="operList"
              @on-delete="handleDelete"
              @on-add="addData"
              @on-search="search"
              @on-refresh="refresh"
              @on-cancel="cancel"
              @on-edit="editData"/>
</template>

##### label

| 参数        | 说明              | 类型        | 默认值 | 知否必填 |
| ----------- | ----------------- | ----------- | ------ | -------- |
| title       | 选项卡显示文字    | String      | #      | 是       |
| index       | 选项卡索引        | Number      | #      | 是       |
| tabPaneType | tab页内容展示格式 | table\|text | false  | 否       |
| content     | tab页内容展示     | Object      | #      | 是       |

##### Tab events

| 事件名      | 说明                 | 返回值             |
| ----------- | -------------------- | ------------------ |
| on-tabIndex | h获得 当前tab的 索引 | 当前tab的索引index |



#### 页面展示



![1561948052025](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561948052025.png)



![1561948090322](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561948090322.png)

![1561948129237](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561948129237.png)

![1561948153969](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561948153969.png)

![1562118826113](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1562118826113.png)


#### 去除水印


在文件目录下node_modules/gojs/release文件下四个js文件中  搜索'7eba17a4ca3b1a8346';
找到类似  a.Jv=d[w.Jg("7eba17a4ca3b1a8346")][w.Jg("78a118b7")](d,w.um,4,4);这样结构的代码;
将其注释，替换成  a.Jv=function(){return true;};