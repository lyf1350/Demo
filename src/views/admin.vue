<template>
  <div>
    <button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#modal" @click="role=''">管理角色</button>
    <div class="modal" id="modal">
      <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
          角色：
          <input type="text" v-model="role"/>
          <button class="btn btn-primary" @click="createRole">创建</button>
          <div class="form-group" v-for="(role,index) in roles" :key="'role'+index">
            {{role.value.roleName}}
            <button class="btn btn-danger" @click="deleteRole(role)">移除</button>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-success btn-block" data-toggle="modal" data-target="#modal2" @click="group=''">管理组</button>
    <div class="modal" id="modal2">
      <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
          组：
          <input type="text" v-model="group"/>
          <button class="btn btn-primary" @click="createGroup">创建</button>
          <div class="form-group" v-for="(group,index) in groups" :key="'group'+index">
            {{group.value.groupName}}
            <button class="btn btn-danger" @click="deleteGroup(group)">移除</button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-warning btn-block" data-toggle="modal" data-target="#modal1">用户管理</button>
    <div class="modal" id="modal1">
      <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
          <div class="form-group">人员:
            <v-select v-model="person" :options="personOptions"></v-select>
          </div>
          <div class="form-group">组：
            <v-select v-model="group" :options="groups"></v-select>
          </div>
          <div class="form-group">角色：
            <v-select :options="roles" v-model="role"></v-select>
          </div>
            <!-- <button class="btn btn-danger btn-block" @click="deleteUser" v-if="person">删除用户</button> -->

            <button class="btn btn-primary btn-block" @click="attachMember" v-if="person">添加角色</button>

          <div v-if="person.value!=null">
            <div class="form-group" v-for="member in person.value.members" :key="member.id">
              组:{{member.group.groupName}} 角色:{{member.role.roleName}}
              
              <button
                class="btn btn-danger"
                @click="detachMember(member)"
              >移除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      role: "",
      group: "",
      person: "",
      users: [],
      personOptions: [],
      roles: [],
      groups: []
    };
  },
  mounted() {
    var $this = this;
    axios.get("/api/user/list").then(response => {
      if (response.data.success) {
        $this.users = response.data.data;
        let options = [];
        for (let i of $this.users) {
          options.push({
            label: i.username,
            value: i
          });
        }
        $this.personOptions = options;
      }
    });
    axios.get("/api/role/list").then(response => {
      if (response.data.success) {
        let roles = response.data.data;
        for (let i of roles) {
          $this.roles.push({
            label: i.roleName,
            value: i
          });
        }
      }
    });
    axios.get("/api/group/list").then(response => {
      if (response.data.success) {
        let groups = response.data.data;
        for (let i of groups) {
          $this.groups.push({
            label: i.groupName,
            value: i
          });
        }
      }
    });
  },
  watch: {
    person: newVal=>{
      if (newVal == null) this.person = {};
    }
  },
  methods: {
    createRole() {
      console.log("role:"+this.role);
      axios
        .post(
          "/api/role/create",
          qs.stringify({
            role: JSON.stringify({
              roleName: this.role
            })
          })
        )
        .then(response => {
          console.log("result:" + JSON.stringify(response.data));
        });
    },
    deleteRole(role) {
      axios
        .post(
          "/api/role/delete",
          qs.stringify({
            role: JSON.stringify(role.value)
          })
        )
        .then(response => {
          console.log(JSON.stringify(response.data));
        });
    },
    createGroup() {
      axios
        .post(
          "/api/group/create",
          qs.stringify({
            group: JSON.stringify({
              groupName: this.group
            })
          })
        )
        .then(response => {
          console.log("result:" + JSON.stringify(response.data));
        });
    },
    deleteGroup(group) {
      axios
        .post(
          "/api/group/delete",
          qs.stringify({
            group: JSON.stringify(group.value)
          })
        )
        .then(response => {
          console.log(JSON.stringify(response.data));
        });
    },
    attachMember() {
      axios
        .post(
          "/api/member/attach",
          qs.stringify({
            group: JSON.stringify(this.group.value),
            role: JSON.stringify(this.role.value),
            username: this.person.value.username
          })
        )
        .then(response => console.log(JSON.stringify(response.data)));
    },
    detachMember(member) {
      axios
        .post(
          "/api/member/detach",
          qs.stringify({
            member: JSON.stringify(member),
            username: this.person.value.username
          })
        )
        .then(response => console.log(JSON.stringify(response.data)));
    }
  }
};
</script>

