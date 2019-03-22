var ws;
import store from "../../store"
import axios from "axios";
export default {
    createWebSocket() {
        ws = new WebSocket("ws://localhost:8080/");
        ws.onopen = function () {
            console.log("建立连接成功");
        };
        ws.onmessage = function (event) {
            console.log("event:" + event.data);

            let tempMsg = JSON.parse(event.data);
            console.log("msg:" + store.state.msg);
            store.state.msg.unshift(tempMsg)
            store.commit('setUnreadMessage', 1);
            store.commit('setMsg', store.state.msg);
        };
        ws.onclose = function (event) {
            store.commit('setUser',null);
            sessionStorage.clear();
            console.log("close websocket");
        };
        ws.onerror = function (error) {
            console.log("error:" + JSON.stringify(error));
        };
        store.commit("setWS", ws);
    },
    send(msg) {
        ws.send(JSON.stringify(msg));
    },
    init() {
        axios
            .get("/api/message/list", {
                params: {
                    id: store.state.user.id
                }
            })
            .then(function (response) {
                let data = response.data.data;
                let count = 0;
                for (let i of data) {
                    count += i.state == 0 ? 1 : 0;

                }
                console.log("data:" + JSON.stringify(data));
                console.log("count:" + count);
                store.commit("setMsg", data);
                store.commit('setUnreadMessage', count);
            });
    }
    
}


