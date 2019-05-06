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
require("bootstrap-vue/dist/bootstrap-vue.css");
require("@fortawesome/fontawesome-free");
require("@fortawesome/fontawesome-free/css/all.css");
require("animate.css");
require("jquery.nicescroll");
require("select2");
require("select2/dist/css/select2.css");
import Header from "@/components/Header.vue";
import axios from "axios";

export default {
  data() {
    return {
      observer: null
    };
  },
  components: {
    Header
  },
  mounted() {
    // console.log("111");
    // let MutationObserver =
    //   window.MutationObserver ||
    //   window.WebKitMutationObserver ||
    //   window.MozMutationObserver;
    // let element = document.querySelector("#app");
    // this.observer = new MutationObserver(mutationList => {
    //   for (let mutation of mutationList) {
    //     if (
    //       mutation.type == "childList" ||
    //       (mutation.oldValue && mutation.oldValue.indexOf("height") != -1)
    //     ) {
    //       $("#app")
    //         .getNiceScroll()
    //         .resize();
    //       return;
    //     }
    //   }
    // });
    // this.observer.observe(element, {
    //   childList: true,
    //   attributes: true,
    //   attributeFilter: ["style"],
    //   attributeOldValue: true,
    //   subtree: true
    // });
  },
  updated() {
    console.log("updated");
    // $("#app").niceScroll({ autohidemode: false });
  },
  beforeDestroyed() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
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
  /* overflow: hidden; */
}

html,
body {
  height: 100%;
}
.my-box {
  /* margin: 10px 0px 10px 10px; */
}
.coolscrollbar {
  scrollbar-arrow-color: yellow;
  scrollbar-base-color: lightsalmon;
}
/* html {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
html::-webkit-scrollbar {
  width: 0px;
} */
</style>
