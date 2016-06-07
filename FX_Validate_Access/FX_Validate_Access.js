
var myversion = getParameterByNameUniquelfw('version');

var validversions = [];
validversions.push('1');

if (myversion == undefined || myversion.length == 0 ||  validversions.indexOf(myversion) < 0)
{
	myversion = 1
}


requireUniquelfw('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/jquery-2.1.4/jquery-2.1.4.min.js', function()
{
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/jquery-2.1.4/jquery-2.1.4.min.js','js');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/css/bootstrap.min.css','css');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/Bootstrap_v3.3.6/js/bootstrap.min.js','js');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/DataTables-1.10.11/media/css/jquery.dataTables.min.css','css');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/DataTables-1.10.11/media/js/jquery.dataTables.min.js','js');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jsforce.min.js','js');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/jszip.min.js','js');
	loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/js/xml2json.min.js','js');


	var j2$ = jQuery.noConflict();

	j2$(document).ready(function()
	{
		j2$( "#MainContent" ).load( "https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/"+myversion+"/main.htm",  function( response, status, xhr ) 
		{
			if ( status == "error" ) 
			{
				var msg = "Sorry but there was an error: ";
				j2$( "MainContent" ).html( msg + xhr.status + " " + xhr.statusText );
			}
			else
			{
				loadjscssfile('https://cdn.rawgit.com/brbjr1/cdn/master/FX_Validate_Access/'+myversion+'/main.js','js');
			}
		});
	});

});



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



function requireUniquelfw(file,callback){
    var head=document.getElementsByTagName("head")[0];
    var script=document.createElement('script');
    script.src=file;
    script.type='text/javascript';
    //real browsers
    script.onload=callback;
    //Internet explorer
    script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            callback();
        }
    }
    head.appendChild(script);
}

