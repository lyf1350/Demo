<template>
  <div>
    <label v-if="config.showLabel">{{config.label}}</label>
    <div v-if="config.editable">
      <b-input
        v-if="config.type=='string'&&config.selectable==false"
        v-model="data"
        @change="change"
        type="text"
      ></b-input>
      <v-select
        v-if="config.type=='string'&&config.selectable"
        v-model="data"
        @change="change"
        :options="config.options"
        :multiple="config.multiple"
      />
      <b-input v-if="config.type=='number'" type="number" v-model="data" @change="change"></b-input>
      <datepicker
        v-if="config.type=='date'"
        v-model="data"
        @input="change"
        :format="formatter"
        monday-first
        input-class="form-control"
      />
    </div>
    <div v-else>
      <label>{{value}}</label>
    </div>
  </div>
</template>
<script>
import moment from "moment";
// import zh from 'vuejs-datepicker/dist/locale/translations';
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

  methods: {
    change() {
      this.$emit("update", this.data);
    },
    formatter(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>
