<template>
  <div>
    <!-- {{$store.state.pending}} -->
    <button
      data-toggle="modal"
      data-target="#modal"
      class="btn btn-primary"
      @click="test1"
    >{{data}}</button>
    <button @click="test2" class="btn btn-primary">{{data}}写入2</button>
    <button @click="test1" class="btn btn-primary">{{data}}写入1</button>
    <node test1="def"></node>
    <br>
    <!-- <br>message:
    <input type="text" v-model="message">

    <br>type:
    <input type="text" v-model="type">

    <div id="editor"></div>
    <br>
    <label v-if="loading">{{$store.state.user}}</label>
    <v-select :options="options " taggable v-model="to">
      <span slot="no-options">未找到搜索结果</span>
      <template slot="option" scope="option">
        <span
          class="fas"
          :class="option.type=='role'?'fa-user-tag':option.type=='group'?'fa-users':'fa-user'"
        />
        {{option.label}}
      </template>
    </v-select>-->
    <div id="modal" class="modal">
      <div class="modal-dialog" style="max-width:100%">
        <div class="modal-content" >
          <iframe
            src="/api/test/1/1.pdf"
            style="max-height:2000px;width:100%;min-height:650px"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
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
import node from "@/components/Node"

export default {
  data() {
    return {
      data: "测试",
      loading: false,
      message: "aaa",
      to: "",
      type: "default",
      editor: null,
      testData: "",
      options: [],
      show: false
    };
  },
  components:{
    Node:node
  },
  created() {},
  mounted() {
    var $this = this;
    this.options.push({
      label: "abc",
      value: "ddd",
      icon: "fas fa-user",
      type: "user"
    });
    this.options.push({
      label: "ef",
      value: "f",
      icon: "fas fa-users",
      type: "group"
    });
    this.options.push({
      label: "dd",
      value: "b",
      icon: "fas fa-user-tag",
      type: "role"
    });
    // CKEditor.create(document.querySelector("#editor"), {
    //   language: "zh-cn"
    // })
    //   .then(function(editor) {
    //     $this.editor = editor;
    //     console.log("created");
    //   })
    //   .catch(function(error) {
    //     console.log("error:" + error);
    //   });
    console.log("mounted");
    // init();
  },
  methods: {
    test1() {
    },
    test2() {
      console.log("dest:" + JSON.stringify(this.to));
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
