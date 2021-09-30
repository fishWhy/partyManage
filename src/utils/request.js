import axios from 'axios';
import router from "../router";
// import vuex from "../store/index.js"

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    // baseURL:'http://172.22.22.35:8080/api/internal',

    baseURL:'http://172.16.10.65:8080/api/internal',

    // baseURL:'http://172.16.10.65:8888/api/internal',
    // http://172.16.10.65:8888
    
    // baseURL:'http://localhost:8080/api/internal',
    
    // baseURL:'http://172.22.14.96:8080/api/internal',

    // baseURL:'http://127.0.0.1:8080/api/internal',
    
    // baseURL:'http://139.9.131.190:8080/api/internal',
    // headers: {'content-type': 'application/json'},
    // withCredentials: true,
    // headers: {'content-type': 'application/x-www-form-urlencoded'},

    timeout: 240000
});


service.interceptors.request.use(
    config => {

        // let token = vuex.getters.token, stuId = vuex.getters.stuId;
        let stuId = localStorage.getItem('stuId');
        let token = localStorage.getItem('token');
        // console.log('the stuId',stuId);
        // console.log('the token',token);

        if(token && stuId){
            config.headers.au = token;//将token设置成请求头
            config.headers.id = stuId;
            // config.headers.duty = localStorage.getItem("duty");
        }


        console.log('config:',config); //stuId
        return config;
    },
    error => {
        console.log('rquest error:',error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.code==1000 ||response.data.code==1000){
                router.push('/login');
            }
            console.log('response:',response);
            return response.data;
        }else  {
            console.log('response error1:');
            Promise.reject();
        }
    },
    error => {
        let errMgs = error.toJSON();
        console.log(' the response  error messages of network   after error.toJSON() from axios :',errMgs)
        if (errMgs.code === 'ECONNABORTED' && errMgs.message.indexOf('timeout') !== -1) {
            return Promise.reject('网络请求超时，请检查网络或重试')
        }else{
            return Promise.reject(error);
        }
    }
);

export default service;
