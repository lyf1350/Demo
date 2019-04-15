<template >
  <div id="home" class="home" style="text-align:center;position:absolute;top:0px;overflow:hidden">
    <b-card
      overlay
      img-src="/img/isometric_bg.jpg"
      img-alt="Card Image"
      text-variant="white"
      bg-variant="primary"
    >
      <b-card-text style="position:relative;top:35%">
        <h1>欢迎来到万向决策平台</h1>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import header from "@/components/Header.vue";
export default {
  components: {
    HelloWorld
  },mounted(){
    
    $('#home').height(document.body.clientHeight);
  }
};
</script>

<style scoped>
.card-img{
  filter:blur(0.7px)
}
</style>


