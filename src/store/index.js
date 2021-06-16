import {createStore} from 'vuex'

export default createStore({
    state: {
        tagsList: [],//存储当前已打开的页面
        collapse: true,
        baseTable:{},
        role:{},
        delTags:{},//存储当前要关闭的页面
    },
    mutations: {
        setRole(state,_role){
            state.role.stuId = _role.stuId;
            state.role.role = _role.role;
        },
        delDelTags(state,data){
            for(let i=state.delTags.length-1;i>=0;i--){
                if(state.delTags[i].path == data.path){
                    state.delTags.splice(i,1);
                }
            }
        },
        delTagsItem(state, data) {
            let delt = state
                .tagsList
                .splice(data.index, 1);
            state.delTags = delt;
            // console.log('delt:',delt);
        },
        setTagsItem(state, data) {
            state
                .tagsList
                .push(data);
            // console.log('state tageList length:',state.tagsList.length);
            // console.log('state.tagesList:',state.tagsList);
        },
        clearTags(state) {
            state.delTags = state.tagsList;
            state.tagsList = []
        },
        // 关闭其他页面
        // data.closeTags是要关闭的标签页面的, data.curTag是当前的页面
        closeTagsOther(state, data) {
            console.log('closeTagsOther:',data)
            state.delTags = data.closeTags;
            state.tagsList = [data.curTag];
        },

        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if(data.toPath){
                        data
                            .$router
                            .push(data.toPath+"");
                    } else if (i < len - 1) {//关闭的当前标签页不是末尾，自动跳转到后一个页面
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {//关闭的当前标签页不是末尾并且打开的标签页不止一个时，自动跳转到后一个页面
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {//只有一个标签页并且关闭它时，跳转到table
                        data
                            .$router
                            .push("/home/table");
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        hadndleCollapse(state, data) {
            state.collapse = data;
        },
        
    },
    actions: {},
    modules: {}
})