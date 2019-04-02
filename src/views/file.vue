<template>
  <div>
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
    <b-button
      v-show="$refs.upload && $refs.upload.active"
      @click.prevent="$refs.upload.active = false"
      type="button"
      variant="danger"
    >Stop upload</b-button>
    <div id="modal" class="modal">
      <div class="modal-dialog" style="max-width:100%">
        <div class="modal-content">
          <iframe :src="src" style="max-height:2000px;width:100%;min-height:650px" scrolling="no"></iframe>
        </div>
      </div>
    </div>
    <br>已上传文件:
    <ul>
      <li v-for="file in uploadedFiles" :key="file.id">
        {{file.fileName}}
        <b-button
          data-toggle="modal"
          data-target="#modal"
          class="btn btn-primary"
          @click="preview(file.uuid)"
        >预览</b-button>
        <b-button @click="download(file.uuid)">下载</b-button>
        <b-button @click="deleteFile(file)">删除</b-button>
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
        .then(response => console.log(response.data));
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

