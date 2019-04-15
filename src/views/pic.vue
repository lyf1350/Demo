<template>
  <div class="my-box">
    <b-btn @click="test">test</b-btn>
    <div id="pic1"></div>
    <div id="pic2"></div>
    <div id="pic3"></div>
    <div id="pic4"></div>
    <div id="pic5" style="height:100px;margin:1em auto"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Highcharts_more from "highcharts/highcharts-more";
import solid_guage from "highcharts/modules/solid-gauge";
import highcharts_export from "highcharts/modules/exporting";
import highcarts_export_data from "highcharts/modules/export-data";
import highcharts_bullet from "highcharts/modules/bullet";
Highcharts_more(Highcharts);
solid_guage(Highcharts);
highcharts_export(Highcharts);
highcarts_export_data(Highcharts);
highcharts_bullet(Highcharts);

export default {
  data() {
    return {
      data: "da",
      loading: false,
      series:[],
      chart:null
      ,options:{}

    };
  },
  methods: {
    test() {}
  },
  mounted() {
    Highcharts.setOptions({
      credits: {
        enabled: false
      },
      lang:{
        contextButtonTitle:'导出',
        downloadCSV:"导出CSV",
        downloadJPEG:"导出JPEG",
        downloadPDF:"导出PDF",
        downloadPNG:"导出PNG",
        downloadSVG:"导出SVG",
        downloadXLS:"导出XLS",
        resetZoom:"重置",
        printChart:"打印图表",
        viewData:"查看数据",
        openInCloud:"云端打开"
      }
    });
    this.options={
      chart: {
        type: "column",
        zoomType: "x",
        panning: true,
        panKey: "shift"
      },

      title: {
        text: "每月销售数据"
      },
      subtitle: {
        text: "来源: 销售统计"
      },
      xAxis: {
        categories: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月"
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: "销售额 (万)"
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} 万</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: []
    }
    this.chart=Highcharts.chart("pic1",this.options );

    Highcharts.chart("pic2", {
      chart: {
        type: "area",
        zoomType: "xy",
        panning: true,
        panKey: "shift"
      },
      title: {
        text: "万向客户统计"
      },
      xAxis: {
        allowDecimals: false,
        labels: {
          formatter: function() {
            return this.value; // clean, unformatted number for year
          }
        }
      },
      yAxis: {
        title: {
          text: "客户数量"
        },
        labels: {
          formatter: function() {
            return this.value / 1000 + "k";
          }
        }
      },
      tooltip: {
        pointFormat:
          "{series.name} 客户数量 <b>{point.y:,.0f}</b><br/>人  {point.x}"
      },
      plotOptions: {
        area: {
          pointStart: 1940,
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [
        {
          name: "万向精工",
          data: [
            null,
            null,
            null,
            null,
            null,
            6,
            11,
            32,
            110,
            235,
            369,
            640,
            1005,
            1436,
            2063,
            3057,
            4618,
            6444,
            9822,
            15468,
            20434,
            24126,
            27387,
            29459,
            31056,
            31982,
            32040,
            31233,
            29224,
            27342,
            26662,
            26956,
            27912,
            28999,
            28965,
            27826,
            25579,
            25722,
            24826
          ]
        },
        {
          name: "万向节",
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            5,
            25,
            50,
            120,
            150,
            200,
            426,
            660,
            869,
            1060,
            1605,
            2471,
            3322,
            4238,
            5221,
            6129,
            7089,
            8339,
            9399,
            10538,
            11643,
            13092,
            14478,
            15915,
            17385,
            19055,
            21205,
            23044,
            25393
          ]
        }
      ]
    });
    Highcharts.chart("pic3", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        style: "width:100%"
      },
      title: {
        text: "客户分布, 2018"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "black"
            }
          }
        }
      },
      series: [
        {
          name: "客户类别",
          colorByPoint: true,
          data: [
            {
              name: "I类客户",
              y: 61.41,
              sliced: true,
              selected: true
            },
            {
              name: "II类客户",
              y: 11.84
            },
            {
              name: "III类客户",
              y: 10.85
            },
            {
              name: "VI类客户",
              y: 4.67
            },
            {
              name: "V类客户",
              y: 4.18
            },
            {
              name: "其他",
              y: 7.05
            }
          ]
        }
      ]
    });
    Highcharts.chart("pic4", {
      chart: {
        type: "solidgauge"
      },
      title: {
        text: "标准化程度"
      },
      pane: {
        center: ["50%", "85%"],
        size: "140%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
            (Highcharts.theme && Highcharts.theme.background2) || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc"
        }
      },
      yAxis: {
        min: 0,
        max: 100,

        stops: [
          [0.1, "#55BF3B"], // green
          [0.5, "#DDDF0D"], // yellow
          [0.9, "#DF5353"] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      credits: {
        enabled: false
      },

      series: [
        {
          name: "标准化",
          data: [80],
          dataLabels: {
            format:
              '<div style="text-align:center"><span style="font-size:25px;color:' +
              ((Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "black") +
              '">{y}</span><br/>' +
              '<span style="font-size:12px;color:silver">%</span></div>'
          },
          tooltip: {
            valueSuffix: " %"
          }
        }
      ],

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      },

      tooltip: {
        enabled: false
      }
    });
    Highcharts.chart("pic5", {
      chart: {
        inverted: true,
        marginLeft: 135,
        type: "bullet"
      },
      title: {
        text: "2018 收入目标达成情况"
      },
      xAxis: {
        categories: ['<span class="hc-cat-title">收入</span><br/> ￥ (1,000)']
      },
      legend: {
        enabled: false
      },
      yAxis: {
        gridLineWidth: 0,
        plotBands: [
          {
            from: 0,
            to: 300,
            color: "#172223"
          }
        ],
        title: null
      },
      series: [
        {
          data: [
            {
              y: 200,
              target: 275
            }
          ]
        }
      ],
      tooltip: {
        pointFormat: "<b>{point.y}</b> (目标： {point.target})"
      }
    });
  },methods:{
    test(){
      let temp=[];
      let cities=['北京','上海','广州','深圳']
      for(let i of cities){
        let data=[];
        for(let j=0;j<10;j++){
          data.push(Math.random()*200);
        }
        temp.push({
          name:i,
          data:data
        })
      }
      this.options.series=temp;
      console.log("options11:"+JSON.stringify(temp));
    this.chart=Highcharts.chart("pic1",this.options );
    // this.chart.exportChartLocal({
		// 	type: 'application/pdf',
		// 	filename: 'my-pdf'
		// })
      console.log(this.chart.getSVG());
      // this.chart.update({
      //   series:temp
      // },true);
    }
  }
};
</script>

<style>

</style>
