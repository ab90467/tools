


/*
https://mixpanel.com

// not include this in build ;-)*/
//import  'bootstrap';
//import '../scss/index.scss';
/* */

import loader from './modules/loader.js';
import xhr from './modules/xhr.js';
import util from './modules/util';
import Deferred from './modules/deferred.js';
import cache from './modules/cache.js';
import log from './modules/log.js';
import event from './modules/event.js';

import mixPanelSingelton from './modules/mixpanel.js';

const ai = {
    loader,
    xhr,
    util,
    cache,
    event,
    log, 
    Deferred
};


const STATUSEXPERIMENTURL   = "/portalfront/dnb/digitalexperiments/bd_experiments_info.json";
const mixPanelErrorName     = "Experiment_failing";
const mixPanelErrorID       = "6d446bf9a25508a7b83291d22fce2a0f";
let DEVENV = false;


if (process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    console.log('Development mode!');
    DEVENV = !true;  
    if(window){
        window.ai = ai;  //make this available on window obj for testing locally
    }
}


window.shouldExperimentStart = (experimentID,  callback, timezone=1, shouldLogToMixpanel = true) => {
    
    const mixpanel = new MixPanel_Incognito(experimentID, DEVENV, shouldLogToMixpanel);
    const errorMixpanel = new MixPanel_Incognito(mixPanelErrorID, DEVENV, shouldLogToMixpanel); //devTest token for now
    const d = new ai.Deferred();
    
    const retFunction = (stat, obj) => {
        const reportObject = {
            id      : experimentID,
            status  : typeof obj.status === 'boolean' ? obj.status : true,
            msg     : obj.msg ? obj.msg : 'experiment done', 
            url     : window ? window.location.href : "n/a"
        }
        if(stat === 'reject'){
            if(DEVENV && console && console.error){
                console.error(`Experiment ERROR:\n${JSON.stringify(reportObject)}\n`); 
            }
            if(errorMixpanel && errorMixpanel.track){
                errorMixpanel.track(mixPanelErrorName,reportObject);  // must log to 'killswitch' project
            }                    
        }else{
            reportObject.callbackvalue = obj.callbackValue;
        }      
        return d[stat](reportObject);
    }


    if(typeof experimentID !== 'string'){
        
        return retFunction('reject',{
            status : false,
            msg : 'missing or invalid experimentID'
        });
    }

    
    xhr.get(STATUSEXPERIMENTURL).then((resp)=>{
        
        if(!resp[experimentID]){
             
            return retFunction('reject',{
                status : false,
                msg : 'not a valid experiment ID'
            });
        }

        if( resp[experimentID].active && typeof resp[experimentID].active === 'boolean' && resp[experimentID].active){
            let workingdays = true;
            let workinghours = true;
            if(typeof resp[experimentID].onlyworkingdays === 'boolean' && resp[experimentID].onlyworkingdays){
                workingdays = util.checkIfDateIsWorkingDay(timezone);             
            }
            if(typeof resp[experimentID].onlyworkinghours === 'boolean' && resp[experimentID].onlyworkinghours){
                workinghours = util.checkIfTimeIsWorkingDay(timezone);              
            }
            
            if(workingdays && workinghours){
                if(typeof callback === "function"){
                    
                    try{                
                        const callbackReturnValue = callback(experimentID, ai, mixpanel, errorMixpanel);
                        if(callbackReturnValue && callbackReturnValue.id && callbackReturnValue.id === 'minideferred'){
                            callbackReturnValue.always(function(resp){
                                return retFunction('resolve',{
                                    callbackValue : callbackReturnValue
                                });
                            });

                        }else{  
                            return retFunction('resolve',{
                                callbackValue : callbackReturnValue
                            });
                        }
                        
                    }catch(e){
                        const errorMSg = `experiment throwed an error: ${e.toString()}`;
                        return retFunction('reject',{
                            status : false,
                            msg : errorMSg
                        });
                    }
                }else{
                    return retFunction('resolve',{
                        msg : 'experiment valid, no callbakc function detected'
                    });
                } 
            }        
        }
        return retFunction('reject',{
            status : false,
            msg : 'not a active experiment'
        });

    }).fail((e) =>{
        return retFunction('reject',{
            status : false,
            msg : 'something failed when contacting server for statusdata for experiment : ' + typeof e === 'object' ? JSON.stringify(e) : e
        });
    });
    return d;
};


//if(module && module.exports){
    
    ai.shouldExperimentStart = window.shouldExperimentStart;
    module.exports = ai;
    window.ai = ai;
//}


