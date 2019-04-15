<template>
  <div>
    <div class="d-flex">
      <button class="btn btn-primary" @click="initCreateTemplate">新建流程模版</button>
      <button class="btn btn-primary" @click="type='modifyTemplate'">修改流程模版</button>
      <!-- <button class="btn btn-primary" @click="type='createAction'">新建Action模版</button> -->
      <!-- <button class="btn btn-primary" @click="type='modifyAction'">修改Action模版</button> -->
      <b-btn class=" ml-auto" v-if="type.length>0" @click="showInfo=!showInfo">{{showInfo?'显示流程页面':'显示信息页面'}}</b-btn>

      <button
        class="btn btn-success  "
        @click="createWorkflowTemplate"
        v-if="type=='createTemplate'"
      >新建</button>
      <button
        class="btn btn-success p-2"
        @click="saveWorkflowTemplate"
        v-show="workflowTemplate&&type=='modifyTemplate'"
      >保存</button>
    </div>

    <div v-show="!showInfo&&type=='createTemplate'">
      <div id="myCreateDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    </div>
    <div v-show="!showInfo&&type=='modifyTemplate'">
      流程模版
      <v-select
        :options="workflowOptions "
        v-model="workflowTemplate"
        id="workflowTemplate"
        placeholder="请选择"
        @change="initModifyTemplate"
      ></v-select>
      <div
        id="myModifyDiv"
        style="flex-grow: 1; height: 750px; border: solid 1px black"
        v-show="workflowTemplate"
      ></div>
    </div>
    <div class="modal" id="prop">
      <div class="modal-dialog">
        <div class="modal-content" v-if="selectedNode">
          <div class="modal-header">{{selectedNode?selectedNode.data.text:''}} 属性</div>
          <div class="modal-content">
            名称：
            <input type="text" v-model="selectedNode.data.text"  @change="updateModel">
            位置：
            <input type="text" v-model="selectedNode.data.loc"  @change="updateModel">
            审核人:{{selectedNode.data.prop.reviewers|reviewerFilter}}
            <button
              class="btn btn-primary"
              data-toggle="modal"
              data-target="#personModal"
              @click="clear"
            >编辑</button>
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
                    <span v-if="reviewer.type=='group'">组:{{reviewer.label}}</span>
                    <span v-if="reviewer.type=='role'">角色:{{reviewer.label}}</span>
                    <span v-if="reviewer.type=='member'">{{reviewer.label}}</span>
                    <button class="btn btn-primary" @click="removeReviewer(reviewer)">移除</button>
                  </div>
                </div>
              </div>
            </div>Action：
            <input type="text" v-model="data">
          </div>
        </div>
      </div>
    </div>
    <div v-if="type=='createAction'">33</div>
    <div v-if="type=='modifyAction'">44</div>
  </div>
</template>

