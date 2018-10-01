(function() {

    const fs = require('fs');
    const path = require('path');
    const colors = require('colors/safe');
    const ora = require('ora');
    const gutil = require('gulp-util');

    const log = function(msg, color, logChoice) {
        color = color ? color : 'blue';
        if (logChoice === 'console') {
            console.log(colors[color](msg));
            return;
        }
        if (logChoice === 'string') {
            return colors[color](msg);
        }
        gutil.log(colors[color](msg));
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
            if (livereloadPort) {
                newData = newData.replace(/\<\/head\>/, function() {
                    return jsIOconnectcodeTemplate(livereloadPort) + '</head>';
                });
            }
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

const listServerStatus = (name, version, port, demo, dist, mock) => {
    console.log(colors.green.bold('\n\tRunning project : "' + name + '" (version ' + version + ')'));
    log('-----------------------------------------------------------------------', 'green', 'console');
    log('\t→ Server running at       : ' + colors.blue('http://localhost:' + port), 'green', 'console');
    log('\t→ HTML served from        : ' + demo.substr(__dirname.length), 'green', 'console');
    log('\t→ Resources served from   : ' + dist.substr(__dirname.length),'green', 'console');
    log('\t→ mockdata served from    : ' + mock.substr(__dirname.length), 'green', 'console');
    log('-----------------------------------------------------------------------\n', 'green', 'console');
};


const getMockfilePath = function(mockRoot, req) {
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

const jsIOconnectcodeTemplate = function(port) {
    return ` <script>
        var s = document.createElement('script');
        s.setAttribute('src', 'http://localhost:${port}/socket.io/socket.io.js');
        s.onload = function() {
            var socketClient = io.connect('localhost:${port}', {
                secure: false,
                reconnection: true,
                reconnectionDelay: 2000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity
            });
            socketClient.on('reload', function() {
                window.location.reload();
            });
        }
        document.head.appendChild(s);
    </script>`
};

const listCatalogContent = function(rootDir, name, version, res) {

    const list = [];
    const head = `  
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${name}</title>
            <link rel="shortcut icon" href="data:image/x-icon;base64,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"/>
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    color: #71717d;
                    padding : 20px;
                }
                ul {
                    padding : 30px;
                    list-style-type: none;
                }
                li {
                    line-height: 30px;
                    background-repeat: no-repeat;
                    background-size: 18px 18px;
                    padding-left: 35px;  
                    background-position: bottom 7px left 10px;
                }
                .gj-icon {
                    background-image: url('data:image/png;base64,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');
                } 
                .html-icon {
                    background-image : url('data:image/png;base64,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');
                }
                footer,h3 {
                    background-repeat: no-repeat;
                    background-size: contain;
                    padding-left: 25px;   
                
                }
                a {
                    text-decoration: none;
                    color: #71717d;
                }
                a:hover{
                    color : grey;
                    background-color: beige;
                }
            </style>
        </head>`;
    fs.readdir(rootDir, function(err, items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].match(/\.html/)) {
                list.push(`<li class="html-icon"><a  href="${items[i]}"> ${items[i]} </a></li>`);
            }
        }
        const body = `
            <body>
                <h3>Listing demo files for project '${name}' (ver. ${version})</h3>
                <hr/>
                <ul>
                    ${list.join('\n')}
                </ul>
                <hr/>
                <footer class="gj-icon"> <a href="http://svn.sandsli.dnb.no/git/projects/GJ-GJL">GJ library</a></footer>
            </body>`;
        res.send(`<html>
                    ${head}
                    ${body}
                 </html>`).end();
    });
};

const setLoader = (choice,text) => {
    // more loaders here https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json
    const config = {
        "point": {
            "interval": 125,
            "frames": [
                "∙∙∙",
                "●∙∙",
                "∙●∙",
                "∙∙●",
                "∙∙∙"
            ]
        },
        "pong": {
            "interval": 80,
            "frames": [
                "▐⠂       ▌",
                "▐⠈       ▌",
                "▐ ⠂      ▌",
                "▐ ⠠      ▌",
                "▐  ⡀     ▌",
                "▐  ⠠     ▌",
                "▐   ⠂    ▌",
                "▐   ⠈    ▌",
                "▐    ⠂   ▌",
                "▐    ⠠   ▌",
                "▐     ⡀  ▌",
                "▐     ⠠  ▌",
                "▐      ⠂ ▌",
                "▐      ⠈ ▌",
                "▐       ⠂▌",
                "▐       ⠠▌",
                "▐       ⡀▌",
                "▐      ⠠ ▌",
                "▐      ⠂ ▌",
                "▐     ⠈  ▌",
                "▐     ⠂  ▌",
                "▐    ⠠   ▌",
                "▐    ⡀   ▌",
                "▐   ⠠    ▌",
                "▐   ⠂    ▌",
                "▐  ⠈     ▌",
                "▐  ⠂     ▌",
                "▐ ⠠      ▌",
                "▐ ⡀      ▌",
                "▐⠠       ▌"
            ]
        },
        "pong_ver2": {
            "interval": 80,
            "frames": [
                "▐⠂       ▌",
                "▐⠈       ▌",
                "[ ⠂      ]",
                "[ ⠠      ]",
                "[  ⡀     ]",
                "[  ⠠     ]",
                "[   ⠂    ]",
                "[   ⠈    ]",
                "[    ⠂   ]",
                "[    ⠠   ]",
                "[     ⡀  ]",
                "[     ⠠  ]",
                "[      ⠂ ]",
                "[      ⠈ ]",
                "▐       ⠂▌",
                "▐       ⠠▌",
                "▐       ⡀▌",
                "[      ⠠ ]",
                "[      ⠂ ]",
                "[     ⠈  ]",
                "[     ⠂  ]",
                "[    ⠠   ]",
                "[    ⡀   ]",
                "[   ⠠    ]",
                "[   ⠂    ]",
                "[  ⠈     ]",
                "[  ⠂     ]",
                "[ ⠠      ]",
                "[ ⡀      ]",
                "▐⠠       ▌"
            ]
        }
    };

    return ora({
        text:  log(text, 'green', 'string'),
        color: 'green',
        spinner: config[choice]
    });
};

//public API
module.exports = {
    missingPage,
    sendJson,
    listCatalogContent,
    setupResourceReferences,
    getMockfilePath,
    getQueryParamValue,
    jsIOconnectcodeTemplate,
    listServerStatus,
    log,
    writeScriptTag,
    getMockFileAndSendToClient,
    getHTMLfilesAndSendToClient,
    setLoader 
};
})();
