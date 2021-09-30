let formDate = {
    gender:{0:'全部',1:'男',2:'女'},
    national:{0:"全部",1:"汉族",2:"蒙古族",3:"回族",4:"藏族",5:"维吾尔族",6:"苗族",7:"彝族",8:"壮族",9:"布依族",10:"朝鲜族",11:"满族",12:"侗族",13:"瑶族",14:"白族",15:"土家族",16:"哈尼族",17:"哈萨克族",18:"傣族",19:"黎族",20:"傈僳族",21:"佤族",22:"畲族",23:"高山族",24:"拉祜族",25:"水族",26:"东乡族",27:"纳西族",28:"景颇族",29:"柯尔克孜族",30:"土族",31:"达斡尔族",32:"仫佬族",33:"羌族",34:"布朗族",35:"撒拉族",36:"毛难族",37:"仡佬族",38:"锡伯族",39:"阿昌族",40:"普米族",41:"塔吉克族",42:"怒族",43:"乌孜别克族",44:"俄罗斯族",45:"鄂温克族",46:"德昂族",47:"保安族",48:"裕固族",49:"京族",50:"塔塔尔族",51:"独龙族",52:"鄂伦春族",53:"赫哲族",54:"门巴族",55:"珞巴族",56:"基诺族",99:"其他"},
    branch:{0:'全部'},
    addParty:{0:'全部',1:'新发展',2:'自本地(市、州、盟、区)直属的其他单位转入)',3:'自本省(区、市)内的其他地(市、州、盟、区)转入',4:'自本省(区、市)直属的其他单位转入',5:'自本系统内的其他单位转入',6:'自外省(区、市)转入',7:'其他'},
    proED:{0:'全部',1:'本科',2:'硕士研究生',3:'博士研究生',4:'其他'},
    stage:{0:'全部',1:'申请入党',2:'入党积极分子',3:'发展对象',4:'预备党员',5:'正式党员',"-1":'其他'},
    isApplay:{0:'全部',1:'是',2:'否'},
    actvTrainResult:{0:'全部',1:'通过',2:'不通过'},
    devTrainResult:{0:'全部',1:'通过',2:'不通过'},
    partyDuty:{0:'全部',1:'普通党员',2:'宣传委员',3:'组织委员',4:'党支部书记',"-1":'其他'},
    stuState:{0:'全部',1:'在读',3:'降级',4:'休学',5:'退学',2:'已毕业',}
}

// 将下拉框选项的数据转成要显示的样式即转成1,2,3
formDate.tranferToKey = function(item, val ){
    if(this[item]){
        for(let key  in this[item]){
            if(this[item][key]==val){
                return key;
            }
        }
        return val;
    }else{
        return val;
    }
}

formDate.tranferToValue = function(item, key){
    if(this[item]){
        for(let k in this[item]){
            if(key == k ){
                return this[item][k]
            }
        }
        return key;
    }else{
        return key;
    }
}

formDate.setNewItemInFormDate = function(itemName, dataArray){
    if(Array.isArray(dataArray)){
        let itemObj = {};
        itemObj['0'] = '全部';
        let k = 1;
        for(let item of dataArray){
            if(item!=null && item!='_$' && item!='null' && item!='undefined' && item!='NaN'){
                if(itemName=='branches' && (item.indexOf('支部')!=-1) ){continue;}// 如果不是以 支部 结尾就不用插入了
                itemObj[k +''] = item;
                k++;
            }
        }
        this[itemName] = itemObj;
    }
}




function inFormToNone(obj){
    Object.keys(formDate).forEach(item=>{
        if(obj[item]==='0'){
            obj[item]='';
        }
    })

}




//这里options设为空数组，是为了方便更改数据，下面会调用函数填上它们应有的值
let baseForm = [
    {label:'学号',prop:'stuId',type:'Input'},
    {label:'姓名',prop:'name',type:'Input'},
    {label:'性别',prop:'gender',type:'Select',options:[]},
    {label:'民族',prop:'national',type:'Select',options:[]},
    {label:'学历',prop:'proED',type:'Select',options:[]},
    {label:'年级',prop:'grade',type:'Input'},
    {label:'专业',prop:'major',type:'Input'},
    {label:'班级',prop:'tclass',type:'Input'},
    {label:'导师',prop:'tutor',type:'Input'},
    {label:'所处阶段',prop:'stage',type:'Select',options:[]},
    {label:'学籍状态',prop:'stuState',type:'Select',options:[]},
    {label:'支部',prop:'branch',type:'Select',options:[],styleObj:{'width':'250px'}},

];

let applyForm = [
    {label:'是否提交申请书',prop:'isApplay',type:'Select',options:[]},
];