<script>
import axios from "axios";
import go from "gojs";
import qs from "qs";
import service from "@/assets/js/service";
export default {
  data() {
    return {
      type: "",
      showInfo:false,
      data: "",
      userOptions: [],
      groupOptions: [],
      roleOptions: [],
      workflowOptions: [],
      user: null,
      group: null,
      role: null,
      myDiagram: null,
      workflowTemplate: null,
      workflowTemplates: [],
      template: {
        class: "GraphLinksModel",
        copiesKey: false,
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [
          {
            category: "Comment",
            loc: "360 -5",
            text: "流程名称",
            key: -13
          },
          { key: -1, category: "Start", loc: "175 0", text: "开始" },
          {
            key: 8,
            category: "common",
            loc: "175 297",
            text: "节点名称"
          },
          {
            key: -2,
            category: "End",
            loc: "175 577",
            text: "结束"
          }
        ],
        linkDataArray: [
          {
            from: 8,
            to: -2,
            fromPort: "B",
            toPort: "T",
            points: [175, 313, 175, 323, 175, 434, 175, 434, 175, 546, 175, 556]
          },
          {
            from: -1,
            to: 8,
            fromPort: "B",
            toPort: "T",
            points: [175, 21, 175, 31, 175, 151, 175, 151, 175, 271, 175, 281]
          }
        ]
      },
      selectedNode: null
    };
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
      for (let i of response.data.data) {
        _this.workflowOptions.push({
          label: i.templateName,
          value: i
        });
      }
    });
  },
  methods: {
    saveWorkflowTemplate() {
      let nodeData = this.myDiagram.model.nodeDataArray;
      let linkData = this.myDiagram.model.linkDataArray;
      let nodeMap = {};
      let nodeArray = [];

      var workflowTemplate = {
        id: this.workflowTemplate.value.id,
        templateModel: this.myDiagram.model.toJson()
      };
      var toMap = {};
      var fromMap = {};
      for (let i of nodeData) {
        switch (i.category) {
          case "common":
            nodeArray.push({
              nodeKey: i.key,
              templatename: i.text,
              reviewers: i.prop.reviewers
            });
            break;
          case "Comment":
            workflowTemplate.templateName = i.text;
            break;
        }
      }
      for (let i of linkData) {
        if (i.from == -1 || i.to == -2) continue;
        if (toMap[i.from.toString()] == null) toMap[i.from.toString()] = [];
        if (fromMap[i.to.toString()] == null) fromMap[i.to.toString()] = [];
        toMap[i.from.toString()].push(i.to.toString());
        fromMap[i.to.toString()].push(i.from.toString());
      }

      axios
        .post(
          "/api/workflowTemplate/createOrUpdate",
          qs.stringify({
            nodeArray: JSON.stringify(nodeArray),
            fromMap: JSON.stringify(fromMap),
            toMap: JSON.stringify(toMap),
            workflowTemplate: JSON.stringify(workflowTemplate)
          })
        )
        .then(response => console.log(JSON.stringify(response)));
    },
    createWorkflowTemplate() {
      let nodeData = this.myDiagram.model.nodeDataArray;
      let linkData = this.myDiagram.model.linkDataArray;
      let nodeMap = {};
      let nodeArray = [];
      var workflowTemplate = { templateModel: this.myDiagram.model.toJson() };
      var toMap = {};
      var fromMap = {};
      for (let i of nodeData) {
        switch (i.category) {
          case "common":
            nodeArray.push({
              nodeKey: i.key,
              templatename: i.text,
              reviewers: i.prop.reviewers
            });
            break;
          case "Comment":
            workflowTemplate.templateName = i.text;
            break;
        }
      }
      for (let i of linkData) {
        if (i.from == -1 || i.to == -2) continue;
        if (toMap[i.from.toString()] == null) toMap[i.from.toString()] = [];
        if (fromMap[i.to.toString()] == null) fromMap[i.to.toString()] = [];
        toMap[i.from.toString()].push(i.to.toString());
        fromMap[i.to.toString()].push(i.from.toString());
      }
      axios
        .post(
          "/api/workflowTemplate/createOrUpdate",
          qs.stringify({
            nodeArray: JSON.stringify(nodeArray),
            fromMap: JSON.stringify(fromMap),
            toMap: JSON.stringify(toMap),
            workflowTemplate: JSON.stringify(workflowTemplate)
          })
        )
        .then(response => console.log(JSON.stringify(response)));
    },
    clear() {
      this.user = null;
      this.group = null;
      this.role = null;
    },
    addReviewer() {
      console.log("this.user:" + JSON.stringify(this.user));
      if (this.user != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "user",
          label: this.user.label,
          reviewerId: this.user.value.id
        });
      } else if (this.role != null && this.group != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "member",
          label: "组:" + this.group.label + " 角色:" + this.role.label,
          reviewerId: this.group.value.id
        });
      } else if (this.role != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "role",
          label: this.role.label,
          reviewerId: this.role.value.id
        });
      } else if (this.group != null) {
        this.selectedNode.data.prop.reviewers.push({
          type: "group",
          label: this.group.label,
          reviewerId: this.group.value.id
        });
      }
    },
    removeReviewer(reviewer) {
      this.selectedNode.data.prop.reviewers.splice(
        this.selectedNode.data.prop.reviewers.indexOf(reviewer),
        1
      );
    },
    updateModel() {
      console.log("myDiagram:" + this.myDiagram.model.toJson());
      this.myDiagram.startTransaction();
      this.myDiagram.updateAllTargetBindings();
      this.myDiagram.commitTransaction("updated");
    },
    initModifyTemplate() {
      console.log("value:" + JSON.stringify(this.workflowTemplate));
      if (this.workflowTemplate)
        service.initTemplate(
          this,
          "myModifyDiv",
          this.workflowTemplate.value.templateModel
        );

    },
    initCreateTemplate() {
      this.type = "createTemplate";
      service.initTemplate(this, "myCreateDiv", JSON.stringify(this.template));


    }
  }
};
</script>
