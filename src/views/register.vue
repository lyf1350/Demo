<template>
  <div class="container">
    <div class="d-flex justify-content-center h-100">
      <div class="card">
        <div class="card-header">
          <h3>用户注册</h3>
        </div>
        <div class="card-body">
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
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-phone"></i>
              </span>
            </div>
            <input
              type="phone"
              class="form-control"
              placeholder="请输入电话"
              name="phone"
              v-model="phone"
            >
          </div>
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
            <input
              type="email"
              class="form-control"
              placeholder="请输入邮箱"
              name="email"
              v-model="email"
            >
          </div>
          <div class="form-group">
            <button @click="register" class="btn float-right login_btn">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import qs from "qs";
import md5 from "blueimp-md5";
export default {
  data() {
    return {
      username: "",
      password: "",
      phone: "",
      email: ""
    };
  },
  mounted() {
    $("#app").css("overflow", "hidden");
  },
  destroyed() {
    $("#app").css("overflow", "auto");
  },
  methods: {
    register() {
      axios
        .post(
          "/api/user/register",
          qs.stringify({
            username: this.username,
            password: md5(this.password),
            phone: this.phone,
            email: this.email
          })
        )
        .then(response => {
          if (response.data.success) {
            $.alert("注册成功");
          }
        });
    }
  }
};
</script>
 <style scoped>
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
  height: 100%;
  max-width: 100%;
  font-family: "Numans", sans-serif;
  align-content: center;
}

.card {
  height: 370px;
  margin-top: 120px;
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
