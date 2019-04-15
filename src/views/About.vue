<template>
  <div class="about">
    <h1>工作进度</h1>
    <table id="table"  data-id-field="id" data-click-to-select="true" data-search="true"></table>
  </div>
</template>
<script>
import "bootstrap-table";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN";
import "bootstrap-table/dist/locale/bootstrap-table-en-US";
import _ from "lodash";
require("bootstrap-table/dist/bootstrap-table.css");

export default {
  methods: {
    test() {
      alert('test');
      console.log("tableData" + $("#table").bootstrapTable("getData"));
    }
  },
  data() {
    return {};
  },
  mounted() {
    var contentData = [];
    contentData.push({
      id: 1,
      content: "Vue 与Highcharts整合",
      contentState: "success"
    });
    contentData.push({
      id: 2,
      content: "Vue 与Bootstrap Table整合",
      contentState: "success"
    });
    contentData.push({
      id: 3,
      content: "SpringBoot Security",
      contentState: "danger"
    });
    contentData.push({
      id: 4,
      content: "消息系统（短信，邮件，站内信）",
      contentState: "success"
    });
    contentData.push({ id: 5, content: "权限配置", contentState: "success" });
    contentData.push({ id: 6, content: "审核流程", contentState: "success" });
    contentData.push({ id: 7, content: "文件预览", contentState: "success" });
    contentData.push({ id: 8, content: "图表配置", contentState: "warning" });
    contentData.push({ id: 9, content: "流程信息显示", contentState: "secondary" });


    var columns = [
      {
        title: "ID",
        field: "id",
        align: "center",
        valign: "middle",
        sortable: true,
        visible: true
      },
      {
        field: "content",
        title: "内容",
        align: "center"
      },
      {
        field: "contentState",
        title: "状态",
        formatter: (value, row, index) => {
          switch (value) {
            case "success":
              return "<button class='btn btn-success' @click='test'>已完成</button>";
            case "warning":
              return "<button class='btn btn-warning'>已开始</button>";
            case "danger":
              return "<button class='btn btn-danger'>已取消</button>";
              case "secondary":
              return "<button class='btn btn-secondary'>未开始</button>";
            default:
              return "<button class='btn btn-info'>未知状态</button>";
          }
        },
        sortable: true,
        align: "center"
      }
    ];
    $("#table").bootstrapTable({
      columns: columns,
      data: contentData,
      locale: "zh-CN",
      height: "100%"
    });
  }
};
</script>

