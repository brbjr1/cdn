
var myversion = getParameterByNameUniquelfw('version');

var validversions = [];
validversions.push('1');

if (myversion == undefined || myversion.length == 0 ||  validversions.indexOf(myversion) < 0)
{
	myversion = 1
}

var isProd = 'cdn.';
var scrsuffix = '';
if (getParameterByNameUniquelfw('isprod') == '0')
{
	isProd = '';
	scrsuffix = 'rand=' + makeid();
}

var loadurls = [];
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/jquery-2.1.4/jquery-2.1.4.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/css/bootstrap.min.css?' + scrsuffix,type:'css'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/js/bootstrap.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/DataTables-1.10.11/media/css/jquery.dataTables.min.css?' + scrsuffix,type:'css'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/DataTables-1.10.11/media/js/jquery.dataTables.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jsforce.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jszip.min.js?' + scrsuffix,type:'js'});
loadurls.push({url:'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/xml2json.min.js?' + scrsuffix,type:'js'});

loadresourcesinorder(loadurls, function()
{
	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		j2$( "#MainContent" ).load( 'https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/main.htm?' + scrsuffix,  function( response, status, xhr ) 
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				loadjscssfile('https://'+isProd+'rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/main.js?' + scrsuffix,'js');
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

