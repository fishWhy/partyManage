import request from '../utils/request';
import { downLoadExcel,importfxx} from "../utils/excel/upDownExcel.js";
import {ptdToAddress,dateTranfer,addressToPtd,dateBack,insertFormDate} from './formDate.js';





/**
 * 
 * @param {请求时的路径} urlL 
 * @param {请求时的参数} query 
 * @param {请求方式，有get,push,post,delete} rqType 
 * @returns 
 */
const requestData = (urlL,query, rqType = 'post') => {
    console.log(urlL,rqType,query);
    // let list = 

   

    return request({
        url: urlL,
        method: rqType,
        data: JSON.parse(JSON.stringify(query))
    });
};





//返回处理数据的函数数组，数据以闭包的型式保存。
let dataFun = (function(){
   
    function getStartDataFromBackend(obj){
        let param = {};
        param.userName = obj.userName;
        param.password = obj.password;
        return requestData('/login',param,'post').then((item)=>{
            console.log('login item:',item);
            data.branchs = item.data.branches;
            console.log('branch:',item.data.brList)
            item.data.brList[0] = "全部";
            insertFormDate('branch',item.data.brList);

            localStorage.setItem("token", item.data.token);
            localStorage.setItem("stuId", item.data.user.stu_id);

            // 将数据格式转变成前端需要的格式
            let list = JSON.parse(JSON.stringify(item.data.infos.slice(0)));
            let it;
            //把list中的actvTrainTime，devTrainTime，pubTime转成数组
            for(let i=0;i<list.length;i++){
                it = list[i];
                for(let k in it){
                    if(Object.prototype.hasOwnProperty.call(it,k)){
                        if(k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'){
                            if(it[k].length>0){
                                it[k] = it[k].split(',');
                            }
                        }else if(k==="home"){
                            it[k] = it[k].split(',');
                        }
                    }
                }
            }
            //将获取的数据存储在data.list
            data.list = list;
            console.log('get Data from:',data.list);
            return item.data.duty;
        });
    }
    function changePsw(obj){
        let psObj = {};
        psObj.userId = obj.userName;
        psObj.oldPassword = obj.password;
        psObj.newPassword = obj.nPassword; 

        return requestData('/user/password',psObj,'post').then((item)=>{
            console.log('changePassword:',item);
            if(item.code==200){
                return true;
            }else{
                return false;
            }
        },()=>{
            return false;
        })
    }

    //数组去重,排在后面的元素会完全替代排在前面的拥有相同stuId的元素
    function arrUni(arr){
        if(!arr||arr.length===0) return [];

        for(let i=arr.length-1;i>0;i--){
            let val = arr[i];
            for(let j=i-1;j>=0;j--){
                if(val.stuId+''===arr[j].stuId+''){
                    arr[j] = val;
                    arr.splice(i,1);
                    break;
                }
            }
        }
        return arr;
    }

    //数组属性, 排在后面的元素的属性如果不为空，则会替代排在前面的拥有相同stuId的元素的属性。
    // 如果排在前面的元素的属性为空，则不会改变排在后面的拥有相同stuId的元素的属性。
    // 更新完成后，，排在后面的这个元素被丢弃。
    function arrAttrUni(arr){
        if(!arr||arr.length===0) return [];

        let valKeys = Object.keys(arr[0])

        for(let i=arr.length-1;i>0;i--){
            let val = arr[i];
            for(let j=i-1;j>=0;j--){
                if(val.stuId+''===arr[j].stuId+''){
                    valKeys.forEach(item=>{
                        // 如果val的属性值不为空，就用这个值更新arr[j]的相同属性
                        if(val[item]){
                            arr[j][item] = val[item];
                        }
                    });
                    arr.splice(i,1);
                    break;
                }
            }
        }
        return arr;
    }

    


    //增
    // 将传入的数组dataItem添加到数据的结尾,在添加的过程中去重并跟新原先的值
    function addDate(dataArr){
        return new Promise(function(resolve,reject){
            // 注意，dataArr是前端要显示的数据，list是要传给后端的数据，它们是不一样的
            dataArr =  arrAttrUni(dataArr);
            let list = transToBackEnd(dataArr);
            console.log('dataArr:',dataArr);
            console.log('list:',list);
            

            requestData('/updateAll',list,'post').then((item)=>{
                console.log("updateAll item:",item)
                //删除返回的代表不被允许（周岁小于18岁）添加进数据库的failedList数组中的stuId，
                let failArr = {};
                item.failedList.forEach(v=>{
                    failArr[v] = true;
                });
                for(let i= dataArr.length - 1;i>=0;i--){
                    if(failArr[dataArr[i].stuId]){
                        dataArr.splice(i,1);
                    }
                }

                data.list = data.list.concat(dataArr);
                data.list = arrAttrUni(data.list);
                // console.log('data_list:',data.list);
                resolve('202');
            },item=>{
                reject(item);
            });      
        })
    }
     

    //删
    //删除stuId为stuId的那条数据
    function deltDate(stuIdArr){
        return new Promise(function(resolve,reject){
            // console.log('istuIdArr:',stuIdArr);
            if(!(stuIdArr instanceof Array)||stuIdArr.length<=0) {reject('删除数据失败');return;}
            let stuIdObj = {};
            // len = stuIddArr.length
            for (let j = 0; j < stuIdArr.length; j++) {
                stuIdObj[stuIdArr[j]] = true;
            }

            requestData('/deleteInfos',stuIdArr,'post').then((item)=>{
                console.log("deleteInfos item:",item)
                for(let i=data.list.length-1;i>=0;i--){
                    if(stuIdObj[data.list[i].stuId]){
                        data.list.splice(i,1);
                        // len--;
                    } 
                }
                resolve('成功删除')
            },item=>{
                reject(item);
            });

        })
        
    }

    // 将数据格式转变成后端需要的格式
    function transToBackEnd(dataArr){
        let list = JSON.parse(JSON.stringify(dataArr));
        let item;
        //把list中的每一项转换成字符串
        for(let i=0;i<list.length;i++){
            item = list[i];
            for(let k in item){
                if(Object.prototype.hasOwnProperty.call(item,k)){
                    if(k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'){
                        if(item[k] instanceof Array){
                            item[k] = item[k].join(',');
                        }else{
                            item[k] = '';
                        }

                    } else if(k==='home'&&(item[k] instanceof Array)){
                        item[k] = item[k].join(',');
                    }
                }
            }
        }
        console.log('list:',list);
        return list;
    }

    //改
    //使用infor对象改变存储在data中的infor.stuId的信息
    function cInfor(infor){
        // 注意，infor是前端要显示的数据，list是要传给后端的数据，它们是不一样的
        // console.log('cInfor')
        let list = transToBackEnd([infor]);
        // console.log('')

        return new Promise(function(resolve,reject){
            requestData('/updateInfo',list[0],'post').then((item)=>{

                console.log("updateInfo item:",item)

                //未查找到对应的数据，无法修改
                if(item.code!==200){
                    reject(infor.stuId);
                    return;
                 }

                for(let i=data.list.length-1;i>=0;i--){
                    if(data.list[i].stuId===infor.stuId){
                        data.list[i] = infor;
                        // console.log('that is all right')
                        resolve(infor.stuId)
                        return;
                    }
                }
                 
            },item=>{
                reject(item)
            });
        }) 
    }

    //查
    //以query为条件查找数据, attriShow表明了返回的数据只包含哪些属性
    function fetchData(q,attriShow=null){
        return new Promise(function(resolve){
            
            // console.log(query);
           
            
            let query = JSON.parse(JSON.stringify(q));
            // console.log('query:',query)

            let _data= [], isSelected;
            // console.log('dataList:',data.list)

            data.list.forEach((item)=>{
                isSelected = true;
                for(let key in query){
                    // if(query[key]&&key!=='pageIndex'){
                    //     console.log('the query key:',key)
                    // }
                    if(query[key]&&key!=='pageIndex'){
                        // console.log('key:',key,'  the value:',query[key], '  the item valu:',item[key]);
                        // 对于stuId，只要item[key]是以query[key]开头的就行
                        if((key==='stuId')&&(String(item[key]).indexOf(query[key])===0)){
                            continue;
                        }
                        // console.log('key:',key)
                        //根据item是否存在 申请入党时间 来判断是否申请入党
                        if(key=='isApplay'){
                            let val1 = item['applyTime'], val2 = query[key];
                            // console.log('val',val1);
                            // console.log('val',val2);
                            if((val2==1 && val1)||(val2==2 && !val1)){
                                

                                continue;
                            }
                        }
                        // 根据item的生日来判断是否对应年龄age
                        // if(key==='age'){
                        //     let age = item[key].stringify(0,4), ageQuery = query[key];
                        //     if(age==ageQuery){
                        //         continue;
                        //     }
                        // }

                        if(key==='actvTrainTime'||key==='devTrainTime'){
                            let val1 = item[key], val2 = query[key];
                            if((Number(val2[0])<=val1[0]) && (Number(val2[1])>=val1[1])){
                                // console.log('trainTimeArea');
                                continue;
                            }
                        }
                        let t = /Time$/g;
                        // console.log('长度',query[key].length===2,query[key] instanceof Array,'正则：' ,t.test(key),query[key] instanceof Array && t.test(key))
                        if((query[key] instanceof Array) && t.test(key)){
                            // console.log('TimeArea');

                            let val = item[key], area = query[key];
                            // console.log('key:',key,'val:',val,'area:',area)
                            if((area[0]<=Number(val)) && (Number(val)<=area[1])){
                                // console.log('In the TimeArea');
                                continue;
                            }
                        }

                        if((query[key]===item[key])){
                            continue;
                        }
                        isSelected = false;break;
                    }
                }

                if(isSelected){
                    //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                    _data.push(JSON.parse(JSON.stringify(item)));
                }
            })
            // console.log('_data',_data)


            let len = _data.length, pageSize = data.perPageNum, pageIndex = query.pageIndex, pageTotal;
            // console.log('len:',len,'pageSize:',pageSize,'pageNum:',Math.floor(len/pageSize))
            pageTotal = Math.max(Math.ceil(len/pageSize),1);
            if(query.pageIndex>pageTotal){
                pageIndex = pageTotal;
            }
            let start = Math.max((pageIndex-1)*pageSize,0),end = Math.min(pageIndex*pageSize,len);
            

            
            let _rDate={list:[],itemTotal:'',pageSize:'',pageIndex:''};
            let list = _data.slice(start,end), finalList = [];

            // console.log("list:",list)
            // console.log("start:",start,"end:",end);
            if(attriShow&&attriShow.length>0){
                // console.log("attriShow")
                let attri = {};
                attriShow.forEach(item=>{
                    attri[item] = true;
                })

                for(let i=0;i<list.length;i++){
                    let elem = list[i], obj={};
                    Object.keys(elem).forEach(item=>{
                        if(attri[item]){

                            obj[item] = elem[item];
                        }
                    })
                    finalList.push(obj);
                }
                _rDate.list = finalList;

            }else{
                _rDate.list = list;
            }
            _rDate.itemTotal = len;
            _rDate.pageSize = pageSize;
            _rDate.pageIndex = pageIndex;


            resolve(_rDate);
        })
        
    }

    //查
    //以query为条件查找数据, attriShow表明了返回的数据只包含哪些属性
    function fetchDataByStuId(stuId){
        // console.log('here',stuId);
        if(!stuId) return {};
        let _rDate = {};

        let dateList = data.list;
        for(let i=0;i<dateList.length;i++){
            // console.log('item stuId',dateList[i])
            if(dateList[i].stuId === stuId){
                // console.log('get stuId')
                //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                _rDate = JSON.parse(JSON.stringify(dateList[i]));
                // if(_rDate.home instanceof Array && _rDate.home.length>2){
                //     _rDate.home = _rDate.home[2];
                // }
                // console.log('_rDate',_rDate)
                return _rDate;
            }
        }

        return {};
        
    }


    // 将data.list的值更新为 tableDate
    async function  setNewData (tableData){
         return new Promise(function(resolve,reject){
            let arr = JSON.parse(JSON.stringify(tableData));
            let list = transToBackEnd(arr);
            // console.log("arr:",arr)
            requestData('/addInfoAll',list,'post').then((item)=>{
                console.log('addInfoAll item:',item);


                 //删除返回的代表不被允许（周岁小于18岁）添加进数据库的failedList数组中的stuId，
                 let failArr = {};
                 item.failUserList.forEach(v=>{
                     failArr[v] = true;
                 });
                 //删除那些因为已经存在不被允许添加进数据库中的existedUserList数组中的stuId，
                 item.existedUserList.forEach(v=>{
                     failArr[v] = true;
                 })
                 for(let i= arr.length - 1;i>=0;i--){
                     if(failArr[arr[i].stuId]){
                        arr.splice(i,1);
                     }
                 }
 

                data.list = arrUni(data.list.concat(arr));
                console.log("arr:",arr);
                resolve('202');

            },(item)=>{
                reject(item);
            });

         })
    }

    
    //判断stuId，是否在date中
    function isInDate(stuId){
        let dateList = data.list;
        for(let i=0;i<dateList.length;i++){
              if(dateList[i].stuId===stuId){
                  return true;
              }
        }
        return false;
    }

    function getTitle(){
        return {listTitle:data.listTitle,tableTitle:data.tableTitle};
    }


    //获取下载数据
    //以query为条件查找数据, attriShow表明了返回的数据只包含哪些属性
    function fetchDataToDown(q,attriShow=null){
        return new Promise(function(resolve){
            
            // console.log(query);
            console.log(attriShow);
           
            // if(!q)
            let query = JSON.parse(JSON.stringify(q));
            // console.log('query:',query)


            let _data= [], isSelected;
            // console.log('dataList:',data.list)


            data.list.forEach((item)=>{
                isSelected = true;
                for(let key in query){
                    // if(query[key]){
                    //     console.log('the query key:',key)
                    // }
                    if(query[key]&&Object.prototype.hasOwnProperty.call(item,key)&&(query[key]!==item[key])){
                        // console.log('key:',key,'  the value:',query[key], '  the item valu:',item[key]);
                        // 对于stuId，只要item[key]是以query[key]开头的就行
                        if((key==='stuId')&&(String(item[key]).indexOf(query[key])===0)){
                            continue;
                        }
                        if(key==='actvTrainTime'||key==='devTrainTime'){
                            let val1 = item[key], val2 = query[key];
                            if((Number(val2[0])<=val1[0]) && (Number(val2[1])>=val1[1])){
                                // console.log('trainTimeArea');
                                continue;
                            }
                        }
                        let t = /Time$/g;
                        // console.log('长度',query[key].length===2,query[key] instanceof Array,'正则：' ,t.test(key),query[key] instanceof Array && t.test(key))
                        if((query[key] instanceof Array) && t.test(key)){
                            // console.log('TimeArea');

                            let val = item[key], area = query[key];
                            if((area[0]<=Number(val)) && (Number(val)<=area[1])){
                                // console.log('In the TimeArea');
                                continue;
                            }
                        }
                        isSelected = false;break;
                    }
                }

                if(isSelected){
                    //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                    _data.push(JSON.parse(JSON.stringify(item)));
                }
            })
            // console.log('_data',_data)
            let _rDate = {};
            _rDate.list = _data;
            _rDate.itemTotal = _data.length;


            resolve(_rDate);
        })
        
    }

    //下载数据到excel表格
    function downDate(filterObj,query,exportIds){
        if(filterObj.type===0){
            // 下载模板
            let arr = JSON.parse(JSON.stringify([downLoadTemp]));
            let downDate = downDateStyle(arr);
            // console.log("downDate:",downDate);
            downLoadExcel(downDate, filterObj.listTitle, filterObj.tableTitle,'支部成员信息'); 
        } else if(filterObj.type===1){
            //下载所有数据
            fetchDataToDown(query).then((_data)=>{
                //一定要在下载时，将数据深复制一次，将data.list与后面的操作隔离开来
                let arr = JSON.parse(JSON.stringify(_data.list));
                let downDate = downDateStyle(arr);
                downLoadExcel(downDate, filterObj.listTitle, filterObj.tableTitle,'支部成员信息'); 
        
            })
        } else if(filterObj.type===2){
            //下载所有数据
            fetchDataToDown(query).then((_data)=>{
                //一定要在下载时，将数据深复制一次，将data.list与后面的操作隔离开来
                let arr = JSON.parse(JSON.stringify(_data.list)), idsFilter = JSON.parse(JSON.stringify(exportIds));
                let downArr = [];
                arr.forEach(item=>{
                    if(idsFilter[item.stuId]){
                        downArr.push(item);
                    }
                });
                console.log('downAr',downArr);
                
                let downDate = downDateStyle(downArr);
                downLoadExcel(downDate, filterObj.listTitle, filterObj.tableTitle,'支部成员信息'); 
        
            })
        }
    }
    function downDateStyle(list){
        return dateTranfer(ptdToAddress(list));
    }

    // 从表格中导入数据
    // fileList是文件名列表
    // filesObj.fileList, filesObj.listTitle, filesObj.tableTitle
    async function loadDateFromExcel(filesObj){
        filesObj.listTitle = JSON.parse(JSON.stringify(filesObj.listTitle));
        filesObj.tableTitle = JSON.parse(JSON.stringify(filesObj.tableTitle));

        let fileList = filesObj.fileList;
        let tableArray = [];
        let _data = [];
        // console.log('filesObj:',filesObj);

        for(let i=0;i<fileList.length;i++){
            try{
                _data = await importfxx(fileList[i].raw, filesObj.listTitle,filesObj.tableTitle);
                
                // console.log("beforeStyle:",_data)
                _data = loadDateStyle(_data);
                // console.log("afterStyle:",_data);
                tableArray = tableArray.concat(_data);
                tableArray = arrUni(tableArray);
                // console.log('tableArray:',tableArray);

                
            } catch(e){
                console.log('erro:',e)
                return [];
            }
        }
        console.log('tableArray:',tableArray);

        return tableArray;
    }

    //list是一个数组
    function loadDateStyle(list){
        list = arrUni(list);

        let item,arr;
        //把list中的每一项转换成字符串
        for(let i=0;i<list.length;i++){
            item = list[i];
            for(let k in item){
                if(Object.prototype.hasOwnProperty.call(item,k)){
                //》》》》这里其实涉及到一个问题，我们通过importfxx从表格获取的数据不一定都是字符串类型的数据，
                    item[k] = item[k]+'';
                    if(k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'){
                        
                        arr = item[k].split(',');
                        item[k] = arr;

                    }
                }
            }
        }

        return addressToPtd(dateBack(list));
    }


    // 获取关于支部branchs相关的数据。
    function getBranchsData(){
        return data.branchs;
    }
    

     // 关于每条数据中每个属性值0,1,2..代表什么可见：../api/formDate.js
     var data = {
         perPageNum: 20,

        list:[
            {
                stuId:"1871232",//学号
                name:'孙亮',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'18级',//年级
                tclass:'1903班',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                jnPartyTime:'',//党员增加时间
                addParty:'1',//党员增加
                honour:'东北大学一等奖学金',//个人荣誉
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                partyDuty:'支部书记',//党内职务
                branch:'1',//所在支部
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20180112',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'20180511',//确定积极分子时间
                actvTrainTime:['20180708','20180801'],//积极分子培训时间
                actvTrainResult:'2',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20181201',//确定发展对象时间
                devTrainTime:['20180201','20180302'],//发展对象培训时间
                devTrainResult:'2',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:['20180201','20180302'],//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20180502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20180506',//转正时间
                letterTime:'20210910',//转正申请书时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1571232",//学号
                name:'赵亮',//姓名
                gender:'2',//性别
                phone:'123415',//联系方式
                national:'2',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950112',//出生日期
                grade:'19级',//年级
                tclass:'1901班',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                jnPartyTime:'20210516',//党员增加时间
                addParty:'2',//党员增加
                honour:'东北大学一等奖学金',//个人荣誉
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                partyDuty:'支部书记',//党内职务
                branch:'1',//所在支部
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:['20210201','20210302'],//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20190506',//转正时间
                letterTime:'20190910',//转正申请书时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            // {
            //     stuId:"1971632",//学号
            //     name:'钱赋',//姓名
            //     gender:'1',//性别
            //     phone:'123415',//联系方式
            //     national:'1',//民族
            //     home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
            //     idCard:'13141414',//身份证
            //     birthday:'19950102',//出生日期
            //     grade:'20级',//年级
            //     tclass:'2011班',//班级
            //     proED:'1',//学历
            //     tutor:'张李',//导师
            //     stage:'1',//所处阶段
            //     jnPartyTime:'20200616',//党员增加时间
            //     addParty:'3',//党员增加
            //     honour:'东北大学一等奖学金',//个人荣誉
            //     bedroom:'3舍A231',//寝室
            //     duty:'副班长',//职务
            //     partyDuty:'宣传委员',//党内职务
            //     branch:'1',//所在支部
                
            //     pTeacher:'李福',//培养联系人
            //     leader:'上官云',//入党介绍人
            //     applyFileNumber:'13415',//入党志愿书编号
            
            
            //     // 申请入党阶段
            //     applyTime:'20190920',//申请入党时间
            //     talkTime:'20191005',//谈心谈话时间
            
            //     //入党积极分子的确定和培养阶段
            //     electLeagueTime:'20191025',//团推优时间
            //     actvTime:'2020051',//确定积极分子时间
            //     actvTrainTime:['20190708','20190801'],//积极分子培训时间
            //     actvTrainResult:'1',//积极分子培训班结业情况
            
            //     //发展对象的确定和考察阶段
            //     devTime:'20201201',//确定发展对象时间
            //     devTrainTime:['20210201','20210302'],//发展对象培训时间
            //     devTrainResult:'1',//发展对象培训班结业情况
            //     classRank:'6',//业务课排名
            //     extFileTime:'20210412',//外调材料日期
            //     polFileTime:'20210412',//政审材料日期
            //     candidateTime:'20210402',//拟发展时间
            //     hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
            //     pubTime:['20180401','20180502'],//公示日期
            
            //     // 预备党员的接收阶段
            //     jnTime:'20210502',//入党时间
            //     aPartyCheckTime:'20210503',//入党总支审查日期
            //     hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
            //     hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
            //     // 预备党员的教育考察和转正阶段
            //     confirmTime:'20210506',//转正时间
            //     letterTime:'20200910',//转正申请书时间
            //     partyConfirmTime:'20210506',//转正总支审查日期
            //     hPartyConfirmTime:'20210507',//转正上级党委审批日期
            //     delayReadyTime:'20210508',//延长预备期日期
            //     delayCheckTime:'20210508',//延长预备期总支审查日期
            //     delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
            //     note:'信息好多，代码好长',//备注
            
            // },

            // {
            //     stuId:"1671232",//学号
            //     name:'孙科',//姓名
            //     gender:'1',//性别
            //     phone:'123415',//联系方式
            //     national:'1',//民族
            //     home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
            //     idCard:'13141414',//身份证
            //     birthday:'19950102',//出生日期
            //     grade:'18级',//年级
            //     tclass:'1801班',//班级
            //     proED:'1',//学历
            //     tutor:'张李',//导师
            //     stage:'1',//所处阶段
            //     jnPartyTime:'20190516',//党员增加时间
            //     addParty:'2',//党员增加
            //     honour:'东北大学二等奖学金',//个人荣誉
            //     bedroom:'3舍A231',//寝室
            //     duty:'班长',//职务
            //     partyDuty:'支部书记',//党内职务
            //     branch:'1',//所在支部
                
            //     pTeacher:'李福',//培养联系人
            //     leader:'上官云',//入党介绍人
            //     applyFileNumber:'13415',//入党志愿书编号
            
            
            //     // 申请入党阶段
            //     applyTime:'20190920',//申请入党时间
            //     talkTime:'20191005',//谈心谈话时间
            
            //     //入党积极分子的确定和培养阶段
            //     electLeagueTime:'20191025',//团推优时间
            //     actvTime:'2020051',//确定积极分子时间
            //     actvTrainTime:['20200708','20200801'],//积极分子培训时间
            //     actvTrainResult:'1',//积极分子培训班结业情况
            
            //     //发展对象的确定和考察阶段
            //     devTime:'20201201',//确定发展对象时间
            //     devTrainTime:['20210201','20210302'],//发展对象培训时间
            //     devTrainResult:'1',//发展对象培训班结业情况
            //     classRank:'6',//业务课排名
            //     extFileTime:'20210412',//外调材料日期
            //     polFileTime:'20210412',//政审材料日期
            //     candidateTime:'20210402',//拟发展时间
            //     hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
            //     pubTime:['20200201','20210302'],//公示日期
            
            //     // 预备党员的接收阶段
            //     jnTime:'20210502',//入党时间
            //     aPartyCheckTime:'20210503',//入党总支审查日期
            //     hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
            //     hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
            //     // 预备党员的教育考察和转正阶段
            //     confirmTime:'20210506',//转正时间
            //     letterTime:'20201010',//转正申请书时间
            //     partyConfirmTime:'20210506',//转正总支审查日期
            //     hPartyConfirmTime:'20210507',//转正上级党委审批日期
            //     delayReadyTime:'20210508',//延长预备期日期
            //     delayCheckTime:'20210508',//延长预备期总支审查日期
            //     delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
            //     note:'信息好多，代码好长',//备注
            
            // },
            // {
            //     stuId:"1971172",//学号
            //     name:'李亮',//姓名
            //     gender:'2',//性别
            //     phone:'123415',//联系方式
            //     national:'1',//民族
            //     home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
            //     idCard:'13141414',//身份证
            //     birthday:'19950102',//出生日期
            //     grade:'20级',//年级
            //     tclass:'2001班',//班级
            //     proED:'1',//学历
            //     tutor:'张李',//导师
            //     stage:'1',//所处阶段
            //     jnPartyTime:'20180516',//党员增加时间
            //     addParty:'1',//党员增加
            //     honour:'东北大学一等奖学金',//个人荣誉
            //     bedroom:'3舍A231',//寝室
            //     duty:'班长',//职务
            //     partyDuty:'支部书记',//党内职务
            //     branch:'1',//所在支部
                
            //     pTeacher:'李福',//培养联系人
            //     leader:'上官云',//入党介绍人
            //     applyFileNumber:'13415',//入党志愿书编号
            
            
            //     // 申请入党阶段
            //     applyTime:'20190920',//申请入党时间
            //     talkTime:'20191005',//谈心谈话时间
            
            //     //入党积极分子的确定和培养阶段
            //     electLeagueTime:'20191025',//团推优时间
            //     actvTime:'2020051',//确定积极分子时间
            //     actvTrainTime:['20200708','20200801'],//积极分子培训时间
            //     actvTrainResult:'1',//积极分子培训班结业情况
            
            //     //发展对象的确定和考察阶段
            //     devTime:'20201201',//确定发展对象时间
            //     devTrainTime:['20210201','20210302'],//发展对象培训时间
            //     devTrainResult:'1',//发展对象培训班结业情况
            //     classRank:'6',//业务课排名
            //     extFileTime:'20210412',//外调材料日期
            //     polFileTime:'20210412',//政审材料日期
            //     candidateTime:'20210402',//拟发展时间
            //     hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
            //     pubTime:['20180501','20180902'],//公示日期
            
            //     // 预备党员的接收阶段
            //     jnTime:'20210502',//入党时间
            //     aPartyCheckTime:'20210503',//入党总支审查日期
            //     hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
            //     hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
            //     // 预备党员的教育考察和转正阶段
            //     confirmTime:'20210506',//转正时间
            //     letterTime:'20200110',//转正申请书时间
            //     partyConfirmTime:'20210506',//转正总支审查日期
            //     hPartyConfirmTime:'20210507',//转正上级党委审批日期
            //     delayReadyTime:'20210508',//延长预备期日期
            //     delayCheckTime:'20210508',//延长预备期总支审查日期
            //     delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
            //     note:'信息好多，代码好长',//备注
            
            // },

            // {
            //     stuId:"1871260",//学号
            //     name:'周溙',//姓名
            //     gender:'2',//性别
            //     phone:'123415',//联系方式
            //     national:'1',//民族
            //     home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
            //     idCard:'13141414',//身份证
            //     birthday:'19950102',//出生日期
            //     grade:'19级',//年级
            //     tclass:'1902班',//班级
            //     proED:'1',//学历
            //     tutor:'张李',//导师
            //     stage:'1',//所处阶段
            //     jnPartyTime:'20201016',//党员增加时间
            //     addParty:'2',//党员增加
            //     honour:'东北大学一等奖学金',//个人荣誉
            //     bedroom:'3舍A231',//寝室
            //     duty:'班长',//职务
            //     partyDuty:'支部书记',//党内职务
            //     branch:'1',//所在支部
                
            //     pTeacher:'李福',//培养联系人
            //     leader:'上官云',//入党介绍人
            //     applyFileNumber:'13415',//入党志愿书编号
            
            
            //     // 申请入党阶段
            //     applyTime:'20190920',//申请入党时间
            //     talkTime:'20191005',//谈心谈话时间
            
            //     //入党积极分子的确定和培养阶段
            //     electLeagueTime:'20191025',//团推优时间
            //     actvTime:'2020051',//确定积极分子时间
            //     actvTrainTime:['20200708','20200801'],//积极分子培训时间
            //     actvTrainResult:'1',//积极分子培训班结业情况
            
            //     //发展对象的确定和考察阶段
            //     devTime:'20201201',//确定发展对象时间
            //     devTrainTime:['20210201','20210302'],//发展对象培训时间
            //     devTrainResult:'1',//发展对象培训班结业情况
            //     classRank:'6',//业务课排名
            //     extFileTime:'20210412',//外调材料日期
            //     polFileTime:'20210412',//政审材料日期
            //     candidateTime:'20210402',//拟发展时间
            //     hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
            //     pubTime:['20190201','20190302'],//公示日期
            
            //     // 预备党员的接收阶段
            //     jnTime:'20210502',//入党时间
            //     aPartyCheckTime:'20210503',//入党总支审查日期
            //     hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
            //     hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
            //     // 预备党员的教育考察和转正阶段
            //     confirmTime:'20210506',//转正时间
            //     letterTime:'20210610',//转正申请书时间
            //     partyConfirmTime:'20210506',//转正总支审查日期
            //     hPartyConfirmTime:'20210507',//转正上级党委审批日期
            //     delayReadyTime:'20210508',//延长预备期日期
            //     delayCheckTime:'20210508',//延长预备期总支审查日期
            //     delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
            //     note:'信息好多，代码好长',//备注
            
            // },

            // {
            //     stuId:"1875894",//学号
            //     name:'吴使',//姓名
            //     gender:'1',//性别
            //     phone:'123415',//联系方式
            //     national:'3',//民族
            //     home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
            //     idCard:'13141414',//身份证
            //     birthday:'19950102',//出生日期
            //     grade:'19级',//年级
            //     tclass:'1902班',//班级
            //     proED:'1',//学历
            //     tutor:'张李',//导师
            //     stage:'1',//所处阶段
            //     jnPartyTime:'20200525',//党员增加时间
            //     addParty:'3',//党员增加
            //     honour:'东北大学一等奖学金',//个人荣誉
            //     bedroom:'3舍A231',//寝室
            //     duty:'班长',//职务
            //     partyDuty:'支部书记',//党内职务
            //     branch:'1',//所在支部
                
            //     pTeacher:'李福',//培养联系人
            //     leader:'上官云',//入党介绍人
            //     applyFileNumber:'13415',//入党志愿书编号
            
            
            //     // 申请入党阶段
            //     applyTime:'20190920',//申请入党时间
            //     talkTime:'20191005',//谈心谈话时间
            
            //     //入党积极分子的确定和培养阶段
            //     electLeagueTime:'20191025',//团推优时间
            //     actvTime:'2020051',//确定积极分子时间
            //     actvTrainTime:['20200708','20200801'],//积极分子培训时间
            //     actvTrainResult:'1',//积极分子培训班结业情况
            
            //     //发展对象的确定和考察阶段
            //     devTime:'20201201',//确定发展对象时间
            //     devTrainTime:['20210201','20210302'],//发展对象培训时间
            //     devTrainResult:'1',//发展对象培训班结业情况
            //     classRank:'6',//业务课排名
            //     extFileTime:'20210412',//外调材料日期
            //     polFileTime:'20210412',//政审材料日期
            //     candidateTime:'20210402',//拟发展时间
            //     hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
            //     pubTime:['20200201','20200302'],//公示日期
            
            //     // 预备党员的接收阶段
            //     jnTime:'20210502',//入党时间
            //     aPartyCheckTime:'20210503',//入党总支审查日期
            //     hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
            //     hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
            //     // 预备党员的教育考察和转正阶段
            //     confirmTime:'20210506',//转正时间
            //     letterTime:'20210912',//转正申请书时间
            //     partyConfirmTime:'20210506',//转正总支审查日期
            //     hPartyConfirmTime:'20210507',//转正上级党委审批日期
            //     delayReadyTime:'20210508',//延长预备期日期
            //     delayCheckTime:'20210508',//延长预备期总支审查日期
            //     delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
            //     note:'信息好多，代码好长',//备注
            
            // },
        ],
        branchs:[
            {id:1,branch:'第一党支部',regCandidate:'11',reParty:'12',graCandidate:'5',graParty:'12',docCandidate:'8',docParty:'15',actv:'13',leader:'张三'},
            {id:2,branch:'第二党支部',regCandidate:'11',reParty:'12',graCandidate:'5',graParty:'12',docCandidate:'8',docParty:'15',actv:'13',leader:'李四'},
            {id:3,branch:'第三党支部',regCandidate:'11',reParty:'12',graCandidate:'5',graParty:'12',docCandidate:'8',docParty:'15',actv:'13',leader:'王五'},
            {id:4,branch:'第四党支部',regCandidate:'11',reParty:'12',graCandidate:'5',graParty:'12',docCandidate:'8',docParty:'15',actv:'13',leader:'周六'},
            {id:5,branch:'第五党支部',regCandidate:'11',reParty:'12',graCandidate:'5',graParty:'12',docCandidate:'8',docParty:'15',actv:'13',leader:'吴七'},

        ]
     };


    // function getDateLength(){
    //     return data.length;
    // }

    return [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel,getStartDataFromBackend,
        getBranchsData,changePsw];



    



})();

let [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel,getStartDataFromBackend,getBranchsData,changePsw] = [...dataFun];


export {addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel,requestData,getStartDataFromBackend,getBranchsData,changePsw}




var downLoadTemp = {
    stuId:"1871232",//学号
    name:'孙亮',//姓名
    gender:'1',//性别
    phone:'123415',//联系方式
    national:'1',//民族
    home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
    idCard:'13141414',//身份证
    birthday:'19950102',//出生日期
    grade:'20级',//年级
    tclass:'2001班',//班级
    proED:'1',//学历
    tutor:'张李',//导师
    stage:'1',//所处阶段
    jnPartyTime:'20190916',//党员增加时间
    addParty:'2',//党员增加
    honour:'东北大学一等奖学金',//个人荣誉
    bedroom:'3舍A231',//寝室
    duty:'班长',//职务
    partyDuty:'支部书记',//党内职务
    branch:'1',//所在支部
    
    pTeacher:'李福',//培养联系人
    leader:'上官云',//入党介绍人
    applyFileNumber:'13415',//入党志愿书编号


    // 申请入党阶段
    applyTime:'20190920',//申请入党时间
    talkTime:'20191005',//谈心谈话时间

    //入党积极分子的确定和培养阶段
    electLeagueTime:'20191025',//团推优时间
    actvTime:'20190511',//确定积极分子时间
    actvTrainTime:['20200708','20200801'],//积极分子培训时间
    actvTrainResult:'1',//积极分子培训班结业情况

    //发展对象的确定和考察阶段
    devTime:'20201201',//确定发展对象时间
    devTrainTime:['20210201','20210302'],//发展对象培训时间
    devTrainResult:'1',//发展对象培训班结业情况
    classRank:'6',//业务课排名
    extFileTime:'20210412',//外调材料日期
    polFileTime:'20210412',//政审材料日期
    candidateTime:'20210402',//拟发展时间
    hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
    pubTime:['20210201','20210502'],//公示日期

    // 预备党员的接收阶段
    jnTime:'20210502',//入党时间
    aPartyCheckTime:'20210503',//入党总支审查日期
    hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
    hPartyPassTime:'20210505',//入党上级党委审批日期
    
    
    // 预备党员的教育考察和转正阶段
    confirmTime:'20210506',//转正时间
    letterTime:'20200910',//转正申请书时间
    partyConfirmTime:'20210506',//转正总支审查日期
    hPartyConfirmTime:'20210507',//转正上级党委审批日期
    delayReadyTime:'20210508',//延长预备期日期
    delayCheckTime:'20210508',//延长预备期总支审查日期
    delayConfirmTime:'20210512',//延长预备期党委审批日期


    note:'信息好多，代码好长',//备注

};
// console.log('person',person);

