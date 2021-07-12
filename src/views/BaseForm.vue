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
                            <table-detail  :formObj="tableDetail" :content="detailContent" :disabled="status==2?false:true" ref="tableDetail" @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 申请入党阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">申请入党阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="applyStage" :content="applyContent" :disabled="disabled" ref="applyStage"  @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 入党积极分子的确定和培养阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">入党积极分子的确定和培养阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="actvStage" :content="actvStageContent" :disabled="disabled" ref="actvStage"  @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 发展对象的确定和考察阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">发展对象的确定和考察阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="devStage" :content="devStageContent" :disabled="disabled" ref="devStage"  @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 预备党员的接收阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">预备党员的接收阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="candidateStage" :content="candidateContent" :disabled="disabled" ref="candidateStage"  @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                    <!-- 预备党员的教育考察和转正阶段 -->
                    <el-container class="inforContainer">
                        <el-header width="80px" class="inforHead"><el-tag type="success" style="font-size:14px;">预备党员的教育考察和转正阶段</el-tag></el-header>
                        <el-main class="inforMain">
                            <table-detail  :formObj="positiveStage" :content="positiveContent" :disabled="disabled" ref="positiveStage"  @changeDate="markLabel"></table-detail>
                        </el-main>
                    </el-container>

                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import  tableDetail from "../components/tableDetail.vue"


import {getTableForm} from "../api/formDate.js"
// dateTranfer

import {fetchDataByStuId,cInfor, addDate,isInDate} from "../api/index";
// addDate,cInfor,fetchData,
// import {}

