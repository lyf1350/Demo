<template>
  <div class="border border-1 my-box">
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">发送消息</button>
    <div class="modal" id="modal">
      <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
          <div class="modal-header"></div>

          <div class="modal-content">
            <div class="form-group">
              <label for="title" class="col-form-label">标题:</label>
              <input type="text" v-model="title" class="form-control" id="title">
            </div>
            <div class="form-group" style="min-width:70%">
              <label for="dest" class="col-form-label">收件人:</label>
              <v-select
                multiple
                :options="options "
                v-model="dest"
                id="dest"
                placeholder="请选择"
                :filter-by="filterFunction"
                :close-on-select="false"
              >
                <span slot="no-options">未找到搜索结果</span>
                <template slot="option" scope="option">
                  <span
                    class="fas"
                    :class="option.type=='role'?'fa-user-tag':option.type=='group'?'fa-users':'fa-user'"
                  />
                  {{option.label}}
                </template>
              </v-select>
            </div>
            <br>内容:
            <div id="editor"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="send">发送</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-for="(message,index) in $store.state.msg" :key="message.id" class="card">
        <h2 class="card-title" data-toggle="collapse" @click="collapse(index)">
          {{message.message.title}}
          <span
            class="float-right badge badge-danger btn"
            v-if="message.state===1"
            @click.stop="remove(index)"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </span>
          <span
            class="float-right badge btn"
            :class="{'badge-danger':message.state===0,'badge-success':message.state===1}"
          >{{message.state==0?'未读':'已读'}}</span>
        </h2>
        <div class="collapse" :id="'message'+index">
          <h6
            class="card-subtitle text-muted"
          >发件人:{{message.message.source}} 收件人:{{message.message.dest}} 时间:{{message.message.createDate|dateFormatter}}</h6>
          <div class="card-text" v-html="message.message.content"></div>
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
import moment from "moment";
export default {
  data() {
    return {
      editor: null,
      messages: [],
      content: "",
      dest: [],
      type: [],
      title: "",
      option: "",
      options: [],
      placeholder: "请选择"
    };
  },
  mounted() {
    var $this = this;
    CKEditor.create(document.querySelector("#editor"), {
      language: "zh-cn"
    }).then(editor => ($this.editor = editor));

    axios.get("/api/user/list").then(response => {
      for (let i of response.data.data) {
        $this.options.push({
          type: "user",
          label: i.username,
          value: i.username
        });
      }
    });
    axios.get("/api/group/list").then(response => {
      for (let i of response.data.data) {
        $this.options.push({
          type: "group",
          label: i.groupName,
          value: i.groupName
        });
      }
    });
    axios.get("/api/role/list").then(response => {
      for (let i of response.data.data) {
        $this.options.push({
          type: "role",
          label: i.roleName,
          value: i.roleName
        });
      }
    });
  },
  created() {
    console.log("created");
  },
  methods: {
    send() {
      let dest = JSON.stringify(this.dest.map(e => e.value));
      let type = JSON.stringify(this.dest.map(e => e.type));

      axios.post(
        "/api/message/send",
        qs.stringify({
          source: this.$store.state.user.username,
          dest: dest,
          title: this.title,
          content: this.editor.getData(),
          type: type
        })
      );
    },
    test(index) {},
    collapse(index) {
      if (this.$store.state.msg[index].state == 0) {
        axios
          .get("api/message/update", {
            params: {
              id: this.$store.state.msg[index].id
            }
          })
          .then(response =>
            console.log("data:" + JSON.stringify(response.data))
          );
        this.$store.state.msg[index].state = 1;
        this.$store.commit("setUnreadMessage", -1);
      }
      $("#message" + index).collapse("toggle");
    },
    remove(index) {
      axios
        .get("api/message/delete", {
          params: {
            id: this.$store.state.msg[index].id
          }
        })
        .then(response => console.log("data:" + JSON.stringify(response.data)));
      this.$store.state.msg.splice(index, 1);
      this.$store.commit("setValue", {
        name:'msg',
        value:this.$store.state.msg
      });
    },
    filterFunction(option, label, search) {
      return (
        (label || "").toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        option.value.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    }
  },
  filters: {
    dateFormatter(value) {
      if (value != null) return moment(value).format('"YYYY-MM-DD HH:mm:ss"');
      else return "";
    }
  }
};
</script>


<style>
</style>
