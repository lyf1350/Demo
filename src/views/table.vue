<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <v-select
            v-model="table"
            :options="tables"
            placeholder="请选择表"
            label="context"
            @change="load"
          />
        </b-col>

        <b-col v-show="table">
          <b-input v-model="filter" placeholder="查询"/>
        </b-col>
        <b-col v-show="table">
          <v-select v-model="perPage" :options="pageOptions" placeholder="每页数量"/>
        </b-col>
      </b-row>
      <b-row v-show="table">
        <b-table
          :items="items"
          :fields="val.fields"
          :striped="val.striped"
          :bordered="val.bordered"
          :borderless="val.borderless"
          :outlined="val.outlined"
          :small="val.small"
          :hover="val.hover"
          :dark="val.dark"
          :fixed="val.fixed"
          :foot-clone="val.footClone"
          :isBusy="isBusy"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
        >
          <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tables: [],
      table: null,
      items: [],
      val: {
        fields: []
      },
      isBusy: false,
      totalRows: 1,
      perPage: 5,
      currentPage: 1,
      pageOptions: [5, 10, 25, 50],
      filter: null
    };
  },
  methods: {
    load() {
      if (this.table == null) return;
      var _this = this;
      this.isBusy = true;
      this.filter = "";
      this.currentPage = 1;

      if (typeof this.table.val == "string")
        this.table.val = JSON.parse(this.table.val);
      this.val = this.table.val;
      axios
        .get("api/table/get?name=" + this.table.configName)
        .then(response => {
          console.log(response.data);
          _this.items = response.data.data;
          _this.isBusy = false;
          _this.totalRows = _this.items.length;
        });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  mounted() {
    var _this = this;
    axios.get("api/config/getTables").then(response => {
      console.log(response.data);
      if (response.data.success) {
        let data = response.data.data;
        _this.tables = data;
      }
    });
  }
};
</script>

<style>
</style>
