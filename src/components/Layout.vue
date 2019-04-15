<template>
  <b-container>
    <b-row v-for="(row,index) in layout" :key="'row'+index">
      <b-col v-for="(col,index2) in row" :key="'col'+index2">
        <div v-if="col.type=='file'">
          <label>{{col.label}}</label>
          <ul>
            <li v-for="file in temp[col.key]" :key="file.name">
              {{file.name}} 进度:
              <b-progress :value="parseInt(file.progress)" variant="success"></b-progress>
            </li>
          </ul>
          <file-upload
            :ref="'upload'+col.key"
            v-model="temp[col.key]"
            post-action="/api/file/upload"
            @input-file="inputFile"
            class="btn btn-primary"
            :multiple="col.multiple"
          >
            <i class="fa fa-plus"></i>
            选择文件
          </file-upload>
          <b-btn
            v-show="!$refs['upload'+col.key] || !$refs['upload'+col.key].active"
            @click.prevent="upload(col.key)"
          >上传</b-btn>
          <b-btn
            v-show="$refs['upload'+col.key] && $refs['upload'+col.key].active"
            @click.prevent="$refs['upload'+col.key][0].active = false"
            variant="danger"
          >停止上传</b-btn>
          <ul>
            <li v-for="file in data[col.key]" :key="file.id">
              {{file.fileName}}
              <!-- <b-button v-b-modal.modal variant="success" @click="preview(file.uuid)">预览</b-button>
                <b-button @click="download(file.uuid)" variant="primary">下载</b-button>
              <b-button @click="deleteFile(file)" variant="danger">删除</b-button>-->
            </li>
          </ul>
        </div>
        <basic v-else-if="col.type!='table'" :config="col" v-model="data[col.key]"/>
        <div v-else>
          {{col.label}}
          <b-table
            :items="data[col.key]"
            :fields="col.fields"
            fixed
            :selectable="col.editable"
            @row-selected="rowSelected(col.key)"
            @row-clicked="rowClicked"
          >
            <template v-for="(field,index3) in col.fields" :slot="field.key" slot-scope="slotData">
              <basic
                :config="field"
                :key="'field'+index3"
                v-model="data[col.key][slotData.index][field.key]"
              />
            </template>
          </b-table>
          <b-btn variant="success" v-if="col.editable" @click="addRow(col.key)">增加列</b-btn>
          <b-btn variant="danger" v-if="col.editable" @click="removeRow(col.key)">移除列</b-btn>
        </div>
        <div></div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Basic from "@/components/BasicComponent.vue";
export default {
  props: {
    layout: null,
    value: null
  },
  data() {
    return {
      data: this.value,
      temp: {}
    };
  },
  mounted() {
    console.log(this.data);
  },
  methods: {
    addRow(key) {
      this.temp[key] = {};
      if(this.data[key]==undefined||this.data[key]==null)
        this.$set(this.data,key,[]);
      this.data[key].push({});
    },
    removeRow(key) {
      console.log(this.temp[key]);
      let arr = [];
      for (let i in this.temp[key]) {
        if (this.temp[key][i]) arr.push(i);
      }
      _.pullAt(this.data[key], arr);
      this.temp[key] = {};
      this.data[key].sort();
    },
    rowSelected(key) {
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
    upload(key) {
      for (var i of this.temp[key]) {
        i.key = key;
      }
      this.$refs["upload" + key][0].active = true;
    },
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if (newFile.response.success && newFile.key) {
          if (this.data[newFile.key] == null)
            this.data[newFile.key] = [];
          this.data[newFile.key].push(newFile.response.data);
        }
      }
    }
  },
  components: {
    basic: Basic
  }
};
</script>
