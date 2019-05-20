<template>
  <div>
    asdklfjasdjflasjd
    <a href="#">
      <i style="color:teal" class="fa fa-square"></i>
    </a>
    <button data-toggle="modal" data-target="#modal" class="btn btn-primary" @click="test1">modal</button>
    <button @click="test2" class="btn btn-primary">写入2</button>
    <button @click="test1" class="btn btn-primary">写入1</button>
    <br>
    <b-dropdown no-caret variant="nav-link">
      <template slot="button-content">aaass</template>
      <b-dropdown-item>aaa</b-dropdown-item>
    </b-dropdown>
    <b-btn v-b-modal.modal>test modal</b-btn>
    <b-form-input v-model="text" placeholder="Enter your name" readonly draggable></b-form-input>
    <b-table :items="data" :fields="fields" hover responsive fixed/>

    <b-modal id="modal" centered hide-footer hide-header>1234</b-modal>
    <div id="editor_holder"></div>
    <layout :layout="layout" :value="testData"/>
    {{testData1}}
    <div v-for="(aac,index) in test3()" :key="index">{{aac}}</div>
    <div class="demo-app-top">
      <button @click="toggleWeekends">toggle weekends</button>
      <button @click="gotoPast">go to a date in the past</button>
      (also, click a date/time to add an event)
    </div>
    <div id="external-events">
      <p>
        <strong>Draggable Events</strong>
      </p>
      <div class="fc-event">My Event 1</div>
      <div class="fc-event">My Event 2</div>
      <div class="fc-event">My Event 3</div>
      <div class="fc-event">My Event 4</div>
      <div class="fc-event">My Event 5</div>
      <p>
        <input type="checkbox" id="drop-remove">
        <label for="drop-remove">remove after drop</label>
      </p>
    </div>
    <FullCalendar
      class="demo-app-calendar"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :header="{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }"
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :events="calendarEvents"
      @dateClick="handleDateClick"
      editable="true"
      :locale="cn"
      @dayRender="dayRender"
      @eventClick="eventClick"
      @drop="drop"
    />
  </div>
</template>

<script>
import md5 from "blueimp-md5";

import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import axios from "axios";
import qs from "qs";
import go from "gojs";
import circular from "circular-json";
import pdf from "pdfjs-dist";
import node from "@/components/Node";
import test from "@/components/TestComponent";
import layout from "@/components/Layout";
import _ from "lodash";
import JSONEditor from "@json-editor/json-editor";
import * as d3 from "d3";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { View } from "@fullcalendar/core";

import cn from "@fullcalendar/core/locales/zh-cn";
require("@fullcalendar/core/main.css");
require("@fullcalendar/daygrid/main.css");

