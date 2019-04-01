<template>
  <div style="height:90%">
    <div class="modal" id="modal" style="overflow:scroll">
      <div class="modal-dialog">
        <div class="modal-content">
          流程模版
          <v-select
            :options="workflowOptions "
            v-model="workflowTemplate"
            id="workflowTemplate"
            placeholder="请选择"
            @change="initTemplate"
          ></v-select>
          <button class="btn btn-success" v-if="workflowTemplate" @click="createWorkflow">发起流程</button>
          <div
            id="myDiv"
            style="flex-grow: 1; height: 750px; border: solid 1px black"
            v-show="workflowTemplate"
          ></div>
        </div>
      </div>
    </div>
    <div class="modal" id="prop">
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
    <div class="container" style="height:90%">
      <button class="btn btn-primary" data-toggle="modal" data-target="#modal">新建流程</button>
      <div class="row" style="height:100%">
        <div class="col-4 card">
          <div class="card-body">
            <div class="card-title">
              <ul class="nav nav-pills">
                <li class="nav-item">
                  <a class="nav-link active" href="#pending" data-toggle="tab">要处理</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#executed" data-toggle="tab">已处理</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#finished" data-toggle="tab">已完成</a>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div class="tab-pane show active" id="pending">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="(node,index) in $store.state.pending" :key="'node'+index">
                    <a @click="currentNode=node;currentWorkflow=null">{{node.nodeTemplate.templateName}}   发起人:{{node.workflow.workflowUser.username}} 开始时间:{{node.startTime}}</a>
                  </li>
                </ul>
              </div>
              <div class="tab-pane" id="executed">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="(node,index) in $store.state.executed" :key="'node'+index">
                    <a href="#">{{node.nodeTemplate.templateName}}</a>
                  </li>
                </ul>
              </div>
              <div class="tab-pane" id="finished">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="(node,index) in $store.state.finished" :key="'node'+index">
                    <a href="#" @click="currentNode=null;currentWorkflow=node">{{node.workflowTemplate.templateName}} 发起人:{{node.workflowUser.username}} 发起时间:{{node.createTime|dateFormatter}}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <ul class="pagination">
                <li class="page-item">
                  <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                  </a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">3</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-8">
          <node :node="currentNode"/>
          <workflow :workflow="currentWorkflow"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import service from "../assets/js/service";
import node from "@/components/Node.vue";
import workflow from "@/components/Workflow.vue";

export default {
  data() {
    return {
      workflowTemplate: null,
      workflowOptions: [],
      selectedNode: null,
      nodes: ["test1", "test2", "test3"],
      currentNode:null,
      currentWorkflow:null
    };
  },
  methods: {
    createWorkflow() {
      axios
        .post(
          "/api/workflow/create",
          qs.stringify({
            workflowTemplate: JSON.stringify(this.workflowTemplate.value)
          })
        )
        .then(response => console.log(JSON.stringify(response.data)));
    },
    initTemplate() {
      console.log("value:" + JSON.stringify(this.workflowTemplate));
      if (this.workflowTemplate)
        service.initTemplate(
          this,
          "myDiv",
          this.workflowTemplate.value.templateModel
        );
    }
  },
  mounted() {
    var _this = this;
    axios.get("/api/workflowTemplate/list").then(response => {
      for (let i of response.data.data) {
        _this.workflowOptions.push({
          label: i.templateName,
          value: i
        });
      }
    });
  },
  components:{
    node:node,
    workflow:workflow
  },
  filters: {
    reviewerFilter(reviewers) {
      let str = "";
      for (let i of reviewers) {
        if (str.length > 0) str += "\n";
        str += i.label;
      }
      return str;
    },dateFormatter(val) {
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
    }
  }
};
</script>

