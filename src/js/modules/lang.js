
var gj = gj || {};

/*
  DefaultValues used within GJ/GJL application, may be overrided in the application itself

*/

gj.config = {
  //defaultDialogLoader : '/gfx/loader_squares.gif',
  //defaultDialogLoader : '/gfx/loader_gears.gif',
  //defaultDialogLoader : '/gfx/loader_box.gif',
  lang : {
      no : {
          "0_comment_" : "gjl.fileuploader",
          "$gjFileupload_addFile" : "Legg til fil",
          "$gjFileupload_removeFileBtnLabel" : "Slett",
          "0_comment_" : "gjl.btncontainer",
          "$nextBtn"     : "Neste",
          "$previousBtn" : "Tilbake",
          "$saveBtn" : "Lagre",
          "$cancelBtn" : "Avbryt",
          "$helpButtonLabel": " ",

          "1_comment_" : "gjl.errormessage",
          "$serverErrormsgLabel" : "Feil fra baksystemet",
          "$reloadLink" : "Prøv å laste siden på nytt",

          "$tooYoungAge" : "Medlåntaker må være minimum %s år.",

          "2_comment_" : "misc. default values",
          "$selectDefaultValue" : "velg",
          "$selectDefaultDisplay" : "Velg",

          "$year" : "år",
          "$fetchDataText" : "Henter data",
          "$generalErrorMsg" : "Noe gikk feil, vennligst prøv igjen",

          "$savedLabel" : "Din søknad er nå lagret",
          "$alreadySavedLabel" : "Ingen endringer å lagre",

          "$navigateBackText": "Naviger tilbake",
          "loading page" : "laster siden",

          "$switchButtonAural": "Vennligst velg dersom ",

          monthNames: ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
          monthNamesShort: ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Des'],
          dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
          dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
          dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],

          "0_comment_" : "altinn",
          "$altinnMainborrowerMissingAltindData" : "Du må hente informasjon om din inntekt, formue og gjeld før du kan gå videre i søknaden",
          "$altinnCoborrowerMissingAltindData" :  "Du må hente informasjon om din inntekt, formue og gjeld før du kan gå videre i søknaden",
          "$altinnError_1" : "Feil person. Kun %s kan gi samtykke til at vi kan hente denne informasjonen.",
          "$altinnError_2" : "Vi finner ikke nødvendig informasjon om din inntekt, formue og gjeld hos Skatteetaten. Kontakt oss så hjelper vi deg videre.",
          "$altinnError_3" : "Det oppstod en feil når vi skulle hente informasjon fra Skatteetaten. Prøv igjen senere.",
          "$altinnError_4" : "Vi kunne ikke innhente data fra Skatteetaten. Kontakt oss så hjelper vi deg videre.",
          "$altinnError_6" : "Skatteetaten har oppdatert informasjon, og vi trenger nytt samtykke fra deg for å hente dette.",
          "$altinnError_7" : "Skatteetaten har oppdatert informasjon, og vi trenger nytt samtykke fra medlåntaker for å hente dette.",
          "$altinnError_8" : "Skatteetaten har oppdatert informasjon, og vi trenger nytt samtykke fra begge for å hente dette.",
      },
      en : {
            "$gjFileupload_addFile" : "Add file",
            "$gjFileupload_removeFileBtnLabel" : "Delete",
            "0_comment_" : "gjl.btncontainer",
            "$nextBtn"     : "Next",
            "$previousBtn" : "Back",
            "$saveBtn" : "Save",
            "$cancelBtn" : "Abort",
            "$helpButtonLabel": " ",

            "1_comment_" : "gjl.errormessage",
            "$serverErrormsgLabel" : "Errormsg from server",
            "$errormsg" : "Error from server'",
            "$reloadLink" : "Try to reload page",
            "Feilmelding" : "Error message",
            'ukjent feil' : 'uknown error',
            'Noe gikk feil' : 'Something went wrong',
            "Tjenesten eksisterer ikke" : "Service do not exist",

            "$tooYoungAge" : "The co-borrower must be at least %s years old",

            "2_comment_" : "gjl.upload",
            "Du må laste opp fil før du går videre" : "Please upload file",

            "3_comment_" : "gj-data.js",
            "Du er logget ut -vennligst logg inn igjen (error_session_timeout)" : "You have been logged out, please log in again.",

            "4_comment_" : "misc. default values",
            "$selectDefaultValue" : "velg",
            "$selectDefaultDisplay" : "Choose",

            "$year" : "year",
            "$fetchDataText" : "Loading data",
            "lagrer data" : "Saving data",

            "lukk" : "close",
            "$generalErrorMsg" : "An error occurred, please try again.",

            "$savedLabel" : "Your application is now saved",
            "$alreadySavedLabel" : "No changes to save",

            "Ikke gyldig verdi" : "Not valid input",

            "$navigateBackText": "Navigate back",

            "$switchButtonAural": "Please select if ",

            "$altinnMainborrowerMissingAltindData": "You have to retrieve information about your income, capital and debt before you can continue the application.",
            "$altinnCoborrowerMissingAltindData": "You have to retrieve information about your income, capital and debt before you can continue the application.",
            "$altinnError_1": "Wrong person. Only %s can give a consent so we can retrieve this information.",
            "$altinnError_2": "We do not find the necessary information about your income, capital and debt at Skatteetaten. Please contact us and we will help you further.",
            "$altinnError_3": "An error occured while trying to retrieve information from Skatteetaten. Please try again later.",
            "$altinnError_4": "We were not able to retrieve data. Please contact us.",
            "$altinnError_6": "Skatteetaten has updated information and we need new consent from you to retrieve this.",
            "$altinnError_7": "Skatteetaten has updated information and we need new consent from the co-borrower to retrieve this.",
            "$altinnError_8": "Skatteetaten has updated information and we need new consent from both of you and the co-boorower to retrieve this.",

            monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa']
      }
  }

};

