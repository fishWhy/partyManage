<template>
    <div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" v-model="visibleElDialog" width="30%" 
        :close-on-click-modal="false" :show-close="false">
            <el-form  label-position="left" label-width="70px" size="small">
                <div id="formAdd">
                    <el-form-item v-for='item in formItems' :label="item.label" :key='item.prop' >
                        <!-- 输入框 -->
                        <el-input v-if="item.type==='Input'" v-model="form[item.prop]" class="addFormDialog_314"></el-input>
                        <!-- 下拉框 -->
                        <el-select v-if="item.type==='Select'" v-model="form[item.prop]" class="addFormDialog_314">
                            <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                        </el-select>
                         <!-- 单选 -->
                        <el-radio-group v-if="item.type==='Radio'" v-model="form[item.prop]">
                            <el-radio v-for="ra in item.radios" :label="ra.label" :key="'select'+ra.label" class="addFormDialog_314" >{{ra.value}}</el-radio>
                        </el-radio-group>
                        <!-- 日期 -->
                        <el-date-picker  size="small" class="addFormDialog_314" style=" width: 200px;" v-if="item.type==='YMR'" :default-value="item.default_time" v-model="form[item.prop]"></el-date-picker>
                        </el-form-item>
                </div>                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelDia">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
<script>
export default{
    props:{
        formDate:{
            type: Object,
            default:()=>{
                //  {id:"1871172",name:'胡亮',gender:'男',birthday:"1997-06-07",major:'计算机软件',proED:'博士',political:'党员',time:'2019-10-01'},
                return {
                    id: "1871172",
                    name: "胡亮",
                    gender:'男',
                    birthday:'1997-06-07',
                    major:'计算机软件',
                    proED:'博士',
                    political:'党员',
                    time:'2019-10-01',
                }
            }
        },
        visible:{
            type: Boolean,
            default: false
        },
        title:{
            type: String,
            default:'el_dialog'
        }
    },
    created(){
        //注意这里一定要深拷贝一次。
        this.form = JSON.parse(JSON.stringify(this.formDate));
        

        if(this.form.birthday){
            this.form.birthday = new Date(this.form.birthday);
        }
        if(this.form.time){
            this.form.time = new Date(this.form.time);
        }

    },
    watch:{
        formDate:function(nval){
            //注意这里一定要深拷贝一次。
            this.form = JSON.parse(JSON.stringify(nval));
                
            if(this.form.birthday){
                this.form.birthday = new Date(this.form.birthday);
            }
            if(this.form.time){
                this.form.time = new Date(this.form.time);
            }
        },
        visible:function(nval){
             this.$nextTick(()=>{
                this.visibleElDialog = nval;
             })
        }
    },
    
    data(){
       return {
           formItems:[
                {label:'学号',prop:'id',type:'Input'},
                {label:'姓名',prop:'name',type:'Input'},
                {label:'性别',prop:'gender',type:'Select',options:[{value:'',label:'全部'},{value:'男',label:'男'},{value:'女',label:'女'}]},
                {label:'生日',prop:'birthday',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-25))},
                {label:'专业',prop:'major',type:'Select',options:[{value:'',label:'全部'},{value:'软件工程',label:'软件工程'},{value:'计算机软件',label:'计算机软件'}]},
                {label:'学历',prop:'proED',type:'Select',options:[{value:'',label:'全部'},{value:'大学',label:'大学'},{value:'研究生',label:'研究生'},{value:'博士',label:'博士'},{value:'3',label:'其他'}]},
                {label:'政治面貌',prop:'political',type:'Select',options:[{value:'',label:'全部'},{value:'党员',label:'党员'},{value:'预备党员',label:'预备党员'},{value:'入党积极分子',label:'入党积极分子'},{value:'其他',label:'其他'}]},
                {label:'入党时间',prop:'time',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-10))},
            ],
            form: {
                id: "",
                name: "",
                gender:'',
                birthday:'',
                major:'',
                proED:'',
                political:'',
                time:'',
            },
            visibleElDialog: false
       }
    },
    methods:{
        saveEdit() {
            
            // 将日期转换成：Y-M-D的型式，例如：2019-01-01
            if(this.form.birthday){
                let y = this.form.birthday.getFullYear(),m=this.form.birthday.getMonth()+1,d=this.form.birthday.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.birthday = y + '-' + m + '-' + d;
            }
            if(this.form.time){
                let y = this.form.time.getFullYear(),m=this.form.time.getMonth()+1,d=this.form.time.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.time = y + '-' + m + '-' + d;
            }

            let rData = JSON.parse(JSON.stringify(this.form))

            this.$emit('saveDia',rData);

        },
        cancelDia(){
            //取消
            this.$emit('cancle');
            console.log('cancleEd')
        }
    }
}
</script>


<style scoped>
#formAdd .el-form-item{
    /* outline: 1px solid red; */
    margin: 15px auto;
    width: 60%;

}
.addFormDialog_314{
    width: 200px!important;
}

</style>