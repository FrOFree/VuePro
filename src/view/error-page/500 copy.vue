<template>
    <Cascader :data="data4" change-on-select :load-data="loadData"></Cascader>
</template>
<script>
export default {
  data () {
    return {
      data4: [
        {
          value: 'beijing',
          label: '北京',
          children: [],
          loading: false
        },
        {
          value: 'hangzhou',
          label: '杭州',
          children: [],
          loading: false
        }
      ],
      data: [
        {
          "id": "631179461942431744",
          "prodNo": "ZL_LX",
          "prodName": "招联_乐信",
          "prodSts": "0",
          "prodDesc": "招联_乐信，欺诈分大于80，数据平台",
          "riskScene": null
        }, {
          "id": "632179683156959232",
          "prodNo": "ZL_other",
          "prodName": "招联非自营",
          "prodSts": "0",
          "prodDesc": "12",
          "riskScene": null
        }, {
          "id": "632269714161782784",
          "prodNo": "ZL_DIDI",
          "prodName": "招联_滴滴",
          "prodSts": "0",
          "prodDesc": "招联_滴滴,反欺诈分大于80，数据平台",
          "riskScene": null
        }, {
          "id": "633241363676135424",
          "prodNo": "hjw",
          "prodName": "123456",
          "prodSts": "0",
          "prodDesc": "测试日志查询",
          "riskScene": null
        }, {
          "id": "639113802681180160",
          "prodNo": "model_prod",
          "prodName": "模型产品",
          "prodSts": "0",
          "prodDesc": "模型产品",
          "riskScene": null
        }, {
          "id": "639769715482058752",
          "prodNo": "cscp0012",
          "prodName": "测试产品0012",
          "prodSts": "0",
          "prodDesc": "111正品行货,超低折扣价,享受生活,享受购物!全场大牌汇集,正品行..",
          "riskScene": null
        }, {
          "id": "ASWD",
          "prodNo": "ZL01",
          "prodName": "招联自营",
          "prodSts": "0",
          "prodDesc": "招联自营",
          "riskScene": "1"
        }
      ]
    };
  },
  mounted () {
    // this.data.forEach(element => {
    //   let echList = {
    //     value: '',
    //     label: '',
    //     children: []
    //   };
    //   echList.value = element.prodNo;
    //   echList.label = element.prodName;
    //   echList.children = [];
    //   echList.loading = false;
    //   this.data4.push(echList);
    // });
    this.cascader(this.data, false);
  },
  methods: {
    cascader (arr, isShowChild) {
      arr.forEach(element => {
        let echList = {
          value: '',
          label: ''
          // children: []
        };
        echList.value = element.prodNo;
        echList.label = element.prodName;
        echList.children = [];
        echList.loading = false;
        this.data4.push(echList);
      });
    },
    loadData (item, callback) {
      item.loading = true;
      console.log(callback);
      console.log(item);
      console.log((item.__label.split('/')));
      setTimeout(() => {
        if (item.value === 'beijing') {
          item.children = [
            {
              value: 'talkingdata',
              label: 'TalkingData',
              children: [],
              loading: false
            },
            {
              value: 'baidu',
              label: '百度',
              children: [],
              loading: false
            },
            {
              value: 'sina',
              label: '新浪',
              children: [],
              loading: false
            }
          ];
        } else if (item.value === 'hangzhou') {
          item.children = [
            {
              value: 'ali',
              label: '阿里巴巴',
              children: [],
              loading: false
            },
            {
              value: '163',
              label: '网易',
              children: [],
              loading: false
            }
          ];
        } else if ((item.__label.split('/')).length - 1 === 1) {
          item.children = [
            {
              value: 'ali',
              label: '阿里巴巴'
            },
            {
              value: '163',
              label: '网易'
            }
          ];
        }
        item.loading = false;
        callback();
      }, 1000);
    }
  }
};
</script>
