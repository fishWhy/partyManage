<template>
    <div class="common-layout">>
        <el-container>
            <el-header id="header314">
                <span style="line-height:40px;font-family:'PingFang SC'">信息详情表</span>
                <div style="float:right;text-align:right;">
                    <el-button type="primary" size="small" style="margin-right:30px" @click="backToTable">返回</el-button>
                    <el-button type="success" size="small" @click="editData" v-if="status === 1">编辑</el-button>
                    <el-button type="success" size="small" @click="saveEdit">保存</el-button>
                </div>
            </el-header>

            <el-main style="margin:0px;padding-top:8px;">
                <div class="infor baseInfor">
                    <!-- 基本信息 -->
                    <el-container class="inforContainer" style="border-top: 1px solid black;">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;" >基本信息</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="tableDetail" :content="detailContent" :disabled="disabled" ref="tableDetail"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 申请入党阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">申请入党阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="applyStage" :content="applyContent" :disabled="disabled" ref="applyStage"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 入党积极分子的确定和培养阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">入党积极分子的确定和培养阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="actvStage" :content="actvStageContent" :disabled="disabled" ref="actvStage"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 发展对象的确定和考察阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">发展对象的确定和考察阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="devStage" :content="devStageContent" :disabled="disabled" ref="devStage"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 预备党员的接收阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">预备党员的接收阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="candidateStage" :content="candidateContent" :disabled="disabled" ref="candidateStage"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 预备党员的教育考察和转正阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">预备党员的教育考察和转正阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="positiveStage" :content="positiveContent" :disabled="disabled" ref="positiveStage"></table-detail>
                        </el-main>
                    </el-container>

                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import  tableDetail from "../components/tableDetail.vue"


import {tableForm} from "../api/formDate.js"
// dateTranfer

import {fetchDataByStuId,cInfor, addDate,isInDate} from "../api/index";
// addDate,cInfor,fetchData,

