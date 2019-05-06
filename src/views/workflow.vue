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
            <button
              class="btn btn-primary"
              data-toggle="modal"
              data-target="#personModal"
              @click="clear"
            >编辑审核人</button>
            <div class="modal" id="personModal">
              <div class="modal-dialog">
                <div class="modal-content">
                  用户:
                  <v-select :options="userOptions " v-model="user" id="user" placeholder="请选择"></v-select>组:
                  <v-select :options="groupOptions " v-model="group" id="group" placeholder="请选择"></v-select>角色:
                  <v-select :options="roleOptions " v-model="role" id="role" placeholder="请选择"></v-select>
                  <button class="btn btn-primary" @click="addReviewer">添加</button>
                  <div
                    v-for="(reviewer,index) in selectedNode.data.prop.reviewers"
                    :key="'reviewer'+index"
                  >
                    <span v-if="reviewer.type=='user'">用户:{{reviewer.label}}</span>
                    <span v-else-if="reviewer.type=='group'">组:{{reviewer.label}}</span>
                    <span v-else-if="reviewer.type=='role'">角色:{{reviewer.label}}</span>
                    <span v-else-if="reviewer.type=='member'">{{reviewer.label}}</span>
                    <button class="btn btn-primary" @click="removeReviewer(reviewer)">移除</button>
                  </div>
                </div>
              </div>
            </div>
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
                  <li
                    class="list-group-item"
                    v-for="(node,index) in $store.state.pending"
                    :key="'node'+index"
                  >
                    <a
                      @click="currentNode=node;currentWorkflow=null"
                    >{{node.nodeName}} 发起人:{{node.workflow.workflowUser.username}} 开始时间:{{node.startTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow">delete</b-btn>
                  </li>
                </ul>
              </div>
              <div class="tab-pane" id="executed">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(node,index) in $store.state.executed"
                    :key="'node'+index"
                  >
                    <a
                      href="#"
                      @click="currentNode=null;currentWorkflow=node"
                    >{{node.workflowName}} 发起人:{{node.workflowUser.username}} 发起时间:{{node.createTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow">delete</b-btn>

                  </li>
                </ul>
              </div>
              <div class="tab-pane" id="finished">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(node,index) in $store.state.finished"
                    :key="'node'+index"
                  >
                    <a
                      href="#"
                      @click="currentNode=null;currentWorkflow=node"
                    >{{node.workflowName}} 发起人:{{node.workflowUser.username}} 发起时间:{{node.createTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow">delete</b-btn>

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
import moment from "moment";
export default {
  data() {
    return {
      workflowTemplate: null,
      workflowOptions: [],
      selectedNode: null,
      currentNode: null,
      currentWorkflow: null,
      userOptions: [],
      groupOptions: [],
      roleOptions: [],
      user: null,
      group: null,
      role: null
    };
  },
  methods: {
    createWorkflow() {
      let nodeData = this.myDiagram.model.nodeDataArray;
      let nodeArray = [];
      console.log("nodeData:", nodeData);
      for (let i of nodeData) {
        if (i.category == "common") {
          nodeArray.push({
            nodeKey: i.key,
            reviewers: i.prop.reviewers
          });
        }
      }
      axios
        .post(
          "/api/workflow/create",
          qs.stringify({
            workflowTemplate: JSON.stringify(this.workflowTemplate.value),
            nodeArray: JSON.stringify(nodeArray)
          })
        )
        .then(response => console.log(response.data));
    },
    initTemplate() {
      console.log("value:" + JSON.stringify(this.workflowTemplate));
      if (this.workflowTemplate)
        service.initTemplate(
          this,
          "myDiv",
          this.workflowTemplate.value.templateModel
        );
    },
    clear() {
      this.user = null;
      this.group = null;
      this.role = null;
    },
    addReviewer() {
      if (this.user != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "user",
          label: this.user.label,
          user: this.user
        });
      } else if (this.role != null && this.group != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "member",
          label: "组:" + this.group.label + " 角色:" + this.role.label,
          group: this.group.value
        });
      } else if (this.role != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "role",
          label: this.role.label,
          role: this.role.value
        });
      } else if (this.group != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "group",
          label: this.group.label,
          group: this.group.value
        });
      }
    },
    removeReviewer(reviewer) {
      this.selectedNode.data.prop.reviewers.splice(
        this.selectedNode.data.prop.reviewers.indexOf(reviewer),
        1
      );
    },
    deleteWorkflow() {
      axios
        .post(
          "/api/workflow/delete",
          qs.stringify({
            workflow: JSON.stringify(this.currentWorkflow!=null?this.currentWorkflow:this.currentNode)
          })
        )
        .then(response => console.log(response.data));
    }
  },
  mounted() {
    var _this = this;
    axios.get("/api/user/list").then(response => {
      for (let i of response.data.data) {
        _this.userOptions.push({
          type: "user",
          label: i.username,
          value: i
        });
      }
    });
    axios.get("/api/group/list").then(response => {
      for (let i of response.data.data) {
        _this.groupOptions.push({
          type: "group",
          label: i.groupName,
          value: i
        });
      }
    });
    axios.get("/api/role/list").then(response => {
      for (let i of response.data.data) {
        _this.roleOptions.push({
          type: "role",
          label: i.roleName,
          value: i
        });
      }
    });
    axios.get("/api/workflowTemplate/list").then(response => {
      console.log("response", response);
      for (let i of response.data.data) {
        _this.workflowOptions.push({
          label: i.templateName,
          value: i
        });
      }
    });
  },
  components: {
    node: node,
    workflow: workflow
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

