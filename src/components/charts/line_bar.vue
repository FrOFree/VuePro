<template>
      <div style="margin-top: 20px" ref="dom"></div>
</template>

<script>
import echarts from 'echarts';
import { on, off } from '@/libs/tools';
export default {
  name: 'ChartLine',
  props: {
    value: Object,
    text: String,
    subtext: String,
    seriesType: Array,
    lineBarStyle: Object
    // lineBarStyle: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data () {
    return {
      dom: null
    };
  },
  mounted () {
    this.creatCharts();
  },
  methods: {
    resize () {
      this.dom.resize();
    },
    creatCharts () {
      const option = {
        // backgroundColor: 'pink',
        title: {
          text: this.text,
          x: 'left',
          textStyle: {
            color: 'gray',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: 18
          }
        },
        legend: {
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let res = '<p>' + params[0].name + '</p >';
            for (let i = 0; i < params.length; i++) {
              let list = params[i].data;
              Object.keys(list).forEach((key) => {
                if (key === params[i].seriesName) {
                  if (this.lineBarStyle.tooltipFormatter === 'num') {
                    res += '<p>' + params[i].seriesName + ':' + list[key] + '</p >';
                  } else {
                    res += '<p>' + params[i].seriesName + ':' + list[key] + '%</p >';
                  }
                }
              });
            }
            return res;
          }
          // formatter: (params) => {
          //   let list = params.data;
          //   let res = '<p>' + params.name + '</p >';
          //   Object.keys(list).forEach((key) => {
          //     if (key === params.seriesName) {
          //       if (this.lineBarStyle.tooltipFormatter === 'num') {
          //         res += '<p>' + params.seriesName + ':' + list[key] + '</p >';
          //       } else {
          //         res += '<p>' + params.seriesName + ':' + list[key] + '%</p >';
          //       }
          //     }
          //   });
          //   return res;
          // }
        },
        dataset: this.value,
        xAxis: {
          type: 'category'
        },
        yAxis: {
          axisLabel: {
            formatter: this.lineBarStyle.axisLabelFormatter
          }
        },
        series: this.seriesType
      };
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom);
        this.dom.setOption(option, true);
        on(window, 'resize', this.resize);
      });
    }
  },
  watch: {
    value: {
      handler (newValue, oldValue) {
        this.value = newValue;
        echarts.init(this.$refs.dom).dispose();
        this.creatCharts();
      },
      deep: true
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize);
  }
};
</script>
