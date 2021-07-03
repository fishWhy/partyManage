import request from '../utils/request';
import {insertFormDate,formDate} from './formDate.js';


/**
 * 
 * @param {请求时的路径} urlL 
 * @param {请求时的参数} query 
 * @param {请求方式，有get,push,post,delete} rqType 
 * @returns 
 */
const requestData = (urlL,query, rqType = 'post') => {
    console.log(urlL,rqType,query);

    return request({
        url: urlL,
        method: rqType,
        data: JSON.parse(JSON.stringify(query))
    });
};


  // 将前端数据转变成后端需要的格式
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

 //将后端数据转换成前端的格式
function tranDataToFrontEnd(list){
    //把list中的actvTrainTime，devTrainTime，pubTime，home转成数组
    let it;
    for(let i=0;i<list.length;i++){
        it = list[i];
        for(let k in it){
            if(Object.prototype.hasOwnProperty.call(it,k)){
                if(k==="actvTrainTime"||k==='devTrainTime'||k==='pubTime'){
                    if(it[k].length>0 && typeof it[k] =="string" ){
                        it[k] = it[k].split(',');
                    }
                }else if(k==="home" && typeof it[k] =="string"){
                    it[k] = it[k].split(',');
                }else if(formDate[k]){// 如果是下拉选框，则转成1,2,3的格式
                    Object.keys(formDate[k]).forEach(eItem=>{
                        if(formDate[k][eItem]==it[k]){
                            it[k] = eItem;
                        }
                    })  
                } 
            }
        }
    }

     // 将下拉框选项的数据转成要显示的样式即转成1,2,3


      return list;
}

function logIn(obj){
    let param = {};
    param.userName = obj.userName;
    param.password = obj.password;
    return requestData('/login',param,'post').then((item)=>{
        console.log('login item:',item);

        let rnObj = {};
        rnObj.token = item.data.token;
        rnObj.studId = item.data.user.stu_id;
        rnObj.duty = item.data.duty;
        
        // localStorage.setItem("token", item.data.token);
        // localStorage.setItem("stuId", item.data.user.stu_id);

         return rnObj;
    },()=>{throw new Error("登录失败,请输入正确的账号密码重新登录")});
}
   function getStartDataFromBackend(){
    return requestData('/refresh',{},'post').then((item)=>{
        console.log('get data from backend item:',item);
        data.branchs = item.data.branches;
        console.log('branch:',item.data.brList);
        insertFormDate('branch',item.data.brList);

         localStorage.setItem("token", item.data.token);
        localStorage.setItem("stuId", item.data.user.stu_id);

         // 将数据格式转变成前端需要的格式
        let list = JSON.parse(JSON.stringify(item.data.infos.slice(0)));
       
        list = tranDataToFrontEnd(list);
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


export {addDate,deltDate,cInfor,setNewData,requestData,getStartDataFromBackend,changePsw,logIn}

