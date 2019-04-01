<template>
  <div v-if="node!=null">
    <b-tabs card>
      <b-tab title="流程信息">
        流程名称:{{node.workflow.workflowTemplate.templateName}}
        <br>
        节点名称:{{node.nodeTemplate.templateName}}
        <br>
        <label>意见:</label>
        <b-form-input type="text" v-model="remark"/>
        <br>
        <b-button variant="success" @click="execute('approve')">同意</b-button>
        <b-button variant="danger" @click="execute('refuse')">拒绝</b-button>
      </b-tab>
      <b-tab @click="show" title="流程图">
        <div id="nodeDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
      </b-tab>
      <b-tab title="流程日志">
        <div>
          <b-table :items="logs" responsive></b-table>
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
export default {
  data() {
    return {
      myDiagram: null,
      test: "123",
      selectedNode: null,
      logs: [],
      remark: ""
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
      service.initTemplate(
        this,
        "nodeDiv",
        this.node.workflow.workflowTemplate.templateModel,"#nodeProp"
      );
    },
    dateFormatter(val) {
      if(val==null)
        return "";
      let date = new Date(val);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
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
    }
  },
  watch: {
    node: function(newVal) {
      if (newVal) {
        console.log("template:" + JSON.stringify(newVal.workflow));
      }
      console.log("logs:" + this.logs);
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
                node: i.node == null ? "" : i.node.nodeTemplate.templateName,
                decision: i.decision,
                startTime: _this.dateFormatter(i.startTime),
                endTime: _this.dateFormatter(i.endTime),
                remark: i.remark,
                person: i.person.username
              });
            }
            console.log("111");
            _this.logs = logs;
          }
          console.log("response:" + JSON.stringify(response));
        });
      console.log("newVal");
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
  }
};
</script>

