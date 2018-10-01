
import Deferred from './deferred.js';
import loader from './loader.js';

// old fashion XHR POST and GET for json-data


const xhrList = {};

const post = (url, data, loaderMsg) => {
    if(typeof data === 'object'){
        try{
            const dummy = JSON.stringify(data);
        }catch(e){
            console.error("ERROR xhr fn post(url,data) has not valid json data :" + data);
            return false;
        }
    }
    return _XHR(url, "POST", data, loaderMsg);
};

const get = (url, data, loaderMsg) => {
    if (typeof data === 'object') {
        let encodedString = '';
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + data[prop]);
            }
        }
        data = encodedString;
    }
    const indent = (url.indexOf("?") > 0) ? '&' : '?';
    url += (typeof data === 'string' && data !== '') ? `${indent}${data}` : '';
    return _XHR(url, "GET", undefined, loaderMsg);
};

const _XHR = function(url, xhrType, data, loaderMsg) {
    //console.error('URL ', url)
    let def = new Deferred();
    let xhr = xhrList.url ? xhrList.url : false;
    if (xhr && xhr.readyState != 4) {
        xhr.abort();
        xhrList.url = undefined;
    }
    xhr = new XMLHttpRequest();
    def.data ={
        xhr : xhr
    }; //make request available outside _XHR;
    xhrList.url = xhr;

    xhr.timeout = 5000; // time in milliseconds
    xhr.open(xhrType, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    if(typeof loaderMsg !== 'boolean'){
        loader.open(loaderMsg || '');
    }

    xhr.ontimeout = function (e) {
        def.reject(`xhr timeout: ${e}`);
        loader.close();
    };

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){ 
            if(xhr.status >= 200 && xhr.status < 300){
                let respons = false;
                try{
                    respons = JSON.parse(xhr.responseText);
                }catch(e){
                    return def.reject(`not valid JSON respons from server: ${e}`);
                }
                def.resolve(respons);
            } else {
                def.reject(`readystate or status is wrong, reason: ${xhr.statusText}`);
            }
            loader.close();
        }
    };

    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
    return def;
};

/*
    lightweight logging to server. Use sendBeacon if available
*/
const logToServer = (url,data) => {
    
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, data);
        return true;
    }
    xhr._logData(url,data);   
};


/* supersimeple XHR POST func for logging -should we use GET insted ? */
const _logData = (url,data) => {
    
    // data = typeof data === 'object' ? JSON.stringify(data) : data;
    if(typeof data === 'object'){
        try{
            data = JSON.stringify(data);
        }catch(e){
            console.error("ERROR xhr fn logData(url,data) has not valid json data :" + data);
            return false;
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.open('post', url, false);
    xhr.send(data);
};


module.exports  = {
    post,
    get,
    logToServer
};

if (process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    module.exports._logData = _logData;
    module.exports._XHR =_XHR;
}