export default {
    name: "baseform",
    components:{
        TableDetail:tableDetail
    },
    // actvStage(){
    //     console.log('actvStage')
    // },
    unmounted(){
        console.log('destroy:',this.path);
        // this.person = {};

    },
    activated(){
        console.log('baseForm activated')
    },
    computed:{
        //时刻监听，当前要关闭的页面是否有当前页面
        delTags(){
            for(let i=0;i<this.$store.state.delTags.length;i++){
                if(this.$store.state.delTags[i].path === this.path){
                    return true;
                }
            }
            return false;
        }
    },
    watch:{
        
        delTags(newValue){
            // console.log('outside delTags',newValue,this.path);
            if(newValue){
               this.resetData();
               console.log('store:',this.$store);
               //一定要记住在重置数据后，在store.state.dleDeTags中去除一下 this.path
               this.$store.commit("delDelTags",{path:this.path});
            }
        },
        redLabel(newValue){
            let item="";
            // console.log('redLabel',newValue);
            for(let i=0;i<this.tableDetail.length;i++){
                item = this.tableDetail[i];
                if(newValue[item.prop]){
                    this.tableDetail[i].redLabel = true;
                }else{
                    this.tableDetail[i].redLabel = false;
                }
            }

            for(let i=0;i<this.applyStage.length;i++){
                item = this.applyStage[i];
                if(newValue[item.prop]){
                    this.applyStage[i].redLabel = true;
                }else{
                    this.applyStage[i].redLabel = false;
                }
            }

            for(let i=0;i<this.actvStage.length;i++){
                item = this.actvStage[i];
                if(newValue[item.prop]){
                    this.actvStage[i].redLabel = true;
                }else{
                    this.actvStage[i].redLabel = false;
                }
            }

            for(let i=0;i<this.devStage.length;i++){
                item = this.devStage[i];
                if(newValue[item.prop]){
                    this.devStage[i].redLabel = true;
                }else{
                    this.devStage[i].redLabel = false;
                }
            }
            for(let i=0;i<this.candidateStage.length;i++){
                item = this.candidateStage[i];
                if(newValue[item.prop]){
                    this.candidateStage[i].redLabel = true;
                }else{
                    this.candidateStage[i].redLabel = false;
                }
            }
            for(let i=0;i<this.positiveStage.length;i++){
                item = this.positiveStage[i];
                if(newValue[item.prop]){
                    this.positiveStage[i].redLabel = true;
                }else{
                    this.positiveStage[i].redLabel = false;
                }
            }


        }
    },
    created(){
        console.log('this:',this);
        // console.log('here createBaseForm');
        this.path = this.$route.fullPath;
        console.log('create:',this.path);
        // console.log('creat baseForm router:',this.$route)
        if(this.$route.query.isDisabled==="false"){
            this.disabled = false;
            this.status = 2;//表示 添加用户的状态
            this.person = {};
        }else{
            this.disabled = true;
            this.status = 1;//表示 详情/修改的状态
            this.stuId = this.$route.query.stuId;
            this.person = fetchDataByStuId(this.stuId);
            console.log('person:',this.person);
        }

        console.log('here get person:',this.person)

        this.tableForm = getTableForm();
        console.log('tableForm:',this.tableForm)
        this.tableDetail = JSON.parse(JSON.stringify(this.tableForm.tableDetail)) ;//基本信息
        this.applyStage = JSON.parse(JSON.stringify(this.tableForm.applyStage));//申请入党阶段
        this.actvStage = JSON.parse(JSON.stringify(this.tableForm.actvStage));//入党积极分子的确定和培养阶段
        this.devStage = JSON.parse(JSON.stringify(this.tableForm.devStage));//发展对象的确定和考察阶段
        this.candidateStage = JSON.parse(JSON.stringify(this.tableForm.candidateStage));// 预备党员的接收阶段
        this.positiveStage = JSON.parse(JSON.stringify(this.tableForm.positiveStage));// 预备党员的教育考察和转正阶段

        this.setFormData();

        // this.markLabel();
        
        
    },
    mounted(){
        console.log('mounted');
        this.markLabel();
    },

    data() {
        return {
            stuId:'',
            redLabel:{},
            path:'',
            disabled:true,
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
        setFormData(){
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
        resetData(){
            if(this.status == 2){
                console.log('BaseForm:resetData at addStatus')
                this.person = {};
                this.disabled = false;
                this.detailContent = {};
                this.applyContent = {};
                this.actvStageContent = {};
                this.devStageContent = {};
                this.candidateContent = {};
                this.positiveContent = {};

            }else if(this.status==1){
                console.log('BaseForm:resetData at editStatus')
                this.person = fetchDataByStuId(this.stuId);
                console.log('the person at editStatus:',this.person)
                this.setFormData();
            }

            this.$nextTick(()=>{
                this.markLabel();
            })
           
        },
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


            try{
                await this.$confirm(`确定要保存吗？红色表示时间顺序或间隔不正确${str}`, "提示", {
                        type: "warning",
                        dangerouslyUseHTMLString: true
                });

                
                // console.log('nData',nData);
                if(!nData.stuId||!nData.name||!nData.birthday){
                    this.$message({type:'error',message:'学号、姓名、出生日期必须添加'});
                    return;
                }
                if(this.redLabel.birthday){
                    this.$message({type:'error',message:'申请入党时必须在18周岁以上'});
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
                this.resetData();
                
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
            // console.log('_data:',_data);

            // 检查时间顺序是否正确
            // arrTime中对象属性的顺序表示了时间之间的前后关系。
            // 除了  外调材料日期 与 政审材料日期 这两个属性的日期可以是同一天，其他的均是后面属性的日期要在在前面属性的日期的后面
            let arrTime = {applyTime:'申请入党时间',talkTime:'谈心谈话时间',electLeagueTime:'团推优时间',
            actvTime:'确定积极分子时间', actvTrainTime:'积极分子培训时间',devTime:'确定发展对象时间',
            devTrainTime:'发展对象培训时间',

            extFileTime:'外调材料日期', polFileTime:'政审材料日期',
            hPartyPreCheckTime:'发展党员上级党委预审日期',pubTime:'公示日期',
            
            candidateTime:'拟发展时间',

            jnTime:'入党时间',
            hPartyTalkTime:'发展党员上级组织谈话日期',
            aPartyCheckTime:'入党总支审查日期',
            hPartyPassTime:'入党上级党委审批日期',


             letterTime:'转正申请书时间',            
            confirmTime:'转正时间',partyConfirmTime:'转正总支审查日期',
            hPartyConfirmTime:'转正上级党委审批日期'};

            let keys = Object.keys(arrTime);
            let objWrong = {};
            this.redLabel = {};
            keys.forEach(item=>{
                objWrong[item] = false;
                this.redLabel[item] = false;
            });
            // 检查时间间隔是否正确
            this.redLabel.applyTime = false;
            this.redLabel.actvTime = false;
            this.redLabel.devTime = false;
            this.redLabel.jnTime = false;


            for(let i=1;i<keys.length;i++){
                let key1 = keys[i-1], key2 = keys[i];
                let data1 = _data[key1], data2 = _data[key2];
                if(data1===""){
                    objWrong[key1] = true;
                    this.redLabel[key1] = true;
                }
                if(data2===""){
                    objWrong[key2] = true;
                    this.redLabel[key1] = true;
                }
                if(data1==="" || data2===""){
                    continue;
                }

                // 入党时间要在公示时间之后，由于这两个时间并不是前后关系，所以这里要特殊处理一下
                if(key2=='jnTime'){
                    // console.log('jnTime:',_data['pubTime'][1],data2)
                    if(_data['pubTime'][1]>data2){
                        objWrong['pubTime'] = true;
                        objWrong[key2] = true;
                        this.redLabel['pubTime'] = true;
                        this.redLabel[key2] = true;
                    }
                }

                // 由于 拟发展时间是 年月的型式，因此这里需要特别处理一下，判断其与它前后时间的关系
                if(key1=='candidateTime'){
                    // console.log('candidateTime',data1,data2);
                    if(data1+'00'>data2){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                    continue;
                }
                if(key2 == 'candidateTime'){
                    // console.log('candidateTime',data1,data2);
                    if(data1[1]>data2+'32'){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                    continue;
                }
                // console.log('data:',data1,data2);
                if((data1 instanceof Array) && data2 instanceof Array){
                    if(data1[1]>=data2[0]){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                }else if(data1 instanceof Array){
                    if(data1[1]>=data2){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                } else if(data2 instanceof Array){
                    if(data1>=data2[0]){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                }else if(key1 == 'extFileTime' && key2 =='polFileTime'){// 这两个日期之间可以相等
                    if(data1>data2){
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
                    }
                }else if(data1>=data2){
                        // console.log('key:',key1,key2);
                        objWrong[key1] = true;
                        objWrong[key2] = true;
                        this.redLabel[key1] = true;
                        this.redLabel[key2] = true;
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

            
            //判断，申请入党时间 与 确定积极分子时间 相差6个月以上，确定积极分子时间与确定发展对象时间相差1年, 入党时间与确定发展对象时间 相差1年
            let applyTime = this.$refs.applyStage.getYMRDate('applyTime'); 
            let actvTime = this.$refs.actvStage.getYMRDate("actvTime");
            let devTime = this.$refs.devStage.getYMRDate('devTime');

            
            let jnTime = this.$refs.candidateStage.getYMRDate("jnTime");
            let letterTime = this.$refs.positiveStage.getYMRDate("letterTime");



            if(applyTime&&actvTime&&!this.isDateBigM(applyTime,actvTime,6)){
                rn += '确定积极分子时间需要在申请入党时间<span style="color:red;">6个月之后</span>;'
                this.redLabel.applyTime = true;
                this.redLabel.actvTime = true;
                // this.$message({type:'error',message:'申请入党时间与确定积极分子时间必须相差6个月以上，请改正'});
                // return;
            }
            if(actvTime&&devTime&&!this.isDateBigM(actvTime,devTime,12)){
                rn +='确定发展对象时间需要在确定积极分子时间<span style="color:red;">1年之后</span>;';
                this.redLabel.actvTime = true;
                this.redLabel.devTime = true;
                // this.$message({type:'error',message:'确定积极分子时间与确定发展对象时间必须相差1年以上，请改正'});
                // return;
            }
            if(jnTime&&letterTime&&!this.isDateBigM(jnTime,letterTime,12)){
                this.redLabel.devTime = true;
                this.redLabel.jnTime = true;
                rn +='转正申请书时间需要在入党时间<span style="color:red;">1年之后</span><br/>';
                // this.$message({type:'error',message:'确定发展对象时间与入党时间必须相差1年以上，请改正'});
                // return;
            }

            // 判断申请入党时间与生日之间是否大于18年，也就是必须18周岁以上申请入党
            this.redLabel.birthday = false;
            let birthDay = this.$refs.tableDetail.getYMRDate('birthday');
            if(birthDay&&applyTime&&!this.isDateBigM(birthDay,applyTime,12*18)){
                this.redLabel.applyTime = true;
                this.redLabel.birthday = true;
                rn +='申请入党时必须在<span style="color:red;">18周岁以上,否则不会保存</span><br/>';
            }

            // 检查学号、姓名、生日、申请入党时间不为空
            this.redLabel.stuId = false;
            if(!_data.stuId){this.redLabel.stuId = true;}
            this.redLabel.name = false;
            if(!_data.name){this.redLabel.name = true;}
            if(!_data.birthday){this.redLabel.birthday = true;}


            return rn;
        },

        backToTable(){
            // console.log('backToTable route',this.$route);
            this.$store.commit("closeCurrentTag", {
                $router: this.$router,
                $route: this.$route
            });
            this.resetData();
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
            // console.log('differTime:', diffmonth,diffDay);
            if(diffmonth>m || diffmonth==m && diffDay>0){
                // console.log('1')
                return true;
            }else {
                // console.log('2')
                return false;
            }
            // return true;
        },
        markLabel(){
            let nData = this.getDateFromTableForm();
            this.checkTime(nData);
            // console.log('labelRed:',this.redLabel);
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