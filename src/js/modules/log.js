


import util from './util.js';

/* 
    purpose of this file:
        create functions to use for logging user behavior here !


*/

// https://www.smashingmagazine.com/2018/07/logging-activity-web-beacon-api/
//TODO removeEventListener seems to not work 
const trackMouseMovements = (flag) => {
    let mouseCoordinates = [];
    let mouseEventCounter = 0;
    const logInterval = 3;
    const MouseloggingURL = 'https://localhost:9000/log';

    const logFunction = (e)=> {
        if(mouseEventCounter%logInterval === 0){
            mouseCoordinates.push({X :e.pageX, y :  e.pageY});
        }
        mouseEventCounter +=1;
    };

    if(flag === 'end'){
        document.removeEventListener("mousemove", logFunction);
        return mouseCoordinates;
    }else{
        util.registerPageUnloadFn(function(){
            logToServer(MouseloggingURL,JSON.stringify({
                url : document.location.href,
                data : mouseCoordinates
            }));
        });
        window.addEventListener('mousemove', logFunction);
    }
};




module.exports  = {
    trackMouseMovements
};