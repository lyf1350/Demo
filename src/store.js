import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    user: null,
    ws: null,
    msg:[],
    unreadMessageCount:0
}

const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setWS(state, ws) {
        state.ws = ws;
    },
    setMsg(state,msg){
        state.msg=msg;
    },
    setUnreadMessage(state,count){
        state.unreadMessageCount+=count;
        if(state.unreadMessageCount<0)
            state.unreadMessageCount=0;
    }
    
}

export default new Vuex.Store({
    state:state,
    mutations:mutations
})