<template>
  <div id="app">
    <!-- <Sticky><Header/></Sticky> -->
    <Header/>
    <router-view/>
  </div>
</template>
<script>
require("bootstrap");
require("bootstrap/dist/css/bootstrap.css");

require("@fortawesome/fontawesome-free");
require("@fortawesome/fontawesome-free/css/all.css");
require("animate.css");

import Header from "@/components/Header.vue";
import axios from "axios";
export default {
  components: {
    Header
  },
  created() {
    
    // console.log("beforeCreated");
    // var $this = this;
    // axios.get("/api/user").then(function(response) {
    //   if (response.data.success) {
    //     let user = response.data.data;
    //     if (user != null) {
    //       console.log("set user");
    //       $this.$store.commit("setUser", user);
    //       service.createWebSocket();
    //       service.init();
    //     }
    //   }
    // });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  height: 100%;
}
.my-box {
  /* margin: 10px 0px 10px 10px; */
}
</style>
