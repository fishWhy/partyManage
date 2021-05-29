import axios from 'axios';
import router from "../router";

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL:'http://172.22.22.35:8080/api/internal',
    // headers: {'content-type': 'application/json'},
    // withCredentials: true,
    // headers: {'content-type': 'application/x-www-form-urlencoded'},

    timeout: 9999
});


service.interceptors.request.use(
    config => {
        // console.log('config:',config); //stuId
        console.log('token:',localStorage.token);
        if(localStorage.token && localStorage.stuId){
            config.headers.au = localStorage.getItem('token');//将token设置成请求头
            config.headers.id = localStorage.getItem('stuId');
            // console.log('config',config);
            // config.headers.content-type = 'application/x-www-form-urlencoded';
        }
        // return config;
        // const token = store.getters['user/token']
        // const user = store.getters['user/userInfo']
        // config.data = JSON.stringify(config.data);
        // config.headers = {
        //     'Content-Type': 'application/json',
        //     'au': 'token34',
        //     'id': '13414'
        // }
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
        console.log('response error2:',error);
        return Promise.reject();
    }
);

export default service;
