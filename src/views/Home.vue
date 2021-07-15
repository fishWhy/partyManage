<template>
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content">

                <router-view v-slot="{ Component }">
                        <!-- keep-alive保持组件的状态, component为动态组件 :include="tagsList" -->
                        <keep-alive include="basetable,baseform" >
                            <component :is="Component" :key="keyOfRouter"/>
                        </keep-alive>
                </router-view>
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
    mounted(){
        this.$message({
            type:'warning',
            message: "正在拉取数据请耐心等待"
        });
    },
    computed: {
        // include(){
        //     let tagsList = this.$store.state.tagsList;
        //     let incluPath = [];
        //     tagsList.forEach(item=>{
        //         incluPath.push(item.path);
        //     })
        //     console.log('include:',incluPath.join(','))
        //     return incluPath;
        // },
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
            console.log('router fullPath',this.$route.fullPath)
            return this.$route.fullPath;
            // if(this.$route.name==='basetable'){
            //     return 'basetable'
            // }else{
            //     return this.$route.fullPath;
            // }
        }
    }
};
</script>