let activistForm = [
    {label:'确定积极分子时间',prop:'actvTime',type:'YMArea'},
    {label:'积极分子培训班时间',prop:'actvTrainTime',type:'YMArea'},
    {label:'培训班结业情况',prop:'actvTrainResult',type:'Select',options:[]},
];
let developForm = [
    {label:'确定发展对象时间',prop:'devTime',type:'YMArea'},
    {label:'拟发展时间',prop:'candidateTime',type:'YMArea'},
    // {label:'发展对象培训时间',prop:'devTrainTime',type:'YMArea'},
    {label:'培训班结业情况',prop:'devTrainResult',type:'Select',options:[]},                
];
let candidateForm = [
    {label:'入党时间',prop:'jnTime',type:'YMArea'},
];
let partyForm = [
    {label:'转正时间',prop:'confirmTime',type:'YMArea'},
];




//基本信息
let tableDetail = [
    {label:'姓名',prop:'name',type:'Input'},
    {label:'性别',prop:'gender',type:'Select',options:[]},
    {label:'出生日期',prop:'birthday',type:'YMR'},
    {label:'民族',prop:'national',type:'Select',options:[]},
    {label:'籍贯',prop:'home',type:'pcc'},
    {label:'身份证',prop:'idCard',type:'Input',styleObj:{'width':'300px!important;'}},
    {label:'学号',prop:'stuId',type:'Input'},
    {label:'联系方式',prop:'phone',type:'Input'},
    {label:'学历',prop:'proED',type:'Select',options:[]},
    {label:'年级',prop:'grade',type:'Input'},
    {label:'专业',prop:'major',type:'Input'},
    {label:'班级',prop:'tclass',type:'Input'},
    {label:'寝室',prop:'bedroom',type:'Input'},
    {label:'学籍状态',prop:'stuState',type:'Select',options:[]},


    {label:'导师',prop:'tutor',type:'Input'},
    {label:'党员增加时间',prop:'jnPartyTime',type:'YMR'},




    {label:'职务',prop:'duty',type:'Input'},
    {label:'党员增加',prop:'addParty',type:'Select',options:[],styleObj:{'width':'340px'}},



    {label:'个人荣誉',prop:'honour',type:'textarea'},
    {label:'备注',prop:'note',type:'textarea'},


];
//申请入党阶段
let applyStage = [

    {label:'申请入党时间',prop:'applyTime',type:'YMR'},
    {label:'谈心谈话党时间',prop:'talkTime',type:'YMR'},

    {type:'br'},
    {label:'所处阶段',prop:'stage',type:'Select',options:[]},
    {label:'党内职务',prop:'partyDuty',type:'Select',options:[]},
    {label:'所在支部',prop:'branch',type:'Select',options:[],styleObj:{'width':'300px'}},

];
//入党积极分子的确定和培养阶段
let actvStage = [
    {label:'团推优时间',prop:'electLeagueTime',type:'YMR'},
    {label:'确定积极分子时间',prop:'actvTime',type:'YMR'},
    {label:'培养联系人(2人)',prop:'pTeacher',type:'Input'},
    {label:'积极分子培训时间',prop:'actvTrainTime',type:'YMDArea'},
    {label:'培训班结业情况',prop:'actvTrainResult',type:'Select',options:[]},

];
//发展对象的确定和考察阶段
let devStage = [
    {label:'确定发展对象时间',prop:'devTime',type:'YMR'},
    {label:'业务课排名',prop:'classRank',type:'Input'},

    {label:'发展对象培训时间',prop:'devTrainTime',type:'YMDArea'},  
    {label:'培训班结业情况',prop:'devTrainResult',type:'Select',options:[]},                
    {label:'外调材料日期',prop:'extFileTime',type:'YMR'},
    {label:'政审材料日期',prop:'polFileTime',type:'YMR'},
    {label:'发展党员上级党委预审日期',prop:'hPartyPreCheckTime',type:'YMR'},
    {label:'公示日期',prop:'pubTime',type:'YMDArea'},
    {label:'拟发展时间',prop:'candidateTime',type:'YM'},

];
// 预备党员的接收阶段
let candidateStage = [
    {label:'入党介绍人（2人）',prop:'leader',type:'Input'},
    {label:'入党志愿书编号',prop:'applyFileNumber',type:'Input'},
    {label:'入党时间',prop:'jnTime',type:'YMR'},
    {label:'发展党员上级组织谈话日期',prop:'hPartyTalkTime',type:'YMR'},
    {label:'入党总支审查日期',prop:'aPartyCheckTime',type:'YMR'},
    {label:'入党上级党委审批日期',prop:'hPartyPassTime',type:'YMR'},

];
// 预备党员的教育考察和转正阶段`
let positiveStage = [
    {label:'转正申请书时间',prop:'letterTime',type:'YMR'},
    {label:'转正时间',prop:'confirmTime',type:'YMR'},
    {label:'转正总支审查日期',prop:'partyConfirmTime',type:'YMR'},
    {label:'转正上级党委审批日期',prop:'hPartyConfirmTime',type:'YMR'},
    {type:'br'},
    {label:'延长预备期日期',prop:'delayReadyTime',type:'YMR'},
    {label:'延长预备期总支审查日期',prop:'delayCheckTime',type:'YMR'},
    {label:'延长预备期党委审批日期',prop:'delayConfirmTime',type:'YMR'},
];

