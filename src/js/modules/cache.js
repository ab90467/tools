
/*
description:
Provide a caching mecanisme.
Can be used between modules, views and controllers for setting and getting any type of data
  no automagic support for DOM attributes or DOM events

  usage :
  SET:
  ai.cache.set(<key>,<data>);

  GET:
  var <data> = ai.cache.get(<key>);

  WATCH:
  gj
  ai.cache.watch(<key>, <fn>);
  <f> will be trigged when registered <key> get updated.

    fn(<key>, <newVal>, <oldVal>);


    NB!
    if you setting a value A like this gj.store.set('key', A, true) it will be persist.
    in same  session setting value to B without persist it : gj.store.set('key', B)
     -> gj.store.get('key') will return B in same session.
     But in next session it will give the persistent value  (A)

*/

// internal storage object holdig cache data
var storage = {};
var watchingFunctions = {};
const LOCALSTORAGENAME ="ai.cache";

import utility from './util.js';

/*
    add  function to a <key> value in cache object.
    Function will be trigged on <key> change
*/
var watch = function(key, fn) {
    if (typeof fn !== "function") {
        console.error('ERROR ai.cache.watch(), watch function not a function...typeof: ', typeof fn);
        return false;
    }
    var array = watchingFunctions[key] || [];
    array.push(fn);
    watchingFunctions[key] = array;
};

const del =  (key, data) => {
    return set(key, undefined);
};

/**
 * set ai.cache.get store data on key from cache object
 * @param {string} key     unique key that data will be assosiated with
 * @param {any} data    he actual data to be stored in cache
 * @param {boolean} persist use persisting option available in browser
 */
var set = function(key, data, persist) {
    /*var myStorage = _getDataObjFromPersistStore();

    if(!myStorage){
        myStorage = storage;
    }*/
    //console.error('data ',data, typeof data);

    var oldValue = get(key, undefined, true);
    storage[key] = {
        "data": data,
        "timestamp": seconds_since_epoch()
    };

    for (var storedKey in watchingFunctions) {
        if (storedKey !== key) continue;
        //console.error('watch callback functions array', watchingFunctions[key])
        for (var i in watchingFunctions[key]) {

            try {
                watchingFunctions[key][i](data, oldValue, storedKey);
            } catch (e) {
                console.error('ERROR ai.cache.set(), error running watch function:', e);
                continue;
            }
        }
    }

    if (persist) {
        var myStorage = _getDataObjFromPersistStore();
        if (!myStorage) {
            myStorage = storage;
        } else {
            myStorage[key] = {
                "data": data,
                "timestamp": seconds_since_epoch()
            };
        }
        if (!window.localStorage) {
            utility.createCookie(LOCALSTORAGENAME, JSON.stringify(myStorage), 90);
        } else {
            localStorage.setItem(LOCALSTORAGENAME, JSON.stringify(myStorage));
        }
    }
    return true;
};


/**
 * get ai.cache.get store data on key from cache object
 * @param  {string} key                key value used to get data to return
 * @param  {integer} maxLivingInMinutes Not in use for now (no of minutes how old valid data can be)
 * @return {any}                    return stored value
 */
var get = function(key, maxLivingInMinutes, internalGet = false /*suppress errors when used internal in module*/) {

    var el;
    var errorMsgAndReturn = function() {
        if(!internalGet){
            console.info('INFO : ai.cache.get() :: You are using a key that do not initialized or not exist: ' + key);
        }      
        return undefined;
    };

    try {
        el = storage[key].data;
        return el;
    } catch (e) {
        var myStorage = _getDataObjFromPersistStore();
        if (myStorage) {
            try {
                el = myStorage[key].data;
                return el;
            } catch (e) {
                errorMsgAndReturn();
            }
        } else {
            errorMsgAndReturn();
        }
    }
    return undefined;

    // not in use for now, but a good idea we might use later....

    //console.error("get() ",key,maxLivingInMinutes,el);
    /*if(maxLivingInMinutes === 0){ // '0' indicates user wants fresh data, not support this value...
        return undefined;
    }
    maxLivingInMinutes = maxLivingInMinutes ? maxLivingInMinutes * 60 : false;
    if(key in myStorage){
        //console.error("get() ",key, myStorage[key].data, maxLivingInMinutes,' < max , alder på cache >',(seconds_since_epoch() - storage[key].timestamp));
        if(maxLivingInMinutes && ((seconds_since_epoch() - myStorage[key].timestamp) > maxLivingInMinutes)){
            return undefined;
        }
        //console.error('get() ',storage[key].data)
        return myStorage[key].data;
    }
    return undefined;*/
};


var _getDataObjFromPersistStore = function(key) {
    var data;

    if (utility.isSupportingLocalStorage()) {
        data = localStorage.getItem(LOCALSTORAGENAME) || false;
    } else {
        data = utility.getCookie(LOCALSTORAGENAME) || false;
    }
    if (!data) {
        return false;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Error ai.cache.get() :: parse localStorage/cookie value: ", e);
        return false;
    }
};

// not in use/tested
var deleteUsingRegExp = function(inKey, regexp) {
    if (!regexp) {
        if (storage[key]) {
            delete storage[key];
            return true;
        } else {
            return false;
        }
    }

    var regKey = new RegExp(inKey);
    var retFlag = false;
    for (var key in storage) {
        if (regKey.test(key)) {
            delete storage[key];
            retFlag = true;
        }
    }
    return retFlag;
};

/**
 * Delete ALL data in cache object
 *
 */
var deleteAll = function() {
    storage = {};
    localStorage.removeItem(LOCALSTORAGENAME);
    util.deleteCookie(LOCALSTORAGENAME);
};

var seconds_since_epoch = function() {
    return Math.floor(Date.now() / 1000);
};

module.exports = {
    get,
    set,
    delete : del,
    deleteAll,

    watch
};