/*
  gj.parse try to load language object before start parsing modules. Could be nice to have the proper
  languagefile in place when starting up the show :)
  gj-lang-basepath tag MUST be on one element in page. The value on this tag is used to resolve where
  gj should fetch languagefile.

  // public functions:
    _("resolve_key");
    gj.lang.printf("Hi %s, my cool sentence for the %s", "guys", "world");
*/

gj.lang = function($){

    var langObj;
    var appLang = false;

    //HTML select default key & value -optional configured in lang file for application
    var defaultSelectValue = "";
    var defaultSelectDisplay = "";


    var setup = function(appID){
        var deferred = $.Deferred();
        //var langObj = false;
        var appLangObj = false;

        // set up default GJL lang obj
        var lang = findLang();
        if(!lang){
            return deferred.reject('gj.lang.setup() ERROR: unable to resolve valid language ', lang);
        }
        if(gj.config.lang[lang]){
            langObj = gj.config.lang[lang]; //setup default values as soon as possible, gets merged when lang spesific file is fetched below
        }
        //console.error(langObj)
        var id = false;
        if(typeof appID === 'string'){
          id = appID;
        }else{
          //try to find out which app we have and try to resolve lang object for this application
          var $el = $('div[gjl-id]:first');
          if(!$el){
            console.info('Upps -no application node in DOM detected, need to have at least one on the minimal form: <div gjl-id="[my id]"/> , only GJ/GJL spesifc language values will be used.');
          }else{
            var id = $el.attr('gjl-id');
            try{
              if(id.indexOf('.') > -1){
                id = id.match(/^(.*)\./)[1];
              }
            }catch(e){id = false;}
          }
        }

        if(id){
          if(id.match(/^gj(l?)$/)){
            console.info('No application spesific language files detected -only default GJ/GJL language object available');
          }else{
            appLangObj = gj.utility.getFunctionFromString(id + '.lang.' + lang);
            if(appLangObj){
              langObj  = $.extend(true, langObj , appLangObj);
            }
          }
        }

        //published lang object from teamsite ? Then add/overwrite lang object with these values
        if(typeof _teamsite !== "undefined" && _teamsite  && _teamsite.lang && _teamsite.lang[lang]){
          langObj  = $.extend(true, langObj , _teamsite.lang[lang]);
        }

        datepickerSetup(lang);

        defaultSelectValue = findStringInLangObject("$selectDefaultValue");
        defaultSelectDisplay = findStringInLangObject("$selectDefaultDisplay");
        return deferred.resolve(lang);
    };

    var createDefaultSelectObject = function(optionalVal, optionDisplay){
        var retObj = {};
        retObj[optionalVal || returnDefaultSelectValue()] = optionDisplay || gj.utility.capitalizeFirstLetter(returnDefaultSelectDisplay());
        return  retObj;
    };

    var returnDefaultSelectValue = function(){
        return defaultSelectValue;
    };

    var returnDefaultSelectDisplay = function(){
        return defaultSelectDisplay;
    };

    var findLang = function(){
    //Portal.config.lang.langCode
          if(appLang){
			         return appLang;
          }
          var language = gj.utility.getQueryParamValue("lang") || gj.utility.getQueryParamValue("la") || false;
		      if(language){
			         appLang = language.toLowerCase();
               return appLang;
		      }

          if(!language && typeof Portal === 'object' && Portal.config && Portal.config.lang && Portal.config.lang.inLangFrom){
              language = Portal.config.lang.inLangFrom; //no_no, no_en, se_sv,dk_da
          }
          if(!language){
              language = window.navigator.userLanguage || window.navigator.language;
          }
          if(language && (language.match(/^no_no$/) || language.match(/nb\-NO/i))){
              appLang = "no";

          }else if(language && (language.match(/no_en/i) || language.match(/en_en/i) || language.match(/en-US/i))){
              appLang = "en";

          }else if(language && language.match(/se_sv/i)){
              appLang ="se";

          }else if(language && language.match(/dk_da/i)){
              appLang = "dk";

          }
          appLang = (!appLang) ? "no" : appLang;   // make sure we return 'no' as default lang
          return appLang;
    };

    // lookup in lang-object and replace string 's' with lang object value.
    // return s if no match is found in lang obj
    var findStringInLangObject = function(s) {
    	if (typeof(langObj)!='undefined' && langObj[s]) {
    		return langObj[s];
    	}
    	return s;
   };

    // classic printf(sentence, string 1 to n)
    // gj.lang.printf("Hello %s, this is cool - right %s!", "Snipp", "Snapp")
    var printf = function(s){
        var _arguments = arguments;

        if (typeof _arguments[0] !== "string") {
           console.error('gjl.lang :: printf() ERROR, invalid input ' + _arguments[0], ' string: ' +s);
           return sentence;
        }
        var i = 0;
        return findStringInLangObject(_arguments[0]).replace(/\%s/g,function (a, b) {
            i++;

            if (typeof _arguments[i] == 'string') {
                return findStringInLangObject(_arguments[i]);
            }else{
              //throw new Error("Arguments element is an invalid type");
              console.error('gjl.lang :: printf() ERROR, invalid input ' + _arguments[i], ' string: ' + s);
              return "";
            }
            return obj[i];
        });
    };


   var getMonthName = function(monthInteger){
     if(typeof monthInteger !== 'number' || monthInteger < 0 || monthInteger > 11){
       console.error('ERROR gj.lang.getMonthName() has invalid input : ', monthInteger);
       return false;
     }
     return gj.config.lang[gj.lang.findLang()].monthNames[monthInteger] || false;
   };

   var getDayName = function(dayInteger){
     if(typeof dayInteger !== 'number' || dayInteger < 0 || dayInteger > 6){
       console.error('ERROR gj.lang.getDayName() has invalid input : ', dayInteger);
       return false;
     }
     return gj.config.lang[gj.lang.findLang()].dayNames[monthInteger] || false;
   };

    var setLangKey = function(key, langObj){
        var updateFlag = false;
        for(var ind in langObj){
            console.error(key, ind,ind.lang.ind.value)
            if(langObj[ind.lang]){
                langObj[ind.lang][key] = ind.value;
                updateFlag = true;
            }
        }
        return updateFlag;
   }

   //public api
   return {
      // setup lang obj
      setup : setup,
      findLang : findLang,

      //find lang value :
      _ : findStringInLangObject ,
      printf : printf,

      getMonthName : getMonthName,
      getDayName : getDayName,

      //create default valus used in select dropdown lists
      createDefaultSelectObject : createDefaultSelectObject,
      returnDefaultSelectValue : returnDefaultSelectValue,
      returnDefaultSelectDisplay : returnDefaultSelectDisplay,

      langObj : langObj,
   };
}(jQuery);
