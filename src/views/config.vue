<template>
  <div>
    <br>

    <b-container>
      <b-row>
        <b-input v-model="config.configName" placeholder="表名" @keyup.enter="load"/>
        <b-btn @click="load">加载</b-btn>
        <b-btn @click="save" variant="success">保存配置</b-btn>
      </b-row>
      <b-row>
        <b-input v-model="config.context" placeholder="显示名称"/>
      </b-row>
      <b-row>
        <b-form-group label="选项">
          <b-form-checkbox v-model="config.val.striped" inline>Striped</b-form-checkbox>
          <b-form-checkbox v-model="config.val.bordered" inline>Bordered</b-form-checkbox>
          <b-form-checkbox v-model="config.val.borderless" inline>Borderless</b-form-checkbox>
          <b-form-checkbox v-model="config.val.outlined" inline>Outlined</b-form-checkbox>
          <b-form-checkbox v-model="config.val.small" inline>Small</b-form-checkbox>
          <b-form-checkbox v-model="config.val.hover" inline>Hover</b-form-checkbox>
          <b-form-checkbox v-model="config.val.dark" inline>Dark</b-form-checkbox>
          <b-form-checkbox v-model="config.val.fixed" inline>Fixed</b-form-checkbox>
          <b-form-checkbox v-model="config.val.footClone" inline>Foot Clone</b-form-checkbox>
        </b-form-group>
      </b-row>
      <b-row>
        <b-table
          :items="config.val.fields"
          :fields="fields"
          :striped="config.val.striped"
          :bordered="config.val.bordered"
          :borderless="config.val.borderless"
          :outlined="config.val.outlined"
          :small="config.val.small"
          :hover="config.val.hover"
          :dark="config.val.dark"
          :fixed="config.val.fixed"
          :foot-clone="config.val.footClone"
          id="table"
          :isBusy="isBusy"
        >
          <template slot="label" slot-scope="slotData">
            <b-input type="text" v-model="config.val.fields[slotData.index].label"></b-input>
          </template>
          <template slot="show" slot-scope="slotData">
            <b-form-checkbox v-model="config.val.fields[slotData.index].show"></b-form-checkbox>
          </template>
          <template slot="sortable" slot-scope="slotData">
            <b-form-checkbox v-model="config.val.fields[slotData.index].sortable"></b-form-checkbox>
          </template>
          <template slot="formatter" slot-scope="slotData">
            <v-select v-model="config.val.fields[slotData.index].formatter" :options="formatters"></v-select>
          </template>
          <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </b-table>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import _ from "lodash";
export default {
  data() {
    return {
      items: [],
      config: {
        configName: "",
        val: {
          fields: []
        }
      },
      fields: [
        { key: "key", label: "字段名" },
        { key: "label", label: "显示名称" },
        { key: "show", label: "是否显示" },
        { key: "sortable", label: "是否可排序" },
        { key: "formatter", label: "formatter" }
      ],
      formatters: ["dateFormatter"],
      isBusy: false
    };
  },
  methods: {
    load() {
      var _this = this;
      this.isBusy = true;
      axios
        .get("/api/config/get?name=" + this.config.configName)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            this.config.val.fields = [];

            if (data != null) {
              data.val = JSON.parse(data.val);
              for (let i of data.val.fields) i.show = true;
              _this.$set(_this, "config", data);
            }
            axios
              .get("/api/table/desc?name=" + this.config.configName)
              .then(response1 => {
                console.log("response1:", response1.data);
                if (response1.data.success) {
                  let temp = response1.data.data;
                  for (let i of temp) {
                    if (_this.config.val.fields.some(e => e.key == i)) {
                      continue;
                    }
                    _this.config.val.fields.push({
                      key: i,
                      label: "",
                      show: false,
                      sortable: false,
                      formatter: ""
                    });
                  }
                  console.log(_this.config.val.fields);
                }
                this.isBusy = false;
              });
          }
        });
    },
    save() {
      var temp = [];
      var config = _.cloneDeep(this.config);
      config.type = "table";
      for (let i of config.val.fields) {
        if (i.show) temp.push(i);
      }

      config.val.fields = temp;
      axios
        .post(
          "/api/config/createOrSave",
          qs.stringify({
            config: JSON.stringify(config)
          })
        )
        .then(response => console.log(response.data));
    }
  }
};
</script>
