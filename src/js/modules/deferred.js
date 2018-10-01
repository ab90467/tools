
/* 
mini deferred, mimick jQuerys implementation
https://softwareengineering.stackexchange.com/questions/143623/what-are-deferred-callbacks

const myDeferredFuncFetchingData = () => {
    let def = new Deferred();
    // async things happens here
    ...
    // It went well
    def.resolve(data);
    ...
    //or we check it and found error
    def.reject(errormsg);
    
    return def;
}



usage: 
const ret = myDeferredFuncFetchingData();
const ret_two = myOtherDeferredFuncFetchingData();

ret.done(function(response){
    console.info('response from function : ' + response);
})

ai.Deferred().allDone([ret, ret2],function() {
    console.error('ALL DONE!');
});



if( ret.id && ret.id === "minideferred") //if u want to check if a func return a mini deferred

    ref.done(fn)
    ref.fail(fn);
    ref.always(fn)

    //example fn() returned data from async func is always sendt inn to fn as param:
    const fn = (fetchedData) =>{
        console.info(`data fetched async:  ${fetchedData}`);
    }

*/


module.exports  = function() {

        var callbacks = [];
        var failCallbacks = [];
        var alwaysCallbacks = [];

        var allDoneCallbacks = [];

        var done = function(callback) {
            if (typeof callback === 'function') {
                callbacks.push(callback);
            }
            return this;
        };
        var fail = function(callback) {
            if (typeof callback === 'function') {
                failCallbacks.push(callback);
            }
            return this;
        };

        var always = function(callback) {
            if (typeof callback === 'function') {
                alwaysCallbacks.push(callback);
            }
            return this;
        };

        const allDone = (array, callback) => {
            let doneArray = [];
            let doneRetValue = [];
            for (let i = 0; i < array.length; i++) {
                doneArray.push('done_' + 1);
                array[i].done(function(resp){
                    doneRetValue[i] = resp;
      
                    doneArray.pop();
                    if(doneArray.length === 0){
                        callback(...doneRetValue);
                    }
                });
           }
           return this;
        };


        var resolve = function(arg) {

            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](arg);
            }

            for (var i = 0; i < alwaysCallbacks.length; i++) {
                alwaysCallbacks[i](arg);
            }
        };
        var reject = function(arg) {

            for (var i = 0; i < failCallbacks.length; i++) {
                failCallbacks[i](arg);
            }
            for (var i = 0; i < alwaysCallbacks.length; i++) {
                alwaysCallbacks[i](arg);
            }

        };
        return {
            done: done,
            then : done, 
            fail,
            always, 
            
            resolve,
            reject,

            data : null,
            id :"minideferred",

            allDone
        };
    };
