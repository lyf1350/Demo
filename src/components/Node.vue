<template>
  <div v-if="node!=null">
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
        <b-button class="btn-block" variant="danger" @click="execute('refuse')">拒绝</b-button>
      </b-tab>
      <b-tab @click="show" title="流程图">
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
      test: "123",
      selectedNode: null,
      logs: [],
      remark: "",
      layout: null,
      data: {}
    };
  },
  props: {
    node: null
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    show() {
      console.log("workflow:", this.node.workflow.workflowModel);
      service.initTemplate(
        this,
        "nodeDiv",
        this.node.workflow.workflowModel,
        "#nodeProp"
      );
    },
    execute(decision) {
      axios.post(
        "/api/node/execute",
        qs.stringify({
          node: JSON.stringify(this.node),
          remark: this.remark,
          decision: decision == "approve" ? "同意" : "拒绝"
        })
      );
    },
    filterFunction(value) {
      console.log("value:" + JSON.stringify(value));
      return true;
    },
    save() {
      axios
        .post(
          "/api/workflow/save",
          qs.stringify({
            id: this.node.workflow.id,
            property: JSON.stringify(this.data)
          })
        )
        .then(response => console.log(response));
    }
  },
  watch: {
    node: function(newVal) {
      if (newVal == null) return;
      var _this = this;
      axios
        .post(
          "/api/workflow/log",
          qs.stringify({
            workflow: JSON.stringify(newVal.workflow)
          })
        )
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
          console.log("response:", response);
        });
      this.layout = JSON.parse(newVal.workflow.workflowLayout);
      this.data = JSON.parse(newVal.workflow.property.property);
      let name = this.node.nodeName;
      for (let i of this.layout) {
        if (i.nodes.indexOf(name) == -1) i.editable = false;
      }
      if (this.data == null) this.data = {};
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

