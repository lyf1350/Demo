<template>
  <b-container>
    <b-btn @click="commit">提交</b-btn>
    <b-btn @click="test">测试</b-btn>

    <b-row>
      <b-col>
        <div id="external-events">
          <v-select v-model="project" :options="projectOptions" placeholder="请选择项目"/>
          <p>
            <strong>日历事件</strong>
          </p>
          <div
            v-for="(content,index) in workEvents"
            :key="'content'+index"
            class="fc-event external-event"
            :style="{'background-color':content.color}"
            :id="JSON.stringify({type:content.type,project:project})"
            @dblclick="removeEvent(index)"
          >{{content.title}}</div>
        </div>
        <div>
          <v-select v-model="work" :options="workOptions" placeholder="请选择工作性质"/>
          <b-input v-model="workContent" placeholder="工作内容"/>
          <b-btn @click="addEvent">添加工作事件</b-btn>
          <b-btn @click="addEvent">移除工作事件</b-btn>
        </div>
        <div>
          <b-table stacked :items="items"></b-table>
        </div>
      </b-col>
      <b-col cols="9">
        <FullCalendar
          id="calendar"
          class="demo-app-calendar"
          ref="calendar"
          defaultView="dayGridMonth"
          :header="header"
          :plugins="calendarPlugins"
          :weekends="calendarWeekends"
          :events="calendarEvents"
          @dateClick="handleDateClick"
          editable="true"
          :locale="locale"
          @dayRender="dayRender"
          @eventClick="eventClick"
          selectable="true"
          allDayDefault="false"
          droppable="true"
          @drop="drop"
          @keyup.enter="deleteEvent"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from "axios";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import moment from "moment";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { View } from "@fullcalendar/core";
import cn from "@fullcalendar/core/locales/zh-cn";
require("@fullcalendar/core/main.css");
require("@fullcalendar/daygrid/main.css");
require("@fullcalendar/timegrid/main.css");
require("@fullcalendar/list/main.css");

export default {
  data() {
    return {
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [
        // initial event data
        {
          title: "Event Now",
          start: new Date(),
          prop: JSON.stringify({ type: "test", project: "test" })
        },
        {
          title: "Event Now1",
          start: new Date("2019-5-16 10:00"),
          allDay: false,
          end: new Date("2019-5-16 11:00")
        }
      ],
      locale: cn,
      api: null,
      header: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
      },
      project: null,
      projectOptions: ["万向", "康勒", "宇视"],
      work: null,
      workOptions: ["在岗", "出差", "实习", "请假", "调休", "加班"],
      workContent: null,
      workEvents: [],
      colorMap: {
        在岗: "green",
        出差: "blue",
        实习: "aqua",
        请假: "red",
        调休: "orange",
        加班: "purple"
      },
      event: null,
      items: [],
      time: null,
      holidays: null
    };
  },
  components: {
    FullCalendar: FullCalendar
  },
  methods: {
    dayRender(dayRenderInfo) {
      let day = dayRenderInfo.date.getDay();
      let year = dayRenderInfo.date.getFullYear();
      let date = moment(dayRenderInfo.date).format("YYYY-MM-DD");
      let holiday = this.holidays != null ? this.holidays[year][date] : null;

      if (holiday != null) {
        dayRenderInfo.el.innerText = holiday.holiday ? holiday.name : "调休";
        dayRenderInfo.el.style.backgroundColor = holiday.holiday
          ? "#dd4b39"
          : "green";
      } else if (day == 6 || day == 0)
        dayRenderInfo.el.style.backgroundColor = "#dd4b39";
    },
    handleDateClick(arg) {},
    eventClick(arg) {
      let duration = new Date() - this.time;
      this.time = new Date();
      let _this = this;
      if (duration < 300) {
        $.confirm({
          title: "是否删除:" + arg.event.title,
          content: "",
          type: "red",
          buttons: {
            confirm: {
              text: "确认",
              action: function() {
                arg.event.remove();
                _this.items = [];
              }
            },
            cancel: {
              text: "取消"
            }
          }
        });

        return;
      }
      console.log("click event:", arg);
      let event = arg.event;
      let prop = event.extendedProps.prop
        ? JSON.parse(event.extendedProps.prop)
        : "";
      this.items = [
        {
          开始时间: moment(event.start).format("YYYY-MM-DD HH:mm"),
          结束时间: event.end
            ? moment(event.end).format("YYYY-MM-DD HH:mm")
            : "",
          项目: prop.project,
          工作性质: prop.type,
          工作内容: event.title
        }
      ];
    },
    drop(dropInfo) {
      console.log("dropInfo:", dropInfo);
    },
    commit() {
      console.log("events:", this.api.getEvents());
    },
    test() {
      console.log(this.calendarEvents);
    },
    addEvent() {
      var containerEl = document.getElementById("external-events");

      this.workEvents.push({
        title: this.workContent,
        type: this.work,
        color: this.colorMap[this.work]
      });
      console.log(this.workEvents);
    },
    removeEvent(index) {
      let _this = this;
      console.log("index:", index);
      $.confirm({
        title: "是否删除:" + this.workEvents[index].title,
        content: "",
        type: "red",
        buttons: {
          confirm: {
            text: "确认",
            action: function() {
              _this.workEvents.splice(index, 1);
            }
          },
          cancel: {
            text: "取消"
          }
        }
      });
    }
  },
  mounted() {
    var containerEl = document.getElementById("external-events");
    new Draggable(containerEl, {
      itemSelector: ".fc-event",
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText,
          backgroundColor: eventEl.style.backgroundColor,
          prop: eventEl.id,
          textColor: "white"
        };
      }
    });
    this.api = this.$refs.calendar.getApi();
    let _this = this;
    this.holidays = {};
    axios.get("/api/config/holiday").then(response => {
      if (response.data.success) {
        _this.holidays = {};
        console.log("holidays:", _this.holidays);

        for (let i in response.data.data) {
          _this.holidays[i] = JSON.parse(response.data.data[i]);
        }
        _this.api.render();
        console.log("333:");
      }
    });
  }
};
</script>

<style scoped>
.external-event {
  padding: 5px 10px;
  font-weight: bold;
  margin-bottom: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  cursor: move;
}
</style>

