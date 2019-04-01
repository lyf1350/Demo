import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    user: null,
    ws: null,
    msg: [],
    unreadMessageCount: 0,
    nodes: [],
    unexecutedNodeCount: 0,
    pending:[],
    executed:[],
    finished:[]
}

const mutations = {
    setUnreadMessage(state, count) {
        state.unreadMessageCount += count;
        if (state.unreadMessageCount < 0)
            state.unreadMessageCount = 0;
    },
    setValue(state,value){
        state[value.name]=value.value;
    }

}

export default new Vuex.Store({
    state: state,
    mutations: mutations
})