<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
<!-- 1. 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";
import echarts from 'echarts';

export default {
  components: {
    Crumb
  },
  data() {
    return {
      name: {
        manage: "数据统计",
        user: "数据报表"
      },
      echartsInfo:{},
      option : {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger:'axis',
                axisPointer:{
                    type:'cross',
                    label:{
                        backgrountColor:'#e9eef3'
                    }
                }
            },
            grid:{
                left:'3%',
                right:'4%',
               bottom:'3%',
                containLabel:true,
            },
            legend: {
                data:['销量']
            },
            xAxis: [{
                boundaryGap:false,
            }],
            yAxis: [
                {
                    type:'value'
                }],
            
      }
    }
  },
  
  mounted () {
      // 对于echarts ， 2：基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        this.$axios.get('reports/type/1').then(e=>{
              this.echartsInfo=e.data.data
              // 将后台给的数据结构拼接一下：
              const merge={...this.option,...e.data.data}
              myChart.setOption(merge);

          })
        
        //对于echarts ， 3： 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 4: 展示图形
       
        
       
  },
  methods: {
      
  },
};
</script>

<style lang="scss" scoped>
</style>