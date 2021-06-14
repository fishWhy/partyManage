<template>
    
    <div >
        
        <!-- <el-divider style="margin: 5px 0 10px 0;"></el-divider> -->

        <el-form  style="padding: 4px 0 0 5px;"  label-position="right" label-width="190px" id="selectForm" :inline="true" >
            <el-form-item v-for='item in formObj' :label="item.label" :key='item.prop' style="margin-top:6px;" :class="{blockClass:item.type==='textarea',itemClass:item.redLabel == true}" >
                <div style="display:inline-block;width:180px;">
                    <!-- 输入框 -->
                    <el-input v-if="item.type==='Input'" v-model="dateItems[item.prop]" class="el_side_style" disabled="true" ></el-input>
                     <!-- 输入框 textarea -->
                    <el-input  v-if="item.type==='textarea'" type="textarea"  class="el_area_style" resize="none" disabled="true" v-model="dateItems[item.prop]"></el-input>
                    <!-- 下拉框 -->
                    <el-select v-if="item.type==='Select'" v-model="dateItems[item.prop]"  :class="{el_side_style: !item.styleObj}" :style = "[item.styleObj]" disabled="true">
                        <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" :class="{el_side_style: !item.styleObj}" :style = "[item.styleObj]"></el-option>
                    </el-select>   
                    <!-- 年月日 -->
                    <el-date-picker  v-if="item.type==='YMR'" :default-value="item.default_time" v-model="dateItems[item.prop]" disabled="true" style="width:145px;font-size:medium;" class="el_side_style" ></el-date-picker>
                    <!-- 年月 -->
                    <el-date-picker
                      v-if="item.type==='YM'"
                      v-model="dateItems[item.prop]"
                      type="month"
                      placeholder="选择月"
                      disabled="true"
                      style="width:180px;font-size:medium" class="el_side_style"
                      >
                    </el-date-picker>

                    <!-- 年月日选择区间 -->
                    <el-date-picker
                        v-if="item.type==='YMDArea'"
                        v-model="dateItems[item.prop]"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        disabled="true"
                        style="width:180px;font-size:medium" class="el_side_style">
                    </el-date-picker>

                    <!-- 月份选择区间    -->
                    <el-date-picker
                        v-if="item.type==='YMArea'"
                        v-model="dateItems[item.prop]"
                        type="monthrange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份"
                        :shortcuts="shortcuts"
                        disabled="true"
                        style="width:180px;font-size:medium" class="el_side_style"
                    >


                    </el-date-picker>

                    <!-- 省市区三级联动（带"全部"选项） -->
                    <el-cascader
                        v-if="item.type==='pccA'"
                        :options="options0"
                        v-model="dateItems[item.prop]"
                        disabled="true"
                        style="width:240px;font-size:12px;" class="el_side_style">
                    </el-cascader>
                    <!-- 省市区三级联动（不带"全部"选项） -->
                    <el-cascader
                      v-if="item.type==='pcc'"
                      :options="options1"
                      v-model="dateItems[item.prop]"
                      disabled="true"
                      style="width:240px;font-size:12px;" class="el_side_style">
                    </el-cascader>
                </div>

            </el-form-item>
        </el-form>
        <!-- <el-form inline>
            <el-form-item>
                <el-button type="primary" size="mini" @click="resetQueryData">重置</el-button>
            </el-form-item>
            <el-form-item style="margin-left:20px">
                <el-button type="success" size="mini" @click="requeryData">查询</el-button>
            </el-form-item> 
        </el-form> -->
    </div>


</template>
<script>
import { regionData,regionDataPlus } from 'element-china-area-data'
import {inFormToNone} from "../api/formDate.js"