//详情页面的表单
let tableForm = {
    tableDetail:tableDetail,//基本信息
    applyStage:applyStage,//申请入党阶段
    actvStage:actvStage,//入党积极分子的确定和培养阶段
    devStage:devStage,//发展对象的确定和考察阶段
    candidateStage:candidateStage,// 预备党员的接收阶段
    positiveStage:positiveStage,// 预备党员的教育考察和转正阶段

}



//主页面的搜索的表单
let formList = {
    baseForm: baseForm,
    applyForm: applyForm,
    activistForm: activistForm,
    developForm: developForm,
    candidateForm: candidateForm,
    partyForm:partyForm
}
function setOptionsToFormDate(arr,type=0){
    for(let j=0;j<arr.length;j++){
        let item = arr[j];
        let options = [];
        let prop = item['prop'];
        if(item['type']==='Select'&&formDate[prop]){
            let keys = Object.keys(formDate[prop]);
            let i = 0;
            if(type===1) i=1;
            for(;i<keys.length;i++){
                let optionsObj = {}, k = keys[i];
                optionsObj['value'] = k;
                optionsObj['label'] = formDate[prop][k];
                options.push(optionsObj);
            }
            arr[j].options = options;
        }
    }   
}
function setFormDateOptions(list,type=0){
    let keys = Object.keys(list);
    for(let i=0;i<keys.length;i++){
        setOptionsToFormDate(list[keys[i]],type); 
    }
}


function getFormList(){
    setFormDateOptions(formList);
    return formList;
}

function getTableForm(){
    setFormDateOptions(tableForm,1);
    return tableForm;
}




var listMap = {
    stage:'所处阶段',//所处阶段
    stuId:"学号",
    name:'姓名',
    gender:'性别',
    national:'民族',
    home:"籍贯",
    birthday:'出生日期',//出生日期
    idCard:'身份证',
    branch:'所在支部',//所在支部
    proED:'学历',//学历
    grade:'年级',//年级
    tclass:'班级',//班级
    major:'专业',//专业
    classRank:'业务课排名',//业务课排名
    duty:'职务',//职务
    partyDuty:'党内职务',//党内职务
    honour:'个人荣誉',//个人荣誉
    phone:'联系方式',
    bedroom:'寝室',//寝室
    tutor:'导师',//导师
    stuState:'学籍状态',//学籍状态


    applyTime:'申请入党时间',//申请入党时间
    talkTime:'谈心谈话时间',//谈心谈话时间
    electLeagueTime:'团推优时间',//团推优时间
    actvTime:'确定积极分子时间',//确定积极分子时间
    actvTrainTime:'积极分子培训时间',//积极分子培训时间
    actvTrainResult:'积极分子培训班结业情况',//积极分子培训班结业情况
    pTeacher:'培养联系人',//培养联系人


    devTime:'确定发展对象时间',//确定发展对象时间
    devTrainTime:'发展对象培训时间',//发展对象培训时间
    devTrainResult:'发展对象培训班结业情况',//发展对象培训班结业情况
    extFileTime:'外调材料日期',//外调材料日期
    polFileTime:'政审材料日期',//政审材料日期
    candidateTime:'拟发展时间',//拟发展时间
    hPartyPreCheckTime:'发展党员上级党委预审日期',//发展党员上级党委预审日期
    pubTime:'公示日期',//公示日期

    leader:'入党介绍人',//入党介绍人
    jnTime:'入党时间',//入党时间
    aPartyCheckTime:'入党总支审查日期',//入党总支审查日期
    hPartyTalkTime:'发展党员上级组织谈话日期',//发展党员上级组织谈话日期
    hPartyPassTime:'入党上级党委审批日期',//入党上级党委审批日期
    applyFileNumber:'入党志愿书编号',//入党志愿书编号
    confirmTime:'转正时间',//转正时间

    letterTime:'转正申请书时间',//转正申请书时间
    partyConfirmTime:'转正总支审查日期',//转正总支审查日期
    hPartyConfirmTime:'转正上级党委审批日期',//转正上级党委审批日期
    delayReadyTime:'延长预备期日期',//延长预备期日期
    delayCheckTime:'延长预备期总支审查日期',//延长预备期总支审查日期
    delayConfirmTime:'延长预备期党委审批日期',//延长预备期党委审批日期
    addParty:'党员增加',//党员增加
    jnPartyTime:'党员增加时间',//党员增加时间
    note:'备注',//


    // 申请入党阶段
    //入党积极分子的确定和培养阶段
    
    //发展对象的确定和考察阶段
    
    // 预备党员的接收阶段
  
    // 预备党员的教育考察和转正阶段

};



export {getFormList,getTableForm,inFormToNone,listMap,formDate}
