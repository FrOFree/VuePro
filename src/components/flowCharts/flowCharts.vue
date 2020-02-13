<template>
    <div class="flow-charts">
      <div style="width: 100%; display: flex; justify-content: space-between;border: solid 1px #eee">
        <div id="myPaletteDiv" style="width: 120px; margin-right: 2px;border: none;"></div>
        <div id="myDiagramDiv" style="flex-grow: 1; height:556px;background: #eee"></div>
        <div style="width: 1% "></div>
        <div style="width: 28% ">
          <span style="display: inline-block; vertical-align: top;">
              <div class="title">模型数据：</div>
              <div id="myInspectorDiv3" ref="myInspectorDiv3" class="inspector"> </div>
              <div class="title">所选节点的属性：</div>
              <div id="myInspectorDiv" ref="myInspectorDiv"  class="inspector"> </div>

              <!--<div class="title">第一个节点的属性：</div>-->
              <!--<div id="myInspectorDiv2" ref="myInspectorDiv2" class="inspector"> </div>-->
              <div style="margin-top:20px;">
                <Button id="SaveButton" @click="save()" type="primary" ref="SaveButton" style="width:100%" v-show="edit">保存决策流</Button>
              </div>
              <div style="margin-top:20px;">
                <Button id="SaveButton" @click="handlBack()" type="primary" ref="SaveButton" style="width:100%">返回</Button>
              </div>
            </span>
        </div>
      </div>
      <button @click="load()" v-if="false">Load</button>
      <button @click="layout()" v-if="false">Layout</button>
      <button @click="printDiagram()" v-if="false">Print Diagram Using SVG</button>
      <!--// 树形模型必须有"key"和"parent"的字段名,-->
      <!--// 你还可以添加任何需要的其他字段，只需要在Node节点模板里绑定就行-->
      <textarea id="mySavedModel" ref="mySavedModel" style="width:100%;height:300px" v-show="false">
   {
    "modelData": {
    },
    "nodeDataArray": [],
    "linkDataArray": []
}
  </textarea>
    </div>
