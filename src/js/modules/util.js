

const NorwegianHollidays = {
    '0101' : 'newyear',

    '0105' : 'National labour day',
    '1705' : 'Constitution Day',

    '2512' : 'Christmas Day'
};


const pad = function(D){
    D = D+'';
    return D.length === 1 ? '0' + D : D;
};
    

// find Easter holidays
const getEasterDates = function(Y) {
    var _t = new Date();
    Y = Y ||  _t.getFullYear();

    var C = Math.floor(Y/100);
    var N = Y - 19*Math.floor(Y/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    
    var findDateString = function(days){
        var _date = new Date(Y, M-1, D,0,0,0,0);
        _date.setDate(_date.getDate() + days);
        var dd = _date.getDate();
        var mm = _date.getMonth()+1;

        return pad(dd) + pad(mm);
    };

    var MaundyThursday = findDateString(-3);
    var GoodFriday = findDateString(-2);
    var EasterDay = pad(D)+pad(M);
    var EasterMonday = findDateString(1);
    var AscensionDay = findDateString(39);
    var WhitSunday = findDateString(49);
    var whiteMonday = findDateString(50);

    return [MaundyThursday,GoodFriday,EasterDay,EasterMonday,AscensionDay,WhitSunday,whiteMonday];
};


//put in dates we want to check
const checkIfDateIsWorkingDay = function(){
    const date = new Date();
    let day = date.getDay();
    let month = date.getMonth() + 1 + '';

    if((day === 6) || (day === 0)){
        return false;
    }
    var array = getEasterDates();
    // var day = date.getDate() + '';
    
    //day =  (day.length === 1 ? '0' + day : day )  + (month.length === 1 ? '0' + month : month );
    day =  pad(day)  + pad(month);
    for(var key in array){
        NorwegianHollidays[array[key]] = 'Easter dates';
        if(array[key] === day){
            return false;
        }
    }
    return true;
};

const checkIfTimeIsWorkingDay = (timezone = 1, from = 8, to = 16 , date = new Date() /*support testing*/) =>{

    const NORWAYtimezone = timezone;
    const UTChour = date.getUTCHours();
    const hour = UTChour + NORWAYtimezone;

    //console.error(from, to, hour , date.getUTCHours());
    return (hour >=from && hour < to);

}


// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
const browserVersion = () => {
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    let tem;
    
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
    }

    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null){
            return {name:'Opera', version:tem[1]};
        }
    }

    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {
        M.splice(1,1,tem[1]);
    }
    return {
        name: M[0],
        version: parseInt(M[1])
    }
};

//check if array of selectors exist in DOM, return true or false
const isDOMcomplete = (array) => {

    for(var key in array){
        const elm = document.querySelectorAll(array[key]); 
        if(elm.length < 1){
           // _mixpanelLog(experiment, 'ai.utility.isDOMcomplete() missing element :: ' + array[key]);
            return false;
        }
    }
    return true;
};

// check if TEXT in node match input, return true| false; 
const assertNodeText = (selector, content) => {
    const elm = document.querySelectorAll(selector); 
    if(elm.length === 1){
        //console.error(elm[0].innerHTML , content)
        if(elm[0].innerHTML !== content){
           // _mixpanelLog(experiment, 'ai.utility.assertNodeText() invalid content :: ' + elm.innerHTML);
            return false;
        }
    }else{
        return false;
    }
    return true;
};

const isLocalDeveloping = () =>{
    return document.location.hostname.match(/localhost/i);
};

//take querykey  (paramName)  and return value or boolean false if it not exist
const getQueryParamValue = (paramName) => {
    if(!paramName || paramName === "") return false;
    var a = window.location.search.substr(1).split('&');
    if (a === "") return false;

    for (var i=0;i<a.length;i++) {
            var pair = a[i].split("=");
            if(pair[0].toLowerCase() === paramName.toLowerCase()){
          return decodeURIComponent(pair[1]);
        }
    }
    return false;
};


// test func to determ if browser supports local storage
const isSupportingLocalStorage = function(){
    var mod = 'dummyValue';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
};

const createCookie = function(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    //console.error("cookie", expires,value);
    document.cookie = name+"="+value+expires+"; path=/";
};

const getCookie = function(name) {
    const match = document.cookie.match(name+'=([^;]*)');
    return match ? match[1] : undefined;
  };

const OLD__readCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) ===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};

const deleteCookie = function(name){
    createCookie(name,"",-1);
};

const _mixpanelLog = (logMsg)=>{
    console.error('ERROR mixpanel logging msg :: ' + logMsg);
    if(typeof window.mixpanel === 'object' && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(logMsg);
        }catch(e){
            console.error('ERROR :  mixpanel.track() :: ' + e);
        }
    }  
};

// add functions to be executed when 'load' event goes. If this event is already fired the function will be executed right away
const registerPageLoadFn = (fn) => {
    _registerFn(fn, 'load', 'registerPageStartupFn' );
};
// add functions to be executed when 'beforeunload' event goes.
const registerPageUnloadFn = (fn) => {
    _registerFn(fn, 'beforeunload', 'registerPageUnloadFn' );
};

const _registerFn = (fn, fnContext, fnName) => {
    if(typeof fn !== 'function'){
        console.error(fnName + ' :: error, fn not a function: ', typeof fn);
        return false;
    }
    if(document.readyState === 'complete' && fnContext === 'load'){
        fn();
    }else{  
        window.addEventListener(fnContext, function() {
            fn();
        });
    }
};

module.exports  = {
    checkIfDateIsWorkingDay,
    checkIfTimeIsWorkingDay,
    browserVersion,
    isDOMcomplete,
    assertNodeText,
    
    getQueryParamValue, 
    isLocalDeveloping,
    
    isSupportingLocalStorage,
    createCookie,
    getCookie, 
    deleteCookie,

    registerPageLoadFn,
    registerPageUnloadFn
};
