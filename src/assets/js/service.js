var ws;
import store from "../../store";
import axios from "axios";
import go from "gojs";

export default {
  createWebSocket() {
    ws = new WebSocket("ws://localhost:8080/");
    ws.onopen = function() {
      console.log("建立连接成功");
    };
    ws.onmessage = function(event) {
      let tempMsg = JSON.parse(event.data);
      console.log("websocket msg:", tempMsg);
      var data = JSON.parse(tempMsg.msg);
      console.log("data:", data);
      if (tempMsg.type == "message") {
        store.state.msg.unshift(data);
        store.commit("setUnreadMessage", 1);
        store.commit("setValue", {
          name: "msg",
          value: store.state.msg
        });
      } else if (tempMsg.type == "node") {
        console.log("node");
        if (data.nodeStatus == "未开始") {
          var nodes = store.state.pending.filter(node => node.id != data.id);
          if (nodes.length != store.state.pending.length)
            store.commit("setValue", {
              name: "pending",
              value: nodes
            });
          var workflows = store.state.executed.filter(
            workflow => workflow.id != data.workflow.id
          );
          if (workflows.length != store.state.executed.length)
            store.commit("setValue", {
              name: "executed",
              value: workflows
            });
        } else if (data.nodeStatus == "已开始") {
          console.log("2");

          var workflows = store.state.executed.filter(
            workflow => workflow.id != data.workflow.id
          );
          if (workflows.length != store.state.executed.length)
            store.commit("setValue", {
              name: "executed",
              value: workflows
            });
          store.state.pending.unshift(data);
          store.commit("setValue", {
            name: "pending",
            value: store.state.pending
          });
        } else if (data.nodeStatus == "已完成") {
          var nodes = store.state.pending.filter(node => node.id != data.id);
          var hasWorkflow = false;
          for (let i of store.state.pending) {
            if (i.id != data.id && i.workflow.id == data.workflow.id) {
              hasWorkflow = true;
              break;
            }
          }
          store.commit("setValue", {
            name: "pending",
            value: nodes
          });
          if (!hasWorkflow) {
            store.state.executed.unshift(data.workflow);
            store.commit("setValue", {
              name: "executed",
              value: store.state.executed
            });
          }
        }
      } else if (tempMsg.type == "workflow") {
        console.log("workflow");
        var nodes = store.state.pending.filter(
          node => node.workflow.id != data.id
        );
        var workflows = store.state.executed.filter(
          workflow => workflow.id != data.id
        );
        if (nodes.length != store.state.pending.length) {
          store.commit("setValue", {
            name: "pending",
            value: nodes
          });
        }
        if (workflows.length != store.state.executed.length) {
          store.commit("setValue", {
            name: "executed",
            value: workflows
          });
        }
        store.state.finished.push(data);
        store.commit("setValue", {
          name: "finished",
          value: store.state.finished
        });
      }
    };
    ws.onclose = function(event) {
      store.commit("setValue", { name: "user", value: null });
      sessionStorage.clear();
      console.log("close websocket");
    };
    ws.onerror = function(error) {
      console.log("error:", error);
    };
    store.commit("setValue", { name: "ws", value: ws });
  },
  send(msg) {
    ws.send(JSON.stringify(msg));
  },
  init() {
    axios
      .get("/api/message/list", {
        params: {
          id: store.state.user.id
        }
      })
      .then(function(response) {
        let data = response.data.data;
        let count = 0;
        for (let i of data) {
          count += i.state == 0 ? 1 : 0;
        }
        console.log("data:" + JSON.stringify(data));
        console.log("count:" + count);
        store.commit("setValue", { name: "msg", value: data });
        store.commit("setUnreadMessage", count);
      });
    axios.get("/api/node/list").then(function(response) {
      let data = response.data.data;
      let count = 0;
      if (response.data.success) {
        store.commit("setValue", { name: "pending", value: data.pending });
        store.commit("setValue", { name: "finished", value: data.finished });
        store.commit("setValue", { name: "executed", value: data.executed });
      }
    });
  },
  initTemplate(_this, id, model, propId = "#prop") {
    console.log("initTemplate:" + _this.myDiagram);
    if (_this.myDiagram) _this.myDiagram.div = null;
    var _ = go.GraphObject.make; // for conciseness in defining templates
    var myDiagram = _(
      go.Diagram,
      id, // must name or refer to the DIV HTML element
      {
        LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
        LinkRelinked: showLinkLabel,
        "undoManager.isEnabled": true // enable undo & redo
      }
    );
    _this.myDiagram = myDiagram;

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
      return _(go.Shape, {
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
      _(
        go.Node,
        "Table",
        {
          selectionChanged: node => {
            var icon = node.findObject("Icon");
            console.log();
            if (node.isSelected) {
              icon.fill = "#f53463";
            } else {
              icon.fill = node.data.color ? node.data.color : "#00A9C9";
            }
          },
          doubleClick: (e, node) => {
            _this.selectedNode = node;
            if (node.data.id != node.key) {
              node.data.id = node.key;
              _this.$set(node.data, "prop", { reviewers: [], actions: [] });
            }
            $(propId).modal("show");
          }
        },
        nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        _(
          go.Panel,
          "Auto",
          _(
            go.Shape,
            "Rectangle",
            {
              name: "Icon",
              fill: "#00A9C9",
              strokeWidth: 0
            },
            new go.Binding("fill", "color")
          ),
          _(
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
      _(
        go.Node,
        "Table",
        nodeStyle(),
        _(
          go.Panel,
          "Auto",
          _(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            strokeWidth: 0
          }),
          _(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    myDiagram.nodeTemplateMap.add(
      "End",
      _(
        go.Node,
        "Table",
        nodeStyle(),
        _(
          go.Panel,
          "Auto",
          _(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#DC3C00",
            strokeWidth: 0
          }),
          _(go.TextBlock, "End", textStyle(), new go.Binding("text"))
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
      _(
        go.Node,
        "Auto",
        nodeStyle(),
        _(go.Shape, "File", {
          fill: "#DEE0A3",
          strokeWidth: 0
        }),
        _(
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
    myDiagram.linkTemplate = _(
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
      _(
        go.Shape, // the highlight shape, normally transparent
        {
          isPanelMain: true,
          strokeWidth: 8,
          stroke: "transparent",
          name: "HIGHLIGHT"
        }
      ),
      _(
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
      _(
        go.Shape, // the arrowhead
        {
          toArrow: "standard",
          strokeWidth: 0,
          fill: "gray"
        }
      ),
      _(
        go.Panel,
        "Auto", // the link label, normally not visible
        {
          visible: false,
          name: "LABEL",
          segmentIndex: 2,
          segmentFraction: 0.5
        },
        new go.Binding("visible", "visible").makeTwoWay(),
        _(
          go.Shape,
          "RoundedRectangle", // the label shape
          {
            fill: "#F8F8F8",
            strokeWidth: 0
          }
        ),
        _(
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
    console.log("end initTemplate");
  }
};
