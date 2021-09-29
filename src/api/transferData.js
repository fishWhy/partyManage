import {formDate} from './formDate.js';
import {  CodeToText, TextToCode } from 'element-china-area-data/dist/app.commonjs';


const formDataKeys = {};
Object.keys(formDate).forEach(item=>{
    formDataKeys[item] = true;
});


// 将后端格式的数据转换成前端数据格式
function transferDataFromBackEnd(resData, onlyOne = false){
    resData = JSON.parse(JSON.stringify(resData));
    transferDataFromBackEnd.dataPreProc(resData, onlyOne);
    transferDataFromBackEnd.tranDataToFrontEnd(resData, onlyOne);
    return resData;

}

// 对前端传来的数据进行预处理
transferDataFromBackEnd.dataPreProc = function(resData,onlyOne = false){
    let tmpValue;
    // 对数据进行过滤防止有些 属性出现空数据
    Object.keys(resData.data).forEach(key=>{
        if(key=='brList'){// 过滤 支部， 防止有空数据
            tmpValue = resData.data[key].split(',').filter(val=>{
                // console.log('the transferDataFromBackEnd value1', val)
                // 在本系统中，为了后台数据库存储数据，设定 _$为空
                return (val!='其他') && (val!=null) && (val!='_$') && (String(val).indexOf('支部')!=-1);
            });
            resData.data[key] = tmpValue;
        }else if(key=='branches' && !onlyOne){// 过滤  支部信息相关的信息
            tmpValue = resData.data[key].filter(val=>{
                // console.log('the transferDataFromBackEnd value2', val)
                return (val.branch!=null) && (val.branch!='_$') && (String(val.branch).indexOf('支部')!=-1);
            });
            resData.data[key] = tmpValue;
        }
    })

    formDate.setNewItemInFormDate('branch', resData.data.brList);
}

