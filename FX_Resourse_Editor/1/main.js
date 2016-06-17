var j$ = jQuery.noConflict();
var RemoteResult; //global var of final results
var salesforceAccessURL = ''; //if value then links will use frontdoor.jsp on links to SalesForce pages
var loadphase = 1;
var fontawesomeloadIcon = "fa fa-spinner fa-pulse fa-3x fa-fw";
var jsforceAPIVersion = '36.0';

//IE support
if (!String.prototype.startsWith)
{
	String.prototype.startsWith = function(searchString, position)
	{
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}


/******************Event Handlers *************************************/



/******************END Event Handlers *************************************/

j$(document).ready(function()
{
	//main loading
	j$("#pagediv").LoadingOverlay("show",{image : "",fontawesome : fontawesomeloadIcon});

	var finalresult = [];
	
	DoJSforceLogin(mysessionId, myloginurl, myusername, mypassword, myproxyUrl, function(loginerr, conn)
	{
		try
		{
			if (loginerr)
			{
				console.log(loginerr);
				ProcessError(loginerr);
			}
			else
			{
				mysessionId = conn.accessToken;
				CurrentUserHasModifyAllDataAccess(conn, myuserid, function(err, hasaccessresult)
				{
					try
					{
						if (err)
						{
							ProcessError(err);
						}
						else
						{
							if (hasaccessresult == false)
							{
								ProcessError('Error: You must have permission Modify All Data to use this page!');
							}
							else
							{
								conn.identity(function(err, res) 
								{
									if (err) 
							  		{ 
								  		ProcessError(err); 
								  	}
								  	else
								  	{
								  		if (res.urls && res.urls.users)
								  		{
											//console.log("user ID: " + res.user_id);
											//console.log("organization ID: " + res.organization_id);
											//console.log("username: " + res.username);
											//console.log("display name: " + res.display_name);
											var link = document.createElement('a');
											//  set href to any path
											link.setAttribute('href', res.urls.users);

											//  get any piece of the url you're interested in
											link.hostname;  //  'example.com'
											link.port;      //  12345
											link.search;    //  '?startIndex=1&pageSize=10'
											link.pathname;  //  '/blog/foo/bar'
											link.protocol;  //  'http:'

											//  cleanup for garbage collection
											link = null;
											if (!conn.instanceUrl || conn.instanceUrl == '')
											{
												conn.instanceUrl = link.protocol + '//' + link.hostname;
											}
										}
										if (conn.instanceUrl)
										{
											salesforceAccessURL = conn.instanceUrl + '/secur/frontdoor.jsp?sid=' + conn.accessToken + '&retURL='
										}

										var myquery = "SELECT Id,Body,Name FROM StaticResource where NamespacePrefix = '' and ContentType in ('text/plain','application/javascript')";
										QueryRecords(conn, myquery, function(Queryerr, QueryResults)
										{
											if (Queryerr)
											{
												ProcessError('Error:' + Queryerr);
											}
											else
											{
												var searchfor = [];
												for (var ir1 = 0; ir1 < QueryResults.length; ir1++)
												{
													searchfor.push(QueryResults[ir1].Name);
												}
												var mypackage = {'types': [],'version': jsforceAPIVersion};
												mypackage.types.push({'members': searchfor,'name': 'StaticResource'});
												conn.metadata.retrieve({unpackaged: mypackage}, function(retreiveerr, retreivemetadata)
												{
													try
													{
														if (retreiveerr)
														{
															ProcessError(retreiveerr);
														}
														else
														{
															DocheckRetrieveStatus(conn, retreivemetadata.id, function(retreivemetadataresulterr, retreivemetadataresult)
															{
																try
																{
																	if (retreivemetadataresulterr)
																	{
																		ProcessError(retreivemetadataresulterr);
																	}
																	else
																	{
																		AddZipContentsToHashTableAsJson(retreivemetadataresult.zipFile, function(zipresultserr, zipresults)
																		{
																			try
																			{
																				if (zipresultserr)
																				{
																					ProcessError(zipresultserr);
																				}
																				else
																				{
																					var presult = '';
																					presult += '<div id="header">Select Resorurce: ';
																					presult += '<select onchange="OnSelectChange(this.value)">';
																					if (QueryResults)
																					{
																						presult += '<option value="">--None--</option>';
																						for (var ir1 = 0; ir1 < QueryResults.length; ir1++)
																						{
																							var QueryResult = QueryResults[ir1];

																							var metaname = 'unpackaged/staticresources/' + QueryResult.Name + '.resource';
																							if (zipresults.hasItem(metaname) == true)
																							{
																								var mydetail = zipresults.getItem(metaname);
																								if(mydetail)
																								{
																									finalresult.push({Name:QueryResult.Name,Body:mydetail});
																									presult += '<option value="'+QueryResult.Name+'">'+QueryResult.Name+'</option>';
																								}
																							}
																						}
																					}

																					presult += '</select>';
																					presult += '<button id="bntsave" type="button">Save</button>';

																					presult += '</div>';

																					presult += '<div id="main">';

																					presult += '<textarea id="texteditor" style="display:none;width: 100%; height: 800px;" />';
																					presult += '<div id="jsoneditor" style="display:none;width: 100%; height: 800px;"></div>'

																					presult += '</div>';

																					presult += '<div id="footer">';

																					presult += '</div>';
																					RemoteResult = finalresult;
																					j$("#pagediv").LoadingOverlay("hide");
																					j$("#pagediv").html(presult);
																					
																				}
																			}
																			catch (err)
																			{
																				console.log(err);
																				ProcessError(err);
																				throw err;
																			}
																		});
																	}
																}
																catch (err)
																{
																	console.log(err);
																	ProcessError(err);
																	throw err;
																}
															});
														}
													}
													catch (err)
													{
														console.log(err);
														ProcessError(err);
														throw err;
													}
												});
											}
										});
									}
								});
							}
						}
					}
					catch (err)
					{
						console.log(err);
						ProcessError(err);
						throw err;
					}
				});
			}
		}
		catch (err)
		{
			console.log(err);
			ProcessError(err);
		}
	});
});

/******************Support Functions *************************************/
	var editor;
	function OnSelectChange(sel)
	{
		j$("#texteditor").hide();
		j$("#jsoneditor").hide();
		var value = sel.value;
		var ffound = false;
		if (sel && sel != '' && RemoteResult && RemoteResult.length > 0)
		{
			for (var ir1 = 0; ir1 < RemoteResult.length; ir1++)
			{
				var Result = RemoteResult[ir1];
				if (Result.Name == sel)
				{

					if (sel == 'FX_Mobile_Filters' || sel == 'FX_Mobile_Rules')
					{
						if (!editor)
						{
							var container = document.getElementById("jsoneditor");
					        var options = {
							    mode: 'tree',
							    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
							    onError: function (err) {
							      alert(err.toString());
							    },
							    onModeChange: function (newMode, oldMode) {
							      //console.log('Mode switched from', oldMode, 'to', newMode);
							    },
							    onError: function (err) {
							      alert(err);
							    }
							  };
						   	
						   	editor = new JSONEditor(container, options);
						}
						var jsondata = Result.Body;
						if (jsondata.startsWith('window.FX_Mobile_Filters ='))
						{
							jsondata = jsondata.substring('window.FX_Mobile_Filters ='.length);
						}
						if (jsondata.startsWith('window.FX_Mobile_Filters='))
						{
							jsondata = jsondata.substring('window.FX_Mobile_Filters='.length);
						}

						if (jsondata.startsWith('window.FX_Mobile_Rules ='))
						{
							jsondata = jsondata.substring('window.FX_Mobile_Rules ='.length);
						}
						if (jsondata.startsWith('window.FX_Mobile_Rules='))
						{
							jsondata = jsondata.substring('window.FX_Mobile_Rules='.length);
						}

						var validerrors = ''
						{
							try 
							{
							 	var c = j$.parseJSON(jsondata);
							}
							catch (err) 
							{
							  	validerrors = err;
							}
						}
					
						if (validerrors != '')
						{
						 	alert('You must fix valadation errors: ' + validerrors);
						 	j$("#texteditor").show();
							j$("#texteditor").val(Result.Body);
						}
						else
						{
					        editor.setText(jsondata);
							j$("#jsoneditor").show();
						}
				    }
				    else
				    {
				    	j$("#texteditor").show();
						j$("#texteditor").val(Result.Body);
					}
					ffound = true;
				}
			}

		}
		if (ffound == false)
		{
			j$("#content").val('');
		}
	}

	function DoJSforceLogin(sid, lurl, luser, lpass, lproxy, callback)
	{
		var conn;
		if (sid != null && sid != '')
		{
			conn = new jsforce.Connection(
			{
				accessToken: sid
			});
			callback(null, conn);
		}
		else if (lurl != null && luser != null && lpass != null && lurl != '' && luser != '' && lpass != '')
		{
			//login with user/pass is only used for testing
			//when calling from sf accessToken is used
			conn = new jsforce.Connection(
			{
				// you can change loginUrl to connect to sandbox or prerelease env.
				loginUrl: myloginurl,
				proxyUrl: lproxy
			});
			conn.login(luser, lpass, function(err, userInfo)
			{
				if (err)
				{
					callback('Error logging in: ' + err, null);
				}
				else
				{
					// Now you can get the access token and instance URL information.
					// Save them to establish connection next time.
					// console.log(conn.accessToken);
					//console.log(conn.instanceUrl);
					// logged in user property
					//console.log("User ID: " + userInfo.id);
					// console.log("Org ID: " + userInfo.organizationId);
					myuserid = userInfo.id;
					// ...
					callback(null, conn);
				}
			});
		}
		else
		{
			callback('Not able to login!', null);
		}
	}


	function CurrentUserHasModifyAllDataAccess(conn, tid, callback)
	{
		var myquery = "select Id, UserRole.Name, UserRoleId,Name,ProfileId,Profile.PermissionsModifyAllData from User where id ='" + tid + "'";
		var HasModifyAllDataAccess = false; // this is needed to access the metadata api
		QueryRecords(conn, myquery, function(UserQueryerr, UserQueryResults)
		{
			if (UserQueryerr)
			{
				callback('Error:' + UserQueryerr, null)
			}
			var myUser = UserQueryResults[0];
			var HasModifyAllDataAccess = myUser.Profile.PermissionsModifyAllData;
			if (HasModifyAllDataAccess == true)
			{
				callback(null, true);
			}
			else
			{
				myquery = "select Id, PermissionsModifyAllData from PermissionSet where IsOwnedByProfile = false and Id in (SELECT PermissionSetId FROM PermissionSetAssignment where AssigneeId = '" + tid + "')";
				QueryRecords(conn, myquery, function(PermissionSetQueryerr, PermissionSetQueryResults)
				{
					if (PermissionSetQueryerr)
					{
						callback('Error:' + PermissionSetQueryerr, null)
					}
					else
					{
						//console.log(PermissionSetQueryResults);
						if (PermissionSetQueryResults != undefined)
						{
							for (var i = 0; i < PermissionSetQueryResults.length; i++)
							{
								var QueryResult = PermissionSetQueryResults[i];
								if (QueryResult.PermissionsModifyAllData == true)
								{
									HasModifyAllDataAccess = true;
									//callback(null,true);
									break;
								}
							}
						}
						callback(null, HasModifyAllDataAccess);
					}
				});
			}
		});
	}

	function AddZipContentsToHashTableAsJson(data, callback)
	{
		var batchs = [];
		var results = new HashTable();
		var new_zip = new JSZip();
		var errorhasoccured = false;
		new_zip.loadAsync(data,
			{
				base64: true
			})
			.then(function(zip)
			{
				j$.each(new_zip.files, function(index, zipEntry)
				{
					batchs.push(zipEntry.name);
				});
				j$.each(new_zip.files, function(index, zipEntry)
				{
					ReadFileToString(new_zip, zipEntry.name, function(err, path, result)
					{
						if (result == undefined || result == null || err)
						{
							callback('Bad Data in File: ' + path, null);
						}
						var mybatchindex = batchs.indexOf(path);
						if (mybatchindex < 0)
						{
							errorhasoccured = true;
							callback('batch not found!', null);
						}
						batchs.splice(mybatchindex, 1);
						var rawresult = result;
						if (!zipEntry.name.endsWith('.resource'))
						{
							var x2js = new X2JS();
							rawresult = x2js.xml_str2json(result);
						}
						results.setItem(path, rawresult);
						if (batchs.length == 0)
						{
							if (errorhasoccured == false)
							{
								callback(null, results);
							}
						}
					});
				});
			});
	}

	function ReadFileToString(myzip, mypath, callback)
	{
		var rawdata = myzip.file(mypath).async("string")
			.then(function(data)
			{
				callback(null, mypath, data);
			});
	}

	function ProcessError(error)
	{
		alert(error);
	}

	function QueryRecords(conn, myquery, callback)
	{
		var records = [];
		var query = conn.query(myquery)
			.on("record", function(record)
			{
				records.push(record);
				//console.log(record);
			})
			.on("end", function()
			{
				callback(null, records);
				//console.log("total in database : " + query.totalSize);
				//console.log("total fetched : " + query.totalFetched);
			})
			.on("error", function(err)
			{
				//console.error(err);
				callback(err, null);
			})
			.run(
			{
				autoFetch: true,
				maxFetch: 4000
			}); //
	}

	function QueryToolingRecords(conn, myquery, callback)
	{
		var records = [];
		var query = conn.tooling.query(myquery)
			.on("record", function(record)
			{
				records.push(record);
				//console.log(record);
			})
			.on("end", function()
			{
				callback(null, records);
				//console.log("total in database : " + query.totalSize);
				//console.log("total fetched : " + query.totalFetched);
			})
			.on("error", function(err)
			{
				//console.error(err);
				callback(err, null);
			})
			.run(
			{
				autoFetch: true,
				maxFetch: 4000
			}); // synonym of Query#execute();
	}

	function DocheckRetrieveStatus(conn, id, callback)
	{
		conn.metadata.checkRetrieveStatus(id, function(err, result)
		{
			if (err)
			{
				callback(err, result);
			}
			else if (result.done == 'false')
			{
				console.log('Metadata API Retrieve Status: ' + result.status);
				setTimeout(function()
				{
					DocheckRetrieveStatus(conn, id, callback);
				}, 5000);
			}
			else if (result.done == 'true')
			{
				callback(err, result);
			}
		});
	}

	function GetAllCustomObject(conn, callback)
	{
		var lstquery = [
		{
			type: 'CustomObject'
		}];
		conn.metadata.list(lstquery, jsforceAPIVersion, function(err, metadata)
		{
			if (err)
			{
				callback(err, null);
			}
			else
			{
				var fullNames = [];
				for (var i = 0; i < metadata.length; i++)
				{
					var meta = metadata[i];
					fullNames.push(meta.fullName);
				}
				callback(null, fullNames);
			}
		});
	}

	function GetAllCustomTabs(conn, callback)
	{
		var lstquery = [
		{
			type: 'CustomTab'
		}];
		conn.metadata.list(lstquery, jsforceAPIVersion, function(err, metadata)
		{
			if (err)
			{
				callback(err, null);
			}
			else
			{
				/*
				var fullNames = [];
				for (var i = 0; i < metadata.length; i++)
				{
					var meta = metadata[i];
					fullNames.push(meta.fullName);
				}
				*/
				callback(null, metadata);
			}
		});
	}


	function HashTable()
	{
		this.length = 0;
		this.items = new Array();
		this.keys = new Array();
		for (var i = 0; i < arguments.length; i += 2)
		{
			if (typeof(arguments[i + 1]) != 'undefined')
			{
				this.items[arguments[i]] = arguments[i + 1];
				this.length++;
			}
		}
		this.removeItem = function(in_key)
		{
			var tmp_previous;
			if (typeof(this.items[in_key]) != 'undefined')
			{
				this.length--;
				var tmp_previous = this.items[in_key];
				delete this.items[in_key];
			}
			if (this.keys.indexOf(in_key) >= 0)
			{
				this.keys.splice(this.keys.indexOf(in_key), 1);
			}
			return tmp_previous;
		}
		this.getItem = function(in_key)
		{
			return this.items[in_key];
		}
		this.getItemAt = function(index_key)
		{
			return this.items[index_key];
		}
		this.setItem = function(in_key, in_value)
		{
			var tmp_previous;
			if (typeof(in_value) != 'undefined')
			{
				if (typeof(this.items[in_key]) == 'undefined')
				{
					this.length++;
				}
				else
				{
					tmp_previous = this.items[in_key];
				}
				if (this.keys.indexOf(in_key) < 0)
				{
					this.keys.push(in_key);
				}
				this.items[in_key] = in_value;
			}
			return tmp_previous;
		}
		this.hasItem = function(in_key)
		{
			return typeof(this.items[in_key]) != 'undefined';
		}
		this.clear = function()
		{
			for (var i in this.items)
			{
				delete this.items[i];
			}
			this.length = 0;
			this.keys = [];
		}
	}

/******************END Support Functions *************************************/