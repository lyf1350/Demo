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
    <b-container style="height:90%">
      <button class="btn btn-primary" data-toggle="modal" data-target="#modal">新建流程</button>
      <b-row style="height:100%">
        <b-col cols="4">
          <b-card>
            <b-tabs>
              <b-tab active title="要处理" @click="currentPage=1">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(node,index) in visibleNodes($store.state.pending)"
                    :key="'node1'+index"
                  >
                    <a
                      @click="currentNode=node;currentWorkflow=null"
                    >{{node.nodeName}} 发起人:{{node.workflow.workflowUser.username}} 开始时间:{{node.startTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow(node.workflow.id)">delete</b-btn>
                  </li>
                </ul>
              </b-tab>
              <b-tab class="tab-pane" title="已处理" @click="currentPage=1">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(node,index) in visibleNodes($store.state.executed)"
                    :key="'node2'+index"
                  >
                    <a
                      @click="currentNode=null;currentWorkflow=node"
                    >{{node.workflowName}} 发起人:{{node.workflowUser.username}} 发起时间:{{node.createTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow(node.id)">delete</b-btn>
                  </li>
                </ul>
              </b-tab>
              <b-tab class="tab-pane" title="已完成" @click="currentPage=1">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(node,index) in visibleNodes($store.state.finished)"
                    :key="'node3'+index"
                  >
                    <a
                      @click="currentNode=null;currentWorkflow=node"
                    >{{node.workflowName}} 发起人:{{node.workflowUser.username}} 发起时间:{{node.createTime|dateFormatter}}</a>
                    <b-btn @click="deleteWorkflow(node.id)">delete</b-btn>
                  </li>
                </ul>
              </b-tab>
            </b-tabs>
            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                v-if="rows>10"
              ></b-pagination>
            </div>
          </b-card>
        </b-col>
        <b-col class="col-8">
          <node :node="currentNode"/>
          <workflow :workflow="currentWorkflow"/>
        </b-col>
      </b-row>
    </b-container>
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
      role: null,
      perPage: 10,
      currentPage: 1,
      rows: 1
    };
  },
  computed: {},
  methods: {
    test() {
      console.log("test");
    },
    visibleNodes(nodes) {
      var _this = this;
      console.log("nodes:", nodes);
      return nodes.filter(
        (e, index) =>
          index >= (_this.currentPage - 1) * _this.perPage &&
          index < _this.currentPage * _this.perPage
      );
    },
    createWorkflow() {
      let nodeData = this.myDiagram.model.nodeDataArray;
      let nodeArray = [];
      console.log("nodeData:", nodeData);
      var reviewer = [
        {
          type: "user",
          user: this.$store.state.user,
          label: this.$store.state.user.username
        }
      ];
      for (let i of nodeData) {
        if (i.category == "common") {
          i.prop.reviewers =
            i.prop.reviewers.length > 0 ? i.prop.reviewers : reviewer;
          for (let j of i.prop.actions) j.id = null;
          nodeArray.push({
            nodeKey: i.key,
            reviewers: i.prop.reviewers
          });
        }
      }
      console.log("val:" + JSON.stringify(this.workflowTemplate.value));
      var workflowTemplate = {
        id: this.workflowTemplate.value.id,
        templateModel: this.myDiagram.model.toJson(),
        templateLayout: this.workflowTemplate.value.templateLayout,
        templateName: this.workflowTemplate.value.templateName
      };
      console.log("template:" + JSON.stringify(workflowTemplate));
      axios
        .post(
          "/api/workflow/create",
          qs.stringify({
            workflowTemplate: JSON.stringify(workflowTemplate),
            nodeArray: JSON.stringify(nodeArray)
          })
        )
        .then(response => {
          if (!response.data.success)
            $.alert(response.data.msg, "流程创建出错");
        });
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
          user: this.user.value
        });
      } else if (this.role != null && this.group != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "member",
          label: "组:" + this.group.label + " 角色:" + this.role.label,
          group: this.group.value,
          role: this.role.value
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
    deleteWorkflow(id) {
      axios
        .post(
          "/api/workflow/delete",
          qs.stringify({
            id: id
          })
        )
        .then(response => console.log(response.data));
    }
  },
  mounted() {
    var _this = this;
    axios.get("/api/user/list/valid").then(response => {
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

