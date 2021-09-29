<template>
    <div class="login-wrap">
        <div class="ms-login" v-if="isLogin">
            <div class="ms-title">党员信息管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" >
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="userName">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                        <!-- <el-button icon="el-icon-user"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div style="overflow:hidden;">
                    <span class="login-tips" style="font-size:12px;">Tips : 用户名必须为4到10位的数字，密码必须6到10位的数字或字母。</span>
                    <span class="login-tipsPs" @click="isLogin = false">修改密码?</span>
                </div>
            </el-form>
        </div>

        <div class="chPassword" v-else>
            <div class="ms-title">修改密码</div>
            <el-form :model="nPassword" :rules="paRules" ref="cPassword" label-width="0px" class="ms-content" >
                <el-form-item prop="userName">
                    <el-input v-model="nPassword.userName" placeholder="用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                        <!-- <el-button icon="el-icon-user"></el-button> -->
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="老密码"
                        v-model="nPassword.password"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="nPassword">
                    <el-input
                        type="password"
                        placeholder="新密码"
                        v-model="nPassword.nPassword"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="confirmNPassword">
                    <el-input
                        type="password"
                        placeholder="再次输入新密码"
                        v-model="nPassword.confirmNPassword"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="changePassword()">确定</el-button>
                </div>
                <div style="overflow:hidden;">
                    <span class="login-tips" style="font-size:12px;">Tips : 用户名必须为4到10位的数字，密码必须6到10位的数字或字母。</span>
                    <span class="login-tipsPs" @click="isLogin=true">返回登录</span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {logIn,changePsw} from '../api/index.js'

export default {
    data() {
        return {
            isLogin:true,
            param: {
                userName: "00008612",
                password: "123456",
                // userName: "",
                // password: ""
            },
            rules: {
                userName: [
                    { required: true, message: "请输入学号", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            },

            nPassword:{
                userName:'',
                password:'',
                nPassword:'',
                confirmNPassword:''
            },
            paRules: {
                userName: [
                    { required: true, message: "请输入正确的学号",  trigger: "blur" },
                    {min:6,max:10,message:'长度在6到10位的数字'},
                    {pattern:/^[0-9]{6,10}$/,message:'用户名只能是数字'}
                ],
                password: [
                    { required: true, message: "请输入正确的老密码", trigger: "blur" },
                    {min:6,max:10,message:'长度在6到10位'},
                    {pattern:/^[a-zA-Z\d]{6,10}$/,message:'密码只能是数字和大小写字母'}
                ],
                nPassword:[
                    { required: true, message: "请输入正确格式的新密码",trigger: "blur" },
                    {min:6,max:10,message:'长度在6到10位'},
                    {pattern:/^[a-zA-Z\d]{6,10}$/,message:'密码只能是数字和大小写字母'}
                ],
                confirmNPassword: [
                    { required: true, message: "请再次输入正确格式的新密码以验证",trigger: "blur" },
                    {min:6,max:10,message:'长度在6到10位'},
                    {pattern:/^[a-zA-Z\d]{6,10}$/,message:'密码只能是数字和大小写字母'}
                ]
            },

        };
    },
    created() {
        localStorage.clear();
        this.$store.commit("clearTags");
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {

                    logIn(this.param).then((_data)=>{
                        // this.$router.push("/home/table");
                        let stuId = _data.user.stu_id, token = _data.token;
                        if(_data.duty>1){
                            this.$store.commit('setRole',{stuId:stuId, role:'manager',token:token});
                            localStorage.setItem('stuId',stuId);
                            localStorage.setItem('token',token);
                            this.$router.push({path:'/home/table'});
                        }else{
                            this.$store.commit('setRole',{stuId:stuId, role:'user',token:token})
                            localStorage.setItem('stuId',stuId);
                            localStorage.setItem('token',token);
                            this.$router.push({path:'/selfForm'});
                        }

                        
                        this.$message.success("登录成功");
                    },(item)=>{
                        console.log('login err:',item);
                        this.$message.error(item+"");
                    });

                    // this.$router.push("/home/table");

                    
                } else {
                    this.$message.error("请输入账号和密码");
                    return false;
                }
            });
        },
        changePassword(){
            if(this.nPassword.confirmNPassword!==this.nPassword.nPassword){
                    this.$message.error("请保证两次输入的新密码相同");
                    return;
            }else{
                changePsw(this.nPassword).then((isSetNew)=>{
                    if(isSetNew){
                        this.$message.success("重置密码成功，请重新登录");
                        this.isLogin = true;
                    }else{
                        this.$message.error("设置失败，请重新设置");
                    }
                })
            }
            console.log(this.nPassword);
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
    overflow: hidden;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: rgb(95, 208, 243);
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 14px;
    line-height: 30px;
    color: #fff;
}

.login-tipsPs {
    font-size: 14px;
    line-height: 30px;
    color: rgb(77, 88, 243);
    margin-left: 140px;
}



.chPassword {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -220px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.login-tipsPs:hover{
    cursor:pointer
}
</style>