</template>
<script>
import {tbFlowinfo} from '@/api/flow';
import { mapMutations } from 'vuex';
// import {getDicList} from '@/libs/util.js';
import go from 'gojs';
// 开发 license
const gojsKey = '2bf842e3b26658c511d35a25403f7efb0bab2d66ce824df0595312f4e80a7a0424cab82a5180d89086ad4efb1b7fc9dfd897602e921b0369e761d48e41e0d6adb23024b2170a40d9b6132096c9fc2af3ac7963e2c1b477aac57893f1ef';
go.licenseKey = gojsKey;
export default {
  name: 'flow-charts',
  components: {},
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      diagram: null,
      dicList: [],
      modelList: []
    };
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    /*
    * // 此事件方法由整个画板的LinkDrawn和LinkRelinked事件触发
    // 如果连线是从"conditional"条件节点出发，则将连线上的标签显示出来
    */
    showLinkLabel (e) {
      let label = e.subject.findObject('LABEL');
      if (label !== null) label.visible = (e.subject.fromNode.data.category === 'Conditional');
    },
    printDiagram () {
      let svgWindow = window.open();
      if (!svgWindow) return;
      let printSize = new go.Size(700, 960);
      let bnds = this.diagram.documentBounds;
      let x = bnds.x;
      let y = bnds.y;
      while (y < bnds.bottom) {
        while (x < bnds.right) {
          let svg = this.diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: printSize });
          svgWindow.document.body.appendChild(svg);
          x += printSize.width;
        }
        x = bnds.x;
        y += printSize.height;
      }
      setTimeout(function () {
        svgWindow.print();
      }, 1);
    },
    load () {
      if (this.$route.query.flowDefinition) {
        document.getElementById('mySavedModel').value = this.$route.query.flowDefinition;
      }
      // console.log(this.$route.query.flowDefinition);
      this.diagram.model = go.Model.fromJson(document.getElementById('mySavedModel').value);
    },
    handlBack () {
      this.closeTag(this.$route);
      this.$router.push({ path: 'decisionList' });
    },
    save () {
      document.getElementById('mySavedModel').value = this.diagram.model.toJson();
      let tbFlowInfoVo = {
        flowId: this.$route.query.flowId,
        flowDefinition: this.diagram.model.toJson()
      };
      tbFlowinfo(tbFlowInfoVo).then(rst => {
        let {code} = rst.data;
        if (this.$successFun(code)) {
          this.diagram.isModified = false;
        }
      });
      this.closeTag(this.$route);
      // console.log(this.diagram.model.toJson());
    },
    layout () {
      this.diagram.layoutDiagram(true);
    },
    nodeStyle () {
      // 设置节点位置风格，并与模型"loc"属性绑定，该方法会在初始化各种节点模板时使用
      return [
        // 将节点位置信息 Node.location 同节点模型数据中 "loc" 属性绑定：
        // 节点位置信息从 节点模型 "loc" 属性获取, 并由静态方法 Point.parse 解析.
        // 如果节点位置改变了, 会自动更新节点模型中"loc"属性, 并由 Point.stringify 方法转化为字符串
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // 节点位置 Node.location 定位在节点的中心
          locationSpot: go.Spot.Center
        }
      ];
    },
    textStyle () {
      // 图形上的文字风格
      return {
        font: 'bold 11pt Helvetica, Arial, sans-serif',
        stroke: 'whitesmoke'
      };
    },
    /*
     创建"port"方法，"port"是一个透明的长方形细长图块，在每个节点的四个边界上，如果鼠标移到节点某个边界上，它会高亮
      "name": "port" ID，即GraphObject.portId,
      "align": 决定"port" 属于节点4条边的哪条
      "spot": 控制连线连入/连出的位置，如go.Spot.Top指, go.Spot.TopSide
      "output" / "input": 布尔型，指定是否允许连线从此"port"连入或连出
      * */
    makePort (name, align, spot, output, input) {
      // 如果是上、下边界，则是水平"port"
      let $ = go.GraphObject.make;
      let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
      return $(go.Shape,
        {
          fill: 'transparent', // 默认透明不现实
          strokeWidth: 0, // 无边框
          width: horizontal ? NaN : 8, // 垂直"port"则8像素宽
          height: !horizontal ? NaN : 8, // 水平"port"则8像素
          alignment: align, // 同其节点对齐
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical), // 自动同其节点一同伸缩
          portId: name, // 声明ID
          fromSpot: spot, // 声明连线头连出此"port"的位置
          fromLinkable: output, // 布尔型，是否允许连线从此"port"连出
          toSpot: spot, // 声明连线尾连入此"port"的位置
          toLinkable: input, // 布尔型，是否允许连线从此"port"连出
          cursor: 'pointer', // 鼠标由指针改为手指，表示此处可点击生成连线
          mouseEnter: function (e, port) { // 鼠标移到"port"位置后，高亮
            if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)';
          },
          mouseLeave: function (e, port) { // 鼠标移出"port"位置后，透明
            port.fill = 'transparent';
          }
        }
      );
    }
  },
  mounted () {
    let that = this;
    that.dicList = that.$route.query.tbRuleRelData;
    that.modelList = that.$route.query.modelData;
    let $ = go.GraphObject.make; //  // 用go.GraphObject.make来创建一个GoJS对象，如果$被占用了，可以使用其他名称
    // 创建图表对象，绑定HTML中的DIV，初始化图表风格
    let myDiagram = $(
      go.Diagram,
      'myDiagramDiv', // 这个名称"myDiagramDiv"必须同HTML中画布DIV的id一致
      {
        'LinkDrawn': this.showLinkLabel, // 每次画线后调用的事件：为条件连线加上标签，该方法再后面定义
        'LinkRelinked': this.showLinkLabel, // 每次重画线后调用的事件：同上LinkDrawn
        initialContentAlignment: go.Spot.Center, // 居中显示内容
        'grid.visible': true, // 展示网格
        'allowZoom': false, // 禁止缩放
        layout: $(go.LayeredDigraphLayout, { //
          direction: 90,
          isInitial: true,
          isOngoing: false,
          layerSpacing: 50
        }),
        // 树形布局
        // layout: $(go.TreeLayout, { // 树形排列布局
        //   angle: 90, // 父子节点之间竖排，即同水平线成90度直角
        //   comparer: go.LayoutVertex.smartComparer
        // }), // have the comparer sort by numbers as well as letters
        'undoManager.isEnabled': true, // 启用Ctrl-Z撤销和Ctrl-Y重做功能
        // automatically show the state of the diagram's model on the page
        'ModelChanged': function (e) {
          if (e.isTransactionFinished) {
            document.getElementById('mySavedModel').value = myDiagram.model.toJson();
          }
        }
      }
    );
    // 当图有改动时，在页面标题后加*，且启动保存按钮
    myDiagram.addDiagramListener('Modified', function (e) {
      let button = document.getElementById('SaveButton');
      if (button) button.disabled = !myDiagram.isModified;
      let idx = document.title.indexOf('*');
      if (myDiagram.isModified) {
        if (idx < 0) document.title += '*';
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    // define the Node templates for regular nodes

    // // 定义步骤（默认类型）节点的模板
    myDiagram.nodeTemplateMap.add('', // // 默认类型
      $(go.Node, 'Table', this.nodeStyle(),
        // 步骤节点是一个包含可编辑文字块的长方形图块
        $(go.Panel, 'Auto',
          $(go.Shape, 'Rectangle',
            { fill: '#1E90FF', strokeWidth: 0 },
            new go.Binding('figure', 'figure')),
          $(go.TextBlock, this.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit, // 尺寸自适应
              editable: true // 文字可编辑
            },
            new go.Binding('text').makeTwoWay()) // 双向绑定模型中"text"属性
        ),
        // 上、左、右可以入，左、右、下可以出
        // "Top"表示中心，"TopSide"表示上方任一位置，自动选择
        this.makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        this.makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        this.makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    );
    // 定义条件节点的模板
    myDiagram.nodeTemplateMap.add('Conditional',
      $(go.Node, 'Table', this.nodeStyle(),
        // // 条件节点是一个包含可编辑文字块的菱形图块
        $(go.Panel, 'Auto',
          $(go.Shape, 'Diamond',
            { fill: '#48D1CC', strokeWidth: 0 },
            new go.Binding('figure', 'figure')),
          $(go.TextBlock, this.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit, // 尺寸自适应
              editable: true // 文字可编辑
            },
            new go.Binding('text').makeTwoWay())
        ),
        // // 上、左、右可以入，左、右、下可以出
        this.makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        this.makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        this.makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );
    // 定义开始节点的模板
    myDiagram.nodeTemplateMap.add('Start',
      // 开始节点是一个圆形图块，文字不可编辑
      $(go.Node, 'Table', this.nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            { minSize: new go.Size(40, 40), fill: '#79C900', strokeWidth: 0 }),
          $(go.TextBlock, 'Start', this.textStyle(),
            new go.Binding('text'))
        ),
        // // 左、右、下可以出，但都不可入
        this.makePort('L', go.Spot.Left, go.Spot.Left, true, false),
        this.makePort('R', go.Spot.Right, go.Spot.Right, true, false),
        this.makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );
    // 定义结束节点的模板
    myDiagram.nodeTemplateMap.add('End',
      // 结束节点是一个圆形图块，文字不可编辑
      $(go.Node, 'Table', this.nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            { minSize: new go.Size(40, 40), fill: '#DC3C00', strokeWidth: 0 }),
          $(go.TextBlock, 'End', this.textStyle(),
            new go.Binding('text'))
        ),
        // // 上、左、右可以入，但都不可出
        this.makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.Left, false, true),
        this.makePort('R', go.Spot.Right, go.Spot.Right, false, true)
      )
    );
    myDiagram.nodeTemplateMap.add('Model',
      $(go.Node, 'Table', this.nodeStyle(),
        // 步骤节点是一个包含可编辑文字块的长方形图块
        $(go.Panel, 'Auto',
          $(go.Shape, 'RoundedRectangle',
            { fill: '#000080', strokeWidth: 0 },
            new go.Binding('figure', 'figure')),
          $(go.TextBlock, this.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit, // 尺寸自适应
              editable: true // 文字可编辑
            },
            new go.Binding('text').makeTwoWay()) // 双向绑定模型中"text"属性
        ),
        // 上、左、右可以入，左、右、下可以出
        // "Top"表示中心，"TopSide"表示上方任一位置，自动选择
        this.makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        this.makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        this.makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    );
    go.Shape.defineFigureGenerator('File', function (shape, w, h) {
      let geo = new go.Geometry();
      let fig = new go.PathFigure(0, 0, true); // starting point
      geo.add(fig);
      fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      let fig2 = new go.PathFigure(0.75 * w, 0, false);
      geo.add(fig2);
      // The Fold
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      geo.spot1 = new go.Spot(0, 0.25);
      geo.spot2 = go.Spot.BottomRight;
      return geo;
    });
    // // 定义注释节点的模板
    myDiagram.nodeTemplateMap.add('Comment',
      // 注释节点是一个包含可编辑文字块的文件图块
      $(go.Node, 'Auto', this.nodeStyle(),
        $(go.Shape, 'File',
          { fill: '#DEE0A3', strokeWidth: 0 }),
        $(go.TextBlock, this.textStyle(),
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: 'center',
            editable: true,
            font: 'bold 12pt Helvetica, Arial, sans-serif',
            stroke: '#454545'
          },
          new go.Binding('text').makeTwoWay())
        // // 不支持连线入和出
      ));
    // // 初始化连接线的模板
    myDiagram.linkTemplateMap.add('',
      $(go.Link, // 所有连接线
        {
          routing: go.Link.AvoidsNodes, // 连接线避开节点
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4, // 直角弧度，箭头弧度
          relinkableFrom: true, // 允许连线头重设
          relinkableTo: true, // 允许连线尾重设
          reshapable: true, // 允许线形修改
          resegmentable: true, // 允许连线分割（折线）修改
          // // 鼠标移到连线上后高亮
          mouseEnter: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
          },
          mouseLeave: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'transparent';
          },
          selectionAdorned: false
        },
        new go.Binding('points').makeTwoWay(), // 双向绑定模型中"points"数组属性
        $(go.Shape, // 隐藏的连线形状，8个像素粗细，当鼠标移上后显示
          { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
        $(go.Shape, //  // 连线规格（颜色，选中/非选中，粗细）
          { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
          new go.Binding('stroke', 'isSelected', function (sel) {
            return sel ? 'dodgerblue' : 'gray';
          }).ofObject()),
        $(go.Shape, // 箭头规格
          { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
        $(go.Panel, 'Auto', // 连线标签，默认不显示
          { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 }, // 双向绑定模型中"visible"属性
          new go.Binding('visible', 'visible').makeTwoWay(),
          $(go.Shape, 'RoundedRectangle', // 连线中显示的标签形状
            { fill: '#F8F8F8', strokeWidth: 0 }),
          $(go.TextBlock, 'Yes', // 连线中显示的默认标签文字
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: '#333333',
              editable: true
            },
            new go.Binding('text').makeTwoWay()) // 双向绑定模型中"text"属性
        )
      ));
    myDiagram.linkTemplateMap.add('Cross',
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          selectionAdorned: false
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape,
          { strokeWidth: 2, stroke: 'red' }),
        $(go.Shape,
          {toArrow: 'standard', fill: 'blue', stroke: null}),
        $(go.Panel, 'Auto',
          { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
          new go.Binding('visible', 'visible').makeTwoWay(),
          $(go.Shape, 'RoundedRectangle',
            { fill: '#F8F8F8', strokeWidth: 0 }),
          $(go.TextBlock, 'Yes',
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: '#333333',
              editable: true
            },
            new go.Binding('text').makeTwoWay()
          )
        )
      )
    );
    // 临时的连线（还在画图中），包括重连的连线，都保持直角
    // myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    // myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    this.diagram = myDiagram;
    this.load();
    // myDiagram.addModelChangedListener(
    //   e => {
    //     if (e.isTransactionFinished) {
    //       console.log('changeEventListener', e);
    //       if (e instanceof go.ChangedEvent) console.log('go.ChangedEvent');
    //     }
    //     if (e instanceof go.DiagramEvent) console.log('go.DiagramEvent');
    //     if (e instanceof go.InputEvent) console.log('go.InputEvent');
    //   }
    // );
    // 在图形页面的左边初始化图例Palette面板
    $(go.Palette, 'myPaletteDiv', // 必须同HTML中Div元素id一致
      {
        scrollsPageOnFocus: false, // 图选中时页面不会滚动
        nodeTemplateMap: myDiagram.nodeTemplateMap, // 同myDiagram公用一种node节点模板
        model: $(go.GraphLinksModel,
          {
            // linkFromPortIdProperty: 'fromPort',
            // linkToPortIdProperty: 'toPort',
            nodeDataArray: [ // 初始化Palette面板里的内容
              { category: 'Start', text: '开始' },
              { category: 'Rule', text: '规则' },
              { category: 'Model', text: '模型' },
              { category: 'Conditional', text: '判定' },
              { category: 'End', text: '结束' },
              { category: 'Comment', text: '备注' }
            ]
          })
      }
    );
    myDiagram.select(myDiagram.nodes.first());
    // support editing the properties of the selected person in HTML
    if (this.Inspector) {
      new this.Inspector('myInspectorDiv', myDiagram,
        {
          resetButton: true,
          // allows for multiple nodes to be inspected at once
          multipleSelection: false,
          // max number of node properties will be shown when multiple selection is true
          showSize: 2,
          // when multipleSelection is true, when showAllProperties is true it takes the union of properties
          // otherwise it takes the intersection of properties
          showAllProperties: true,
          // uncomment this line to only inspect the named properties below instead of all properties on each object:
          // includesOwnProperties: false,
          properties: {
            'text': { label: '名称' },
            'reName': {
              label: '规则名称',
              show: (node) => {
                // 规则节点展示
                return node.data.category === 'Rule';
              },
              type: 'select',
              choices: function (node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                for (let [, item] of JSON.parse(localStorage.getItem('tbRuleRelData')).entries()) {
                  if (item.reName === node.data.reName) {
                    node.data.rsNo = item.rsNo;
                    node.data.rsVersion = item.rsVersion;
                    node.data.reName = item.reName;
                    node.data.ruleReleseId = item.id;
                    node.data.rsOuttype = item.rsOuttype;
                  }
                }
                return that.dicList; // 选择的数组
              }
            },
            'decisionVariable': {
              show: (node) => {
                return node.data.category === 'Conditional';
              },
              type: 'select',
              choices: function (node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                return ['result'];
              }
            },
            'exprOper': {
              label: '操作法',
              show: (link) => {
                return link.fromNode && link.fromNode.data.category === 'Conditional';
              },
              type: 'select',
              choices: (link, propName) => {
                if (Array.isArray(link.data.choices)) return link.data.choices;
                if (link.fromNode.data.rsOuttype === 'SZ') {
                  return ['>', '>=', '==', '<', '<='];
                } else {
                  return ['=='];
                }
              }
            },
            'exprRight': {
              label: '右表达式',
              show: (link) => {
                return link.fromNode && link.fromNode.data.category === 'Conditional';
              },
              type: 'select',
              typeFunc: function (link) {
                if (link && link.fromNode && link.fromNode.data.rsOuttype === 'SZ') {
                  return 'number';
                } else {
                  return 'select';
                }
              },
              choices: function (link, propName) {
                if (Array.isArray(link.data.choices)) return link.data.choices;
                if (link.fromNode.data.rsOuttype === 'SZ') {
                  return [];
                } else {
                  const selectDic = [
                    {keyName: 'RULE_RESULT', dicValue: '通过', dicCode: '1'},
                    {keyName: 'RULE_RESULT', dicValue: '拒绝', dicCode: '0'}
                  ];
                  return selectDic.map(dic => ({ label: dic.dicValue, value: dic.dicCode }));
                }
              }
            },
            'result': {
              label: '结果',
              show: (link) => {
                return link.fromNode && link.fromNode.data.category === 'Conditional';
              },
              type: 'select',
              choices: function (link, propName) {
                if (Array.isArray(link.data.choices)) return link.data.choices;
                const selectDic = [
                  {keyName: 'RULE_RESULT', dicValue: '通过', dicCode: '1'},
                  {keyName: 'RULE_RESULT', dicValue: '拒绝', dicCode: '0'}
                ];
                return selectDic.map(dic => ({ label: dic.dicValue, value: dic.dicCode }));
              }
            },
            'rsNo': {
              readOnly: true,
              label: '规则集号',
              show: (node) => {
                // 规则节点展示
                return node.data.category === 'Rule';
              }
            },
            'rsVersion': {
              readOnly: true,
              label: '版本号',
              show: (node) => {
                // 规则节点展示
                return node.data.category === 'Rule';
              }
            },
            'ruleReleseId': {
              readOnly: true,
              label: '规则发布编号',
              show: (node) => {
                // 规则节点展示
                return node.data.category === 'Rule';
              }
            },
            'key': {readOnly: true, show: this.Inspector.showIfNode},
            'category': {readOnly: true, show: this.Inspector.showIfNode, label: '节点类型'},
            'rsOuttype': {
              label: '结果类型',
              type: 'select',
              show: (node) => {
                // 模型节点展示
                return node.data.category === 'Model' || node.data.category === 'Rule' || node.data.category === 'Conditional';
              },
              choices: function (node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                const selectDic = [
                  {keyName: 'RS_OUT_TYPE', dicValue: '布尔值', dicCode: 'BL'},
                  {keyName: 'RS_OUT_TYPE', dicValue: '数字', dicCode: 'SZ'},
                  {keyName: 'RS_OUT_TYPE', dicValue: '字符串', dicCode: 'WB'}
                ];
                return selectDic.map(dic => ({ label: dic.dicValue, value: dic.dicCode }));
              }
            },
            'modelName': {
              label: '模型名称',
              show: (node) => {
                // 开始，结束，判断节点和线的情况下不展示
                if (node.data.category === 'Model') {
                  return true;
                } else if (node.data.from) {
                  return false;
                }
              },
              type: 'select',
              choices: function (node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                for (let [, item] of JSON.parse(localStorage.getItem('modelData')).entries()) {
                  if (item.modelName === node.data.modelName) {
                    node.data.modelName = item.modelName;
                    node.data.modelId = item.modelId;
                    node.data.rsOuttype = 'SZ';
                  }
                }
                return that.modelList; // 选择的数组
              }
            },
            // 'modelId': {
            //   readOnly: true,
            //   label: '模型编码',
            //   show: (node) => {
            //     // 开始，结束，判断节点和线的情况下不展示
            //     if (node.data.category === 'Model') {
            //       return true;
            //     } else if (node.data.from) {
            //       return false;
            //     }
            //   }
            // }
            'modelId': {
              readOnly: true,
              label: '模型编码',
              // type: 'select',
              show: (node) => {
                // 模型节点展示
                return node.data.category === 'Model';
              },
              choices: function (node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                // node.data.modelName = 'testModel';
                node.data.rsOuttype = 'SZ';
                return ['1'];
              }
            }
            // 'modelName': {
            //   readOnly: true,
            //   label: '模型名称',
            //   show: (node) => {
            //     // 模型节点展示
            //     return node.data.category === 'Model';
            //   }
            // }

            // 'modelId': {
            //   readOnly: true,
            //   label: '模型编码',
            //   show: (node) => {
            //     // 开始，结束，判断节点和线的情况下不展示
            //     if (node.data.category === 'Model') {
            //       return true;
            //     } else if (node.data.from) {
            //       return false;
            //     }
            //   }
            // }
          }
        });
    }
    let inspector3 = new this.Inspector('myInspectorDiv3', myDiagram,
      {
        inspectSelection: false,
        properties: {
          // 'key': { readOnly: true },
          'flowId': {label: '决策流ID ', readOnly: true},
          'flowChname': {label: '决策流名', readOnly: true},
          'flowDesc': {label: '决策流描述', readOnly: true},
          'flowVer': {label: '版本号', readOnly: true},
          'flowName': {label: '决策流编码', readOnly: true},
          'flowSts': {label: '状态', readOnly: true}
        }
      });
    // 12.26修改列表数据后，gojs页面数据显示错误  采取重新赋值
    myDiagram.model.modelData.flowChname = this.$route.query.flowChname;
    myDiagram.model.modelData.flowDesc = this.$route.query.flowDesc;
    myDiagram.model.modelData.flowName = this.$route.query.flowName;
    myDiagram.model.modelData.flowVer = this.$route.query.flowVer;
    // *****11.29取消显示key和状态显示数据字典
    if (myDiagram.model.modelData.flowSts === '1') {
      myDiagram.model.modelData.flowSts = '正常';
    } else if (myDiagram.model.modelData.flowSts === '0') {
      myDiagram.model.modelData.flowSts = '停用';
    }
    // let ob = getDicList('FLOW_STS');
    // ob.forEach(element => {
    //   // console.log(element);
    //   myDiagram.model.modelData.flowSts = element.dicValue;
    //   console.log(myDiagram.model.modelData.flowSts);
    // });
    Object.keys(myDiagram.model.modelData).forEach((key) => {
      if (key === 'key') {
        delete myDiagram.model.modelData.key;
      }
    });
    // ********************结束***************
    inspector3.inspectObject(myDiagram.model.modelData);
  }
};
</script>

<style lang="css" scoped>
  .flow-charts{
    background: #fff;
    padding:20px;
  }
  .title{
    border-left:5px solid blue;
    padding-left:10px;
    margin:10px 10px 10px 0;
  }
  .inspector {
    display: inline-block;
    font: bold 14px helvetica, sans-serif;
    background-color: #eee; /* Grey 900 */
    color: #000; /* Grey 100 */
    cursor: default;
    padding:10px;
    width:100%;
  }
  .inspector table {
    border-collapse: separate;
    border-spacing: 2px;
  }
  .inspector table tbody td{
    padding: 10px;
  }

  .inspector input {
    background-color: #424242; /* Grey 800 */
    color: #F5F5F5; /* Grey 100 */
    font: bold 12px helvetica, sans-serif;
    border: 0;
    padding: 10px;
  }

  .inspector input:disabled {
    background-color: #BDBDBD; /* Grey 400 */
    color: #616161; /* Grey 700 */
  }

  .inspector select {
    background-color: #424242;
  }
</style>
