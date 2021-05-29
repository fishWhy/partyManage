function isUserName(str){
    // reg匹配 4到10位的数字
    const reg = /^[0-9]{4,10}$/g
    return reg.test(str);
}

function isPassword(str){
    // reg匹配 6到10位的小写字母、大写字母、数字
    const reg = /[a-zA-Z0-9]{6-10}/g
    return reg.test(str);
}

export {isUserName,isPassword}
