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


import {tableForm} from "../api/formDate.js"
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

        console.log('here get person:',this.person)

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
            person: {
                stuId:"1871232",//学号
                name:'孙亮',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'1995-01-02',//出生日期
                grade:'1',//年级
                tclass:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片

                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号


                // 申请入党阶段
                applyTime:'2019-09-20',//申请入党时间
                talkTime:'2019-10-05',//谈心谈话时间

                //入党积极分子的确定和培养阶段
                electLeagueTime:'2019-10-25',//团推优时间
                actvTime:'2020-05-1',//确定积极分子时间
                actvTrainTime:'2020-07-08',//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况

                //发展对象的确定和考察阶段
                devTime:'2020-12-01',//确定发展对象时间
                devTrainTime:['2020-07-08','2020-08-01'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'2021-04-12',//外调材料日期
                polFileTime:'2021-04-12',//政审材料日期
                candidateTime:'2021-04-02',//拟发展时间
                hPartyPreCheckTime:'2021-04-18',//发展党员上级党委预审日期
                pubTime:'2021-05-01',//公示日期

                // 预备党员的接收阶段
                jnTime:'2021-05-02',//入党时间
                aPartyCheckTime:'2021-05-03',//入党总支审查日期
                hPartyTalkTime:'2021-05-04',//发展党员上级组织谈话日期
                hPartyPassTime:'2021-05-05',//入党上级党委审批日期


                // 预备党员的教育考察和转正阶段
                confirmTime:'2021-05-06',//转正时间
                partyConfirmTime:'2021-05-06',//转正总支审查日期
                hPartyConfirmTime:'2021-05-07',//转正上级党委审批日期
                delayReadyTime:'2021-05-08',//延长预备期日期
                delayCheckTime:'2021-05-08',//延长预备期总支审查日期
                delayConfirmTime:'2021-05-12',//延长预备期党委审批日期


                note:'信息好多，代码好长',//备注
            },

            tableDetail:tableForm.tableDetail,//基本信息
            applyStage:tableForm.applyStage,//申请入党阶段
            actvStage:tableForm.actvStage,//入党积极分子的确定和培养阶段
            devStage:tableForm.devStage,//发展对象的确定和考察阶段
            candidateStage:tableForm.candidateStage,// 预备党员的接收阶段
            positiveStage:tableForm.positiveStage,// 预备党员的教育考察和转正阶段


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