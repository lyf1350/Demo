<template>
  <div class="sticky">
    <header
      class="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar animated"
      :class="{'fadeInDown':fadein,'fadeOutUp':fadeout}"
    >
      <a class="navbar-brand mr-0 mr-md-2" href="/" aria-label="Bootstrap">
        <!-- <img src="favicon.png" width="36" height="36"> -->
        万向决策平台
      </a>
      <div class="navbar-nav-scroll">
        <ul class="navbar-nav bd-navbar-nav flex-row">
          <li class="nav-item">
            <router-link class="nav-link" to="/">主页</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/test">测试</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pic">图样示例</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/table">表格示例</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/file">文件上传</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/calendar">日历示例</router-link>
          </li>
        </ul>
      </div>

      <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
        <li class="nav-item">
          <router-link class="nav-link" to="/login" v-if="$store.state.user==null">登录</router-link>
          <div v-else>
            <li class="nav-item dropdown">
              <router-link
                class="nav-item nav-link mr-md-2"
                to="/user"
              >{{$store.state.user.username}}</router-link>

              <div class="dropdown-menu dropdown-menu-left" aria-labelledby="bd-versions">
                <!-- <router-link class="dropdown-item" to="/user">用户信息</router-link> -->
                <router-link class="dropdown-item" to="/message">消息</router-link>
                <router-link class="dropdown-item" to="/workflow">流程</router-link>
                <router-link class="dropdown-item" to="/template">模版</router-link>
                <router-link class="dropdown-item" to="/config">配置</router-link>

                <router-link
                  class="dropdown-item"
                  to="/admin"
                  v-if="$store.state.user.members.some(x=>x.role.roleName='管理员')"
                >管理</router-link>
                <button class="dropdown-item" @click="logout">登出</button>
              </div>
            </li>
          </div>
        </li>
        <li class="nav-item">
          <a
            class="nav-link p-2"
            href="https://github.com/lyf1350"
            rel="noopener"
            aria-label="GitHub"
          >
            <svg
              class="navbar-nav-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 499.36"
              focusable="false"
              role="img"
            >
              <title>GitHub</title>
              <path
                d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
        <li class="nav-item">
          <b-dropdown no-caret variant="nav-link">
            <template slot="button-content">
              <i class="far fa-envelope" style="font-size:125%;padding-top:2px;color:#95a6af"></i>
              <b-badge
                variant="danger"
                style="font-size:9px;line-height:.9;position:absolute;top:1px;right:3px;padding:2px 3px"
                v-if="$store.state.unreadMessageCount>0"
              >{{$store.state.unreadMessageCount}}</b-badge>
            </template>
            <b-dropdown-text style="padding:0 0">
              <b-list-group
                style="height:300px;width:300px;overflow:auto"
                v-if="$store.state.unreadMessageCount>0"
              >
                <b-list-group-item
                  v-for="(message) in $store.state.msg.filter(e=>e.state=='0')"
                  :key="message.id"
                  class="card"
                >
                  <h5>{{message.message.title}}</h5>
                  发件人:{{message.message.source}}
                </b-list-group-item>
              </b-list-group>
              <b-btn to="/message" block>查看所有消息</b-btn>
            </b-dropdown-text>
          </b-dropdown>
        </li>
        <li class="nav-item">
          <a class="nav-link p-2" href="#" rel="noopener" aria-label="Open Collective">
            <svg
              class="navbar-nav-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 41"
              focusable="false"
              role="img"
              fill="currentColor"
              fill-rule="evenodd"
            >
              <title>Open Collective</title>
              <path
                d="M32.8 21c0 2.4-.8 4.9-2 6.9l5.1 5.1c2.5-3.4 4.1-7.6 4.1-12 0-4.6-1.6-8.8-4-12.2L30.7 14c1.2 2 2 4.3 2 7z"
                fill-opacity="0.4"
              ></path>
              <path
                d="M20 33.7a12.8 12.8 0 0 1 0-25.6c2.6 0 5 .7 7 2.1L32 5a20 20 0 1 0 .1 31.9l-5-5.2a13 13 0 0 1-7 2z"
              ></path>
            </svg>
          </a>
        </li>
      </ul>

      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="请输入搜索内容" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">搜索</button>
      </form>
    </header>
  </div>
</template>

<script>
const $ = require("jquery");
import axios from "axios";
export default {
  name: "Header",
  data() {
    return {
      currentScoll: 0,
      header: $("header"),
      didScroll: !1,
      fadein: false,
      fadeout: false
    };
  },
  methods: {
    logout() {
      var $this = this;
      axios.get("/api/user/logout").then(function() {
        $this.$store.commit("setValue", { name: "user", value: null });
        $this.$store.commit("setValue", { name: "ws", value: null });
        sessionStorage.clear();

        $this.$router.push("/");
      });
    }
  },
  mounted() {
    // window.addEventListener("scroll", () => {
    //   var $this = this;
    //   this.didScroll ||
    //     ((this.didScroll = !0),
    //     setTimeout(function() {
    //       var e = window.pageYOffset || document.documentElement.scrollTop;
    //       if (e < $this.currentScoll) {
    //         $this.fadeout = false;
    //         $this.fadein = true;
    //       } else {
    //         $this.fadeout = true;
    //         $this.fadein = false;
    //       }
    //       ($this.currentScoll = e), ($this.didScroll = !1);
    //     }, 200));
    // });
  }
};
</script>
<style scoped>
.bd-navbar {
  min-height: 4rem;
  background-color: #314b5e;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}
.bd-navbar {
  min-height: 4rem;
  background-color: #314b5e;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 991.98px) {
  .bd-navbar {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }

  .bd-navbar .navbar-nav-scroll {
    max-width: 100%;
    height: 2.5rem;
    margin-top: 0.25rem;
    overflow: hidden;
    font-size: 0.875rem;
  }

  .bd-navbar .navbar-nav-scroll .navbar-nav {
    padding-bottom: 2rem;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
}

@media (min-width: 768px) {
  @supports ((position: -webkit-sticky) or (position: sticky)) {
    .bd-navbar {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 1071;
    }
  }
}

.bd-navbar .navbar-nav .nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.bd-navbar .navbar-nav .nav-link.active,
.bd-navbar .navbar-nav .nav-link:hover {
  color: #fff;
  background-color: transparent;
}

.bd-navbar .navbar-nav .nav-link.active {
  font-weight: 600;
}

.bd-navbar .navbar-nav-svg {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-top;
}

.bd-navbar .dropdown-menu {
  font-size: 0.875rem;
}

.bd-navbar .dropdown-item.active {
  font-weight: 600;
  color: #212529;
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23292b2c' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: 0.4rem 0.6rem;
  background-size: 0.75rem 0.75rem;
}
.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}
.sticky {
  top: 0;
  z-index: 10;
  position: sticky;
  position: -webkit-sticky;
}
.router-link-exact-active {
  /* background-color: #00ba87;
  color: #fff !important;
  border-radius: 5px; */
}
</style>

