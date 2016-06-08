var validversions = [];
validversions.push('1');
var myversion ='1';// getParameterByNameUniquelfw('version');
var mysessionId = '';
var myloginurl = '';
var myusername = '';
var mypassword = '';
var mycdnurl = 'https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/';


var scripts = document.getElementsByTagName("script");
var myscripturl = '';
if (scripts)
{ 
	for(var ip1=0; ip1 < scripts.length; ip1++ )
	{
		var scr1 = scripts[ip1].src;
		if (scr1 != undefined && scr1.includes('FX_Validate_Access'))
		{
			myscripturl = scr1;
			break;
		}
	}
}

var israndom = false;
if (myscripturl != '')
{
	var scrversion = getScriptParameterByNameUniquelfw('version',myscripturl);
	var scrcdn = getScriptParameterByNameUniquelfw('cdnurl',myscripturl);
	//var scrsessionid = getScriptParameterByNameUniquelfw('sessionid',myscripturl);
	var scrisrandom = getScriptParameterByNameUniquelfw('israndom',myscripturl);
	if (scrversion != null && scrversion.length > 0 &&  validversions.indexOf(scrversion) > 0)
	{
		myversion = scrversion;
	}
	if (scrcdn != null && scrcdn != '')
	{
		mycdnurl = scrcdn;
		hascustoncdn = true;
		console.log('using custom sdnurl:' + mycdnurl);
	}
	//if (scrsessionid != null)
	//{
	//	mysessionId = scrsessionid;
	//}
	if (scrisrandom != null && scrisrandom != '')
	{
		israndom = scrisrandom == '1';
	}

	mysessionId = getScriptParameterByNameUniquelfw('sessionid',myscripturl);
	myloginurl = getScriptParameterByNameUniquelfw('lurl',myscripturl);
	myusername = getScriptParameterByNameUniquelfw('luser',myscripturl);
	mypassword = getScriptParameterByNameUniquelfw('lpass',myscripturl);

}

var scrsuffix = '';
if (israndom == true)
{
	scrsuffix = 'rand=' + makeid();
}

//console.log(scripts);

var loadurls = [];
loadurls.push({url:mycdnurl + 'jquery-2.1.4/jquery-2.1.4.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:mycdnurl + 'Bootstrap_v3.3.6/css/bootstrap.min.css?' + scrsuffix,type:'css'});
loadurls.push({url:mycdnurl + 'Bootstrap_v3.3.6/js/bootstrap.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:mycdnurl + 'DataTables-1.10.11/media/css/jquery.dataTables.min.css?' + scrsuffix,type:'css'});
loadurls.push({url:mycdnurl + 'DataTables-1.10.11/media/js/jquery.dataTables.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:mycdnurl + 'js/jsforce.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:mycdnurl + 'js/jszip.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:mycdnurl + 'js/xml2json.min.js?' + scrsuffix,type:'js'});

loadresourcesinorder(loadurls, function()
{
	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		j2$( "#MainContent" ).load( mycdnurl + 'main.htm?' + scrsuffix,  function( response, status, xhr ) 
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				loadjscssfile(mycdnurl + 'main.js?' + scrsuffix,'js');
			}
		});
	});

});

/*
requireUniquelfw('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/jquery-2.1.4/jquery-2.1.4.min.js', function()
{
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/jquery-2.1.4/jquery-2.1.4.min.js','js');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/css/bootstrap.min.css','css');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/js/bootstrap.min.js','js');
	loadjscssfile(,'css');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/DataTables-1.10.11/media/js/jquery.dataTables.min.js','js');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jsforce.min.js','js');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jszip.min.js','js');
	loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/xml2json.min.js','js');


	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		j2$( "#MainContent" ).load( 'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/main.htm',  function( response, status, xhr ) 
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/main.js','js');
			}
		});
	});

});
*/


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function loadresourcesinorder(urls, callback)
{

	 if (urls != undefined && Array.isArray(urls)  && urls.length > 0)
	 {
	 	var myurl = urls[0].url;
	 	var mytype = urls[0].type;
	 	urls.splice(0, 1);
	 	requireUniquelfw(myurl,mytype, 
	 	function()
		{
			loadresourcesinorder(urls,callback);
		});
	 }
	 else
	 {
	 	callback(null,true);
	 }

}

function getScriptParameterByNameUniquelfw(name, scr) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(scr);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



function getParameterByNameUniquelfw(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}



function requireUniquelfw(filename,filetype,callback)
{
	 var head=document.getElementsByTagName("head")[0];
	 if (filetype=="js")
	 {
	    
	    var script=document.createElement('script');
	    script.src=filename;
	    script.type='text/javascript';
	    //real browsers
	    script.onload=callback;
	    //Internet explorer
	    script.onreadystatechange = function() 
	    {
	        if (this.readyState == 'complete') 
	        {
	            callback();
	        }
	    }
	    head.appendChild(script);
	}
    else if (filetype=="css")
    { //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
        head.appendChild(fileref);
        callback();
	}
}

