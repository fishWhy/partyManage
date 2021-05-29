// import { reject } from "core-js/fn/promise";
import {export_json_to_excel,formatJson} from "./Export2Excel.js";



/**
 * @param tableTitle 为上传进来的excel文件中的表头
 *@param  listTitle 为要显示在页面中的表头，这里要将tableTitle转换成listTitle的样式 
 */
function downLoadExcel(tableData,listTitle,tableTitle,fileName){
   

    const _data = formatJson(listTitle,tableData);
    export_json_to_excel(tableTitle,_data,fileName);
}

/**
 * 
 * @param {Object} obj  从<el-upload>组件获取上传的excel文件，读取其中的数据返回
 * @param tableTitle 为上传进来的excel文件中的表头
 * @param  listTitle 为要显示在页面中的表头，这里要将tableTitle转换成listTitle的样式 
 */
function importfxx(obj,listTitle,tableTitle) {
    var fileTemp = obj;

    if(fileTemp){
        if((fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (fileTemp.type == 'application/vnd.ms-excel')){
            return  new Promise(function(resolve,reject){
                var reader = new FileReader();
                reader.onload = function(et){
                    // console.log('et',et);
                    var binary = et.target.result;
                    // console.log('binary:',binary)
                    var XLSX = require('xlsx');
                    var wb = XLSX.read(binary, {
                            type: 'binary'
                    });
                    
                    var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                    console.log('the data:',data);
                    var _data = [];
                    //检查导入的表格中的数据是否符合格式的要求，只检测表头是否符合要求
                    for(let i=0;i<data.length;i++){
                        let _objKeys = Object.keys(data[i]);
                        // console.log('_objKeys:',_objKeys);
                        // console.log('_tableTitle::',tableTitle);

                        if(_objKeys.length<=tableTitle.length){
                            let item;
                            for(let i=0;i<_objKeys.length;i++){
                                item = _objKeys[i];
                                if(tableTitle.indexOf(item)===-1){
                                    reject(`1.文件《${data[i].name}》内容格式错误，${item},请删除后重新上传！`);
                                    return;
                                }
                            }

                            // tableTitle.forEach(item=>{
                            //     if(_objKeys.indexOf(item)===-1){
                            //         // console.log('the item is',item);
                            //        reject(`1.文件《${data[i].name}》内容格式错误，${item},请删除后重新上传！`);
                            //         return;
                            //     }
                            // })
                        }else{
                            reject(`2.文件《${obj.name}》内容格式错误，请删除后重新上传！,${_objKeys.length},${tableTitle.length}`);
                            return;

                        }
                    }
                    for(let i=0;i<data.length;i++){
                        let _obj = data[i];
                        let _nobj = {};
                        Object.keys(_obj).forEach(item=>{
                            let _val = _obj[item];
                            _nobj[listTitle[tableTitle.indexOf(item)]] = _val;
                            
                        })
                        _data.push(_nobj);
                    
                    }
                    resolve(_data);
                }
                reader.readAsBinaryString(fileTemp);
            }) 
        } else {
            // this.$message({
            //     type:'warning',
            //     message:'附件格式错误，请删除后重新上传！'
            // });
            return Promise.reject(`文件《${obj.name}》的附件格式${fileTemp.type}错误，请删除后重新上传！`)
        }
    } else {
        return Promise.reject('请上传附件！')
    }

    
}

export  {importfxx, downLoadExcel}

