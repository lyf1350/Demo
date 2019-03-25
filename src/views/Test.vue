<template>
  <div>
    <button @click="test" class="btn btn-primary">{{data}}</button>
    <button @click="test2" class="btn btn-primary">{{data}}写入</button>
    <br>message:
    <input type="text" v-model="message" >
   
    <br>type:
    <input type="text" v-model="type">

    <div id="editor"></div>
    <br>
    <label v-if="loading">{{$store.state.user}}</label>
    <v-select  :options="options " taggable v-model="to" >
      <span slot="no-options">未找到搜索结果</span>
      <template slot="option" scope="option">
        <span class="fas" :class="option.type=='role'?'fa-user-tag':option.type=='group'?'fa-users':'fa-user'" />         {{option.label}}
    </template>
    </v-select>
    
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import axios from "axios";
import qs from "qs";
import go from "gojs";
import circular from "circular-json";
function load() {}
function init() {
  // if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make; // for conciseness in defining templates

  var myDiagram = $(
    go.Diagram,
    "myDiagramDiv", // must name or refer to the DIV HTML element
    {
      LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
      LinkRelinked: showLinkLabel,
      "undoManager.isEnabled": true // enable undo & redo
    }
  );

  // when the document is modified, add a "*" to the title and enable the "Save" button
  // myDiagram.addDiagramListener("Modified", function(e) {
  //   var button = document.getElementById("SaveButton");
  //   if (button) button.disabled = !myDiagram.isModified;
  //   var idx = document.title.indexOf("*");
  //   if (myDiagram.isModified) {
  //     if (idx < 0) document.title += "*";
  //   } else {
  //     if (idx >= 0) document.title = document.title.substr(0, idx);
  //   }
  // });

  // helper definitions for node templates

  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center
      }
    ];
  }

  function makePort(name, align, spot, output, input) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    return $(go.Shape, {
      fill: "transparent", // changed to a color in the mouseEnter event handler
      strokeWidth: 0, // no stroke
      width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
      alignment: align, // align the port on the main Shape
      stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
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
    "", // the default category
    $(
      go.Node,
      "Table",{
        selectionChanged:node=>{
          var icon=node.findObject('Icon');
          if(node.isSelected){
            console.log("node:"+JSON.stringify(node.data));
            console.log("data:"+myDiagram.model.toJson());

            node.data.test='111';
            icon.fill='#f53463';
          }else{
            icon.fill='#00A9C9';
          }
        }
      },
      nodeStyle(),
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $(
        go.Panel,
        "Auto",
        $(
          go.Shape,
          "Rectangle",
          {
            name:"Icon",
            fill: "#00A9C9",
            strokeWidth: 0
          },
          new go.Binding("figure", "figure")
        ),
        $(
          go.TextBlock,
          textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true
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
  myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
  myDiagram.toolManager.relinkingTool.temporaryLink.routing =
    go.Link.Orthogonal;
    
  myDiagram.model = go.Model.fromJson(
    document.getElementById("mySavedModel").value
  );
  
}
export default {
  data() {
    return {
      data: "测试",
      loading: false,
      message: "aaa",
      to: "",
      type: "default",
      editor: null,
      testData: "",
      options: []
    };
  },
  created() {},
  mounted() {
    var $this = this;
    this.options.push({
      label: "abc",
      value: "ddd",
      icon: "fas fa-user",
      type: "user"
    });
    this.options.push({
      label: "ef",
      value: "f",
      icon: "fas fa-users",
      type: "group"
    });
    this.options.push({
      label: "dd",
      value: "b",
      icon: "fas fa-user-tag",
      type: "role"
    });
    CKEditor.create(document.querySelector("#editor"), {
      language: "zh-cn"
    })
      .then(function(editor) {
        $this.editor = editor;
        console.log("created");
      })
      .catch(function(error) {
        console.log("error:" + error);
      });
    console.log("mounted");
    // init();
  },
  methods: {
    test() {
      console.log("to:"+JSON.stringify(this.to));
    },
    test2() {
      console.log("dest:" + JSON.stringify(this.to));
      axios
        .post(
          "/api/test/1",
          qs.stringify({
            dest: JSON.stringify(this.to)
          })
        )
        .then(response => console.log(JSON.stringify(response)))
        .catch(error => console.log(JSON.stringify(error)));
      // console.log("$store:" + this.$store.state.ws);
      // var temp = {
      //   from: "test",
      //   to: this.to,
      //   message: this.message,
      //   type: this.type
      // };
      // this.$store.state.ws.send(JSON.stringify(temp));
    }
  }
};
</script>

<style>
</style>
