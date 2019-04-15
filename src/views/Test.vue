<template>
  <div>
    <!-- {{$store.state.pending}} -->
    <button data-toggle="modal" data-target="#modal" class="btn btn-primary" @click="test1">modal</button>
    <button @click="test2" class="btn btn-primary">写入2</button>
    <button @click="test1" class="btn btn-primary">写入1</button>
    <br>
    <b-dropdown no-caret variant="nav-link">
      <template slot="button-content">aaass</template>
      <b-dropdown-item>aaa</b-dropdown-item>
    </b-dropdown>
    <b-btn v-b-modal.modal>test modal</b-btn>
    {{to}}
    <b-form-input v-model="text" placeholder="Enter your name" readonly draggable></b-form-input>
    {{message}}
    {{testData}}
    <div @drop="test2" @dragover.prevent>
      <p>asdasd</p>
      <span>fffff</span>
    </div>
    <b-table :items="data" :fields="fields" hover responsive fixed/>

    <b-modal id="modal" hide-footer hide-header>1234</b-modal>
    <div id="editor_holder"></div>
    <!-- <layout :layout="testLayout" :value="testData"/> -->
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import axios from "axios";
import qs from "qs";
import go from "gojs";
import circular from "circular-json";
import pdf from "pdfjs-dist";
import node from "@/components/Node";
import test from "@/components/TestComponent";
import layout from "@/components/Layout";
import _ from "lodash";
import JSONEditor from "@json-editor/json-editor";
export default {
  data() {
    return {
      temp: {},
      loading: false,
      message: "aaa",
      to: "abc",
      type: "default",
      editor: null,
      testData: {},
      fields2: [
        {
          key: "test1",
          label: "测试1",
          type: "string"
        },
        {
          key: "test2",
          label: "测试2",
          type: "string"
        }
      ],
      selected: true,
      index: null,
      selectedTable: {},
      options: [],
      show: false,
      files: [],
      src: "",
      uploadedFiles: [],
      test: "",
      text: "abc",
      data: [],
      fields: [],
      html: "<Test />aabbcc",
      config: {
        editable: true,
        label: "test",
        type: "string",
        selectable: true,
        options: ["a", "b", "c", "d"]
      },
      dataArray: [
        {
          test1: "111",
          test2: "222"
        }
      ],
      testLayout: null,
      layout: [
        {
          key: "f",
          label: "test2",
          row: 1,
          col: 2,
          type: "file",
          selectable: true,
          options: ["a", "b", "c"],
          editable: true,
          showLabel: true,
          multiple: true
        },
        {
          key: "a",
          label: "test1",
          row: 5,
          col: 2,
          type: "string",
          selectable: true,
          options: ["a", "b", "c"],
          editable: true,
          showLabel: true
        },
        {
          key: "b",
          label: "test2",
          row: 3,
          col: 2,
          type: "number",
          editable: true,
          showLabel: true,
          fields: [
            {
              key: "",
              label: "",
              type: ""
            }
          ]
        },
        {
          key: "c",
          label: "test2",
          row: 3,
          col: 1,
          type: "date",
          editable: true,
          fields: [
            {
              key: "",
              label: "",
              type: ""
            }
          ],
          showLabel: true
        },
        {
          key: "e",
          label: "test5",
          type: "table",
          row: 4,
          col: 3,
          editable: true,
          fields: [
            {
              key: "test1",
              label: "测试1",
              type: "string",
              editable: true,
              selectable: true,
              options: ["a", "b", "c", "d"]
            },
            {
              key: "test2",
              label: "测试2",
              type: "string",
              selectable: false
            }
          ]
        }
      ]
    };
  },
  components: {
    Node: node,
    Test: test,
    layout: layout
  },
  created() {},
  mounted() {
    var element = document.getElementById("editor_holder");

    var editor = new JSONEditor(element, {
      theme: "bootstrap4",
      schema: {
        type: "object",
        title: "流程信息页面布局设置",
        properties: {
          make: {
            type: "string",
            enum: ["Toyota", "BMW", "Honda", "Ford", "Chevy", "VW"]
          },
          model: {
            type: "string"
          },
          year: {
            type: "integer",
            title:"年份",
            enum: [
              1995,
              1996,
              1997,
              1998,
              1999,
              2000,
              2001,
              2002,
              2003,
              2004,
              2005,
              2006,
              2007,
              2008,
              2009,
              2010,
              2011,
              2012,
              2013,
              2014
            ],
            default: 2008
          },
          safety: {
            type: "integer",
            format: "rating",
            maximum: "5",
            exclusiveMaximum: false,
            readonly: false
          }
        }
      },
      iconlib:'fontawesome5',
      compact:true,
      object_layout:'normal'
    });
    var $this = this;
    axios.get("/api/file/list").then(response => {
      if (response.data.success) {
        $this.uploadedFiles = response.data.data;
      }
    });
    var test = {};
    var test2 = [];
    for (var i of this.layout) {
      if (test[i.row] == undefined || test[i.row] == null) {
        test[i.row] = [];
      }
      test[i.row].push(i);
    }
    for (var i in test) {
      test[i].sort((a, b) => {
        return a.col < b.col ? -1 : 1;
      });
      test2.push(test[i]);
    }
    test2.sort((a, b) => {
      return a[0].row < b[0].row ? -1 : 1;
    });
    this.testLayout = test2;
    console.log("test:" + JSON.stringify(test2));

    console.log("mounted");
    // init();
  },
  methods: {
    /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if (newFile.response.success && newFile.key) {
          if (this.testData[newFile.key] == null)
            this.testData[newFile.key] = [];
          this.testData[newFile.key].push(newFile.response.data);
        }
        if (newFile.xhr) {
          //  Get the response status code
          console.log("status", newFile.xhr.status);
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent();
        }
      }

      // Create a blob field
      newFile.blob = "";
      let URL = window.URL || window.webkitURL;
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file);
      }
    },
    download(uuid) {
      window.open("/api/file/download/" + uuid);
    },
    upload(key) {
      for (var i of this.temp[key]) {
        i.key = key;
      }
      this.$refs["upload" + key][0].active = true;
    },
    test1() {
      var _this = this;
      this.fields = [
        {
          key: "file_name",
          label: "文件名"
        },
        {
          key: "suffix",
          label: "后缀",
          sortable: true,
          variant: "danger"
        }
      ];
      axios.get("/api/test").then(response => {
        console.log("response:" + JSON.stringify(response.data));
        _this.data = response.data.data;
      });
      // this.src = "/api/file/" + uuid;
    },
    dragover(ev) {
      event.preventDefault();
    },
    addRow(key) {
      this.temp[key] = {};
      this.testData[key].push({});
    },
    removeRow(key) {
      console.log(this.temp[key]);
      let arr = [];
      for (let i in this.temp[key]) {
        if (this.temp[key][i]) arr.push(i);
      }
      _.pullAt(this.testData[key], arr);
      this.temp[key] = {};
      this.testData[key].sort();
    },
    rowSelected(key) {
      console.log("select1");

      if (!this.selected) {
        return;
      }
      this.selected = false;
      console.log("select2");

      if (this.temp[key] == null) this.temp[key] = {};
      this.temp[key][this.index] =
        this.temp[key][this.index] == null ? true : !this.temp[key][this.index];
    },
    rowClicked(item, index, event) {
      console.log("click");
      this.selected = true;
      this.index = index;
    },
    test2(ev) {
      // console.log(ev);
      console.log(this.$refs["test"]);
      // console.log(this.temp);
      // pdf.getDocument("/api/test/1").then(
      //   pdf => {
      //     pdf.getPage(1).then(page => {
      //       var viewport = page.getViewport({ scale: 1.5 });
      //       var canvas = document.getElementById("canvas");
      //       var context = canvas.getContext("2d");
      //       canvas.height = 2000;
      //       canvas.width = 1200;
      //       page
      //         .render({
      //           canvasContext: context,
      //           viewport: viewport
      //         })
      //         .then(response => console.log("success"));
      //     });
      //   },
      //   error => console.log("error:" + error)
      // );

      // axios
      //   .post("/api/test/1")
      //   .then(response => {console.log(JSON.stringify(response.data.success))

      //   .catch(error => console.log(JSON.stringify(error)));
      // console.log("$store:" + this.$store.state.ws);
      // var temp = {
      //   from: "test",
      //   to: this.to,
      //   message: this.message,
      //   type: this.type
      // };
      // this.$store.state.ws.send(JSON.stringify(temp));
    }
  }
};
</script>

<style>
</style>
