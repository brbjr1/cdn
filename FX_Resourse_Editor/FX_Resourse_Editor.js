var validversions = [];
validversions.push('1');

var myversion ='1'; //update to latest to change version
var mysessionId = '';





/***Used for local dev :never will be used in prod ***/
var myloginurl = '';
var myusername = '';
var mypassword = '';
var myserverUrl = ''; //not used any more
var myproxyUrl = ''; //https://localhost:8443/proxy
/*****************************************************************************************/








var myuserid = '';
var mycdnurl = 'https://rawgit.com/brbjr1/cdn/master/FX_Resourse_Editor';


//IE support
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

var scripts = document.getElementsByTagName("script");
var myscripturl = '';
if (scripts)
{ 
	for(var ip1=0; ip1 < scripts.length; ip1++ )
	{
		var scr1 = scripts[ip1].src;
		if (scr1 != undefined && scr1.includes('FX_Resourse_Editor'))
		{
			myscripturl = scr1;
			break;
		}
	}
}

if (myscripturl != '')
{
	var scrversion = getScriptParameterByName('version',myscripturl);
	var scrcdn = getScriptParameterByName('cdnurl',myscripturl);

	if (scrversion != null && scrversion.length > 0 &&  validversions.indexOf(scrversion) > 0)
	{
		myversion = scrversion;
	}
	if (scrcdn != null && scrcdn != '')
	{
		mycdnurl = scrcdn;
		console.log('using custom cdnurl:' + mycdnurl);
	}
	
	mysessionId = getScriptParameterByName('sessionid',myscripturl);
	myloginurl = getScriptParameterByName('lurl',myscripturl);
	myusername = getScriptParameterByName('luser',myscripturl);
	mypassword = getScriptParameterByName('lpass',myscripturl);
	myuserid = getScriptParameterByName('myuserid',myscripturl); 
	myproxyUrl = getScriptParameterByName('purl',myscripturl); 
}

mycdnurl = mycdnurl + '/'+myversion+'/';

var loadurls = [];
loadurls.push({url:'https://code.jquery.com/jquery-2.2.4.min.js',type:'js'});

//using custom namespace bootstrp to stop collision with sf
loadurls.push({url:'https://cdn.rawgit.com/brbjr1/cdn/master/Custom_Bootstrap/201606090600/Bootstrap_v3.3.6/css/bootstrap.min.css',type:'css'});
loadurls.push({url:'https://cdn.rawgit.com/brbjr1/cdn/master/Custom_Bootstrap/201606090600/Bootstrap_v3.3.6/js/bootstrap.min.js',type:'js'});


loadurls.push({url:'https://cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.3/jsforce.min.js',type:'js'});
loadurls.push({url:'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js',type:'js'});
loadurls.push({url:'https://cdn.rawgit.com/brbjr1/cdn/master/js/201606090600/xml2json.min.js',type:'js'});
loadurls.push({url:'https://cdn.rawgit.com/brbjr1/cdn/master/animation/201606141100/jquery-loading-overlay-1.3/src/loadingoverlay.min.js',type:'js'});
loadurls.push({url:'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',type:'css'});

loadresourcesinorder(loadurls, function()
{
	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		var mainhtml = '<style>.versioninfo {font-size: 10px;margin-top: 20px;color: #999999;}</style><div class="bs" id="pagediv"></div>';
		loadjscssfile(mycdnurl + 'main.js','js');
		j2$( "#MainContent" ).html(mainhtml);
		/*
		j2$( "#MainContent" ).load( mycdnurl + 'main.htm',  function( response, status, xhr ) 	
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				j2$('#version').html(myversion);
				loadjscssfile(mycdnurl + 'main.js','js');
			}
		});
		*/
	});

});


function loadresourcesinorder(urls, callback)
{

	 if (urls != undefined && Array.isArray(urls)  && urls.length > 0)
	 {
	 	var myurl = urls[0].url;
	 	var mytype = urls[0].type;
	 	urls.splice(0, 1);
	 	loadjscssfile(myurl,mytype, 
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

function getScriptParameterByName(name, scr) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(scr);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadjscssfile(filename,filetype,callback)
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
				callback(null);
			}
		}
		head.appendChild(script);
	}
    else if (filetype=="css")
    {
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
        head.appendChild(fileref);
        callback(null);
	}
}






