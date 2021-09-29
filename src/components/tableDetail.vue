<template>
    
    <div >
        
        <!-- <el-divider style="margin: 5px 0 10px 0;"></el-divider> -->

        <el-form  style="padding: 4px 0 0 5px;"  label-position="right" label-width="160px" id="selectForm" :inline="true" >
            
            <el-form-item v-for='item in formObj' :label="item.label" :key='item.prop'  size='mini' :class="{blockClass:item.type==='textarea',itemClass:item.redLabel == true,br:item.type==='br'}" >
                <div style="display:inline-block;width:160px;">
                    <br v-if="item.type==='br'"/>
                    <!-- 输入框 Input -->
                    <el-input v-if="item.type==='Input'" v-model="dateItems[item.prop]"  :disabled="disabled" @change="changeDate"  :class="{el_side_style: !item.styleObj}" :style = "[item.styleObj]"></el-input>
                    <!-- 输入框 textarea -->
                    <el-input  v-if="item.type==='textarea'" type="textarea"  class="el_area_style" resize="none" :disabled="disabled" v-model="dateItems[item.prop]"></el-input>

                    <!-- 下拉框 -->
                    <el-select v-if="item.type==='Select'" v-model="dateItems[item.prop]"   :disabled="disabled"  :class="{el_side_style: !item.styleObj}"  :style = "[item.styleObj]">
                        <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" :class="{el_side_style: !item.styleObj}"></el-option>
                    </el-select>   
                    <!-- 年月日 -->
                    <el-date-picker  v-if="item.type==='YMR'" :default-value="item.default_time" v-model="dateItems[item.prop]" :disabled="disabled" style="width:130px;font-size:smaller" class="el_side_style" @change="changeDate"></el-date-picker>
                    <!-- 年月 -->
                    <el-date-picker
                      v-if="item.type==='YM'"
                      v-model="dateItems[item.prop]"
                      type="month"
                      placeholder="选择月"
                      :disabled="disabled"
                      @change="changeDate"
                      style="width:120px;font-size:smaller" class="el_side_style"
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
                        :disabled="disabled"
                        @change="changeDate"
                        style="width:200px;font-size:smaller" class="el_side_style">
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
                        :disabled="disabled"
                        @change="changeDate"
                        style="width:130px;font-size:smaller" class="el_side_style"
                    >


                    </el-date-picker>

                    <!-- 省市区三级联动（带"全部"选项） -->
                    <el-cascader
                        v-if="item.type==='pccA'"
                        :options="options0"
                        v-model="dateItems[item.prop]"
                        :disabled="disabled"
                        style="width:240px;font-size:12px;" class="el_side_style">
                    </el-cascader>
                    <!-- 省市区三级联动（不带"全部"选项） -->
                    <el-cascader
                      v-if="item.type==='pcc'"
                      :options="options1"
                      v-model="dateItems[item.prop]"
                      :disabled="disabled"
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
                let arr = []
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
        disabled:{
            type:Boolean,
            default:false
        }

    },
    created(){
        // this.formObj.forEach(item=>{
        //     this.query[item.prop] = "";
        // })
        this.dateItems = JSON.parse(JSON.stringify(this.content));
        // console.log('dateItems',this.dateItems);
    },
    watch:{
        content:{
            deep:true,
            handler:function(newVale){
                console.log('change tableDetail:',newVale)
                this.dateItems = JSON.parse(JSON.stringify(newVale));
            }
        }

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
        changeDate(){
            // console.log('changeDate');
            this.$emit('changeDate');
        },
        getDate(){
            let rnDate = {};
            let YMR = [], YM = [], YMArea = [], YMDArea = [];
            
            Object.keys(this.dateItems).forEach(item=>{
                if(item!=='YMR'&&item!=='YM'&&item!=='YMArea'&&item!=='YMDArea'&& this.dateItems[item]){
                    rnDate[item] = this.dateItems[item] + '';
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
                    rnDate[item] = y +''+ m + '' + d;
                }else if(val){
                    rnDate[item]  = val + ''; 
                }else{
                    rnDate[item] = '';
                }
                // console.log('item',val instanceof Date,item,rnDate[item])
            });

            YM.forEach(item=>{
                let val = this.dateItems[item];
                if(val instanceof Date){
                     let y = val.getFullYear(), m=val.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnDate[item] = y+ '' + m;
                }else if(val){
                    rnDate[item]  = val + ''; 
                }else{
                    rnDate[item] = '';
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
                    rnDate[item][0] = y +'' + m + '01';

                    val2 = val[1];
                    y = val2.getFullYear();
                    m=val2.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnDate[item][1] = y +'' + m + '31';
                }else if(val){
                    rnDate[item]  = val + ''; 
                }else{
                    rnDate[item] = '';
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
                        rnDate[item][0] = y + ''+ m + '' + d;
                    }else if(val1){
                        rnDate[item][0]  = val1 + ''; 
                    }else{
                        rnDate[item][0] = '';
                    }
                    

                    val2 = val[1];
                     if(val2 instanceof Date){
                        y = val2.getFullYear();
                        m=val2.getMonth()+1;
                        d=val2.getDate();
                        if(m<=9)m = "0" + m;
                        if(d<=9)d="0"+d;
                        rnDate[item][1] = y +'' + m + '' + d;
                    }else if(val2){
                        rnDate[item][1]  = val2 + ''; 
                    }else{
                        rnDate[item][1] = '';
                    }

                    // rnDate[item] = val1 + ',' + val2;

                    
                }else{
                    rnDate[item] = val + '';
                }
                // console.log(item,  rnDate[item]);
            });
            // console.log("rnDate:",rnDate);
            // 将query中值为0的 下拉框 对应的值由0值，置为''
            inFormToNone(rnDate);
            // console.log('getFormQuery:',rnQuery)
            let rn = JSON.parse(JSON.stringify(rnDate));
            // console.log('after parse rn:',rn);

            Object.keys(rn).forEach(item=>{
                if(rn[item]==="undefined"){
                    rn[item] = "";
                }
            })
            // console.log('tableDetail Return:',rn);
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
            
        },
        resetData(){

        }
    }
}
</script>
<style scoped>
/* 修改 id为filter的header的样式 */
#selectForm:deep(.el-form-item__label){
    font-size: 12px;
}
#selectForm>.itemClass:deep(.el-form-item__label){
    color: red;
}

#selectForm{
    padding-top: 0px;
    border: 0px;
}

#selectForm .el-form-item{
    margin-bottom: 5px;
}
.el_side_style{
    font-size: smaller;
    width: 130px !important;
    margin-top: 0px;
    /* outline: 1px solid red; */
}
.el_side_style:deep(.el-input__inner){
    color:black;

}


.el_area_style{
    /* color:black; */
    /* outline: 1px solid red; */
    font-size: smaller;
    margin-top: 0px;
    margin-bottom: 0px;
    width:500px;
    height:60px;

}
.blockClass{
    margin-top: 0px;
    display: block;
}

.br{
    display: block!important;
    height: 0px!important;
    margin-top: 0px!important;
    margin-bottom: 0px!important;
}
/* .el_area_style{
    display: block;
} */

</style>


<style>
/* 写在这个style中的内容一定要注意，会影响所有的组件中的样式，一定要慎用 */
    /* 这里我确实希望所有disabled属性为true的表单都会是这样的，因此这样写合理 */
    .el-input.is-disabled .el-input__inner{
        color:black;
    }
</style>
