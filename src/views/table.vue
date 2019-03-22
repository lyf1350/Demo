<template>
  <div >
    <button @click="test" class="btn btn-primary">测试</button>
    <br>
    <div id="toolbar">
      <button id="remove" @click="remove" class="btn btn-danger">
        <i class="glyphicon glyphicon-remove"></i> 删除
      </button>
    </div>
    <table
      id="table"
      data-toolbar="#toolbar"
      data-search="true"
      data-show-refresh="true"
      data-show-toggle="true"
      data-show-columns="true"
      data-show-export="true"
      data-detail-view="true"
      data-detail-formatter="detailFormatter"
      data-minimum-count-columns="2"
      data-pagination="true"
      data-id-field="id"
      data-page-list="[10, 25, 50, 100, ALL]"
      data-show-footer="true"
      data-response-handler="responseHandler"
      data-click-to-select="true"
    ></table>
  </div>
</template>

<script>
import "bootstrap-table";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN";
import "bootstrap-table/dist/locale/bootstrap-table-en-US";
import "../assets/js/tableExport";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export";
import _ from "lodash";
require("bootstrap-table/dist/bootstrap-table.css");

var selections = [];

function getIdSelections() {
  return $.map($("#table").bootstrapTable("getSelections"), function(row) {
    return row.id;
  });
}

function responseHandler(res) {
  $.each(res.rows, function(i, row) {
    row.state = $.inArray(row.id, selections) !== -1;
  });
  return res;
}
var testData = [];
for (let ii = 0; ii < 100; ii++) {
  let temp = {};
  temp.id = ii;
  temp.name = "物品 " + ii;
  temp.price = Math.floor(Math.random() * 100) + 1;
  testData.push(temp);
}

function formatter(value, row, index) {
  return value;
}
export default {
  data() {
    return {
      data: testData,
      loading: false,
      message: [],
      columns: [
        [
          {
            field: "state",
            checkbox: true,
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            title: "产品ID",
            field: "id",
            rowspan: 2,
            align: "center",
            valign: "middle",
            sortable: true,
            footerFormatter: data => {
              return "总额";
            },
            visible:false
          },
          {
            title: "明细",
            colspan: 3,
            align: "center"
          }
        ],
        [
          {
            field: "name",
            title: "名称",
            sortable: true,
            formatter: formatter,
            footerFormatter: data => {
              return data.length;
            },
            align: "center"
          },
          {
            field: "price",
            title: "价格",
            sortable: true,
            align: "center",
            footerFormatter: data => {
              return (
                "￥" +
                data
                  .map(function(row) {
                    return +row["price"];
                  })
                  .reduce(function(sum, i) {
                    return sum + i;
                  }, 0)
              );
            }
          },
          {
            field: "operate",
            title: "操作",
            align: "center",
            events: {
              "click .like": function(e, value, row, index) {
                alert("You click like action, row: " + JSON.stringify(row));
              },
              "click .remove": function(e, value, row, index) {
                console.log("remove");
                $('#table').bootstrapTable("remove", {
                  field: "id",
                  values: [row.id]
                });
              }
            },
            formatter: (value, row, index) => {
              return [
                '<a class="like" href="javascript:void(0)" title="Like">',
                '<i class="fa fa-heart"></i>',
                "</a>  ",
                '<a class="remove" href="javascript:void(0)" title="Remove">',
                '<i class="fa fa-trash"></i>',
                "</a>"
              ].join("");
            }
          }
        ]
      ]

    };
  },
  methods: {
    test() {
    //   console.log("test");
    //   console.log("data:"+JSON.stringify(this.data));
    //   this.loading = !this.loading;
    //   $('#remove').prop("disabled", this.loading);
    console.log("data1:"+JSON.stringify(this.data));
    _.pullAt(this.data,[0,1]);
    this.data[0].name="test";
    $('#table').bootstrapTable('load',this.data);
    // $('#table').bootstrapTable('updateRow',{index:0});
    // $('#table').bootstrapTable('load');

    },
    remove() {
      console.log("remove11");
      var ids = getIdSelections();
      console.log("ids:" + JSON.stringify(ids));
      $("#table").bootstrapTable("remove", {
        field: "id",
        values: ids
      });
    }
  },
  mounted() {
    $("#table").bootstrapTable({
      columns: this.columns,
      data: this.data,
      locale: "zh-CN",
      uniqueId:"id",
      detailFormatter: (index, row) => {
        var html = [];
        $.each(row, function(key, value) {
          html.push("<p><b>" + key + ":</b> " + value + "</p>");
        });
        return html.join("");
      },
      height: '100%'
    });
  }
};
</script>

<style>
</style>
