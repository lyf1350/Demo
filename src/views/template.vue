<template>
  <div>
    <button class="btn btn-primary" @click="initCreateTemplate">新建流程模版</button>
    <button class="btn btn-primary" @click="type='modifyTemplate'">修改流程模版</button>
    <button class="btn btn-primary" @click="type='createAction'">新建Action模版</button>
    <button class="btn btn-primary" @click="type='modifyAction'">修改Action模版</button>
    <div v-show="type=='createTemplate'">
      <button class="btn btn-success" @click="createWorkflowTemplate">新建</button>
      <button class="btn btn-success" data-toggle="modal" data-target="#modal">节点属性</button>
      <div id="myCreateDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    </div>
    <div v-show="type=='modifyTemplate'">
      流程模版<v-select :options="workflowOptions " v-model="workflowTemplate" id="workflowTemplate" placeholder="请选择" @change="initModifyTemplate"></v-select>
      <button class="btn btn-success" @click="saveWorkflowTemplate">保存</button>
      <button class="btn btn-success" data-toggle="modal" data-target="#modal">节点属性</button>
      <div id="myModifyDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    </div>
    <div class="modal" id="modal">
      <div class="modal-dialog">
        <div class="modal-content" v-if="selectedNode">
          <div class="modal-header">{{selectedNode?selectedNode.data.text:''}} 属性</div>
          <div class="modal-content">
            名称：
            <input type="text" v-model="selectedNode.data.text">
            位置：
            <input type="text" v-model="selectedNode.data.loc">
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
                    <span v-if="reviewer.type=='member'">{{reviewer.label}} </span>
                    <button class="btn btn-primary" @click="removeReviewer(reviewer)">移除</button>
                  </div>
                </div>
              </div>
            </div>Action：
            <input type="text" v-model="data">
            <button class="btn btn-primary" @click="updateModel">更改</button>
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
import _ from "lodash";
import qs from "qs";
export default {
  data() {
    return {
      type: "template",
      data: "",
      userOptions: [],
      groupOptions: [],
      roleOptions: [],
      workflowOptions:[],
      user: null,
      group: null,
      role: null,
      myDiagram: null,
      workflowTemplate:null,
      workflowTemplates:[],
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
        str+=i.label;
      }
      return str;
    }
  },
  mounted() {
    var $this=this;
    axios.get("/api/user/list").then(response => {
      for (let i of response.data.data) {
        $this.userOptions.push({
          type: "user",
          label: i.username,
          value: i
        });
      }
    });
    axios.get("/api/group/list").then(response => {
      for (let i of response.data.data) {
        $this.groupOptions.push({
          type: "group",
          label: i.groupName,
          value: i
        });
      }
    });
    axios.get("/api/role/list").then(response => {
      for (let i of response.data.data) {
        $this.roleOptions.push({
          type: "role",
          label: i.roleName,
          value: i
        });
      }
    });
   
    axios.get("/api/workflowTemplate/list").then(response => {
      for (let i of response.data.data) {
        $this.workflowOptions.push({
          label: i.templateName,
          value: i
        });
      }
    });
  },
  methods: {
    saveWorkflowTemplate(){
      let nodeData = this.myDiagram.model.nodeDataArray;
      let linkData = this.myDiagram.model.linkDataArray;
      let nodeMap = {};
      let nodeArray = [];

      var workflowTemplate = {id:this.workflowTemplate.value.id,templateModel:this.myDiagram.model.toJson()};
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

      axios.post('/api/workflowTemplate/createOrUpdate',qs.stringify({
        nodeArray:JSON.stringify(nodeArray),
        fromMap:JSON.stringify(fromMap),
        toMap:JSON.stringify(toMap),
        workflowTemplate:JSON.stringify(workflowTemplate)
      })).then(response=>console.log(JSON.stringify(response)));
    },
    createWorkflowTemplate() {
      let nodeData = this.myDiagram.model.nodeDataArray;
      let linkData = this.myDiagram.model.linkDataArray;
      let nodeMap = {};
      let nodeArray = [];
      var workflowTemplate = {templateModel:this.myDiagram.model.toJson()};
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

      axios.post('/api/workflowTemplate/createOrUpdate',qs.stringify({
        nodeArray:JSON.stringify(nodeArray),
        fromMap:JSON.stringify(fromMap),
        toMap:JSON.stringify(toMap),
        workflowTemplate:JSON.stringify(workflowTemplate)
      })).then(response=>console.log(JSON.stringify(response)));

    },
    clear() {
      this.user = null;
      this.group = null;
      this.role = null;
    },
    addReviewer() {
      console.log("this.user:"+JSON.stringify(this.user));
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
      console.log("value:"+JSON.stringify(this.workflowTemplate));
      this.init('myModifyDiv',this.workflowTemplate.value.templateModel);
    },
    initCreateTemplate() {
      this.type = "createTemplate";
      this.init("myCreateDiv", JSON.stringify(this.template));
    },
    init(id, model) {
      var $this = this;
      // if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
      if (this.myDiagram) this.myDiagram.div = null;
      var $ = go.GraphObject.make; // for conciseness in defining templates
      var myDiagram = $(
        go.Diagram,
        id, // must name or refer to the DIV HTML element
        {
          LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
          LinkRelinked: showLinkLabel,
          "undoManager.isEnabled": true // enable undo & redo
        }
      );
      this.myDiagram = myDiagram;

      function nodeStyle() {
        return [
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            locationSpot: go.Spot.Center
          }
        ];
      }

      function makePort(name, align, spot, output, input) {
        var horizontal =
          align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        return $(go.Shape, {
          fill: "transparent", // changed to a color in the mouseEnter event handler
          strokeWidth: 0, // no stroke
          width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
          alignment: align, // align the port on the main Shape
          stretch: horizontal
            ? go.GraphObject.Horizontal
            : go.GraphObject.Vertical,
          portId: name, // declare this object to be a "port"
          fromSpot: spot, // declare where links may connect at this port
          fromLinkable: output, // declare whether the user may draw links from here
          toSpot: spot, // declare where links may connect at this port
          toLinkable: input, // declare whether the user may draw links to here
          cursor: "pointer", // show a different cursor to indicate potential link point
          mouseEnter: function(e, port) {
            // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function(e, port) {
            port.fill = "transparent";
          }
        });
      }

      function textStyle() {
        return {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: "whitesmoke"
        };
      }

      // define the Node templates for regular nodes

      myDiagram.nodeTemplateMap.add(
        "common", // the default category
        $(
          go.Node,
          "Table",
          {
            selectionChanged: node => {
              var icon = node.findObject("Icon");
              if (node.isSelected) {
                console.log("node:" + JSON.stringify(node.data));
                // console.log("data:" + myDiagram.model.toJson());
                $this.selectedNode = node;
                if (node.data.id != node.key) {
                  console.log("1111");
                  node.data.id = node.key;
                  node.data.prop = {
                    reviewers: []
                  };
                }

                icon.fill = "#f53463";
              } else {
                icon.fill = "#00A9C9";
              }
            }
          },
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Rectangle", {
              name: "Icon",
              fill: "#00A9C9",
              strokeWidth: 0
            }),
            $(
              go.TextBlock,
              "common",
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Start",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#79C900",
              strokeWidth: 0
            }),
            $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "End",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#DC3C00",
              strokeWidth: 0
            }),
            $(go.TextBlock, "End", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the bottom, all input only:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        )
      );

      // taken from ../extensions/Figures.js:
      go.Shape.defineFigureGenerator("File", function(shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(0.75 * w, 0, false);
        geo.add(fig2);
        // The Fold
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        geo.spot1 = new go.Spot(0, 0.25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
      });

      myDiagram.nodeTemplateMap.add(
        "Comment",
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          $(go.Shape, "File", {
            fill: "#DEE0A3",
            strokeWidth: 0
          }),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: "#454545"
            },
            new go.Binding("text").makeTwoWay()
          )
          // no ports, because no links are allowed to connect with a comment
        )
      );

      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate = $(
        go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          },
          selectionAdorned: false
        },
        new go.Binding("points").makeTwoWay(),
        $(
          go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT"
          }
        ),
        $(
          go.Shape, // the link path shape
          {
            isPanelMain: true,
            stroke: "gray",
            strokeWidth: 2
          },
          new go.Binding("stroke", "isSelected", function(sel) {
            return sel ? "dodgerblue" : "gray";
          }).ofObject()
        ),
        $(
          go.Shape, // the arrowhead
          {
            toArrow: "standard",
            strokeWidth: 0,
            fill: "gray"
          }
        ),
        $(
          go.Panel,
          "Auto", // the link label, normally not visible
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(
            go.Shape,
            "RoundedRectangle", // the label shape
            {
              fill: "#F8F8F8",
              strokeWidth: 0
            }
          ),
          $(
            go.TextBlock,
            "Yes", // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      // Make link labels visible if coming out of a "conditional" node.
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.category === "Conditional";
      }

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      myDiagram.model = go.Model.fromJson(model);
    }
  }
};
</script>
