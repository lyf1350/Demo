<template>
  <div>
    <!-- {{$store.state.pending}} -->
    <button data-toggle="modal" data-target="#modal" class="btn btn-primary" @click="test1">{{data}}</button>
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
    <ul>
      <li v-for="file in files" :key="file.name">{{file.name}} Success: {{file.success}}</li>
    </ul>
    <file-upload
      ref="upload"
      v-model="files"
      post-action="/api/file/upload"
      @input-file="inputFile"
      class="btn btn-primary"
      :multiple="true"
    >
      <i class="fa fa-plus"></i>
      Select files
    </file-upload>
    <b-button
      v-show="!$refs.upload || !$refs.upload.active"
      @click.prevent="$refs.upload.active = true"
      type="button"
    >Start upload</b-button>
    <button
      v-show="$refs.upload && $refs.upload.active"
      @click.prevent="$refs.upload.active = false"
      type="button"
    >Stop upload</button>
    <div id="modal" class="modal">
      <div class="modal-dialog" style="max-width:100%">
        <div class="modal-content">
          <iframe
            :src="src"
            style="max-height:2000px;width:100%;min-height:650px"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
    <br>已上传文件:
    <ul>
      <li v-for="file in uploadedFiles" :key="file.id">{{file.fileName}} <b-button data-toggle="modal" data-target="#modal" class="btn btn-primary" @click="test1(file.uuid)">预览</b-button>
      <b-button @click="download(file.uuid)">下载</b-button></li>
    </ul>
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
      show: false,
      files: [],
      src: "",
      uploadedFiles: []
    };
  },
  components: {
    Node: node
  },
  created() {},
  mounted() {
    var $this = this;
    axios.get("/api/file/list").then(response => {
      if (response.data.success) {
        $this.uploadedFiles = response.data.data;
      }
    });
    // this.options.push({
    //   label: "abc",
    //   value: "ddd",
    //   icon: "fas fa-user",
    //   type: "user"
    // });
    // this.options.push({
    //   label: "ef",
    //   value: "f",
    //   icon: "fas fa-users",
    //   type: "group"
    // });
    // this.options.push({
    //   label: "dd",
    //   value: "b",
    //   icon: "fas fa-user-tag",
    //   type: "role"
    // });
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
    download(uuid){
      window.open("/api/file/download/"+uuid)
    },
    test1(uuid) {
      this.src="/api/file/"+uuid;
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
