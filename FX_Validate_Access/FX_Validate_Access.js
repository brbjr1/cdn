var validversions = [];
validversions.push('1');
validversions.push('2');
var myversion ='2'; //update to latest to change version
var mysessionId = '';

/***Have not been able to login with usersname password because of cross domain issue ***/
//never will be used in prod
var myloginurl = '';
var myusername = '';
var mypassword = '';
var myserverUrl = '';
/*****************************************************************************************/

var myuserid = '';
var mycdnurl = 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access';
var mycdnurl2 = 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access';
var targetUserId = getParameterByName('id');


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
	
	var scrisrandom = getScriptParameterByNameUniquelfw('israndom',myscripturl)== '1';
	if (scrversion != null && scrversion.length > 0 &&  validversions.indexOf(scrversion) > 0)
	{
		myversion = scrversion;
	}
	if (scrcdn != null && scrcdn != '')
	{
		//to use a localhost as a cdn you must make it look like a domain otherwise chrome will report it as a cross doamin request
		//examle host enty 127.0.0.1       localhost	testmyjs.com
		mycdnurl2 = scrcdn;
		console.log('using custom sdnurl:' + mycdnurl2);
	}
	if (scrisrandom != null && scrisrandom != '')
	{
		israndom = scrisrandom == '1';
	}

	mysessionId = getScriptParameterByNameUniquelfw('sessionid',myscripturl);
	myloginurl = getScriptParameterByNameUniquelfw('lurl',myscripturl);
	myusername = getScriptParameterByNameUniquelfw('luser',myscripturl);
	mypassword = getScriptParameterByNameUniquelfw('lpass',myscripturl);
	myuserid = getScriptParameterByNameUniquelfw('myuserid',myscripturl); 
	myserverUrl = getScriptParameterByNameUniquelfw('surl',myscripturl); 

}

mycdnurl = mycdnurl + '/'+myversion+'/';
mycdnurl2 = mycdnurl2 + '/'+myversion+'/';


var scrsuffix = '';
if (israndom == true)
{
	scrsuffix = 'rand=' + makeid();
}

var loadurls = [];
loadurls.push({url:'//code.jquery.com/jquery-2.2.4.min.js',type:'js'});

//using custom namespace bootstrp to stop collision with sf
loadurls.push({url:mycdnurl + 'Bootstrap_v3.3.6/css/bootstrap.min.css?' + scrsuffix,type:'css'});
loadurls.push({url:mycdnurl + 'Bootstrap_v3.3.6/js/bootstrap.min.js?' + scrsuffix,type:'js'});

loadurls.push({url:'//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css',type:'css'});
loadurls.push({url:'//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js',type:'js'});
loadurls.push({url:'//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.3/jsforce.min.js',type:'js'});
loadurls.push({url:'//cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js',type:'js'});
loadurls.push({url:mycdnurl + 'js/xml2json.min.js?' + scrsuffix,type:'js'});

loadresourcesinorder(loadurls, function()
{
	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		//
		//mycdnurl = 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access' + '/'+myversion+'/';
		//j2$( "#MainContent" ).load( 'https://rawgit.com/brbjr1/cdn/master/FX_Validate_Access' + '/'+myversion+'/' + 'main.htm?' + scrsuffix,  function( response, status, xhr ) 
		j2$( "#MainContent" ).load( mycdnurl + 'main.htm?' + scrsuffix,  function( response, status, xhr ) 	
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				loadjscssfile(mycdnurl2 + 'main.js?' + scrsuffix,'js');
			}
		});
	});

});


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



function getParameterByName(name) 
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

