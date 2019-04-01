<template>
  <div class="container">
    <div class="d-flex justify-content-center h-100">
      <div class="card">
        <div class="card-header">
          <h3>登录</h3>
        </div>
        <div class="card-body" @keydown.enter="login">
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="请输入用户名"
              name="username"
              v-model="username"
            >
          </div>
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-key"></i>
              </span>
            </div>
            <input
              type="password"
              class="form-control"
              placeholder="请输入密码"
              name="password"
              v-model="password"
            >
          </div>
          <!-- <div class="row align-items-center remember">
              <input type="checkbox">Remember Me
          </div>-->
          <div class="form-group">
            <button @click="login" class="btn float-right login_btn">登录</button>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-center links">没有账户?
            <router-link to="/register">注册</router-link>
          </div>
          <div class="d-flex justify-content-center">
            <a href="#">忘记密码?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import service from "../assets/js/service";
import md5 from "blueimp-md5";
export default {
  data() {
    return {
      username: "",
      password: "",
      ws: null
    };
  },
  mounted() {
    $("#app").css("overflow", "hidden");
  },
  destroyed() {
    $("#app").css("overflow", "auto");
  },
  methods: {
    login() {
      let $this = this;
      axios
        .post(
          "/api/user/login",
          qs.stringify({
            username: this.username,
            password: md5(this.password)
          })
        )
        .then(function(response) {
          if (response.data.success) {
            sessionStorage.setItem("user", JSON.stringify(response.data.data));
            $this.$store.commit("setValue", {name:'user',value:response.data.data});
            $this.$store.commit(
              "setUnreadMessage",
              -$this.$store.state.unreadMessageCount
            );
            service.createWebSocket();
            service.init();
            $this.$router.back();
          }
        })
        .catch(function(error) {
          console.log("error:" + error);
        });
    }
  }
};
</script>


<style  scoped>
@font-face {
  font-family: "Numans";
  font-style: normal;
  font-weight: 400;
  src: local("Numans"), local("Numans-Regular"),
    url(../assets/fonts/SlGRmQmGupYAfH84ZhIh.woff2) format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}

.container {
  background-image: url("../assets/login.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  font-family: "Numans", sans-serif;
  height: 100%;
  max-width: 100%;
  align-content: center;
  overflow: hidden;
}

.card {
  height: 370px;
  margin-top: 150px;
  margin-bottom: auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.social_icon span {
  font-size: 60px;
  margin-left: 10px;
  color: #ffc312;
}

.social_icon span:hover {
  color: white;
  cursor: pointer;
}

.card-header h3 {
  color: white;
}

.social_icon {
  position: absolute;
  right: 20px;
  top: -45px;
}

.input-group-prepend span {
  width: 50px;
  background-color: #ffc312;
  color: black;
  border: 0 !important;
}

input:focus {
  outline: 0 0 0 0 !important;
  box-shadow: 0 0 0 0 !important;
}

.remember {
  color: white;
}

.remember input {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  margin-right: 5px;
}

.login_btn {
  color: black;
  background-color: #ffc312;
  width: 100px;
}

.login_btn:hover {
  color: black;
  background-color: white;
}

.links {
  color: white;
}

.links a {
  margin-left: 4px;
}
</style>

