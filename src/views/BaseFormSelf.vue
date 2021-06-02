<template>
    <div style="height:100%;overflow:auto;">
        <div  style="width:80%;margin:50px auto;">
            <el-container>
                <el-header id="header314">
                    <span style="line-height:40px;font-family:'PingFang SC';font-size:xx-large;">信息详情表</span>
                    <div style="float:right;text-align:right;">
                        <el-button type="success" size="medium" @click="backToLogin">退出登录</el-button>
                    </div>
                </el-header>

                <el-main style="margin:0px;padding-top:8px;">
                    <div class="infor baseInfor">
                        <!-- 基本信息 -->
                        <el-container class="inforContainer" style="border-top: 1px solid black;">
                            <el-header width="100px" class="inforHead"><el-tag type="success"  class="tag" >基本信息</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="tableDetail" :content="detailContent"  ref="tableDetail"></table-detail-big>
                            </el-main>
                        </el-container>

                        <!-- 申请入党阶段 -->
                        <el-container class="inforContainer">
                            <el-header width="80px" class="inforHead"><el-tag type="success" class="tag">申请入党阶段</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="applyStage" :content="applyContent"  ref="applyStage"></table-detail-big>
                            </el-main>
                        </el-container>

                        <!-- 入党积极分子的确定和培养阶段 -->
                        <el-container class="inforContainer">
                            <el-header width="80px" class="inforHead"><el-tag type="success" class="tag">入党积极分子的确定和培养阶段</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="actvStage" :content="actvStageContent"  ref="actvStage"></table-detail-big>
                            </el-main>
                        </el-container>

                        <!-- 发展对象的确定和考察阶段 -->
                        <el-container class="inforContainer">
                            <el-header width="80px" class="inforHead"><el-tag type="success" class="tag">发展对象的确定和考察阶段</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="devStage" :content="devStageContent"  ref="devStage"></table-detail-big>
                            </el-main>
                        </el-container>

                        <!-- 预备党员的接收阶段 -->
                        <el-container class="inforContainer">
                            <el-header width="80px" class="inforHead"><el-tag type="success" class="tag">预备党员的接收阶段</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="candidateStage" :content="candidateContent"  ref="candidateStage"></table-detail-big>
                            </el-main>
                        </el-container>

                        <!-- 预备党员的教育考察和转正阶段 -->
                        <el-container class="inforContainer">
                            <el-header width="80px" class="inforHead"><el-tag type="success" class="tag">预备党员的教育考察和转正阶段</el-tag></el-header>
                            <el-main class="inforMain">
                                <table-detail-big  :formObj="positiveStage" :content="positiveContent"  ref="positiveStage"></table-detail-big>
                            </el-main>
                        </el-container>

                    </div>
                </el-main>
            </el-container>
        </div>

    </div>
    
</template>

<script>
import  tableDetailBig from "../components/tableDetailBig.vue"


import {getTableForm} from "../api/formDate.js"
// dateTranfer

import {fetchDataByStuId} from "../api/index";
// addDate,cInfor,fetchData,

export default {
    name: "baseform",
    components:{
        tableDetailBig:tableDetailBig
    },
    created(){
        console.log('baseFormSelf:',this.$store)

        console.log('BaseFormSelf stuId:',this.$store.state.role.stuId);
        this.person = fetchDataByStuId(this.$store.state.role.stuId);

        this.tableForm = getTableForm();
        // console.log('tableForm:',this.tableForm)
        this.tableDetail = this.tableForm.tableDetail;//基本信息
        this.applyStage = this.tableForm.applyStage;//申请入党阶段
        this.actvStage = this.tableForm.actvStage;//入党积极分子的确定和培养阶段
        this.devStage = this.tableForm.devStage;//发展对象的确定和考察阶段
        this.candidateStage = this.tableForm.candidateStage;// 预备党员的接收阶段
        this.positiveStage = this.tableForm.positiveStage;// 预备党员的教育考察和转正阶段

        // console.log('here get person:',this.person)

        //构建表单中要显示的值
        let atribute = [];

        this.tableDetail.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.detailContent[item] = this.person[item]
        })

        atribute = [];
        this.applyStage.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.applyContent[item] = this.person[item]
        })

        atribute = [];
        this.actvStage.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.actvStageContent[item] = this.person[item]
        })

        atribute = [];
        this.devStage.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.devStageContent[item] = this.person[item]
        })

        atribute = [];
        this.candidateStage.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.candidateContent[item] = this.person[item]
        })

        atribute = [];
        this.positiveStage.forEach(item=>{
            atribute.push(item.prop);
        })
        atribute.forEach(item=>{
            this.positiveContent[item] = this.person[item]
        })
        
        

    },

    data() {
        return {
            disabled:false,
            status:0,
            person: {},

            tableForm:'',
            tableDetail:'',//基本信息
            applyStage:'',//申请入党阶段
            actvStage:'',//入党积极分子的确定和培养阶段
            devStage:'',//发展对象的确定和考察阶段
            candidateStage:'',// 预备党员的接收阶段
            positiveStage:'',// 预备党员的教育考察和转正阶段

            detailContent:{},
            applyContent:{},
            actvStageContent:{},
            devStageContent:{},
            candidateContent:{},
            positiveContent:{}
        };
    },

    methods: {
        backToLogin(){
            // console.log('backToTable route',this.$route);
            this.$store.commit("closeCurrentTag", {
                $router: this.$router,
                $route: this.$route
            });
            this.$router.push({path:'/login'});
        },

    }
};
</script>
<style scoped>

 #header314{
    /* background-color: #B3C0D1; */
    /* color: #333; */
    text-align: center;
    line-height: 60px;
    height: 60px!important;


  }
.inforContainer{
    padding-bottom: 15px!important;
    border: 1px solid black;
    border-top: none;
}

.inforHead{
    margin:0px;
    height:40px!important;
    font-size:20px;
}

.tag{
    font-size:20px;
    padding:5px;
    height:100%
}


  .inforMain{
      padding: 4px 0 0 5px;
  }

  .image{
    margin: 0 auto;
    padding: 10px;
    width: 120px;
    height: 120px;
    outline: 1px solid yellow;
  }

  /* .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 160px; */
    /* outline: 1px solid blue;

  } */
</style>