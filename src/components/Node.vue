<template>
  <div v-if="node!=null&&show">
    <b-tabs card>
      <b-tab title="流程信息">
        流程名称:{{node.workflow.workflowName}}
        <br>
        流程ID:{{node.workflow.id}}
        <br>
        节点名称:{{node.nodeName}}
        <b-card title="流程属性">
          <layout :layout="layout" :value="data"/>
        </b-card>
        <br>
        <label>意见:</label>
        <b-form-input type="text" v-model="remark"/>
        <br>
        <b-button class="btn-block" variant="info" @click="save">保存</b-button>

        <b-button class="btn-block" variant="success" @click="execute('approve')">同意</b-button>
        <b-button
          class="btn-block"
          variant="danger"
          @click="execute('refuse')"
          v-if="node.nodeLevel!=0"
        >拒绝</b-button>
        <b-button
          class="btn-block"
          variant="danger"
          @click="deleteWorkflow"
          v-if="node.nodeLevel==0&&node.workflow.workflowUser.id==$store.state.user.id"
        >删除流程</b-button>
      </b-tab>
      <b-tab @click="showModel" title="流程图">
        <div id="nodeDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
      </b-tab>
      <b-tab title="流程日志">
        <div>
          <b-table :items="logs" responsive hover :filter="filterFunction"></b-table>
        </div>
      </b-tab>
    </b-tabs>
    <div class="modal" id="nodeProp">
      <div class="modal-dialog">
        <div class="modal-content" v-if="selectedNode">
          <div class="modal-header">{{selectedNode?selectedNode.data.text:''}} 属性</div>
          <div class="modal-content">
            名称：{{selectedNode.data.text}}
            审核人:{{selectedNode.data.prop.reviewers|reviewerFilter}}
            Action：
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/assets/js/service";
import axios from "axios";
import qs from "qs";
import moment from "moment";
import layout from "@/components/Layout";
export default {
  data() {
    return {
      myDiagram: null,
      selectedNode: null,
      logs: [],
      remark: "",
      layout: null,
      data: {},
      show: true
    };
  },
  props: {
    node: null
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    showModel() {
      console.log("workflow:", this.node.workflow.workflowModel);
      service.initTemplate(
        this,
        "nodeDiv",
        this.node.workflow.workflowModel,
        "#nodeProp"
      );
    },
    execute(decision) {
      var _this = this;
      axios
        .post(
          "/api/node/execute",
          qs.stringify({
            id: this.node.id,
            remark: this.remark,
            decision: decision == "approve" ? "同意" : "拒绝",
            property: JSON.stringify(this.data)
          })
        )
        .then(response => {
          if (response.data.success) _this.show = false;
          else {
            $.alert(response.data.msg, "流程执行出错");
          }
        });
    },
    filterFunction(value) {
      console.log("value:" + JSON.stringify(value));
      return true;
    },
    save() {
      console.log(this.data);
      axios
        .post(
          "/api/workflow/save",
          qs.stringify({
            id: this.node.workflow.id,
            property: JSON.stringify(this.data)
          })
        )
        .then(response => console.log(response.data));
    },
    deleteWorkflow() {
      var _this = this;
      axios
        .post(
          "/api/workflow/delete",
          qs.stringify({
            id: _this.node.workflow.id
          })
        )
        .then(response => {
          console.log(response.data);
          if (response.data.success) {
            _this.show = false;
            var nodes = _this.$store.state.pending.filter(
              e => e.id != _this.node.id
            );
            _this.$store.commit("setValue", {
              name: "pending",
              value: nodes
            });
          }
        });
    }
  },
  watch: {
    node: function(newVal) {
      if (newVal == null) return;
      var _this = this;
      console.log("node:", newVal);
      axios
        .get("/api/workflow/log?id=" + newVal.workflow.id)
        .then(function(response) {
          if (response.data.success) {
            var logs = [];
            for (let i of response.data.data) {
              logs.push({
                node: i.nodeName,
                decision: i.decision,
                startTime: _this.dateFormatter(i.startTime),
                endTime: _this.dateFormatter(i.endTime),
                remark: i.remark,
                person: i.userName
              });
            }
            _this.logs = logs;
          }
        });
      this.layout = JSON.parse(newVal.workflow.workflowLayout);
      this.data = JSON.parse(newVal.workflow.property.property);
      let name = this.node.nodeName;
      for (let i of this.layout) {
        if (i.nodes.indexOf(name) == -1) {
          i.editable = false;
          if (i.type == "table") {
            for (let j of i.fields) {
              j.editable = false;
            }
          }
        }
      }

      if (this.data == null || newVal.workflow.property.property.length == 2) {
        console.log("data null");
        this.data = {};
        for (let i of this.layout) {
          if (i.type == "table") this.data[i.key] = [];
          else this.data[i.key] = null;
        }
      }
      this.show = true;
      console.log("layout:", this.layout);
      console.log("data:", this.data);
    }
  },
  filters: {
    reviewerFilter(reviewers) {
      let str = "";
      for (let i of reviewers) {
        if (str.length > 0) str += "\n";
        str += i.label;
      }
      return str;
    }
  },
  components: {
    layout: layout
  }
};
</script>

