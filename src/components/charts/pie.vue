<template>
  <div ref="dom" style="margin-top: 20px" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts';
import tdTheme from './theme.json';
import { on, off } from '@/libs/tools';
echarts.registerTheme('tdTheme', tdTheme);
export default {
  name: 'ChartPie',
  props: {
    value: Object,
    text: String,
    subtext: String,
    center: {
      type: Array,
      default: () => (['50%', '60%'])
    }
  },
  data () {
    return {
      dom: null
    };
  },
  methods: {
    resize () {
      this.dom.resize();
    },
    creatCharts () {
      this.$nextTick(() => {
        // let legend = this.value.source.map(_ => _.name);
        // console.log(legend);
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              let list = params.data;
              let res = '';
              Object.keys(list).forEach((key) => {
                if (key === params.seriesName) {
                  res += '<p>' + list[key] + ':' + params.percent + '%</p >';
                }
              });
              return res;
            }
          },
          legend: {
            width: 300,
            height: 200,
            orient: 'vertical',
            left: 'right',
            // data: this.value.ruNo,
            padding: [60, 40, 0, 0]
          },
          dataset: this.value,
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: this.center,
              // data: this.value.source,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.dom = echarts.init(this.$refs.dom, 'tdTheme');
        this.dom.setOption(option);
        on(window, 'resize', this.resize);
      });
    }
  },
  mounted () {
    this.creatCharts();
  },
  watch: {
    value: {
      handler (newValue, oldValue) {
        this.value = newValue;
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
