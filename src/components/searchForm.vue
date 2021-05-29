<template>
    
    <div >
        
        <!-- <el-divider style="margin: 5px 0 10px 0;"></el-divider> -->

        <el-form  label-position="left" label-width="auto" id="selectForm" :inline="true"  :style="{ minHeight:minHeight+'px'}">
            <el-form-item v-for='item in formObj' :label="item.label" :key='item.prop'  size='mini'>
               <!-- 输入框 -->
                <el-input v-if="item.type==='Input'" v-model="query[item.prop]" class="el_side_style"  ></el-input>
                <!-- 下拉框 -->
                <el-select v-if="item.type==='Select'" v-model="query[item.prop]"  class="el_side_style"  >
                    <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                </el-select>   
                <!-- 年月日 -->
                <el-date-picker  v-if="item.type==='YMR'" :default-value="item.default_time" v-model="query[item.prop]" style="width:130px;font-size:smaller" class="el_side_style"></el-date-picker>
                <!-- 年月 -->
                <el-date-picker
                  v-if="item.type==='YM'"
                  v-model="query[item.prop]"
                  type="month"
                  placeholder="选择月"
                  style="width:120px;font-size:smaller" class="el_side_style"
                  >
                </el-date-picker>
                <!-- 月份选择区间    -->
                <el-date-picker
                    v-if="item.type==='YMArea'"
                    v-model="query[item.prop]"
                    type="monthrange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    :shortcuts="shortcuts"
                    style="width:180px;font-size:smaller" class="el_side_style"
                >
                </el-date-picker>

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
        minHeight:{
            type:Number,
            default:70
        }
    },
    created(){
        this.formObj.forEach(item=>{
            this.query[item.prop] = "";
        })
    },

    data(){
       return {
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
            //筛选表单
            //筛选/搜索数据时的条件
            query: {},
       }
    },
    computed:{
        
    },
    methods:{
        resetQuery(obj){
            Object.keys(this.query).forEach(item=>{
                if(Object.prototype.hasOwnProperty.call(obj,item)){
                    this.query[item] = obj[item];
                }
            });

        },
        getQuery(){
            let rnQuery = {};
            let YMR = [], YM = [], YMArea = [];
            
            Object.keys(this.query).forEach(item=>{
                if(item!=='YMR'&&item!=='YM'&&item!=='YMArea'){
                    rnQuery[item] = this.query[item];
                }else {
                    rnQuery[item] = "";
                }
            })

            this.formObj.forEach(item=>{
                if(item.type === 'YMR'){
                    YMR.push(item.prop);
                } else if(item.type === 'YM'){
                    YM.push(item.prop);
                }else if(item.type === 'YMArea'){
                    YMArea.push(item.prop);
                }
            });

            YMR.forEach(item=>{
                let val = this.query[item];
                if(val instanceof Date){
                     let y = val.getFullYear(), m=val.getMonth()+1, d=val.getDate();
                    if(m<=9)m = "0" + m;
                    if(d<=9)d="0"+d;
                    rnQuery[item] = y + m + d;
                }
            });

            YM.forEach(item=>{
                let val = this.query[item];
                if(val instanceof Date){
                     let y = val.getFullYear(), m=val.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnQuery[item] = y + m;
                }
            });
            
            YMArea.forEach(item=>{
                let val = this.query[item];
                if(val instanceof Array){
                    rnQuery[item] = [];
                    let val1,val2,y,m;
                    val1 = val[0];
                    y = val1.getFullYear();
                    m=val1.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnQuery[item][0] = y + m + '01';

                    val2 = val[1];
                    y = val2.getFullYear();
                    m=val2.getMonth()+1;
                    if(m<=9)m = "0" + m;
                    rnQuery[item][1] = y +''+ m + '31';
                }
            });

            // 将query中值为0的 下拉框 对应的值由0值，置为''
            inFormToNone(rnQuery);
            // console.log('getFormQuery:',rnQuery)
            return rnQuery;
        }
    }
}
</script>
<style scoped>
/* 修改 id为filter的header的样式 */
#selectForm:deep(.el-form-item__label){
    font-size: 12px;
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

</style>
