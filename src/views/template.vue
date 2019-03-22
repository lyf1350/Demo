<template>
  <div>
    <button class="btn btn-primary" @click="initCreateTemplate">新建流程模版</button>
    <button class="btn btn-primary" @click="type='modifyTemplate'">修改流程模版</button>
    <button class="btn btn-primary" @click="type='createAction'">新建Action模版</button>
    <button class="btn btn-primary" @click="type='modifyAction'">修改Action模版</button>
    <div v-show="type=='createTemplate'">
      <div id="myCreateDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    </div>

      <div id="myModifyDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
    <div v-if="type=='modifyTemplate'">22</div>
    <div v-if="type=='createAction'">33</div>
    <div v-if="type=='modifyAction'">44</div>
  </div>
</template>

<script>
import go from "gojs";
export default {
  data: function() {
    return {
      type: "template",
      myDiagram: null,
      template: {
        class: "GraphLinksModel",
        copiesKey: false,
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [
          { category: "Comment", loc: "360 -10", text: "流程名称", key: -13 },
          { key: -1, category: "Start", loc: "175 0", text: "开始" },
          { key: 0, loc: "-5 75", text: "Preheat oven to 375 F" },
          {
            key: 1,
            loc: "175 100",
            text:
              "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"
          },
          {
            key: 2,
            loc: "175 200",
            text: "Gradually beat in 1 cup sugar and 2 cups sifted flour"
          },
          {
            key: 3,
            loc: "175 290",
            text: "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
          },
          {
            key: 4,
            loc: "175 380",
            text: "Press evenly into ungreased 15x10x1 pan"
          },
          {
            key: 5,
            loc: "355 85",
            text: "Finely chop 1/2 cup of your choice of nuts"
          },
          { key: 6, loc: "175 450", text: "Sprinkle nuts on top" },
          { key: 7, loc: "175 515", text: "Bake for 25 minutes and let cool" },
          { key: 8, loc: "175 585", text: "Cut into rectangular grid" },
          { key: -2, category: "End", loc: "175 660", text: "结束" }
        ],
        linkDataArray: [
          {
            from: 1,
            to: 2,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              139.7508972167969,
              175,
              149.7508972167969,
              175,
              153.96886215209963,
              175,
              153.96886215209963,
              175,
              158.18682708740235,
              175,
              168.18682708740235
            ]
          },
          {
            from: 2,
            to: 3,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              231.81317291259768,
              175,
              241.81317291259768,
              175,
              245,
              175,
              245,
              175,
              248.18682708740232,
              175,
              258.1868270874023
            ]
          },
          {
            from: 3,
            to: 4,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              321.8131729125976,
              175,
              331.8131729125976,
              175,
              335,
              175,
              335,
              175,
              338.1868270874023,
              175,
              348.1868270874023
            ]
          },
          {
            from: 4,
            to: 6,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              411.8131729125976,
              175,
              421.8131729125976,
              175,
              422.9377243041992,
              175,
              422.9377243041992,
              175,
              424.0622756958008,
              175,
              434.0622756958008
            ]
          },
          {
            from: 6,
            to: 7,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              465.9377243041992,
              175,
              475.9377243041992,
              175,
              478.53113784790037,
              175,
              478.53113784790037,
              175,
              481.1245513916016,
              175,
              491.1245513916016
            ]
          },
          {
            from: 7,
            to: 8,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              538.8754486083984,
              175,
              548.8754486083984,
              175,
              550,
              175,
              550,
              175,
              551.1245513916016,
              175,
              561.1245513916016
            ]
          },
          {
            from: 8,
            to: -2,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              608.8754486083984,
              175,
              618.8754486083984,
              175,
              623.7836629645769,
              175,
              623.7836629645769,
              175,
              628.6918773207553,
              175,
              638.6918773207553
            ]
          },
          {
            from: -1,
            to: 0,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              21.308122679244644,
              175,
              31.308122679244644,
              175,
              40.18519918752271,
              -5,
              40.18519918752271,
              -5,
              49.06227569580078,
              -5,
              59.06227569580078
            ]
          },
          {
            from: -1,
            to: 1,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              21.308122679244644,
              175,
              31.308122679244644,
              175,
              40.77861273122389,
              175,
              40.77861273122389,
              175,
              50.24910278320313,
              175,
              60.24910278320313
            ]
          },
          {
            from: -1,
            to: 5,
            fromPort: "B",
            toPort: "T",
            points: [
              175,
              21.308122679244644,
              175,
              31.308122679244644,
              175,
              41.2163370354231,
              355,
              41.2163370354231,
              355,
              51.124551391601564,
              355,
              61.124551391601564
            ]
          },
          {
            from: 5,
            to: 4,
            fromPort: "B",
            toPort: "T",
            points: [
              355,
              108.87544860839844,
              355,
              118.87544860839844,
              355,
              116,
              355,
              116,
              355,
              332,
              212.82068634033203,
              332,
              212.82068634033203,
              338.1868270874023,
              212.82068634033203,
              348.1868270874023
            ]
          },
          {
            from: 0,
            to: 4,
            fromPort: "B",
            toPort: "T",
            points: [
              -5,
              90.93772430419921,
              -5,
              100.93772430419921,
              -5,
              100,
              -5,
              100,
              -5,
              332,
              137.17931365966797,
              332,
              137.17931365966797,
              338.1868270874023,
              137.17931365966797,
              348.1868270874023
            ]
          }
        ]
      },
      selectedNode: null
    };
  },
  mounted() {},
  methods: {
    initCreateTemplate() {
      this.type = "createTemplate";
      this.init("myCreateDiv",JSON.stringify(this.template));
    },
    init(id,model) {
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
        "", // the default category
        $(
          go.Node,
          "Table",
          {
            selectionChanged: node => {
              var icon = node.findObject("Icon");
              if (node.isSelected) {
                console.log("node:" + JSON.stringify(node.data));
                console.log("data:" + JSON.stringify(myDiagram.model));
                $this.selectedNode = node;
                node.data.test = "111";
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
            $(
              go.Shape,
              "Rectangle",
              {
                name: "Icon",
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
      myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      myDiagram.model = go.Model.fromJson(model);
    }
  }
};
</script>
