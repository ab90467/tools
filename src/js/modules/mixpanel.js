
/*

    include mixpanel code here

*/


module.exports = (function (e, a) {
    // console.error('MIXPANEL :: run once');
    // denne setter vi så vi IKKE går inn i if'en nedenfor
    a['__SV'] = true;  // 'hack'

    if (!a.__SV) {
        var b = window;
        try {
            var c, l, i, j = b.location,
                g = j.hash;
            c = function (a, b) {
                return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null
            };
            g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search)))
        } catch (m) {}
        var k, h;
        window.mixpanel = a;
        a._i = [];
        a.init = function (b, c, f) {
            function e(b, a) {
                var c = a.split(".");
                2 == c.length && (b = b[c[0]], a = c[1]);
                b[a] = function () {
                    b.push([a].concat(Array.prototype.slice.call(arguments,
                        0)))
                }
            }
            var d = a;
            "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel";
            d.people = d.people || [];
            d.toString = function (b) {
                var a = "mixpanel";
                "mixpanel" !== f && (a += "." + f);
                b || (a += " (stub)");
                return a
            };
            d.people.toString = function () {
                return d.toString(1) + ".people (stub)"
            };
            k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
            for (h = 0; h < k.length; h++) e(d, k[h]);
            a._i.push([b, c, f])
        };
        a.__SV = 1.2;
        b = e.createElement("script");
        b.type = "text/javascript";
        b.async = !0;
        b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
        c = e.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(b, c)
    }

    window.MixPanel_Incognito = function(token, development, shouldLogToMixpanel){
        this.TRACKING = true;
        this.shouldLogToMixpanel = shouldLogToMixpanel;
        this.isTracking = function()
        {
            return this.TRACKING;
        }

        this.setTracking = function(b)
        {
            this.TRACKING = b;
        }

        this.track = function(eventId, properties)
        {   //console.error('data', shouldLogToMixpanel, development, token)
            if(!this.shouldLogToMixpanel || development){
                console.info(`logging to mixpanel is disabled for ${token} :`, eventId, properties ? properties : '');
                return;
            }
            if (this.isTracking())
            {
                var properties = (properties) ? properties : {} ;

                const url = `${development ? "https//localhost:9000" : "https://api.mixpanel.com"}/track/?data=`;
                const cookie = "DNB_TRACKING_UID";

                send();
                function send()
                {
                    properties.distinct_id = getUID();
                    properties.token = token;

                    var requestURL = url + b64encode(JSON.stringify({"event": eventId, "properties": properties}));

                    var xhttp = new XMLHttpRequest();
                    xhttp.open("GET", requestURL, true);
                    xhttp.send();
                }

                function getUID()
                {
                    var userId = (getCookie(cookie) == "") ? guid() : getCookie(cookie);
                    setCookie(cookie, userId);
                    return userId;

                    function guid()
                    {
                        function s4()
                        {
                            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                        }
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                    }

                    function getCookie(cname)
                    {
                        var name = cname + "=";
                        var decodedCookie = decodeURIComponent(document.cookie);
                        var ca = decodedCookie.split(';');
                        for(var i = 0; i <ca.length; i++)
                        {
                            var c = ca[i];
                            while (c.charAt(0) == ' ')
                            {
                                c = c.substring(1);
                            }

                            if (c.indexOf(name) == 0)
                            {
                                return c.substring(name.length, c.length);
                            }
                        }
                        return "";
                    }

                    function setCookie(cname, cvalue)
                    {
                        var d = new Date();
                        d.setTime(d.getTime() + (3650*24*60*60*1000));
                        var expires = "expires="+ d.toUTCString();
                        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                    }
                }

                function b64encode(input)
                {
                    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = utf8_encode(input);

                    while (i < input.length)
                    {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2))
                        {
                            enc3 = enc4 = 64;
                        }
                        else if (isNaN(chr3))
                        {
                            enc4 = 64;
                        }

                        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                    }

                    return output;

                    function utf8_encode(str)
                    {
                        str = str.replace(/\r\n/g, "\n");
                        var utftext = "";

                        for (var n = 0; n < str.length; n++)
                        {
                            var c = str.charCodeAt(n);

                            if (c < 128)
                            {
                                utftext += String.fromCharCode(c);
                            }
                            else if ((c > 127) && (c < 2048))
                            {
                                utftext += String.fromCharCode((c >> 6) | 192);
                                utftext += String.fromCharCode((c & 63) | 128);
                            }
                            else
                            {
                                utftext += String.fromCharCode((c >> 12) | 224);
                                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                utftext += String.fromCharCode((c & 63) | 128);
                            }
                        }

                        return utftext;
                    }
                }
            }
        }
    }

})(document, window.mixpanel || []);


/*
Example 
mixpanel.init("6d446bf9a25508a7b83291d22fce2a0f", {
    loaded: function(mixpanel) {
        distinct_id = mixpanel.get_distinct_id();
		chkTrackId(distinct_id);
    }
});

mixpanel.track("ABC_ButtonTextOption",{"Condition":window.btnCondition});

function chkTrackId(x){
	"use strict";
	window.trackID = x;
}

mixpanel.identify(window.trackID);
mixpanel.people.set({
    "$first_name": window.trackID,
});

*/