export default {
    name: "baseform",
    components:{
        TableDetail:tableDetail
    },
    actvStage(){
        console.log('actvStage')
    },
    unmounted(){
        console.log('destroyed baseForm.vue')
    },
    created(){
        console.log('here createBaseForm');
        if(this.$route.query.isDisabled==="false"){
            this.disabled = false;
            this.status = 2;//表示 添加用户的状态
        }else{
            this.disabled = true;
            this.status = 1;//表示 详情/修改的状态
        }

        this.person = fetchDataByStuId(this.$route.query.stuId);

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
            disabled:true,
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
                class:'1',//班级
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
        getDateFromTableForm(){
            return Object.assign({}, 
                this.$refs.tableDetail.getDate(),
                this.$refs.applyStage.getDate(),
                this.$refs.actvStage.getDate(),
                this.$refs.devStage.getDate(),
                this.$refs.candidateStage.getDate(),
                this.$refs.positiveStage.getDate()
                )
        },

        editData(){
            this.disabled= !this.disabled;
        },
        
        async saveEdit(){

            let nData, str = "";
            if(this.disabled){
                this.$message({
                            type:'warning',
                            message: "您当前处于未编辑状态，不能保存数据"
                    });
                return;
            }

            nData = this.getDateFromTableForm();
            str += this.checkTime(nData);


            //判断，申请入党时间 与 确定积极分子时间 相差6个月以上， 入党时间是否与 确定积极分子时间 相差6个月
            let applyTime = this.$refs.applyStage.getYMRDate('applyTime'); 
            let actvTime = this.$refs.actvStage.getYMRDate("actvTime");
            let jnTime = this.$refs.candidateStage.getYMRDate("jnTime");
            // console.log('applyTime:',applyTime);
            // console.log('actvTime:',actvTime);
            // console.log('jinTime:',jnTime);
            if(applyTime&&actvTime&&!this.isDateBigM(applyTime,actvTime,6)){
                str += '申请入党时间与确定积极分子时间必须相差<span style="color:red;">6个月以上</span>;'
                // this.$message({type:'error',message:'申请入党时间与确定积极分子时间必须相差6个月以上，请改正'});
                // return;
            }
            if(actvTime&&jnTime&&!this.isDateBigM(actvTime,jnTime,12)){
                str +='确定积极分子时间与入党时间必须相差<span style="color:red;">1年以上</span>';
                // this.$message({type:'error',message:'确定积极分子时间与入党时间必须相差1年以上，请改正'});
                // return;
            }



            try{
                await  this.$confirm(`确定要保存吗？红色表示时间顺序或间隔不正确${str}`, "提示", {
                            type: "warning",
                            dangerouslyUseHTMLString: true
                        });

                
                
                // console.log('nData',nData);
                if(!nData.stuId||!nData.name){
                    this.$message({type:'error',message:'学号与姓名必须添加'});
                    return;
                }

                //将数据提交给后台
                // this.person = nData;
                if(this.status===1){
                    await cInfor(nData);
                }else{
                    if(isInDate(nData.stuId)){
                        this.$message.error(`stuId为 ${nData.stuId} 的同学的信息已经存在，添加失败`);
                        return;
                    }
                    await addDate([nData]);
                }


                this.$message.success(`保存id为 ${nData.stuId} 的同学的信息成功`);
                
                this.$store.commit("closeCurrentTag", {
                    $router: this.$router,
                    $route: this.$route,
                    // toPath:'/home/table'
                });

            }catch(e){
                console.log(e);
                this.$message.error(`保存信息失败${e}`);
               

            }finally{
                 console.log('the edit data:',nData);
            }
        },

        // 检查表单中日期的前后关系是否正确，返回字符串，前后日期不正确的 会用<span style='color:red;'></span>标签包裹起来
        checkTime(_data){
            console.log('_data:',_data);
            // arrTime中对象属性的顺序表示了时间之间的前后关系。
            // 除了  外调材料日期 与 政审材料日期 这两个属性的日期可以是同一天，其他的均是后面属性的日期要在在前面属性的日期的后面
            let arrTime = {applyTime:'申请入党时间',talkTime:'谈心谈话时间',electLeagueTime:'团推优时间',
            actvTime:'确定积极分子时间', actvTrainTime:'积极分子培训时间',devTime:'确定发展对象时间',
            devTrainTime:'发展对象培训时间',extFileTime:'外调材料日期', polFileTime:'政审材料日期',
            hPartyPreCheckTime:'发展党员上级党委预审日期',pubTime:'公示日期',candidateTime:'拟发展时间',
            jnTime:'入党时间',aPartyCheckTime:'入党总支审查日期',hPartyTalkTime:'发展党员上级组织谈话日期',
            hPartyPassTime:'入党上级党委审批日期',confirmTime:'转正时间',partyConfirmTime:'转正总支审查日期',
            hPartyConfirmTime:'转正上级党委审批日期'};

            let keys = Object.keys(arrTime);
            let objWrong = {};
            keys.forEach(item=>{
                objWrong[item] = false;
            });

            for(let i=1;i<keys.length;i++){
                let key1 = keys[i-1], key2 = keys[i];
                let data1 = _data[key1], data2 = _data[key2];
                if(data1===""){
                    objWrong[key1] = true;
                }
                if(data2===""){
                    objWrong[key2] = true;
                }
                if(data1==="" || data2===""){
                    continue;
                }
                // console.log('data:',data1,data2);
                if((data1 instanceof Array) && data2 instanceof Array){
                    if(data1[1]>=data2[0]){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                    }
                }else if(data1 instanceof Array){
                    if(data1[1]>=data2){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                    }
                } else if(data2 instanceof Array){
                    if(data1>=data2[0]){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                    }
                }else if(key1 == 'extFileTime' && key2 =='polFileTime'){// 这两个日期之间可以相等
                    if(data1>data2){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                    }
                }else if(data1>=data2){
                        // console.log('key:',key1,key2);
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                }
            }

            let rn = "<br/>", redSpan = "<span style='color:red;'>", spanEnd = "</span>";

            for(let i=0;i<keys.length;i++){
                
                let strV = arrTime[keys[i]];
                
                if(objWrong[keys[i]]){
                    strV = redSpan +'' + strV +'' + spanEnd;
                    // console.log('strV',strV);
                }

                if(i<keys.length -1){
                    strV += "->";
                }

                rn += strV;

            }
            rn += "<br/>"
            console.log('checkTime:',rn);

            return rn;
        },

        backToTable(){
            // console.log('backToTable route',this.$route);
            this.$store.commit("closeCurrentTag", {
                $router: this.$router,
                $route: this.$route
            });
            // this.$router.push({path:'/home/table'});
        },

        isDateBigM(time1,time2, m){
            if(!time1||!time2|| !(time1 instanceof Date)||!(time1 instanceof Date)) return false;
            
            var diffyear = time2.getFullYear() - time1.getFullYear() ;
            var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth() ;
            var diffDay = time2.getDate() - time1.getDate() ;
            // if(diffmonth < 0 ){
            //     return false ;
            // }else if(diffmonth < m || (diffmonth == m && diffDay <= 0)){
            //     return false;
            // }
            console.log('differTime:', diffmonth,diffDay);
            if(diffmonth>m || diffmonth==m && diffDay>0){
                console.log('1')
                return true;
            }else {
                console.log('2')
                return false;
            }
            // return true;
        }

    }
};
</script>
<style scoped>

 #header314{
    /* background-color: #B3C0D1; */
    /* color: #333; */
    text-align: center;
    line-height: 40px;
    height: 40px!important;


  }
.inforContainer{
    padding-bottom: 15px!important;
    border: 1px solid black;
    border-top: none;
}

  .inforHead{
      margin:0px;
      height:30px!important;
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