export default {
  data() {
    return {
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [
        // initial event data
        { title: "Event Now", start: new Date() }
      ],
      cn: cn,
      temp: {},
      loading: false,
      message: "aaa",
      to: "abc",
      type: "default",
      editor: null,
      testData: {},
      fields2: [
        {
          key: "test1",
          label: "测试1",
          type: "string"
        },
        {
          key: "test2",
          label: "测试2",
          type: "string"
        }
      ],
      selected: true,
      index: null,
      selectedTable: {},
      options: [],
      show: false,
      files: [],
      src: "",
      uploadedFiles: [],
      test: "",
      text: "abc",
      data: [],
      fields: [],
      html: "<Test />aabbcc",
      config: {},
      dataArray: [
        {
          test1: "111",
          test2: "222"
        }
      ],
      testLayout: null,
      layout: [],
      nodes: [],
      svgContainer: null,
      circle: null,
      testData1: [],
      testData2: 10
    };
  },
  components: {
    Node: node,
    Test: test,
    layout: layout,
    FullCalendar: FullCalendar
  },
  created() {},
  mounted() {
    var containerEl = document.getElementById("external-events");
    var calendarEl = document.getElementById("calendar");
    var checkbox = document.getElementById("drop-remove");
    console.log("drag:", Draggable);
    new Draggable(containerEl, {
      itemSelector: ".fc-event",
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText
        };
      }
    });
  },
  methods: {
    test5(index) {
      console.log("circle:", this.circle);
      var jsonCircles = [
        { x_axis: 30, y_axis: 30, radius: 20, color: "blue" },
        { x_axis: 70, y_axis: 70, radius: 20, color: "purple" },
        { x_axis: 110, y_axis: 100, radius: 20, color: "red" }
      ];
      jsonCircles[index].color = "yellow";
      console.log("json:", jsonCircles);
      this.svgContainer
        .selectAll("circle")
        .exit()
        .remove();
      this.svgContainer
        .selectAll("circle")
        .data(jsonCircles)
        .attr("cx", function(d) {
          return d.x_axis;
        })
        .attr("cy", function(d) {
          return d.y_axis;
        })
        .attr("r", function(d) {
          return d.radius;
        })
        .style("fill", function(d) {
          console.log("d:", d);
          return d.color;
        });
    },
    /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if (newFile.response.success && newFile.key) {
          if (this.testData[newFile.key] == null)
            this.testData[newFile.key] = [];
          this.testData[newFile.key].push(newFile.response.data);
        }
        if (newFile.xhr) {
          //  Get the response status code
          console.log("status", newFile.xhr.status);
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent();
        }
      }

      // Create a blob field
      newFile.blob = "";
      let URL = window.URL || window.webkitURL;
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file);
      }
    },
    download(uuid) {
      window.open("/api/file/download/" + uuid);
    },
    upload(key) {
      for (var i of this.temp[key]) {
        i.key = key;
      }
      this.$refs["upload" + key][0].active = true;
    },
    test1() {
      this.testData2 = Math.random() * 10;
      // var _this = this;
      // this.fields = [
      //   {
      //     key: "file_name",
      //     label: "文件名"
      //   },
      //   {
      //     key: "suffix",
      //     label: "后缀",
      //     sortable: true,
      //     variant: "danger"
      //   }
      // ];
      // axios.get("/api/test").then(response => {
      //   console.log("response:" + JSON.stringify(response.data));
      //   _this.data = response.data.data;
      // });
      // this.src = "/api/file/" + uuid;
    },
    dragover(ev) {
      event.preventDefault();
    },
    addRow(key) {
      this.temp[key] = {};
      this.testData[key].push({});
    },
    removeRow(key) {
      console.log(this.temp[key]);
      let arr = [];
      for (let i in this.temp[key]) {
        if (this.temp[key][i]) arr.push(i);
      }
      _.pullAt(this.testData[key], arr);
      this.temp[key] = {};
      this.testData[key].sort();
    },
    rowSelected(key) {
      console.log("select1");

      if (!this.selected) {
        return;
      }
      this.selected = false;
      console.log("select2");

      if (this.temp[key] == null) this.temp[key] = {};
      this.temp[key][this.index] =
        this.temp[key][this.index] == null ? true : !this.temp[key][this.index];
    },
    rowClicked(item, index, event) {
      console.log("click");
      this.selected = true;
      this.index = index;
    },
    test2() {
      // console.log(this.temp);
      // pdf.getDocument("/api/test/1").then(
      //   pdf => {
      //     pdf.getPage(1).then(page => {
      //       var viewport = page.getViewport({ scale: 1.5 });
      //       var canvas = document.getElementById("canvas");
      //       var context = canvas.getContext("2d");
      //       canvas.height = 2000;
      //       canvas.width = 1200;
      //       page
      //         .render({
      //           canvasContext: context,
      //           viewport: viewport
      //         })
      //         .then(response => console.log("success"));
      //     });
      //   },
      //   error => console.log("error:" + error)
      // );
      // axios
      //   .post("/api/test/1")
      //   .then(response => {console.log(JSON.stringify(response.data.success))
      //   .catch(error => console.log(JSON.stringify(error)));
      // console.log("$store:" + this.$store.state.ws);
      // var temp = {
      //   from: "test",
      //   to: this.to,
      //   message: this.message,
      //   type: this.type
      // };
      // this.$store.state.ws.send(JSON.stringify(temp));
    },
    test3() {
      return this.testData1.filter(e => e < this.testData2);
    },
    toggleWeekends() {
      console.log("events:", this.calendarEvents);
    },
    gotoPast() {
      let calendarApi = this.$refs.fullCalendar.getApi(); // from the ref="..."
      calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    },
    dayRender(dayRenderInfo) {
      if (dayRenderInfo.date.getDay() == 6 || dayRenderInfo.date.getDay() == 0)
        dayRenderInfo.el.style.backgroundColor = "#dd4b39";
      console.log("dayrender:", dayRenderInfo);
    },
    handleDateClick(arg) {
      if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
        this.calendarEvents.push({
          // add new event data
          title: "New Event",
          start: arg.date,
          allDay: arg.allDay
        });
      }
    },
    eventClick(arg) {
      console.log("click event");
    },
    drop(dropInfo) {
      console.log("dropInfo:", dropInfo);
      // // this function is called when something is dropped

      // // retrieve the dropped element's stored Event Object
      // var originalEventObject = $(this).data("eventObject");

      // // we need to copy it, so that multiple events don't have a reference to the same object
      // var copiedEventObject = $.extend({}, originalEventObject);

      // // assign it the date that was reported
      // copiedEventObject.start = date;
      // copiedEventObject.allDay = allDay;
      // copiedEventObject.backgroundColor = $(this).css("background-color");
      // copiedEventObject.borderColor = $(this).css("border-color");

      // // render the event on the calendar
      // // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
      // $("#calendar").fullCalendar("renderEvent", copiedEventObject, true);

      // // is the "remove after drop" checkbox checked?
      // if ($("#drop-remove").is(":checked")) {
      //   // if so, remove the element from the "Draggable Events" list
      //   $(this).remove();
      // }
    }
  }
};
</script>

<style >
</style>
