var validversions = [];
validversions.push('1');
validversions.push('2');
validversions.push('3');
validversions.push('4');
validversions.push('5');
validversions.push('6');
validversions.push('7');
validversions.push('8');
validversions.push('9');
validversions.push('10');
validversions.push('11');
var myversion ='10'; //update to latest to change version
var mysessionId = '';





/***Used for local dev :never will be used in prod ***/
var myloginurl = '';
var myusername = '';
var mypassword = '';
var myserverUrl = ''; //not used any more
var myproxyUrl = ''; //https://localhost:8443/proxy
/*****************************************************************************************/










var myuserid = '';
var mycdnurl = 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access';
var targetUserId = getParameterByName('id');

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
		if (scr1 != undefined && scr1.includes('FX_Validate_Access'))
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

loadurls.push({url:'https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css',type:'css'});
loadurls.push({url:'https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js',type:'js'});
loadurls.push({url:'https://cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.3/jsforce.min.js',type:'js'});
loadurls.push({url:'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js',type:'js'});
loadurls.push({url:'https://cdn.rawgit.com/brbjr1/cdn/master/js/201606090600/xml2json.min.js',type:'js'});
//loadurls.push({url:'https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css',type:'css'});

loadresourcesinorder(loadurls, function()
{
	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		j2$( "#MainContent" ).load( mycdnurl + 'main.htm',  function( response, status, xhr ) 	
		//j2$( "#MainContent" ).load( 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access/8/main.htm',  function( response, status, xhr ) 	
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