export default{
    props:{
        formObj:{
            type:Array,
            default:function(){
                let arr = [
                            // {label:'学号',prop:'stuId',type:'Input'},
                            // {label:'姓名',prop:'name',type:'Input'},
                            // {label:'性别',prop:'gender',type:'Select',options:[{value:0,label:'全部'},{value:1,label:'男'},{value:2,label:'女'}]},
                            // {label:'民族',prop:'national',type:'Select',options:[{value:0,label:'汉族'},{value:1,label:'满族'},{value:2,label:'壮族'}]},
                            // {label:'支部',prop:'branch',type:'Select',options:[{value:0,label:'全部'},{value:1,label:'第一党支部'},{value:2,label:'第二党支部'},{value:3,label:'第三党支部'}]},
                            
                            // {label:'年龄',prop:'age',type:'Input'},
                            // {label:'学历',prop:'proED',type:'Select',options:[{value:0,label:'全部'},{value:1,label:'大学'},{value:2,label:'研究生'},{value:3,label:'博士'},{value:4,label:'其他'}]},
                            // {label:'班级',prop:'class',type:'Select',options:[{value:0,label:'全部'},{value:1,label:'1901班'},{value:2,label:'1902班'},{value:3,label:'1903班'},{value:4,label:'其他'}]},
                            // {label:'导师',prop:'tutor',type:'Input'},
                            // {label:'所处阶段',prop:'stage',type:'Select',options:[{value:0,label:'全部'},{value:1,label:'党员'},{value:2,label:'预备党员'},{value:3,label:'入党积极分子'},{value:4,label:'优秀团员'}]},

                            // {label:'确定积极分子时间',prop:'activistTime',type:'YMArea'},
                            // {label:'拟发展时间',prop:'adoptTime',type:'YM'},
                        ]
                return arr;
            }
        },
       
        //绑定数据
        content: {
            type:Object,
            default:function(){
                return{}
            }
        },

    },
    created(){
        // this.formObj.forEach(item=>{
        //     this.query[item.prop] = "";
        // })
        this.dateItems = JSON.parse(JSON.stringify(this.content));
        // console.log('dateItems',this.dateItems);
    },

    data(){
       return {
           options0:regionDataPlus,
           options1: regionData,
            shortcuts: [{
              text: '本月',
              value: [new Date(), new Date()],
            }, {
              text: '最近2个月',
              value: (() => {
                const end = new Date()
                const start = new Date()
                start.setMonth(start.getMonth() - 2)
                return [start, end]
              })(),
            }, {
              text: '最近3个月',
              value: (() => {
                const end = new Date()
                const start = new Date()
                start.setMonth(start.getMonth() - 3)
                return [start, end]
              })(),
            }],

            dateItems:{},
            
       }
    },
    computed:{
    },
    methods:{
        getDate(){
            let rnDate = {};
            let YMR = [], YM = [], YMArea = [], YMDArea = [];
            
            Object.keys(this.dateItems).forEach(item=>{
                if(item!=='YMR'&&item!=='YM'&&item!=='YMArea'&&item!=='YMDArea'){
                    rnDate[item] = this.dateItems[item];
                }else {
                    rnDate[item] = "";
                }
            })

            this.formObj.forEach(item=>{
                if(item.type === 'YMR'){
                    YMR.push(item.prop);
                } else if(item.type === 'YM'){
                    YM.push(item.prop);
                }else if(item.type === 'YMArea'){
                    YMArea.push(item.prop);
                }else if(item.type === 'YMDArea'){
                    YMDArea.push(item.prop);
                }
            });

            YMR.forEach(item=>{
                let val = this.dateItems[item];
                if(val instanceof Date){
                     let y = val.getFullYear(), m=val.getMonth()+1, d=val.getDate();
                    if(m<=9)m = "0" + m;
                    if(d<=9)d="0"+d;
                    rnDate[item] = y + m + d;
                }
            });

            YM.forEach(item=>{
                let val = this.dateItems[item];
                if(val instanceof Date){
                     let y = val.getFullYear(), m=val.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnDate[item] = y + m;
                }
            });
            
            YMArea.forEach(item=>{
                let val = this.dateItems[item];
                if(val instanceof Array){
                    rnDate[item] = [];
                    let val1,val2,y,m;
                    val1 = val[0];
                    y = val1.getFullYear();
                    m=val1.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnDate[item][0] = y + m + '01';

                    val2 = val[1];
                    y = val2.getFullYear();
                    m=val2.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnDate[item][1] = y + m + '31';
                }
            });

            YMDArea.forEach(item=>{
                let val = this.dateItems[item];
                if(val instanceof Array){
                    // console.log('YMDAreaval:',val,val[0],[val[1]])
                    rnDate[item] = [];
                    let val1,val2,y,m,d;

                    val1 = val[0];
                    if(val1 instanceof Date){
                        y = val1.getFullYear();
                        m=val1.getMonth()+1;
                        d=val1.getDate();
                        if(m<=9)m = "0" + m;
                        if(d<=9)d="0"+d;
                        rnDate[item][0] = y + m + d;
                    }else {
                        rnDate[item][0] = val1;
                    }
                    

                    val2 = val[1];
                     if(val instanceof Date){
                        y = val2.getFullYear();
                        m=val2.getMonth()+1;
                        d=val2.getDate();
                        if(m<=9)m = "0" + m;
                        if(d<=9)d="0"+d;
                        rnDate[item][1] = y + m + d;
                    }else {
                        rnDate[item][1] = val2;
                    }

                    
                }
            });

            // 将query中值为0的 下拉框 对应的值由0值，置为''
            inFormToNone(rnDate);
            // console.log('getFormQuery:',rnQuery)
            let rn = JSON.parse(JSON.stringify(rnDate));
            // console.log('tableDetail:',rn);
            return rn;
        },
        //获取属性为attr的关于年月日的数据
        getYMRDate(attr){
            // console.log('attr',attr);
            let rnDate = null;
            this.formObj.forEach(item=>{
                if(item.type === 'YMR' && item.prop == attr){
                    let time= this.dateItems[item.prop];
                    // console.log('item:',item,time);
                    if(time instanceof Date){
                        // console.log('date')
                        rnDate = new Date(time);
                    }else if(typeof time ==='string' && time.length>0){
                        let y = time.substring(0,4), m = time.substring(4,6), d = time.substring(6,8);
                        // console.log('y m r:', y, m, d);
                        rnDate = new Date(y+'-'+m+'-'+d);
                    }

                }
            });
            // console.log('no match')
            return  rnDate;
            // return {y:val.getFullYear,m:val.getMonth()+1,D:val.getDate()};
            
        }
    }
}
</script>
<style scoped>
/* 修改 id为filter的header的样式 */
#selectForm:deep(.el-form-item__label){
    font-size: 14px;
}
#selectForm>.itemClass:deep(.el-form-item__label){
    color: red;
}

#selectForm{
    padding-top: 0px;
    border: 0px;
}

#selectForm .el-form-item{
    margin-bottom: 3px;
}
.el_side_style{
    font-size: medium;
    width: 145px !important;
    margin-top: 0px;
    /* outline: 1px solid red; */
}
.el_side_style:deep(.el-input__inner){
    color:black;
    /* outline: 1px solid red; */
    /* line-height: 35px;
    height: 35px; */
}

.el_area_style{
    /* color:black; */
    /* outline: 1px solid red; */
    display: block;
    width:400px;
    height:60px;

}

.blockClass{
    display: block;
}



</style>


<style>
/* 写在这个style中的内容一定要注意，会影响所有的组件中的样式，一定要慎用 */
    /* 这里我确实希望所有disabled属性为true的表单都会是这样的，因此这样写合理 */
    .el-input.is-disabled .el-input__inner{
        color:black;
    }
</style>
