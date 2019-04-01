import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import store from "./store"
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      component: Home
    },
    {
      path: "/about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/About.vue")
    }, {
      path: "/test",
      component: () =>
        import("./views/Test.vue")
    }, {
      path: "/pic",
      beforeEnter: (to, from, next) => {
        // ...
        // console.log("to:" + JSON.stringify(to));
        // if(from){
        //   console.log("from:"+JSON.stringify(from));
        // }

        next();
      },
      component: () =>
        import("./views/pic.vue")
    }, {
      path: "/table",
      component: () =>
        import("./views/table.vue")
    }, {
      path: "/login",
      beforeEnter: (to, from, next) => {

        if (sessionStorage.getItem('user') == null)
          next();
        else {
          console.log("???");
          next('/');
        }
      },
      component: () =>
        import("./views/login.vue")
    }, {
      path: "/register",
      component: () =>
        import("./views/register.vue")
    }, {
      path: "/user",
      component: () =>
        import("./views/user.vue")
    }, {
      path: "/message",
      component: () =>
        import("./views/message.vue")
    }, {
      path: "/admin",
      beforeEnter: (to, from, next) => {
        if (store.state.user==null)
          next('/login');
        else if(store.state.user.members.some(e=>e.role.roleName="管理员")){
          next();
        }else{ 
          next('/auth');
        }
      },
      component: () =>
        import("./views/admin.vue")
    }, {
      path: "/auth",
      component: () =>
        import("./views/auth.vue")
    }, {
      path: "/template",
      component: () =>
        import("./views/template.vue")
    }, {
      path: "/workflow",
      component: () =>
        import("./views/workflow.vue")
    }
  ]
});