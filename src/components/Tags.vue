<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li
                class="tags-li"
                v-for="(item,index) in tagsList"
                :class="{'active': isActive(item.path)}"
                :key="index"
            >
                <router-link :to="item.path" class="tags-li-title">{{item.name}}</router-link>
                <span class="tags-li-icon" @click="closeTags(index)" v-if="item.name!=='表格'">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="small">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        tagsList() {
            let _list = JSON.parse(JSON.stringify(this.$store.state.tagsList));
            for(let i=0;i<_list.length;i++){
                if(_list[i].name=="basetable"){
                    _list[i].name = "表格"
                }else if(_list[i].name=="baseBranchs"){
                    _list[i].name = "支部信息"
                }else if(_list[i].name=="baseform"){
                    if(_list[i].path.split('=')[1]=='false'){
                        _list[i].name = "添加成员"
                    }else{
                        _list[i].name = "表单" + _list[i].path.split('=')[1];
                    }
                }
            }
            return _list;
        },
        showTags() {
            return this.tagsList.length > 0;
        }
    },
    methods: {
        isActive(path) {
            return path === this.$route.fullPath;
        },
        // 关闭单个标签
        closeTags(index) {
            const delItem = this.tagsList[index];
            // if(delItem.name==='basetable') return;
            this.$store.commit("delTagsItem", { index:index });
            const item = this.tagsList[index]
                ? this.tagsList[index]
                : this.tagsList[index - 1];
            
            
            if (item) {
                // 如果当前页面是要关闭的标签就进行路由跳转，否则不进行路由跳转
                delItem.path === this.$route.fullPath &&
                    this.$router.push(item.path);
            } else {// item为空说明所有页面都关闭了，这是就需要跳转到主页
                this.$router.push("/home/table");
            }
        },
        // 关闭全部标签
        closeAll() {
            this.$store.commit("clearTags");
            this.$router.push("/home/table");
        },
        // 关闭其他标签
        closeOther() {
            // closeTags为要关闭的标签
            const closeTags = this.tagsList.filter(item => {
                return item.path !== this.$route.fullPath;
            });

            this.$store.commit("closeTagsOther", {'closeTags':closeTags,curTag:{
                    name: this.$route.name,
                    title: this.$route.meta.title,
                    path: this.$route.fullPath
            }});
        },
        // 设置标签
        setTags(route) {
            const isExist = this.tagsList.some(item => {
                
                return item.path === route.fullPath;
            });
            if (!isExist) {
                //限定最大打开数量
                if (this.tagsList.length >= 8) {
                    this.$store.commit("delTagsItem", { index: 0 });
                    this.$message({
                            type:'warning',
                            message: "最多只能打开8个标签页"
                    });
                }
                this.$store.commit("setTagsItem", {
                    name: route.name,
                    title: route.meta.title,
                    path: route.fullPath
                });
            }
        },
        handleTags(command) {
            command === "other" ? this.closeOther() : this.closeAll();
        }
    },
    watch: {
        $route(newValue) {
            // console.log('router newValue:',newValue);
            // console.log('tagsList:',this.tagsList)
            this.setTags(newValue);
        }
    },
    created() {
        this.setTags(this.$route);
        // 关闭当前页面的标签页
        // this.$store.commit("closeCurrentTag", {
        //     $router: this.$router,
        //     $route: this.$route
        // });
    }
};
</script>


<style>
.tags {
    position: relative;
    height: 30px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    box-shadow: 0 5px 10px #ddd;
}

.tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.tags-li {
    float: left;
    margin: 3px 5px 2px 3px;
    border-radius: 3px;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 23px;
    line-height: 23px;
    border: 1px solid #e9eaec;
    background: #fff;
    padding: 0 5px 0 12px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
    background: #f8f8f8;
}

.tags-li.active {
    color: #fff;
}

.tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
}

.tags-li.active .tags-li-title {
    color: #fff;
}

.tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    z-index: 10;
}
</style>
