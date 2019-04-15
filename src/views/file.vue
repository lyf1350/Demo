<template>
  <div>
    <ul>
      <li v-for="file in files" :key="file.name">{{file.name}} {{file.speed/1000}}KB/s 进度:<b-progress :value="parseInt(file.progress)" variant="success"></b-progress> </li>
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
      选择文件
    </file-upload>
    <b-button
      v-show="!$refs.upload || !$refs.upload.active"
      @click.prevent="$refs.upload.active = true"
    >上传</b-button>
    <b-button
      v-show="$refs.upload && $refs.upload.active"
      @click.prevent="$refs.upload.active = false"
      variant="danger"
    >停止上传</b-button>
    <b-modal id="modal" size="xl" hide-footer>
      <iframe :src="src" style="width:100%;min-height:650px" scrolling="no"></iframe>
    </b-modal>
    <br>已上传文件:
    <!-- <b-container> <b-row v-for="file in uploadedFiles" :key="file.id"> 
      <b-col>
        {{file.fileName}}

      </b-col>
      <b-col>
        <b-button v-b-modal.modal variant="success" @click="preview(file.uuid)">预览</b-button>
        <b-button @click="download(file.uuid)" variant="primary">下载</b-button>
        <b-button @click="deleteFile(file)" variant="danger">删除</b-button>
      </b-col>

      </b-row></b-container> -->
    <ul>
      <li v-for="file in uploadedFiles" :key="file.id">
        {{file.fileName}}
        <b-button v-b-modal.modal variant="success" @click="preview(file.uuid)">预览</b-button>
        <b-button @click="download(file.uuid)" variant="primary">下载</b-button>
        <b-button @click="deleteFile(file)" variant="danger">删除</b-button>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      files: [],
      src: "",
      uploadedFiles: []
    };
  },
  methods: {
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if(newFile.response.success)
          this.uploadedFiles.push(newFile.response.data);
        if (newFile.xhr) {
          //  Get the response status code
          console.log("status", newFile.xhr.status);
        }
      }
    },
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
    preview(uuid) {
      this.src = "/api/file/" + uuid;
    },
    deleteFile(file) {
      axios
        .post(
          "/api/file/delete",
          qs.stringify({
            file: JSON.stringify(file)
          })
        )
        .then(response => {
          console.log("response",response,"test");
          if(response.data.success){
            this.uploadedFiles.splice(this.uploadedFiles.indexOf(file),1);
          }
        });
    }
  },
  mounted() {
    var $this = this;
    axios.get("/api/file/list").then(response => {
      if (response.data.success) {
        $this.uploadedFiles = response.data.data;
      }
    });
  }
};
</script>

