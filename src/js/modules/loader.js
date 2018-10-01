
// old fashion XHR POST and GET for json-data
let dialogOpen = false;
let cssAdded = false;
let loaderCounter = 0;
let loaderTexts = [];
const addCss = ()=>{
    if(cssAdded){return};
    const cssContent = `
        .ai-loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #007272;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            animation: aispin 2s linear infinite;
        }
        
        @keyframes aispin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .modal {
            display: block; 
            position: fixed; 
            z-index: 999; 
            left: 0;
            top: 0;
            width: 100%; 
            height: 100%; /* Full height */
            overflow: none; /* Enable scroll if needed */

            
            background: #fff;
            opacity: .90;
        }
        .modal-content {
            background-color: #fefefe;
            margin: 30% auto; /* 15% from the top and centered */
            padding: 50px; 
            width: 200px; 
        }

        .modal-loadertext {
            border: 0px;
            margin: 10px 0 0 0; 
            text-align: center;
        }
        
        `;
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(cssContent));
    head.appendChild(style);
    cssAdded = true;
};
const open = (text) => {
    if(dialogOpen){
        close("_inernal_");
    };
    addCss();
    let modalWrapper = document.createElement('div');
    modalWrapper.setAttribute("class", "modal");
    let modalContent = document.createElement('div');
    modalContent.setAttribute("class", "modal-content");


    var loader = document.createElement('div');
    loader.setAttribute("class", "ai-loader");
    modalContent.appendChild(loader);
    if(text){
        let p = document.createElement('p');
        p.setAttribute("class", "modal-loadertext");
        p.setAttribute("id", "modal-loadertext-container");
        // let content = document.createTextNode(text); 
        // p.appendChild(content);
        p.innerHTML = text;
        modalContent.appendChild(p);
        //console.error('1-',loaderTexts);
        loaderTexts.push(text);

    }else{
        loaderTexts.push('');
    }
    modalWrapper.appendChild(modalContent);
    document.body.appendChild(modalWrapper);
    dialogOpen= true;
    loaderCounter ++;
   // console.error('loaderCounter open()', loaderCounter, loaderTexts, loaderTexts.length);
};

const close = function(choice){
   
    if(choice !== "_inernal_"){
        //console.error('loaderCounter close() INTERNAL', loaderCounter)
    //}else{

        if(loaderTexts.length>0 ){
            loaderTexts.pop();
    
            if(loaderTexts.length>0 ){
                document.getElementById('modal-loadertext-container').innerHTML = loaderTexts[(loaderTexts.length-1)];
            }
        }

        loaderCounter --;
        //console.error('loaderCounter close()', loaderCounter, loaderTexts)
        if(loaderCounter > 0){
            return;
        }
        if(loaderCounter < 0){
            loaderCounter = 0;
        }
        
    }
    
    //console.error('loaderCounter close() 2:: ', loaderCounter)
    if(!dialogOpen){return};
    var element = document.querySelector(".modal");
    element.parentNode.removeChild(element);
    dialogOpen= false;
    
};

module.exports  = {
    open,
    close
};
