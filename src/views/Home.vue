<template>
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content">

                <router-view v-slot="{ Component }">
                    <!-- vue的动画 :key="keyOfRouter"-->
                    <transition name="move" mode="out-in">
                        <!-- keep-alive保持组件的状态, component为动态组件 :include="tagsList" -->
                        <keep-alive include="basetable,baseform" >
                            <component :is="Component" :key="keyOfRouter"/>
                        </keep-alive>
                    </transition>
                </router-view>
                <!-- <el-backtop target=".content"></el-backtop> -->
            </div>
        </div>
    </div>
</template>
<script>
import vHeader from "../components/Header";
import vSidebar from "../components/Sidebar";
import vTags from "../components/Tags.vue";
export default {
    components: {
        vHeader,
        vSidebar,
        vTags
    },
    computed: {
        tagsList() {
            return this.$store.state.tagsList.map(item => item.name);
        },
        collapse() {
            return this.$store.state.collapse;
        },
        keyOfRouter(){
            // const isExist =this.$store.state.tagsList.some(item=>{
            //     return item.path === this.$route.fullPath;
            // });
            
            // if(isExist){
            //     console.log('is exist',this.$route.fullPath)
            //     return this.$route.fullPath
            // }else {
            //     console.log('is  not exist',this.$route.fullPath)
            //     return undefined; 
            // }
            if(this.$route.name==='basetable'){
                return 'basetable'
            }else{
                return this.$route.fullPath;
            }
        }
    }
};
</script>
