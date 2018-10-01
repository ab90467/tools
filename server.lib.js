(function() {

        const fs = require('fs');
        const path = require('path');
        //const colors = require('colors/safe');
        //const ora = require('ora');
        //const gutil = require('gulp-util');

        const log = function(msg, color, logChoice) {
            /*color = color ? color : 'blue';
            if (logChoice === 'console') {
                console.log(colors[color](msg));
                return;
            }
            if (logChoice === 'string') {
                return colors[color](msg);
            }
            gutil.log(colors[color](msg));*/
            console.log(msg);
        };

        const missingPage = function(res, req, err) {
            res.setHeader("Content-Type", "text/html");
            res.status(404).send("<h3>404 ERROR</h3><p style='color:red;padding:30px'>" + err + "</p>");
            res.end();
            log('404 error: ' + err, 'red');
            return err;
        };

        const sendJson = function(data, res) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(data).end();
            return true;
        };
        const getHTMLfilesAndSendToClient = function(demoRoot, resourceList, livereloadPort, req, res) {
            let cleanFile = req.originalUrl;
            if (cleanFile.indexOf("?") > 0) {
                cleanFile = cleanFile.substring(0, cleanFile.indexOf("?"));
            }
            fs.readFile(demoRoot + cleanFile, 'utf8', function(err, data) {
                if (err) { // Handle 404
                    log('Missing HTML page ' + err, 'red');
                    return missingPage(res, req, err);
                }
                let newData = data.replace(/\[\[(.*?)\]\]/ig, function(match, variable) {
                    if (resourceList && resourceList[variable]) {
                        return resourceList[variable];
                    } else {
                        return "<!-- unable to resolve resource reference '" + variable + "' -->";
                    }
                });
                if (getQueryParamValue(req.originalUrl, 'test', 'a1')) {
                    newData = newData.replace(/\<\/head\>/, function() {
                        return writeScriptTag("/includes/HTMLCS.js", function() {
                            HTMLCSAuditor.run('WCAG2AA', null, { path: '//squizlabs.github.io/HTML_CodeSniffer/build/' });
                        }) + '</head>';
                    });
                }
                if (getQueryParamValue(req.originalUrl, 'test', 'a2')) {
                    newData = newData.replace(/\<\/head\>/, function() {
                        return writeScriptTag("/includes/tota11y.js") + '</head>';
                    });
                }
                res.status(200).send(newData);
                res.end();
            });
        };

        const getMockFileAndSendToClient = (mockRoot, req, res, delay) => {
            const mockfile = getMockfilePath(mockRoot, req);
            if (mockfile) {
                fs.readFile(mockfile, 'utf8', function(err, data) {
                    if (err) {
                        log('   Unable to read mockfile ' + mockfile, 'red');
                        return missingPage(res, req, err);
                    }
                    log('   use mockfile : ' + mockfile.substr(__dirname.length), 'yellow');
                    setTimeout(() => {
                        return sendJson(data, res, req, err);
                    }, delay ? delay : 0);
                });
            } else {
                log('   Unable to resolve mockfile ' + mockfile, 'red');
                return missingPage(res, req, { msg: `error reading mockfile  ${mockfile} (URL : ${req.originalUrl})` });
            }
        };


        const writeScriptTag = function(url, callback) {
                return ` 
            <script>
                var s = document.createElement('script');
                s.setAttribute('src', '${url}');
                ${(()=>{
                    if(typeof callback === 'function'){
                        return `s.onload = ${callback.toString()}`;
                    }
                    return "";
                })()}       
                document.head.appendChild(s);
            </script>`;
    };



    const __getMockfilePath = function(mockRoot, req) {
        let cleanFile = req.originalUrl;
        try {
            if (cleanFile.indexOf("?") > 0) {
                cleanFile = cleanFile.substring(0, cleanFile.indexOf("?"));
            }
            const mockFile = path.join(mockRoot, cleanFile.match(/.*\/(.*)$/)[1] + '.json');
            return mockFile;
        } catch (e) {
            log('\t-> ERROR: no match on request ' + req.originalUrl + ', errormsg: ' + e, 'red');
            return false;
        }
    };


    const getMockfilePath = function(mockRoot, req) {
        let cleanFile = req.originalUrl;
        try {
            if (cleanFile.indexOf("?") > 0) {
                cleanFile = cleanFile.substring(0, cleanFile.indexOf("?"));
            }
            if (cleanFile.indexOf(".json") > 0) {
                return path.join(mockRoot, cleanFile.match(/.*\/(.*)$/)[1]);
            }
            return path.join(mockRoot, cleanFile.match(/.*\/(.*)$/)[1] + '.json');
        } catch (e) {
            log('\t-> ERROR: no match on request ' + req.originalUrl + ', errormsg: ' + e, 'red');
            return false;
        }
    };

    const setupResourceReferences = function(resourceList) {

        for (const resourceName in resourceList) {
            if (!resourceList.hasOwnProperty(resourceName)) {
                continue;
            }
            (function(resource, path) {
                fs.readFile(path, 'utf8', function(err, data) {
                    if (err) {
                        log("Try reading in include files failed:\n",'red');
                        throw err;
                    }
                    resourceList[resource] = data;
                });
            })(resourceName, resourceList[resourceName]);
        }
        return resourceList;
    };

    /*const getQueryParamValue = function(url, paramName, paramValue) {
        if (!paramName || paramName === "") return false;
        const a = url.split('?');
        if (a === "") return false;
        let match = false;
        for (let i = 0; i < a.length; i++) {
            const pair = a[i].split("=");
            if (pair[0].toLowerCase() === paramName.toLowerCase()) {
                match = decodeURIComponent(pair[1]);
                break; 
            }
        }
        if(match){
            return (paramValue ? (match === paramValue) : match);
        }
        return false;
    };*/

    const getQueryParamValue = function(url, paramName, paramValue) {
        if (!paramName || paramName === "") return false;
        url = url.split('?');
        if(url.length < 2) return false;
        const a = url[1].split('&');
        if (a === "") return false;
        let match = false;
        for (let i = 0; i < a.length; i++) {
            const pair = a[i].split("=");
            if (pair[0].toLowerCase() === paramName.toLowerCase()) {
                match = decodeURIComponent(pair[1]);
                break; 
            }
        }
        if(match){
            return (paramValue ? (match === paramValue) : match);
        }
        return false;
    };
    


    //public API
    module.exports = {
        missingPage,
        sendJson,
        setupResourceReferences,
        getMockfilePath,
        getQueryParamValue,
        log,
        writeScriptTag,
        getMockFileAndSendToClient,
        getHTMLfilesAndSendToClient
         
    };
})();