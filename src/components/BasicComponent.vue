<template>
  <div>
    <label v-if="config.showLabel">{{config.label}}</label>
    <div v-if="config.editable">
      <b-input
        v-if="config.type=='string'&&config.selectable==false"
        v-model="data"
        type="text"
        @change="change"
      ></b-input>
      <v-select
        v-if="config.type=='string'&&config.selectable"
        v-model="data"
        :options="config.options"
        :multiple="config.multiple"
        @change="change"
      />
      <b-input v-if="config.type=='number'" type="number" v-model="data" @change="change"></b-input>
      <datepicker
        v-if="config.type=='date'"
        v-model="data"
        :format="formatter"
        monday-first
        input-class="form-control"
        @input="change"
      />
    </div>
    <div v-else>
      <label>{{value}}</label>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  model: {
    prop: "value",
    event: "update"
  },
  props: {
    config: {},
    value: null
  },
  data() {
    return {
      data: this.value
    };
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    change() {
      this.$emit("update", this.data);
    },
    formatter(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  updated() {},
  watch: {
    value: function(newVal, oldVal) {
      this.data = newVal;
    }
  }
};
</script>
