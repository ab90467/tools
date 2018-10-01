

/*
description:
Used for post values and subscribe on values.
usage
  ai.event.post("<my postID>", <stringValue>|<objectValue>, <severity>);

  if <severity> is 'high' and someone post something before there are a subscriber for the postID it will be saved
  and post when a subscriber get registered whith corresponding postID

  ai.event.subscribe("<my postID>", function(<stringValue>|<objectValue>){
      Do something with <stringValue>|<objectValue>
  });

  Every DOM element can be tagged with gj-event attributes in order to automagic post values on events

  gj-event-change
  gj-event-click
  gj-event-keyup

  The event on triggers  should be self explained :)
  The value it sends is configurated in gj-event-change= "my value to send"
  BUT you could also put in a name on a function!
  gj-event-change|click|keyup = refinance.controller.handleThisEvent
      input value to function will be one of this (in this order):
        gj-event-value="inputvalue to function"
        element.val()
        element its self
      Then the function will be executed
*/

  let el = document.createElement("div");
  let storageListenerStarted = false;

  const subscriberList = {};
  const subscriberListData ={};
  const storageChangeFunctions = [];

  const STORAGEID ="ai-eventstorage-msg"; 

  /**
   * [post description]
   * @param  {[type]} id  [description]
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
  */
  const post = (id,val,severity) => {

    if(id === undefined ){ //|| val === undefined){
      console.error('ai.event.post() failes due to error in input id:',id,' value: ',val);
      return false;
    }

    if(severity === 'high'){
        let dataTab = subscriberListData[id]  ? subscriberListData[id] : [];
        dataTab.push(val);
        subscriberListData[id]= dataTab;
    }

    const event = new CustomEvent(id, { "detail" : (val === undefined) ? "dummy" : val });    
    el.dispatchEvent(event);  
 
  };


  /**
   * [subscribe description]
   * @param  {[type]}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  const subscribe = (id, callback) => {
    
    if(typeof id !== 'string' || typeof callback !== 'function'){
      console.error('ai.event.subscribe() failes due to error in input:  id:',id,' callback: ',callback);
      return false;
    }

    subscriberList[id]='registered';
    var setupSubscribe = function(_id){
  
        var ret = el.addEventListener(_id, function (e) {
            callback(e.detail ? e.detail : undefined);
        }, false);
        return ret;
    };


    if (id instanceof Array){
        for (i in id) {
            setupSubscribe(id[i]);
        }
        return true;
    }else{
        return setupSubscribe(id);
    }

    if(subscriberListData[id]){
        var array = subscriberListData[id];
        var i;
        for(i in array){
            post(id, array[i]);
        }
        subscriberListData[id] = undefined;
    }
  };


  // ==================================================================================================================

   // Communication between tabs or windows support -using localStorage
   // https://stackoverflow.com/questions/28230845/communication-between-tabs-or-windows
  const message_broadcast = function(message){
      var msg = message;
      if(typeof msg === 'object'){
          try{msg = JSON.stringify(message);}catch(e){msg='failing';}
      }
      if(msg === 'failing'){
        console.error('ERROR ai.event message_broadcast() do not have valid message ', message);
        return false;
      }

      localStorage.setItem(STORAGEID,msg);
      localStorage.removeItem(STORAGEID);
      return true;
  };


  // register function to run when system is broadcasting msg
  const add_message_receive_function = function(eventCallbackFunction){

      if( typeof eventCallbackFunction !== "function" && typeof eventCallbackFunction !== "string" ){
        console.error('ERROR ai.event message_receive() not valid callback registered ', eventCallbackFunction);
        return false;
      }
      if(!storageListenerStarted){
        window.addEventListener("storage", _message_do_action);
        storageListenerStarted = true;
      }
      storageChangeFunctions.push(eventCallbackFunction);
      return true;
  };


  // this function runs when localstore change event goes
  // will run every function that is registered using add_message_receive_function
  const _message_do_action = function(ev){
      const errorMsg = 'ERROR ai.event.message_receive() error in callback func: ';
      if (ev.key !== STORAGEID) return; // ignore other keys
      if (ev.newValue === null || ev.newValue === undefined) return;
      let msg;
      try{
        msg = JSON.parse(ev.newValue);
      }catch(e){
        msg = ev.newValue;
      }

      for(var i in storageChangeFunctions){
        var callback =  storageChangeFunctions[i];
        /*if(typeof callback  === "string"){
          callback = gj.utility.getFunctionFromString(callback); // da må denne inn i AI
        }*/
        if(typeof callback  === "function"){
          try{
            callback(msg, ev);
          }catch(e){
            console.error(errorMsg, e);
            return false;
          }
        }else{
          console.error(errorMsg, callback);
        }
      }
  };

   //public API
  module.exports  = {
        post,
        subscribe,

        message_broadcast,
        add_message_receive_function
  };