// 对后端数据转换成前端格式（相当于解码）
transferDataFromBackEnd.tranDataToFrontEnd = function(resData, onlyOne = false){
    //把list中的actvTrainTime，devTrainTime，pubTime，home转成数组
    if(!onlyOne){
        for(let i=0;i<resData.data.infos.length;i++){
            resData.data.infos[i] = tranferInfosData(resData.data.infos[i]);
        }
    }else{
        resData.data.infos = tranferInfosData(resData.data.infos);
    }

    function tranferInfosData(it){
        let  regT = /^[0-9]+,[0-9]+$/, regH = /^[0-9]+,[0-9]+,[0-9]+$/;//正则表达式一定要写上^和$表示以什么开头，以什么结尾
        for(let k in it){
            if(Object.prototype.hasOwnProperty.call(it,k)){
                if(it[k] == "_$"){
                    it[k] = '';//_$为了后端好处理空值存成这种字符串,这里需要转换成前端的格式
                }else if((k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime')&&(typeof it[k] =="string" && it[k].length>0 &&  regT.test(it[k]))){
                    it[k] = it[k].split(',');
                }else if(k==="home" &&(typeof it[k] =="string" && it[k].length>0 && regH.test(it[k]) )){
                    it[k] = it[k].split(',');
                }else if(formDate[k]){// 如果是下拉选框，则转成1,2,3的格式,这一步不能省略，因为branch属性
                    it[k] = formDate.tranferToKey(k, it[k]); 
                } 
            }
        }
        return it;
    }

}


// 将前端格式的数据转换成后端格式的数据（将所有数据都变成字符串型式）
function transferDataToBE(list){
    list = JSON.parse(JSON.stringify(list));
    let item;
    //把list中的每一项转换成字符串
    for(let i=0;i<list.length;i++){
        item = list[i];
        for(let k in item){
            if(Object.prototype.hasOwnProperty.call(item,k)){
                if((k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'||k==='home')&&(item[k] instanceof Array)){
                    item[k] = item[k].join(',');

                }else if(item[k]==''){
                    item[k] = "_$"//为了后端好处理空值存成这种字符串
                }else if(k=='branch'){
                    item[k] = formDate[k][item[k]];
                }
            }
        }

        // 自动补值
        // 是党员，但党内职务为空时，党内职务置为 普通党员
        if((!item["partyDuty"] || item["partyDuty"]=="_$")&& (item['stage']=="正式党员"||item['stage']=="5")){
            list[i]["partyDuty"] = "1";
            // console.log('partyDuty');
        }
        // 党内职务为空 或 非正式党员时，党内职务置为 其他
        if((!item['partyDuty'] || item["partyDuty"]=="_$") || (item['stage']!="正式党员" && item['stage']!="5")){
            list[i]["partyDuty"] = "-1";
        }
        //所处阶段为空 所处阶段置为 其他
        if(!item['stage'] || item['stage']=="_$"){
            list[i]['stage'] = "-1";
        }

    }

    return list;
}



// 将从excel表格导入的数据转成前端数据格式
function transferDataFromExcel(list){
    list = JSON.parse(JSON.stringify(list));
    let item,arr;

    //把list中的每一项转换成字符串
    for(let i=0;i<list.length;i++){

        item = list[i];

        for(let k in item){
            if(Object.prototype.hasOwnProperty.call(item,k)){
            //》》》》这里其实涉及到一个问题，我们通过importfxx从表格获取的数据不一定都是字符串类型的数据，
                item[k] = item[k]+'';

                if((k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'||k==='home')&&(typeof item[k]=='string' && item[k].length>0)){                        
                    arr = item[k].split(',');
                    item[k] = arr;
                }

                // 将对象数组list中的属性值由汉字变成对应数字，如gender:'男' 变为 gender:'1'
                if(formDataKeys[k]){
                    for(let key in formDate[k]){
                        if(item[k]==formDate[k][key]){
                            item[k] = key;
                        }
                    }
                }

            }
        }
    }

    return addressEncode(list);
}

// 将从excel表格导入的数据转成后端数据格式
function transferExcelDataToBE(list){
    list = JSON.parse(JSON.stringify(list));
    let item;

    //把list中的每一项转换成字符串
    for(let i=0;i<list.length;i++){

        item = list[i];
        for(let k in item){
            if(Object.prototype.hasOwnProperty.call(item,k)){

                if((k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'||k==='home')&&(item[k] instanceof Array)){
                    item[k] = item[k].join(',');
                }

                // 将对象数组list中的属性值由汉字变成对应数字，如gender:'男' 变为 gender:'1'
                if( k!='branch'&& formDataKeys[k]){
                    for(let key in formDate[k]){
                        if(item[k]==formDate[k][key]){
                            item[k] = key;
                        }
                    }
                }
                //》》》》这里其实涉及到一个问题，我们通过importfxx从表格获取的数据不一定都是字符串类型的数据，
                item[k] = item[k]+'';

            }
        }

        // 自动补值
        // 是党员，但党内职务为空时，党内职务置为 普通党员
        if((!item["partyDuty"] || item["partyDuty"]=="_$")&& (item['stage']=="正式党员"||item['stage']=="5")){
            list[i]["partyDuty"] = "1";
            // console.log('partyDuty');
        }
        // 党内职务为空 或 非正式党员时，党内职务置为 其他
        if((!item['partyDuty'] || item["partyDuty"]=="_$") || (item['stage']!="正式党员" && item['stage']!="5")){
            list[i]["partyDuty"] = "-1";
        }
        //所处阶段为空 所处阶段置为 其他
        if(!item['stage'] || item['stage']=="_$"){
            list[i]['stage'] = "-1";
        }
    }

    return list;
}


// 将前端格式的数据转换成excel表格的数据格式
function tranferDataToExcel(list){
    list = JSON.parse(JSON.stringify(list));
    list = addressDecode(list);
    // 将对象数组list中的属性值由0,1变为对应的汉字，如gender:'1'，变为gender:'男'
    for(let i=0, item;i<list.length;i++){
        item = list[i];
        for(let k in item){
            if(formDataKeys[k]){
                for(let key in formDate[k]){
                    if(item[k]==key){
                        item[k] = formDate[k][key];
                    }
                }
            }
        }
    }
    return list;

}


// 将地址转成数组
//省市区三级区地址转区域码，例如：河北省/秦皇岛市/山海关区 转成 ["130000","130300","130303"] 
// 数组list中的每一项都为一个对象
function addressEncode(list){
    let rs = [];

    for(let i=0;i<list.length;i++){ 
        if((Object.prototype.hasOwnProperty.call(list[i],'home'))&&(typeof list[i]['home'] == 'string' && list[i]['home'].length>0)){
            //codeArr是一个长度为3的数组分别是省市区的区域码，["130000","130300","130303"]，这里会转成 河北省/秦皇岛市/山海关区
            let addr = list[i]['home'].split('/');
            rs = [];
            rs.push(TextToCode[addr[0]].code);
            rs.push(TextToCode[addr[0]][addr[1]].code);
            rs.push(TextToCode[addr[0]][addr[1]][addr[2]].code);
            list[i]['home'] = rs;
            // list[i]['home'] = TextToCode[addr[0]][addr[1]][addr[2]].code;
        }
        
    }
    return list;
}



//省市区三级区域码转地址
// 数组list中的每一项都为一个对象
function addressDecode(list){
    let rs = "";
    console.log('地址：',CodeToText, TextToCode);

    for(let i=0;i<list.length;i++){ 
        //codeArr是一个长度为3的数组分别是省市区的区域码，["130000","130300","130303"]，这里会转成 河北省/秦皇岛市/山海关区
        if(Object.prototype.hasOwnProperty.call(list[i],'home')){
            let codeArr = list[i].home;
            rs = "";

            if(codeArr instanceof Array){
                codeArr.forEach(item=>{
                    //注意一定要有'/'，目的是为了方便导入表格
                    rs += CodeToText[item]+"/";
                })
                rs = rs.slice(0,rs.length-1);
            }
            
            list[i]['home'] = rs;
        }
        
    }
    return list;
}




export {transferDataFromBackEnd,transferDataToBE,transferDataFromExcel,tranferDataToExcel,transferExcelDataToBE,addressDecode,addressEncode}
