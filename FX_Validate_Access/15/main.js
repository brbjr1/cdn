var j$ = jQuery.noConflict();
var RemoteGetObjectInfoResult; //global var of final results
var salesforceAccessURL = ''; //if value then links will use frontdoor.jsp on links to SalesForce pages

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

var loadphase = 1;

/******************Event Handlers *************************************/
	function UserTypeUpdated()
	{
		j$('#pageloading').show();
		var it1 = j$('#FXTicketingmobile').is(":checked");
		var it2 = j$('#FXTicketingBackOffice').is(":checked");
		var it3 = j$('#FXCPQmobile').is(":checked");
		var it4 = j$('#FXCPQBackOffice').is(":checked");
		var it5 = j$('#FXBackOfficeSchedulingAndDispatch').is(":checked");
		var it6 = j$('#FXEAM').is(":checked");
		var it7 = j$('#FXTimecard').is(":checked");
		var it8 = j$('#FXBackOfficeSchedulingAndDispatchMapping').is(":checked");
		j$('#FXObjectPermissionsWarnings').html(GetFXObjectPermissionsWarningshtml(it1, it2, it3, it4, it5, it6, it7, it8));
		j$('#FXLicenseWarnings').html(GetFXLicenseWarningshtml(it1, it2, it3, it4, it5, it6, it7, it8));
		j$('#pageloading').hide();
	}

	function ShowRecordTypePermissionsModal(sobject, sobjectlabel)
	{
		//j$('#RTHeader').html('<h2>' + sobjectlabel + ' Record Type Assigments</h2>');
		var fp = FindRTPermissions(sobject);
		var fs = FindSobject(sobject);
		var oheader = '';
		if (fs.CusomObjectId)
		{
			oheader = '<a href="' + salesforceAccessURL + '/' + fs.CusomObjectId + '" target="_blank">' + fs.Label + '</a> (' + fs.APIName + ')';
		}
		else
		{
			oheader = fs.Label;
		}
		j$('#RTHeader').html('<h2>' + oheader + ' Record Type Assigments</h2>');


		var datatableFieldPermissionsresult = '';
		if (fp != undefined && fp != null)
		{
			datatableFieldPermissionsresult += '<table id="RTPermissionsTable" class="display" style="display:none" cellspacing="0" width="100%"><thead><tr>';
			datatableFieldPermissionsresult += '<th>Label</th>';
			datatableFieldPermissionsresult += '<th>API Name</th>';
			datatableFieldPermissionsresult += '<th>Assigned</th>';
			datatableFieldPermissionsresult += '<th>Default</th>';
			datatableFieldPermissionsresult += '</tr></thead>';
			datatableFieldPermissionsresult += '<tbody>';
			j$.each(fp,
				function(index, d)
				{
					datatableFieldPermissionsresult += '<tr>';
					datatableFieldPermissionsresult += '<td>' + d.Label + '</td>';
					datatableFieldPermissionsresult += '<td>' + d.Name + '</td>';
					datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.Assigned, true, d.AssignedGrantedBy, fs, 'Field') + '</td>'
					datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.Default, true, d.DefaultGrantedBy, fs, 'Field') + '</td>'
					datatableFieldPermissionsresult += '</tr>';
				});
			datatableFieldPermissionsresult += '</tbody>';
			datatableFieldPermissionsresult += '</table>';
			j$('#RTBody').html(datatableFieldPermissionsresult);
		}
		j$('#RecordTypePermissionsModal').modal('show');
	}

	function ShowFieldPermissionsModal(sobject)
	{
		var fs = FindSobject(sobject);
		var fp = FindFieldPermissions(sobject);
		var oheader = '';
		if (fs.CusomObjectId)
		{
			oheader = '<a href="' + salesforceAccessURL + '/' + fs.CusomObjectId + '" target="_blank">' + fs.Label + '</a> (' + fs.APIName + ')';
		}
		else
		{
			oheader = fs.Label;
		}
		j$('#FPHeader').html('<h2>' + oheader + ' Field Permissions</h2>');
		
		
		var datatableFieldPermissionsresult = '';
		if (fp != undefined && fp != null)
		{
			// datatableFieldPermissionsresult += '<div class="table-responsive">';
			datatableFieldPermissionsresult += '<div><table id="FieldPermissionsTable" class="display" style="display:none;" cellspacing="0" width="100%"><thead><tr>';
			datatableFieldPermissionsresult += '<th>Label</th>';
			datatableFieldPermissionsresult += '<th>API Name</th>';
			datatableFieldPermissionsresult += '<th>Type</th>';
			datatableFieldPermissionsresult += '<th>Read</th>';
			datatableFieldPermissionsresult += '<th>Edit</th>';
			datatableFieldPermissionsresult += '</tr></thead>';
			datatableFieldPermissionsresult += '<tbody>';
			j$.each(fp,
				function(index, d)
				{
					datatableFieldPermissionsresult += '<tr>';
					datatableFieldPermissionsresult += '<td>' + d.Label + '</td>';
					datatableFieldPermissionsresult += '<td>' + d.Name + '</td>';
					var mytype = d.FieldDescribe.type;
					if (!mytype)
					{
						mytype = '';
					}
					if (mytype == 'Lookup' || mytype == 'MasterDetail')
					{
						var tsobjectype = d.FieldDescribe.referenceTo;
						if (!tsobjectype)
						{
							var tname = d.FieldDescribe.fullName;
							if (tname.endsWith('Id'))
							{
								tname = tname.substring(0, tname.length - 2);
							}
							if (tname == 'Owner')
							{
								tname = 'User';
							}
							if (tname == 'ReportsTo')
							{
								tname = 'Contact';
							}
							tsobjectype = tname;
						}
						
						var tsobject = FindSobject(tsobjectype);
						if (tsobject)
						{
							mytype += '(<a onclick="ShowFieldPermissionsModal(&apos;' + tsobject.APIName + '&apos;);">' + tsobject.Label + '</a>)';
						}
						else
						{
							console.log('Error 896156');
						}
					}

					datatableFieldPermissionsresult += '<td>' + mytype+ '</td>';


					datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.HasRead, d.ReadIsAssignable, d.HasReadGrantedBy, fs, 'Field') + '</td>'
					datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.HasEdit, d.EditIsAssignable, d.HasEditGrantedBy, fs, 'Field') + '</td>'
					datatableFieldPermissionsresult += '</tr>';
				});
			datatableFieldPermissionsresult += '</tbody>';
			datatableFieldPermissionsresult += '</table></div>';
		}

		var isshown = (j$("#FilePermissionsModal").data('bs.modal') || {}).isShown
		if (isshown == true)
		{
			j$('#FieldPermissionsTable').DataTable().destroy();
			j$('#FieldPermissionsTable').empty();

			j$('#FPBody').html(datatableFieldPermissionsresult);
			loadFilePermissionsModal();
		}
		else
		{
			j$('#FPBody').html(datatableFieldPermissionsresult);
			j$('#FilePermissionsModal').modal('show');
		}
	}

	function ShowObjectModal(sobject)
	{
		var ort = FindRTPermissions(sobject);
		var ofp = FindFieldPermissions(sobject);
		var ofs = FindSobject(sobject);
		var oheader = '';
		if (ofs.CusomObjectId)
		{
			oheader = '<a href="' + salesforceAccessURL + '/' + ofs.CusomObjectId + '" target="_blank">' + ofs.Label + '</a> (' + ofs.APIName + ')';
		}
		else
		{
			oheader = ofs.Label;
		}
		j$('#OHeader').html('<h2>' + oheader + (ofs.ObjectDescribe.IsCustomTab == true ? ' Tab' : ' Object') +  ' Settings</h2>');
		var osresult = '';

		if (ofs.TabPermissions && ofs.TabPermissions.length > 0)
		{
			osresult += '<div class="container-full"><h4>Tab Settings</h4><div class="panel panel-default">';
			osresult += '<table id="OTabPermissionsTable" class="display" style="display:none;" cellspacing="0" width="100%">';
			osresult += '<thead>';
			osresult += '<tr>';
			osresult += '<th>Label</th>';
			osresult += '<th>Assigned</th>';
			osresult += '</tr>';
			osresult += '</thead>';
			osresult += '<tbody>';
			j$.each(ofs.TabPermissions,
				function(index, d)
				{
					osresult += '<tr>';
					osresult += '<td>' + d.Label + '</td>';
					osresult += '<td>' + GetSpanPermission(d.Assigned, true, d.AssignedGrantedBy, ofs, 'TabSetting') + '</td>'
					osresult += '</tr>';
				});
			osresult += '</tbody>';
			osresult += '</table>';
			osresult += '</div></div></div>';
			osresult += '<br/>';
		}


		if (ort && ort.length > 0)
		{
			osresult += '<div class="container-full"><h4>Record Types Assignments</h4><div class="panel panel-default">';
			osresult += '<table id="ORTPermissionsTable" class="display" style="display:none;" cellspacing="0" width="100%">';
			osresult += '<thead>';
			osresult += '<tr>';
			osresult += '<th>Label</th>';
			osresult += '<th>API Name</th>';
			osresult += '<th>Assigned</th>';
			osresult += '<th>Default</th>';
			osresult += '</tr>';
			osresult += '</thead>';
			osresult += '<tbody>';
			j$.each(ort,
				function(index, d)
				{
					osresult += '<tr>';
					osresult += '<td>' + d.Label + '</td>';
					osresult += '<td>' + d.Name + '</td>';
					osresult += '<td>' + GetSpanPermission(d.Assigned, true, d.AssignedGrantedBy, ofs, 'Field') + '</td>'
					osresult += '<td>' + GetSpanPermission(d.Default, true, d.DefaultGrantedBy, ofs, 'Field') + '</td>'
					osresult += '</tr>';
				});
			osresult += '</tbody>';
			osresult += '</table>';
			osresult += '</div></div></div>';
			osresult += '<br/>';
		}
		if (ofs.IsPermissionable == true)
		{
			osresult += '<div class="container-full"><h4>Object Permissions</h4><div class="panel panel-default">';
			osresult += '<table id="OFXObjectsTable" class="display" style="display:none;" cellspacing="0" width="100%">';
			osresult += '<thead>';
			osresult += '<tr>';
			osresult += '<th>Permission Name</th>';
			osresult += '<th>Enabled</th>';
			osresult += '</tr>';
			osresult += '</thead>';
			osresult += '<tbody>';
			osresult += '<tr><td>Read</td><td>' + GetSpanPermission(ofs.HasRead, true, ofs.HasReadGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '<tr><td>Create</td><td>' + GetSpanPermission(ofs.HasCreate, true, ofs.HasCreateGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '<tr><td>Edit</td><td>' + GetSpanPermission(ofs.HasEdit, true, ofs.HasEditGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '<tr><td>Delete</td><td>' + GetSpanPermission(ofs.HasDeleteRead, true, ofs.HasDeleteGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '<tr><td>View All</td><td>' + GetSpanPermission(ofs.HasViewAll, true, ofs.HasViewAllGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '<tr><td>Modify All</td><td>' + GetSpanPermission(ofs.HasModifyAllRead, true, ofs.HasModifyAllGrantedBy, ofs, 'Object') + '</td></tr>';
			osresult += '</tbody>';
			osresult += '</table>';
			osresult += '</div></div></div>';
		}

		if (ofs.OneFieldIsPermissionable == true && ofp)
		{
			osresult += '<br/>';
			osresult += '<div class="container-full"><h4>Field Permissions</h4><div class="panel panel-default">';
			osresult += '<table id="OFieldPermissionsTable" class="display" style="display:none;" cellspacing="0" width="100%">';
			osresult += '<thead>';
			osresult += '<tr>';
			osresult += '<th>Label</th>';
			osresult += '<th>API Name</th>';
			osresult += '<th>Type</th>';
			osresult += '<th>Read</th>';
			osresult += '<th>Edit</th>';
			osresult += '</tr>';
			osresult += '</thead>';
			osresult += '<tbody>';
			j$.each(ofp,
				function(index, d)
				{
					osresult += '<tr>';
					osresult += '<td>' + d.Label + '</td>';
					osresult += '<td>' + d.Name + '</td>';
					var mytype = d.FieldDescribe.type;
					if (!mytype)
					{
						mytype = '';
					}
					if (mytype == 'Lookup' || mytype == 'MasterDetail')
					{
						var tsobjectype = d.FieldDescribe.referenceTo;
						if (!tsobjectype)
						{
							var tname = d.FieldDescribe.fullName;
							if (tname.endsWith('Id'))
							{
								tname = tname.substring(0, tname.length - 2);
							}
							if (tname == 'Owner')
							{
								tname = 'User';
							}
							if (tname == 'ReportsTo')
							{
								tname = 'Contact';
							}
							tsobjectype = tname;
						}
						
						var tsobject = FindSobject(tsobjectype);
						if (tsobject)
						{
							mytype += '(<a onclick="ShowObjectModal(&apos;' + tsobject.APIName + '&apos;);">' + tsobject.Label + '</a>)';
						}
						else
						{
							//console.log('Error 896155');
							mytype += '(' + tsobjectype + ')';
						}
					}

					osresult += '<td>' + mytype+ '</td>';
					
					osresult += '<td>' + GetSpanPermission(d.HasRead, d.ReadIsAssignable, d.HasReadGrantedBy, ofs, 'Field') + '</td>'
					osresult += '<td>' + GetSpanPermission(d.HasEdit, d.EditIsAssignable, d.HasEditGrantedBy, ofs, 'Field') + '</td>'
					osresult += '</tr>';
				});
			osresult += '</tbody>';
			osresult += '</table>';
			osresult += '</div></div></div>';
		}
		//j$('#OBody').html(osresult);

		var isshown = (j$("#ObjectModal").data('bs.modal') || {}).isShown
		if (isshown == true)
		{
			
			j$('#OTabPermissionsTable').DataTable().destroy();
			j$('#ORTPermissionsTable').DataTable().destroy();
			j$('#OFXObjectsTable').DataTable().destroy();
			j$('#OFieldPermissionsTable').DataTable().destroy();

			j$('#OTabPermissionsTable').empty();
			j$('#ORTPermissionsTable').empty();
			j$('#OFXObjectsTable').empty();
			j$('#OFieldPermissionsTable').empty();

			j$('#OBody').html(osresult);
			loadObjectModal();
		}
		else
		{
			j$('#OBody').html(osresult);
			//j$('#ObjectModal').modal('hide');
			j$('#ObjectModal').modal('show');
		}
	}

	j$(window).resize(function()
	{
		var maxdocheight = j$(window).height() - 150;
		j$('#RTBody').css('height', maxdocheight);
		j$('#FPBody').css('height', maxdocheight);
		j$('#OBody').css('height', maxdocheight);
	});

	j$('#RecordTypePermissionsModal').on('shown.bs.modal', function()
	{
		window.location.hash = "RecordTypePermissionsModal";
		j$('#RTPermissionsTable').show();
		var maxdocheight = j$(window).height() - 150;
		j$('body').css(
		{
			overflow: 'hidden'
		});
		j$('#RTBody').css('height', maxdocheight);
		j$('#RTPermissionsTable').DataTable(
		{
			"scrollCollapse": true,
			"paging": false,
			"order": [0, "asc"],
			"stateSave": true,
			"searching": true,
			"columnDefs": [
			{
				"targets": [2, 3],
				"visible": true,
				"searchable": false,
				"orderDataType": "dom-span.glyphicon.glyphicon-check.dropdown-toggle"
			}]
		});
	});

	j$('#RecordTypePermissionsModal').on('hidden.bs.modal', function()
	{
		j$('body').css(
		{
			overflow: ''
		});
		if (window.location.hash == "#RecordTypePermissionsModal")
		{
			window.history.back();
		}
	});

	j$('#FilePermissionsModal').on('shown.bs.modal', function()
	{
		window.location.hash = "FilePermissionsModal";
		loadFilePermissionsModal();
	});

	j$('#FilePermissionsModal').on('hidden.bs.modal', function()
	{
		j$('body').css(
		{
			overflow: ''
		});
		if (window.location.hash == "#FilePermissionsModal")
		{
			window.history.back();
		}
	});

	function loadFilePermissionsModal()
	{
		j$('#FieldPermissionsTable').show();
		var maxdocheight = j$(window).height() - 150;
		j$('body').css(
		{
			overflow: 'hidden'
		});
		j$('#FPBody').css('height', maxdocheight);
		j$('#FieldPermissionsTable').DataTable(
		{
			"scrollCollapse": false,
			"paging": false,
			"order": [0, "asc"],
			"stateSave": true,
			"searching": true,
			"columnDefs": [
			{
				"targets": [2, 3],
				"visible": true,
				"searchable": false,
				"orderDataType": "dom-checkbox-glyphicon"
			}]
		});
	}

	j$('#ObjectModal').on('shown.bs.modal', function()
	{
		window.location.hash = "ObjectModal";
		loadObjectModal();
	});


	function loadObjectModal()
	{
		j$('#OTabPermissionsTable').show();
		j$('#ORTPermissionsTable').show();
		j$('#OFXObjectsTable').show();
		j$('#OFieldPermissionsTable').show();
		var maxdocheight = j$(window).height() - 150; //j$('OHeader').height() - j$('OFooter').height();// * .80;
		j$('#OBody').css('height', maxdocheight);
		j$('body').css(
		{
			overflow: 'hidden'
		});

		j$('#OTabPermissionsTable').DataTable(
		{
			"scrollCollapse": true,
			"paging": false,
			"stateSave": false,
			"searching": false,
			"ordering": false,
			"info": false,
			"columnDefs": [
				{
					"targets": [1],
					"visible": true,
					"searchable": false,
					"orderDataType": "dom-checkbox-glyphicon"
				},
				{
					"targets": [0],
					"width": "20%"
				}
			]
		});
		

		
		j$('#ORTPermissionsTable').DataTable(
		{
			"scrollCollapse": true,
			"paging": false,
			"order": [0, "asc"],
			"stateSave": true,
			"searching": false,
			"info": false,
			"columnDefs": [
			{
				"targets": [2, 3],
				"visible": true,
				"searchable": false,
				"orderDataType": "dom-checkbox-glyphicon"
			}]
		});
		j$('#OFXObjectsTable').DataTable(
		{
			"scrollCollapse": true,
			"paging": false,
			"stateSave": false,
			"searching": false,
			"ordering": false,
			"info": false,
			"columnDefs": [
				{
					"targets": [1],
					"visible": true,
					"searchable": false,
					"orderDataType": "dom-checkbox-glyphicon"
				},
				{
					"targets": [0],
					"width": "20%"
				}
			]
		});
		j$('#OFieldPermissionsTable').DataTable(
		{
			"scrollCollapse": false,
			"paging": false,
			"order": [0, "asc"],
			"stateSave": true,
			"searching": true,
			"columnDefs": [
			{
				"targets": [2, 3],
				"visible": true,
				"searchable": false,
				"orderDataType": "dom-checkbox-glyphicon"
			}]
		});
	}

	j$('#ObjectModal').on('hidden.bs.modal', function()
	{
		j$('body').css(
		{
			overflow: ''
		});
		if (window.location.hash == "#ObjectModal")
		{
			window.history.back();
		}
	});

	j$.fn.dataTable.ext.order['dom-checkbox-glyphicon'] = function(settings, col)
	{
		return this.api().column(col,
		{
			order: 'index'
		}).nodes().map(function(td, i)
		{
			return j$('span', td).attr('data-checked') == 'true' ? '1' : '0';
		});
	}

	j$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    	//alert('TAB CHANGED');
    	if (e.target.hash == "#UserDetails" && loadphase  == 1)
    	{
    		j$("#UserDetails").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#FXObjectPermissions" && loadphase <= 2)
    	{
    		j$("#FXObjectPermissions").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#FXRelatedObjectPermissions" && loadphase <= 2)
    	{
    		j$("#FXRelatedObjectPermissions").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#ApexClasses" && loadphase  == 1)
    	{
    		j$("#ApexClasses").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#VisualforcePages" && loadphase  == 1)
    	{
    		j$("#VisualforcePages").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#SystemPermissions" && loadphase  == 1)
    	{
    		j$("#SystemPermissions").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}
    	if (e.target.hash == "#Warnings" && loadphase <= 2)
    	{
    		j$("#Warnings").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
    	}

	})
/******************END Event Handlers *************************************/

j$(document).ready(function()
{
	
	j$("#pagediv").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});
	//j$("#UserDetails").LoadingOverlay("show",{image : "",fontawesome : "fa fa-spinner fa-spin"});

	var finalresult = {
		FXObjects: [],
		FXRelatedObjects: [],
		PermissionSets: [],
		PackageLicense: [],
		ApexClassAccess: [],
		VFPageAccess: [],
		SystemPermissions: []
	};
	/*
    PromiseDoJSforceLogin(mysessionId, myloginurl, myusername, mypassword, myproxyUrl).then(function(conn)
    {
    	console.log('login success');
        if (targetUserId == undefined || targetUserId == null || targetUserId == '')
        {
            throw 'Id not found';
        }
        else if (myuserid == undefined || myuserid == null || myuserid == '')
        {
            throw 'My UserId not found';
        }
        PromiseCurrentUserHasModifyAllDataAccess(conn, myuserid).then(function(hasaccessresult)
	    {
	    	console.log(hasaccessresult);
	    	throw 'sss';
	        
	    })
    }
	)
    .catch(function(error) 
    {
    	ProcessError(error);
	    //console.log("Failed!", error);
	});
	*/
	//if (1 == 2)
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
				try
				{
					if (targetUserId == undefined || targetUserId == null || targetUserId == '')
					{
						ProcessError('Id not found');
					}
					else if (myuserid == undefined || myuserid == null || myuserid == '')
					{
						ProcessError('My UserId not found');
					}
					else
					{
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
										if (conn.instanceUrl)
										{
											salesforceAccessURL = conn.instanceUrl + '/secur/frontdoor.jsp?sid=' + conn.accessToken + '&retURL='
										}
										conn.sobject("Profile").describe(function(err, Profilemeta)
										{
											try
											{
												if (err)
												{
													ProcessError(err);
												}
												else
												{
													conn.sobject("PermissionSet").describe(function(err, Permissionsetmeta)
													{
														try
														{
															if (err)
															{
																ProcessError(err);
															}
															else
															{
																//console.log(Profilemeta);
																var userprofilefields = '';
																for (var iupf1 = 0; iupf1 < Profilemeta.fields.length; iupf1++)
																{
																	var myfield = Profilemeta.fields[iupf1];
																	userprofilefields += ', Profile.' + myfield.name;
																}
																var myUser;
																var myquery = "select Id, UserRole.Name, UserRoleId,Name,ProfileId,Profile.UserLicense.Name " + userprofilefields + " from User where id ='" + targetUserId + "'";
																QueryRecords(conn, myquery, function(UserQueryerr, UserQueryResults)
																{
																	try
																	{
																		if (UserQueryerr)
																		{
																			ProcessError('Error:' + UserQueryerr);
																		}
																		else
																		{
																			finalresult.Userdetail = UserQueryResults[0];
																			myUser = UserQueryResults[0];
																			var searchids = "'" + myUser.ProfileId + "'";
																			var searchprofilename = myUser.Profile.Name;
																			var searchPermissionSetnames = [];
																			var searchObjects = [];
																			var perms = new HashTable();
																			myquery = "Select Id from PermissionSet where ProfileId = '" + myUser.ProfileId + "'";
																			QueryRecords(conn, myquery, function(ProfilePermissionSetQueryerr, ProfilePermissionSetQueryResults)
																			{
																				try
																				{
																					if (ProfilePermissionSetQueryerr)
																					{
																						ProcessError('Error:' + ProfilePermissionSetQueryerr);
																					}
																					else
																					{
																						var ProfilePermissionSetId = ProfilePermissionSetQueryResults[0].Id;
																						searchids += ",'" + ProfilePermissionSetId + "'";
																						var permissionsetfields = '';
																						for (var ipsf1 = 0; ipsf1 < Permissionsetmeta.fields.length; ipsf1++)
																						{
																							var myfield = Permissionsetmeta.fields[ipsf1];
																							if (permissionsetfields != '')
																							{
																								permissionsetfields += ',';
																							}
																							permissionsetfields += myfield.name;
																						}
																						myquery = "select " + permissionsetfields + " from PermissionSet where IsOwnedByProfile = false and Id in (SELECT PermissionSetId FROM PermissionSetAssignment where AssigneeId = '" + targetUserId + "')";
																						QueryRecords(conn, myquery, function(PermissionSetQueryerr, PermissionSetQueryResults)
																						{
																							try
																							{
																								if (PermissionSetQueryerr)
																								{
																									ProcessError('Error:' + PermissionSetQueryerr);
																								}
																								else
																								{
																									//console.log(PermissionSetQueryResults);
																									if (PermissionSetQueryResults != undefined)
																									{
																										for (var ipsr1 = 0; ipsr1 < PermissionSetQueryResults.length; ipsr1++)
																										{
																											var QueryResult = PermissionSetQueryResults[ipsr1];
																											var mypermname = (QueryResult.NamespacePrefix != undefined && QueryResult.NamespacePrefix.length > 0 ? QueryResult.NamespacePrefix + '__' : '') + QueryResult.Name;
																											searchPermissionSetnames.push(mypermname);
																											searchids += ",'" + QueryResult.Id + "'";
																											perms.setItem(QueryResult.Id, QueryResult);
																											var psinfo = {
																												Name: mypermname,
																												Label: QueryResult.Label,
																												Description: (QueryResult.Description != undefined && QueryResult.Description != null ? QueryResult.Description : ''),
																												Id: QueryResult.Id
																											};
																											finalresult.PermissionSets.push(psinfo);
																										}
																									}
																									for (var ipm1 = 0; ipm1 < Profilemeta.fields.length; ipm1++)
																									{
																										var myfield = Profilemeta.fields[ipm1];
																										if (myfield.name.startsWith('Permissions'))
																										{
																											var si = {
																												GrantedBy: [],
																												HasAccess: false,
																												Label: myfield.label,
																												Name: myfield.name
																											};
																											var panswer = myUser.Profile[myfield.name];
																											if (panswer != undefined && panswer == true)
																											{
																												si.HasAccess = true;
																												si.GrantedBy.push(
																												{
																													Id: myUser.Profile.Id,
																													IsProfile: true,
																													Name: myUser.Profile.Name
																												});
																											}
																											if (PermissionSetQueryResults != undefined)
																											{
																												for (var ipsr1 = 0; ipsr1 < PermissionSetQueryResults.length; ipsr1++)
																												{
																													var permsetresult = PermissionSetQueryResults[ipsr1];
																													var psanswer = permsetresult[myfield.name];
																													if (psanswer != undefined && psanswer == true)
																													{
																														si.HasAccess = true;
																														si.GrantedBy.push(
																														{
																															Id: permsetresult.Id,
																															IsProfile: false,
																															Name: permsetresult.Name
																														});
																													}
																												}
																											}
																											finalresult.SystemPermissions.push(si);
																										}
																									}
																									DescribeAllSObjects(conn, function(DescribeAllSObjectserr, DescribeAllSObjectsResult,Customtabnames)
																									{
																										try
																										{
																											if (DescribeAllSObjectserr)
																											{
																												console.log('Warning: There was an error Describing objects. Error Details: ' + DescribeAllSObjectserr);
																												// alert( 'Warning: There was an error Describing objects. Error Details: ' + DescribeAllSObjectserr);
																											}
																											//recordTypes
																											//console.log(DescribeAllSObjectsResult);
																											var ChildParentRelationships = new HashTable();
																											var ParentChildRelationships = new HashTable();
																											var SobjectHT = new HashTable();
																											var RelatedFXObjectsHT = new HashTable();
																											j$.each(DescribeAllSObjectsResult, function(index, item)
																											{
																												var sobjecttype = item.fullName;
																												if ((sobjecttype.toLowerCase().startsWith('fx5__') || sobjecttype.toLowerCase().startsWith('fxt2__') || sobjecttype == 'Account' || sobjecttype == 'Contact' || sobjecttype == 'User') && item.isCustomSetting == false ) 
																												{
																													RelatedFXObjectsHT.setItem(sobjecttype, item);
																													var fieldresults = GetFieldResults(item);
																													var recordTyperesults = GetRecordTypeResults(item,myUser.ProfileId, searchprofilename);
																													var TabPerms = GetTabResults(item);
																													var s1 = {
																														APIName: sobjecttype,
																														HasCreate: false,
																														HasCreateGrantedBy: [],
																														HasDelete: false,
																														HasDeleteGrantedBy: [],
																														HasEdit: false,
																														HasEditGrantedBy: [],
																														HasModifyAll: false,
																														HasModifyAllGrantedBy: [],
																														HasRead: false,
																														HasReadGrantedBy: [],
																														HasViewAll: false,
																														HasViewAllGrantedBy: [],
																														Label: item.label,
																														OneFieldIsPermissionable: item.OneFieldIsPermissionable,
																														fields: fieldresults,
																														recordtypes: recordTyperesults,
																														/*isCustom: false,*/
																														isCustomSetting: false,
																														CusomObjectId: item.CusomObjectId,
																														ObjectDescribe: item,
																														IsPermissionable: item.IsPermissionable,
																														TabPermissions : TabPerms,
																														ChildRelatedObjects:[],
																														ParentRelatedObjects:[]

																													};
																													finalresult.FXObjects.push(s1);
																													searchObjects.push(sobjecttype);
																												}
																												SobjectHT.setItem(sobjecttype, item);
																												var myparents = [];
																												var myfields = GetDescribeSObjectField(item.fields);
																												for (var ifld1 = 0; ifld1 < myfields.length; ifld1++)
																												{
																													var field = myfields[ifld1];
																													if ((field.type == 'MasterDetail' || field.type == 'Lookup') && field.referenceTo != undefined && field.referenceTo != null)
																													{
																														if (myparents.indexOf(field.referenceTo) < 0)
																														{
																															myparents.push(field.referenceTo);
																														}
																													}
																												}
																												if (myparents.length > 0)
																												{
																													ChildParentRelationships.setItem(sobjecttype, myparents);
																													for (var icpr1 = 0; icpr1 < myparents.length; icpr1++)
																													{
																														var myparent = myparents[icpr1];
																														var mychildern = ParentChildRelationships.hasItem(myparent) ? ParentChildRelationships.getItem(myparent) : [];
																														if (mychildern.indexOf(sobjecttype) < 0)
																														{
																															mychildern.push(sobjecttype);
																														}
																														if (mychildern.length > 0)
																														{
																															ParentChildRelationships.setItem(myparent, mychildern);
																														}
																													}
																												}
																											});
																											//console.log(ChildParentRelationships);
																											var RelatedFXObjectNames = [];
																											for (var irh1 = 0; irh1 < RelatedFXObjectsHT.keys.length; irh1++)
																											{
																												var mykey = RelatedFXObjectsHT.keys[irh1];
																												var parentname = RelatedFXObjectsHT.getItem(mykey);
																												if (parentname != undefined)
																												{
																													GetRelatedObjects(RelatedFXObjectNames, parentname.fullName, ParentChildRelationships);
																												}
																												else
																												{
																													var a1 = '';
																												}
																											}
																											//also add object child objects
																											for (var ipcr1 = 0; ipcr1 < ParentChildRelationships.keys.length; ipcr1++)
																											{
																												var mykey = ParentChildRelationships.keys[ipcr1];
																												var myvalue = ParentChildRelationships.getItem(mykey);
																												if (myvalue && myvalue.length > 0)
																												{
																													for (var imv1 = 0; imv1 < myvalue.length; imv1++)
																													{
																														var mychaildname = myvalue[imv1];
																														if(RelatedFXObjectsHT.hasItem(mychaildname))
																														{
																															if (RelatedFXObjectNames.indexOf(mykey) < 0)
																															{
																																RelatedFXObjectNames.push(mykey)
																															}
																														}

																													}
																												}
																											}

																											//console.log(RelatedFXObjectNames);
																											for (var ifro1 = 0; ifro1 < RelatedFXObjectNames.length; ifro1++)
																											{
																												var RelatedFXObjectName = RelatedFXObjectNames[ifro1];
																												if (SobjectHT.hasItem(RelatedFXObjectName))
																												{
																													var item = SobjectHT.getItem(RelatedFXObjectName);
																													var sobjecttype = item.fullName;
																													if (sobjecttype != undefined && RelatedFXObjectsHT.hasItem(sobjecttype) == false && item.isCustomSetting == false)
																													{
																														searchObjects.push(sobjecttype);
																														var fieldresults = GetFieldResults(item);
																														var recordTyperesults = GetRecordTypeResults(item,myUser.ProfileId, searchprofilename);
																														var TabPerms = GetTabResults(item);
																														var s1 = {
																															APIName: sobjecttype,
																															HasCreate: false,
																															HasCreateGrantedBy: [],
																															HasDelete: false,
																															HasDeleteGrantedBy: [],
																															HasEdit: false,
																															HasEditGrantedBy: [],
																															HasModifyAll: false,
																															HasModifyAllGrantedBy: [],
																															HasRead: false,
																															HasReadGrantedBy: [],
																															HasViewAll: false,
																															HasViewAllGrantedBy: [],
																															Label: item.label,
																															OneFieldIsPermissionable: item.OneFieldIsPermissionable,
																															fields: fieldresults,
																															recordtypes: recordTyperesults,
																															/*isCustom: false,*/
																															isCustomSetting: false,
																															CusomObjectId: item.CusomObjectId,
																															ObjectDescribe: item,
																															IsPermissionable: item.IsPermissionable,
																															TabPermissions : TabPerms,
																															ChildRelatedObjects:[],
																															ParentRelatedObjects:[]
																														};
																														finalresult.FXRelatedObjects.push(s1);
																													}
																												}
																											}
																											//add child and panert ralationshipe
																											//finalresult.FXObjects
																											//finalresult.FXRelatedObjects
																											//	var ChildParentRelationships = new HashTable();
																											//var ParentChildRelationships = new HashTable();
																											for (var ifor1 = 0; ifor1 < finalresult.FXObjects.length; ifor1++)
																											{
																												var fobj = finalresult.FXObjects[ifor1];
																												if (ParentChildRelationships.hasItem(fobj.APIName))
																												{
																													finalresult.FXObjects[ifor1].ChildRelatedObjects = ParentChildRelationships.getItem(fobj.APIName);
																												}
																												if (ChildParentRelationships.hasItem(fobj.APIName))
																												{
																													finalresult.FXObjects[ifor1].ParentRelatedObjects = ChildParentRelationships.getItem(fobj.APIName);
																												}
																											}
																											for (var ifor1 = 0; ifor1 < finalresult.FXRelatedObjects.length; ifor1++)
																											{
																												var fobj = finalresult.FXRelatedObjects[ifor1];
																												if (ParentChildRelationships.hasItem(fobj.APIName))
																												{
																													finalresult.FXRelatedObjects[ifor1].ChildRelatedObjects = ParentChildRelationships.getItem(fobj.APIName);
																												}
																												if (ChildParentRelationships.hasItem(fobj.APIName))
																												{
																													finalresult.FXRelatedObjects[ifor1].ParentRelatedObjects = ChildParentRelationships.getItem(fobj.APIName);
																												}
																											}

																											myquery = "SELECT Id, Status, IsProvisioned, AllowedLicenses, UsedLicenses, ExpirationDate, CreatedDate, LastModifiedDate, SystemModstamp, NamespacePrefix FROM PackageLicense where NamespacePrefix in('FXMAP','FXJSD','FXTKT','FX5','FXCPQ','FXEAM') and Id in (SELECT  PackageLicenseId FROM UserPackageLicense where UserId ='" + targetUserId + "')";
																											QueryRecords(conn, myquery, function(PackageLicenseQueryerr, PackageLicenseQueryResults)
																											{
																												try
																												{
																													if (PackageLicenseQueryerr)
																													{
																														ProcessError('Error:' + PackageLicenseQueryerr);
																													}
																													else
																													{
																														if (PackageLicenseQueryResults != undefined)
																														{
																															for (var iplqr1= 0; iplqr1 < PackageLicenseQueryResults.length; iplqr1++)
																															{
																																var QueryResult = PackageLicenseQueryResults[iplqr1];
																																var licinfo = {
																																	Name: GetLicenseName(QueryResult.NamespacePrefix),
																																	Id: QueryResult.Id
																																};
																																finalresult.PackageLicense.push(licinfo);
																															}
																														}
																														var profileId = myUser.ProfileId;
																														var profileName = myUser.Profile.Name;
																														myquery = "SELECT Id, Name,NamespacePrefix,Status, (SELECT Id, ParentId,SetupEntityId FROM SetupEntityAccessItems where ParentId in ( " + searchids + " )) FROM ApexClass";
																														QueryRecords(conn, myquery, function(ApexClassQueryerr, ApexClassQueryResults)
																														{
																															try
																															{
																																if (ApexClassQueryerr)
																																{
																																	ProcessError('Error:' + ApexClassQueryerr);
																																}
																																else
																																{
																																	if (ApexClassQueryResults != undefined)
																																	{
																																		for (var iaqr1 = 0; iaqr1 < ApexClassQueryResults.length; iaqr1++)
																																		{
																																			var QueryResult = ApexClassQueryResults[iaqr1];
																																			var myname = (QueryResult.NamespacePrefix != null ? QueryResult.NamespacePrefix + '.' + QueryResult.Name : QueryResult.Name).replace(' ', '_');
																																			var si = {
																																				GrantedBy: [],
																																				HasAccess: false,
																																				Label: myname,
																																				Name: myname
																																			};
																																			if (QueryResult.SetupEntityAccessItems != undefined)
																																			{
																																				if (Array.isArray(QueryResult.SetupEntityAccessItems.records))
																																				{
																																					for (var isea1 = 0; isea1 < QueryResult.SetupEntityAccessItems.records.length; isea1++)
																																					{
																																						var sa = QueryResult.SetupEntityAccessItems.records[isea1];
																																						si.HasAccess = true;
																																						var myid = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId ? profileId : sa.ParentId;
																																						var isprofile = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId;
																																						var myparentname = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId ? profileName : perms.getItem(sa.ParentId).Name;
																																						si.GrantedBy.push(
																																						{
																																							Id: myid,
																																							IsProfile: isprofile,
																																							Name: myparentname
																																						});
																																					}
																																				}
																																				else
																																				{
																																					Alert('Error 99901');
																																				}
																																			}
																																			finalresult.ApexClassAccess.push(si);
																																		}
																																	}
																																	myquery = "SELECT Id, Name,NamespacePrefix,MasterLabel, (SELECT Id, ParentId,SetupEntityId FROM SetupEntityAccessItems where ParentId in ( " + searchids + " )) FROM ApexPage";
																																	QueryRecords(conn, myquery, function(ApexPageQueryerr, ApexPageQueryResults)
																																	{
																																		try
																																		{
																																			if (ApexPageQueryerr)
																																			{
																																				ProcessError('Error:' + ApexPageQueryerr);
																																			}
																																			else
																																			{
																																				if (ApexPageQueryResults != undefined)
																																				{
																																					for (var iapq = 0; iapq < ApexPageQueryResults.length; iapq++)
																																					{
																																						var QueryResult = ApexPageQueryResults[iapq];
																																						var myname = (QueryResult.NamespacePrefix != null ? QueryResult.NamespacePrefix + '.' + QueryResult.Name : QueryResult.Name).replace(' ', '_');
																																						var si = {
																																							GrantedBy: [],
																																							HasAccess: false,
																																							Label: myname,
																																							Name: myname
																																						};
																																						if (QueryResult.SetupEntityAccessItems != undefined)
																																						{
																																							if (Array.isArray(QueryResult.SetupEntityAccessItems.records))
																																							{
																																								for (var iapq2 = 0; iapq2 < QueryResult.SetupEntityAccessItems.records.length; iapq2++)
																																								{
																																									var sa = QueryResult.SetupEntityAccessItems.records[iapq2];
																																									si.HasAccess = true;
																																									var myid = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId ? profileId : sa.ParentId;
																																									var isprofile = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId;
																																									var myparentname = sa.ParentId == profileId || sa.ParentId == ProfilePermissionSetId ? profileName : perms.getItem(sa.ParentId).Name;
																																									si.GrantedBy.push(
																																									{
																																										Id: myid,
																																										IsProfile: isprofile,
																																										Name: myparentname
																																									});
																																								}
																																							}
																																							else
																																							{
																																								Alert('Error 99902');
																																							}
																																						}
																																						finalresult.VFPageAccess.push(si);
																																					}
																																				}
																																				ProcessFinalResult(finalresult, 1, function(result)
																																				{
																																					loadphase = 2;
																																					j$("#pagediv").LoadingOverlay("hide", true);
																																					j$("#UserDetails").LoadingOverlay("hide", true);
																																				    //j$("#FXObjectPermissions").LoadingOverlay("hide", true);
																																				    //j$("#FXRelatedObjectPermissions").LoadingOverlay("hide", true);
																																				    j$("#ApexClasses").LoadingOverlay("hide", true);
																																				    j$("#VisualforcePages").LoadingOverlay("hide", true);
																																				    j$("#SystemPermissions").LoadingOverlay("hide", true);
																																				    //j$("#Warnings").LoadingOverlay("hide", true);
																																				});
																																				var mypackage = {
																																					'types': [],
																																					'version': '36.0'
																																				};
																																				mypackage.types.push(
																																				{
																																					'members': MetaDataApiName(searchprofilename),
																																					'name': 'Profile'
																																				});
																																				mypackage.types.push(
																																				{
																																					'members': '*',
																																					'name': 'CustomField'
																																				});
																																				mypackage.types.push(
																																				{
																																					'members': searchObjects,
																																					'name': 'CustomObject'
																																				});

																																				var searchTabs = searchObjects;

																																				if(Customtabnames)
																																				{
																																					for (var itab = 0; itab < Customtabnames.length; itab++)
																																					{
																																						var Customtabname = Customtabnames[itab];
																																						if (searchTabs.indexOf(Customtabname) < 0)
																																						{
																																							searchTabs.push(Customtabname);
																																						}
																																					}
																																				}

																																				//searchObjects.push('standard-Account');
																																				//searchObjects.push('standard-Contact');
																																				//searchObjects.push('standard-User');
																																				mypackage.types.push(
																																				{
																																					'members': searchTabs,
																																					'name': 'CustomTab'
																																				});
																																				if (searchPermissionSetnames.length > 0)
																																				{
																																					mypackage.types.push(
																																					{
																																						'members': searchPermissionSetnames,
																																						'name': 'PermissionSet'
																																					});
																																				}
																																				conn.metadata.retrieve(
																																				{
																																					unpackaged: mypackage
																																				}, function(retreiveerr, retreivemetadata)
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

																																													//console.log(zipresults);
																																													for (var iobj = 0; iobj < finalresult.FXRelatedObjects.length; iobj++)
																																													{
																																														var tobj = finalresult.FXRelatedObjects[iobj];
																																														if (tobj.ObjectDescribe.IsCustomTab == true)
																																														{
																																															var metatabname = 'unpackaged/tabs/' + tobj.ObjectDescribe.fullName + '.tab';
																																															if (zipresults.hasItem(metatabname) == true)
																																															{
																																																var mydetail = zipresults.getItem(metatabname);
																																																if(mydetail.CustomTab.label)
																																																{
																																																	finalresult.FXRelatedObjects[iobj].Label = mydetail.CustomTab.label;
																																																}
																																															}
																																														}
																																													}

																																													for (var iobj = 0; iobj < finalresult.FXObjects.length; iobj++)
																																													{
																																														var tobj = finalresult.FXObjects[iobj];
																																														if (tobj.ObjectDescribe.IsCustomTab == true)
																																														{
																																															var metatabname = 'unpackaged/tabs/' + tobj.ObjectDescribe.fullName + '.tab';
																																															if (zipresults.hasItem(metatabname) == true)
																																															{
																																																var mydetail = zipresults.getItem(metatabname);
																																																if(mydetail.CustomTab.label)
																																																{
																																																	finalresult.FXObjects[iobj].Label = mydetail.CustomTab.label;
																																																}
																																															}
																																														}
																																													}


																																													//add results for profile
																																													var profilepackagename = 'unpackaged/profiles/' + MetaDataApiName(searchprofilename).replace(".", "%2E").replace("(", "%28").replace(")", "%29").replace("/", "%2F") + '.profile';
																																													if (zipresults.hasItem(profilepackagename) == true)
																																													{
																																														var mydetail = zipresults.getItem(profilepackagename);
																																														if (mydetail.Profile.fieldPermissions != undefined)
																																														{
																																															for (var impf = 0; impf < mydetail.Profile.fieldPermissions.length; impf++)
																																															{
																																																var mypermission2 = mydetail.Profile.fieldPermissions[impf];
																																																SetFeildResult(mypermission2, myUser.ProfileId, finalresult, searchprofilename, true);
																																															}
																																														}
																																														if (mydetail.Profile.objectPermissions != undefined)
																																														{
																																															for (var impo = 0; impo < mydetail.Profile.objectPermissions.length; impo++)
																																															{
																																																var mypermission2 = mydetail.Profile.objectPermissions[impo];
																																																SetObjectResult(mypermission2, myUser.ProfileId, finalresult, searchprofilename, true);
																																															}
																																														}
																																														if (mydetail.Profile.recordTypeVisibilities)
																																														{
																																															for (var impr = 0; impr < mydetail.Profile.recordTypeVisibilities.length; impr++)
																																															{
																																																var myrtvis = mydetail.Profile.recordTypeVisibilities[impr];
																																																SetRecordTypeResult(myrtvis, myUser.ProfileId, finalresult, searchprofilename, true);
																																															}
																																														}
																																														
																																														if (mydetail.Profile.tabVisibilities)
																																														{
																																															for (var impt = 0; impt < mydetail.Profile.tabVisibilities.length; impt++)
																																															{
																																																var mytabvis = mydetail.Profile.tabVisibilities[impt];
																																																SetTabPermissionResult(mytabvis, myUser.ProfileId, finalresult, searchprofilename, true);
																																															}
																																														}
																																														
																																													}
																																													else
																																													{
																																														console.log('Error Metadata not found for ' + profilepackagename);
																																														alert('Error 99908');
																																													}
																																													if (PermissionSetQueryResults != undefined)
																																													{
																																														for (var ipr44 = 0; ipr44 < PermissionSetQueryResults.length; ipr44++)
																																														{
																																															var QueryResult = PermissionSetQueryResults[ipr44];
																																															var permname = (QueryResult.NamespacePrefix != undefined && QueryResult.NamespacePrefix.length > 0 ? QueryResult.NamespacePrefix + '__' : '') + QueryResult.Name;
																																															(QueryResult.NamespacePrefix != undefined && QueryResult.NamespacePrefix.length > 0 ? QueryResult.NamespacePrefix + '__' : '') + QueryResult.Name;
																																															var permpackagename = 'unpackaged/permissionsets/' + permname.replace(".", "%2E").replace("(", "%28").replace(")", "%29").replace("/", "%2F") + '.permissionset';
																																															if (zipresults.hasItem(permpackagename) == true)
																																															{
																																																var mydetail = zipresults.getItem(permpackagename);
																																																if (mydetail.PermissionSet.fieldPermissions != undefined)
																																																{
																																																	for (var impf2 = 0; impf2 < mydetail.PermissionSet.fieldPermissions.length; impf2++)
																																																	{
																																																		var mypermission2 = mydetail.PermissionSet.fieldPermissions[impf2];
																																																		SetFeildResult(mypermission2, QueryResult.Id, finalresult, QueryResult.Name, false);
																																																	}
																																																}
																																																if (mydetail.PermissionSet.objectPermissions != undefined)
																																																{
																																																	for (var impo2 = 0; impo2 < mydetail.PermissionSet.objectPermissions.length; impo2++)
																																																	{
																																																		var mypermission2 = mydetail.PermissionSet.objectPermissions[impo2];
																																																		SetObjectResult(mypermission2, QueryResult.Id, finalresult, QueryResult.Name, false);
																																																	}
																																																}
																																																if (mydetail.PermissionSet.recordTypeVisibilities)
																																																{
																																																	for (var impr2 = 0; impr2 < mydetail.PermissionSet.recordTypeVisibilities.length; impr2++)
																																																	{
																																																		var myrtvis = mydetail.PermissionSet.recordTypeVisibilities[impr2];
																																																		SetRecordTypeResult(myrtvis, QueryResult.Id, finalresult, QueryResult.Name, false);
																																																	}
																																																}
																																																if (mydetail.PermissionSet.tabSettings)
																																																{
																																																	for (var impt2 = 0; impt2 < mydetail.PermissionSet.tabSettings.length; impt2++)
																																																	{
																																																		var mytabvis = mydetail.PermissionSet.tabSettings[impt2];
																																																		SetTabPermissionResult(mytabvis, QueryResult.Id, finalresult, QueryResult.Name, false);
																																																	}
																																																}
																																															}
																																															else
																																															{
																																																console.log('Error Metadata not found for ' + permpackagename);
																																																alert('Error 99909');
																																															}
																																														}
																																													}
																																													ProcessFinalResult(finalresult, 2, function(result)
																																													{
																																														loadphase = 3
																																														//j$("#UserDetails").LoadingOverlay("hide", true);
																																													    j$("#FXObjectPermissions").LoadingOverlay("hide", true);
																																													    j$("#FXRelatedObjectPermissions").LoadingOverlay("hide", true);
																																													    //j$("#ApexClasses").LoadingOverlay("hide", true);
																																													    //j$("#VisualforcePages").LoadingOverlay("hide", true);
																																													    //j$("#SystemPermissions").LoadingOverlay("hide", true);
																																													    j$("#Warnings").LoadingOverlay("hide", true);
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
																												}
																												catch (err)
																												{
																													console.log(err);
																													ProcessError(err);
																													throw err;
																												}
																											});
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
	function FindFieldPermissions(sobject)
	{
		var result;
		if (RemoteGetObjectInfoResult != undefined)
		{
			if (RemoteGetObjectInfoResult.FXObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d.fields;
						}
					}
				);
			}
			if (result == undefined && RemoteGetObjectInfoResult.FXRelatedObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXRelatedObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d.fields;
						}
					}
				);
			}
		}
		return result;
	}

	function FindSobject(sobject)
	{
		var result;
		if (RemoteGetObjectInfoResult != undefined)
		{
			if (RemoteGetObjectInfoResult.FXObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d;
						}
					}
				);
			}
			if (result == undefined && RemoteGetObjectInfoResult.FXRelatedObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXRelatedObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d;
						}
					}
				);
			}
		}
		return result;
	}

	function FindRTPermissions(sobject)
	{
		var result;
		if (RemoteGetObjectInfoResult != undefined)
		{
			if (RemoteGetObjectInfoResult.FXObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d.recordtypes;
						}
					}
				);
			}
			if (result == undefined && RemoteGetObjectInfoResult.FXRelatedObjects != undefined)
			{
				j$.each(RemoteGetObjectInfoResult.FXRelatedObjects,
					function(index, d)
					{
						if (d.APIName == sobject)
						{
							result = d.recordtypes;
						}
					}
				);
			}
		}
		return result;
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
					if (targetUserId == undefined || targetUserId == null || targetUserId == '')
					{
						//setup for testing
						targetUserId = userInfo.id;
					}
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

	function PromiseDoJSforceLogin(sid, lurl, luser, lpass, lproxy)
	{
		return loginPromise = new Promise(function(resolve, reject)
		{
			var conn;
			if (sid != null && sid != '')
			{
				conn = new jsforce.Connection(
				{
					accessToken: sid
				});
				resolve(conn);
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
						reject('Error logging in: ' + err);
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
						if (targetUserId == undefined || targetUserId == null || targetUserId == '')
						{
							//setup for testing
							targetUserId = userInfo.id;
						}
						// ...
						resolve(conn);
					}
				});
			}
			else
			{
				reject('Not able to login!');
			}
		});
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

	function PromiseCurrentUserHasModifyAllDataAccess(conn, tid)
	{
		return resultPromise = new Promise(function(resolve, reject)
		{
			var myquery = "select Id, UserRole.Name, UserRoleId,Name,ProfileId,Profile.PermissionsModifyAllData from User where id ='" + tid + "'";
			var HasModifyAllDataAccess = false; // this is needed to access the metadata api
			QueryRecords(conn, myquery, function(UserQueryerr, UserQueryResults)
			{
				if (UserQueryerr)
				{
					reject('Error:' + UserQueryerr);
				}
				var myUser = UserQueryResults[0];
				var HasModifyAllDataAccess = myUser.Profile.PermissionsModifyAllData;
				if (HasModifyAllDataAccess == true)
				{
					resolve(true);
				}
				else
				{
					myquery = "select Id, PermissionsModifyAllData from PermissionSet where IsOwnedByProfile = false and Id in (SELECT PermissionSetId FROM PermissionSetAssignment where AssigneeId = '" + tid + "')";
					QueryRecords(conn, myquery, function(PermissionSetQueryerr, PermissionSetQueryResults)
					{
						if (PermissionSetQueryerr)
						{
							reject('Error:' + PermissionSetQueryerr);
						}
						else
						{
							if (PermissionSetQueryResults != undefined)
							{
								for (var i = 0; i < PermissionSetQueryResults.length; i++)
								{
									var QueryResult = PermissionSetQueryResults[i];
									if (QueryResult.PermissionsModifyAllData == true)
									{
										HasModifyAllDataAccess = true;
										break;
									}
								}
							}
							resolve(HasModifyAllDataAccess);
						}
					});
				}
			});
		});
	}

	function SetObjectResult(mypermission, myProfieePermSerId, fresult, proPermName, IsProfile)
	{
		try
		{
			var sobjectname = mypermission.object;
			for (var i2 = 0; i2 < fresult.FXObjects.length; i2++)
			{
				var myresultobject = fresult.FXObjects[i2];
				if (myresultobject.APIName == sobjectname)
				{
					if (mypermission.allowCreate == 'true')
					{
						myresultobject.HasCreate = true;
						myresultobject.HasCreateGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowDelete == 'true')
					{
						myresultobject.HasDelete = true;
						myresultobject.HasDeleteGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowEdit == 'true')
					{
						myresultobject.HasEdit = true;
						myresultobject.HasEditGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowRead == 'true')
					{
						myresultobject.HasRead = true;
						myresultobject.HasReadGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.modifyAllRecords == 'true')
					{
						myresultobject.HasModifyAll = true;
						myresultobject.HasModifyAllGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.viewAllRecords == 'true')
					{
						myresultobject.HasViewAll = true;
						myresultobject.HasViewAllGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					break;
				}
			}
			for (var i2 = 0; i2 < fresult.FXRelatedObjects.length; i2++)
			{
				var myresultobject = fresult.FXRelatedObjects[i2];
				if (myresultobject.APIName == sobjectname)
				{
					if (mypermission.allowCreate == 'true')
					{
						myresultobject.HasCreate = true;
						myresultobject.HasCreateGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowDelete == 'true')
					{
						myresultobject.HasDelete = true;
						myresultobject.HasDeleteGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowEdit == 'true')
					{
						myresultobject.HasEdit = true;
						myresultobject.HasEditGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.allowRead == 'true')
					{
						myresultobject.HasRead = true;
						myresultobject.HasReadGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.modifyAllRecords == 'true')
					{
						myresultobject.HasModifyAll = true;
						myresultobject.HasModifyAllGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					if (mypermission.viewAllRecords == 'true')
					{
						myresultobject.HasViewAll = true;
						myresultobject.HasViewAllGrantedBy.push(
						{
							Id: myProfieePermSerId,
							IsProfile: IsProfile,
							Name: proPermName
						});
					}
					break;
				}
			}
		}
		catch (err)
		{
			console.log(err);
			throw err;
		}
	}

	function SetTabPermissionResult(mypermission, myProfieePermSerId, fresult, proPermName, IsProfile)
	{
		try
		{
			var sobjectname = mypermission.tab;
			if (sobjectname.startsWith('standard-'))
			{
				sobjectname = sobjectname.substring(9);
			}
			var vis = '';
			if (mypermission.visibility == 'None' || mypermission.visibility == 'Hidden')
			{
				vis = 'NoneHidden';
			}
			else if (mypermission.visibility == 'DefaultOff' || mypermission.visibility == 'Available')
			{
				vis = 'DefaultOffAvailable';
			}
			else if (mypermission.visibility == 'DefaultOn' || mypermission.visibility == 'Visible')
			{
				vis = 'DefaultOnVisible';
			}

			if (vis != '')
			{
				for (var if1 = 0; if1 < fresult.FXObjects.length; if1++)
				{
					var myresultsobject = fresult.FXObjects[if1];
					if (myresultsobject.APIName == sobjectname)
					{
						for (var mt1 = 0; mt1 < myresultsobject.TabPermissions.length; mt1++)
						{
							var myresultobject = myresultsobject.TabPermissions[mt1];
							if (myresultobject.Name == vis)
							{
								myresultobject.Assigned = true;
								myresultobject.AssignedGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
								break;
							}
						}
						break;
					}
				}
				for (var if2 = 0; if2 < fresult.FXRelatedObjects.length; if2++)
				{
					var myresultsobject = fresult.FXRelatedObjects[if2];
					if (myresultsobject.APIName == sobjectname)
					{
						for (var mt2 = 0; mt2 < myresultsobject.TabPermissions.length; mt2++)
						{
							var myresultobject = myresultsobject.TabPermissions[mt2];
							if (myresultobject.Name == vis)
							{
								myresultobject.Assigned = true;
								myresultobject.AssignedGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
								break;
							}
						}
						break;
					}
				}
			}
		}
		catch (err)
		{
			console.log(err);
			//console.log(mypermission);
			throw err;
		}
	}

	function SetRecordTypeResult(mypermission, myProfieePermSerId, fresult, proPermName, IsProfile)
	{
		try
		{
			var sobjectraw = mypermission.recordType;
			var sobjectname = sobjectraw.substring(0, sobjectraw.indexOf("."));
			var sobjectrt = sobjectraw.substring(sobjectraw.indexOf(".") + 1);
			for (var i2 = 0; i2 < fresult.FXObjects.length; i2++)
			{
				var myresultsobject = fresult.FXObjects[i2];
				if (myresultsobject.APIName == sobjectname)
				{
					for (var i3 = 0; i3 < myresultsobject.recordtypes.length; i3++)
					{
						var myresultobject = myresultsobject.recordtypes[i3];
						if (myresultobject.Name == sobjectrt)
						{
							if (mypermission.visible == 'true')
							{
								
								myresultobject.Assigned = true;
								myresultobject.AssignedGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							if (IsProfile == true && mypermission.default == 'true')
							{
								SetMasterRecordTypeToFalse(myresultsobject.recordtypes);
								myresultobject.Default = true;
								myresultobject.DefaultGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							break;
						}
					}
					break;
				}
			}
			for (var i2 = 0; i2 < fresult.FXRelatedObjects.length; i2++)
			{
				var myresultsobject = fresult.FXRelatedObjects[i2];
				if (myresultsobject.APIName == sobjectname)
				{
					for (var i3 = 0; i3 < myresultsobject.recordtypes.length; i3++)
					{
						var myresultobject = myresultsobject.recordtypes[i3];
						if (myresultobject.Name == sobjectrt)
						{
							if (mypermission.visible == 'true')
							{
								
								myresultobject.Assigned = true;
								myresultobject.AssignedGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							if (IsProfile == true && mypermission.default == 'true')
							{
								SetMasterRecordTypeToFalse(myresultsobject.recordtypes);
								myresultobject.Default = true;
								myresultobject.DefaultGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							break;
						}
					}
					break;
				}
			}
		}
		catch (err)
		{
			console.log(err);
			//console.log(mypermission);
			throw err;
		}
	}

	function SetMasterRecordTypeToFalse(sobjectRecordtypes)
	{
		for (var i3 = 0; i3 < sobjectRecordtypes.length; i3++)
		{
			var myresultobject = sobjectRecordtypes[i3];
			if (myresultobject.Name == '--Master--')
			{
				myresultobject.Assigned = false;
				myresultobject.AssignedGrantedBy = [];
				myresultobject.Default = false;
				myresultobject.DefaultGrantedBy = [];
				break;
			}
		}
	}

	function SetFeildResult(mypermission, myProfieePermSerId, fresult, proPermName, IsProfile)
	{
		try
		{
			var sobjectraw = mypermission.field;
			var sobjectname = sobjectraw.substring(0, sobjectraw.indexOf("."));
			var sobjectfield = sobjectraw.substring(sobjectraw.indexOf(".") + 1);
			//console.log(sobjectname + ' |' + sobjectfield);
			for (var i2 = 0; i2 < fresult.FXObjects.length; i2++)
			{
				var myresultsobject = fresult.FXObjects[i2];
				if (myresultsobject.APIName == sobjectname)
				{
					for (var i3 = 0; i3 < myresultsobject.fields.length; i3++)
					{
						var myresultobject = myresultsobject.fields[i3];
						if (myresultobject.Name == sobjectfield)
						{
							if (mypermission.readable == 'true')
							{
								myresultobject.HasRead = true;
								myresultobject.HasReadGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							if (mypermission.editable == 'true')
							{
								myresultobject.HasEdit = true;
								myresultobject.HasEditGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							break;
						}
					}
					break;
				}
			}
			for (var i2 = 0; i2 < fresult.FXRelatedObjects.length; i2++)
			{
				var myresultsobject = fresult.FXRelatedObjects[i2];
				if (myresultsobject.APIName == sobjectname)
				{
					for (var i3 = 0; i3 < myresultsobject.fields.length; i3++)
					{
						var myresultobject = myresultsobject.fields[i3];
						if (myresultobject.Name == sobjectfield)
						{
							if (mypermission.readable == 'true')
							{
								myresultobject.HasRead = true;
								myresultobject.HasReadGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							if (mypermission.editable == 'true')
							{
								myresultobject.HasEdit = true;
								myresultobject.HasEditGrantedBy.push(
								{
									Id: myProfieePermSerId,
									IsProfile: IsProfile,
									Name: proPermName
								});
							}
							break;
						}
					}
					break;
				}
			}
		}
		catch (err)
		{
			console.log(err);
			//console.log(mypermission);
			throw err;
		}
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
						var x2js = new X2JS();
						var jsonresult = x2js.xml_str2json(result);
						results.setItem(path, jsonresult);
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

	function MetaDataApiName(profilename)
	{
		var standardprofiledict = new HashTable();
		standardprofiledict.setItem("System Administrator", "Admin");
		standardprofiledict.setItem("Standard User", "Standard");
		standardprofiledict.setItem("Marketing User", "MarketingProfile");
		standardprofiledict.setItem("Contract Manager", "ContractManager");
		standardprofiledict.setItem("Solution Manager", "SolutionManager");
		standardprofiledict.setItem("Read Only", "ReadOnly");
		standardprofiledict.setItem("Customer Portal Manager", "CustomerManager");
		standardprofiledict.setItem("Customer Portal User", "CustomerUser");
		standardprofiledict.setItem("High Volume Customer Portal", "HighVolumePortal");
		standardprofiledict.setItem("Partner User", "Partner");
		standardprofiledict.setItem("Authenticated Website", "PlatformPortal");
		standardprofiledict.setItem("Standard Platform User", "StandardAul");
		standardprofiledict.setItem("Standard Guest", "Guest");
		if (standardprofiledict.hasItem(profilename))
		{
			return standardprofiledict.getItem(profilename);
		}
		return profilename;
	}

	function GetLicenseName(namespace)
	{
		var result = 'Unknown';
		if (namespace == 'FXMAP')
		{
			result = 'FieldFX Mapping';
		}
		else if (namespace == 'FXJSD')
		{
			result = 'FieldFX Job Scheduling & Dispatch';
		}
		else if (namespace == 'FXTKT')
		{
			result = 'FieldFX e-Ticketing';
		}
		else if (namespace == 'FXT2')
		{
			result = 'FieldFX Timecards';
		}
		else if (namespace == 'FXEAM')
		{
			result = 'FieldFX EAM';
		}
		else if (namespace == 'FX5')
		{
			result = 'FieldFX Base Package';
		}
		else if (namespace == 'FXCPQ')
		{
			result = 'FieldFX CPQ';
		}
		return result;
	}

	function ProcessError(error)
	{
		alert(error);
	}

	function GetRelatedObjects(results, parentApi, ParentChildernRelationships)
	{
		if (ParentChildernRelationships.hasItem(parentApi))
		{
			var targets = ParentChildernRelationships.getItem(parentApi);
			for (var i = 0; i < targets.length; i++)
			{
				var childname = targets[i];
				if (childname != undefined)
				{
					if (results.indexOf(childname) < 0)
					{
						results.push(childname);
						GetRelatedObjects(results, childname, ParentChildernRelationships);
					}
				}
				else
				{
					var a1 = '';
				}
			}
		}
	}

	function GetFieldResults(item)
	{
		var fieldresults = [];
		var myfields = GetDescribeSObjectField(item.fields);
		for (var i = 0; i < myfields.length; i++)
		{
			var field = myfields[i];
			var HasEdit = false;
			var HasRead = false;
			var EditIsAssignable = true;
			var ReadIsAssignable = true;
			if (field.required == 'true' || field.type == 'MasterDetail' || field.type == 'AutoNumber')
			{
				HasEdit = true;
				HasRead = true;
				EditIsAssignable = false;
				ReadIsAssignable = false;
			}
			if (field.formula != undefined)
			{
				HasEdit = true;
				EditIsAssignable = false;
			}
			var flabel = field.label != undefined ? field.label : field.fullName;
			var fieldresult = {
				EditIsAssignable: EditIsAssignable,
				HasEdit: HasEdit,
				HasEditGrantedBy: [],
				HasRead: HasRead,
				HasReadGrantedBy: [],
				Label: flabel,
				Name: field.fullName,
				ReadIsAssignable: ReadIsAssignable,
				autoNumber: field.type == 'AutoNumber',
				calculated: field.formula != undefined,
				permissionable: true,
				FieldDescribe: field
			};
			fieldresults.push(fieldresult);
		}
		return fieldresults;
	}

	function GetRecordTypeResults(item,userProfileId, profilename)
	{
		var recordtyperesults = [];
		if (item.recordTypes)
		{
			if (item.fullName.endsWith('__c'))
			{
				var recordtyperesult = {
					Default: true,
					DefaultGrantedBy: [{Id: userProfileId,IsProfile: true,Name: profilename}],
					Assigned: true,
					AssignedGrantedBy: [{Id: userProfileId,IsProfile: true,Name: profilename}],
					Label: '--Master--',
					Name: '--Master--'
				};
				recordtyperesults.push(recordtyperesult);
			}
			if (Array.isArray(item.recordTypes))
			{
				for (var i = 0; i < item.recordTypes.length; i++)
				{
					var recordtype = item.recordTypes[i];
					if (recordtype.active == 'true')
					{
						var flabel = recordtype.label != undefined ? recordtype.label : recordtype.fullName;
						var recordtyperesult = {
							Default: false,
							DefaultGrantedBy: [],
							Assigned: false,
							AssignedGrantedBy: [],
							Label: flabel,
							Name: recordtype.fullName,
							RecordTypeDescribe: recordtype
						};
						recordtyperesults.push(recordtyperesult);
					}
				}
			}
			else
			{
				var recordtype = item.recordTypes;
				if (recordtype.active == 'true')
				{
					var flabel = recordtype.label != undefined ? recordtype.label : recordtype.fullName;
					var recordtyperesult = {
						Default: false,
						DefaultGrantedBy: [],
						Assigned: false,
						AssignedGrantedBy: [],
						Label: flabel,
						Name: recordtype.fullName,
						RecordTypeDescribe: recordtype
					};
					recordtyperesults.push(recordtyperesult);
				}
			}
		}
		return recordtyperesults;
	}

	function GetTabResults(item)
	{
		var tabresults = [];
		var starndardtabs = ['Account','Contact','User']
		if (item.CusomTab || starndardtabs.indexOf(item.fullName) >= 0)
		{
			var tabresult = {
				Assigned: false,
				AssignedGrantedBy: [],
				Label: 'None / Hidden',
				Name: 'NoneHidden',
			};
			tabresults.push(tabresult);
			var tabresult = {
				Assigned: false,
				AssignedGrantedBy: [],
				Label: 'DefaultOff / Available',
				Name: 'DefaultOffAvailable',
			};
			tabresults.push(tabresult);
			var tabresult = {
				Assigned: false,
				AssignedGrantedBy: [],
				Label: 'DefaultOn / Visible',
				Name: 'DefaultOnVisible',
			};
			tabresults.push(tabresult);
		}
		return tabresults;
	}

	function GetDescribeSObjectField(fields)
	{
		var results = [];
		if (fields != undefined && Array.isArray(fields))
		{
			j$.each(fields, function(index, field)
			{
				results.push(field);
			});
		}
		else if (fields != undefined)
		{
			results.push(fields);
		}
		return results;
	}

	function ProcessFinalResult(result, pass, callback)
	{
		console.log(result);
		RemoteGetObjectInfoResult = result;
		if (pass == 1)
		{
			if (result.Userdetail != undefined)
			{
				j$('#userFullName').html('<a href="/' + result.Userdetail.Id + '?noredirect=1&isUserEntityOverride=1" target="_blank">' + result.Userdetail.Name + '</a>');
				if (result.Userdetail.UserRole != undefined)
				{
					j$('#userRole').html(result.Userdetail.UserRole.Name);
				}
				if (result.Userdetail.Profile != undefined)
				{
					j$('#userProfileName').html('<a href="/' + result.Userdetail.Profile.Id + '" target="_blank">' + result.Userdetail.Profile.Name + '</a>');
					if (result.Userdetail.Profile.UserLicense != undefined)
					{
						j$('#userProfileLicenseType').html(result.Userdetail.Profile.UserLicense.Name);
					}
				}
			}
			var datatablePermissionSetresult = '';
			if (result.PermissionSets != undefined)
			{
				datatablePermissionSetresult += '<table id="PermissionSetTable" class="table table-hover" cellspacing="0" width="100%"><thead><tr>';
				datatablePermissionSetresult += '<th>Name</th>';
				datatablePermissionSetresult += '<th>Description</th>';
				datatablePermissionSetresult += '<tbody>';
				j$.each(result.PermissionSets,
					function(index, d)
					{
						datatablePermissionSetresult += '<tr>';
						datatablePermissionSetresult += '<td><a href="/' + d.Id + '" target="_blank">' + d.Label + '</a></td>';
						datatablePermissionSetresult += '<td>' + d.Description + '</td>';
						datatablePermissionSetresult += '</tr>';
					});
				datatablePermissionSetresult += '</tbody>';
				datatablePermissionSetresult += '</table>';
				j$('#FXPermissionSetTable').html(datatablePermissionSetresult);
			}
			var datatableLicenseresult = '';
			if (result.PackageLicense != undefined)
			{
				datatableLicenseresult += '<table id="LicensesTable" class="table table-hover" cellspacing="0" width="100%"><thead><tr>';
				datatableLicenseresult += '<th>Name</th>';
				datatableApexClassesresult += '</tr></thead>';
				datatableApexClassesresult += '<tbody>';
				j$.each(result.PackageLicense,
					function(index, d)
					{
						datatableLicenseresult += '<tr>';
						datatableLicenseresult += '<td>' + d.Name + '</td>';
						datatableLicenseresult += '</tr>';
					});
				datatableLicenseresult += '</tbody>';
				datatableLicenseresult += '</table>';
				j$('#FXLicensesTable').html(datatableLicenseresult);
			}
			var datatableApexClassesresult = '';
			if (result.ApexClassAccess != undefined)
			{
				datatableApexClassesresult += '<table id="ApexClassesTable" class="display" cellspacing="0" width="100%"><thead><tr>';
				datatableApexClassesresult += '<th>Name</th>';
				datatableApexClassesresult += '<th>Enabled</th>';
				datatableApexClassesresult += '</tr></thead>';
				datatableApexClassesresult += '<tbody>';
				j$.each(result.ApexClassAccess,
					function(index, d)
					{
						datatableApexClassesresult += '<tr>';
						datatableApexClassesresult += '<td>' + d.Label + '</td>';
						datatableApexClassesresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy, null, 'ClassAccess') + '</td>'
						datatableApexClassesresult += '</tr>';
					});
				datatableApexClassesresult += '</tbody>';
				datatableApexClassesresult += '</table>';
				j$('#fxApexClassestable').html(datatableApexClassesresult);
				j$('#ApexClassesTable').DataTable(
				{
					"scrollCollapse": true,
					"paging": false,
					"order": [0, "asc"],
					"stateSave": true,
					"searching": true,
					"columnDefs": [
					{
						"targets": [1],
						"visible": true,
						"searchable": false,
						"orderDataType": "dom-checkbox-glyphicon"
					},
					{
						"targets": [0],
						"width": "350px"
					}]
				});
			}
			var datatableVisualforcePagesresult = '';
			if (result.VFPageAccess != undefined)
			{
				datatableVisualforcePagesresult += '<table id="VisualforcePagesTable" class="display" cellspacing="0" width="100%"><thead><tr>';
				datatableVisualforcePagesresult += '<th>Name</th>';
				datatableVisualforcePagesresult += '<th>Enabled</th>';
				datatableVisualforcePagesresult += '</tr></thead>';
				datatableVisualforcePagesresult += '<tbody>';
				j$.each(result.VFPageAccess,
					function(index, d)
					{
						datatableVisualforcePagesresult += '<tr>';
						datatableVisualforcePagesresult += '<td>' + d.Label + '</td>';
						datatableVisualforcePagesresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy, null, 'PageAccess') + '</td>'
						datatableVisualforcePagesresult += '</tr>';
					});
				datatableVisualforcePagesresult += '</tbody>';
				datatableVisualforcePagesresult += '</table>';
				j$('#fxVisualforcePagestable').html(datatableVisualforcePagesresult);
				j$('#VisualforcePagesTable').DataTable(
				{
					"scrollCollapse": true,
					"paging": false,
					"order": [0, "asc"],
					"stateSave": true,
					"searching": true,
					"columnDefs": [
					{
						"targets": [1],
						"visible": true,
						"searchable": false,
						"orderDataType": "dom-checkbox-glyphicon"
					},
					{
						"targets": [0],
						"width": "350px"
					}]
				});
			}
			var datatableSystemPermissionsresult = '';
			if (result.SystemPermissions != undefined)
			{
				datatableSystemPermissionsresult += '<table id="SystemPermissionsTable" class="display" cellspacing="0" width="100%"><thead><tr>';
				datatableSystemPermissionsresult += '<th>Label</th>';
				datatableSystemPermissionsresult += '<th>Enabled</th>';
				datatableSystemPermissionsresult += '</tr></thead>';
				datatableSystemPermissionsresult += '<tbody>';
				j$.each(result.SystemPermissions,
					function(index, d)
					{
						datatableSystemPermissionsresult += '<tr>';
						datatableSystemPermissionsresult += '<td>' + d.Label + '</td>';
						datatableSystemPermissionsresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy, null, 'SystemPermissions') + '</td>'
						datatableSystemPermissionsresult += '</tr>';
					});
				datatableSystemPermissionsresult += '</tbody>';
				datatableSystemPermissionsresult += '</table>';
				j$('#FXSystemPermissionsTable').html(datatableSystemPermissionsresult);
				//j$('[data-toggle="popover"]').popover({container: 'body'});  
				j$('#SystemPermissionsTable').DataTable(
				{
					"scrollCollapse": true,
					"paging": false,
					"order": [0, "asc"],
					"stateSave": true,
					"searching": true,
					"columnDefs": [
					{
						"targets": [1],
						"visible": true,
						"searchable": false,
						"orderDataType": "dom-checkbox-glyphicon"
					},
					{
						"targets": [0],
						"width": "350px"
					}]
				});
			}
			var FXApexClassesWarningshtml = '';
			if (result.ApexClassAccess != undefined)
			{
				j$.each(result.ApexClassAccess, function(index, d)
				{
					if (d.Label.startsWith('FX5.') && d.HasAccess == false)
					{
						FXApexClassesWarningshtml += '<p>User has not been granted access to ' + d.Label + ' </p>';
					}
				});
			}
			j$('#FXApexClassesWarnings').html(FXApexClassesWarningshtml);
			var FXVisualforcepageWarningshtml = '';
			if (result.VFPageAccess != undefined)
			{
				j$.each(result.VFPageAccess, function(index, d)
				{
					if (d.Label.startsWith('FX5.') && d.HasAccess == false)
					{
						FXVisualforcepageWarningshtml += '<p>User has not been granted access to ' + d.Label + ' </p>';
					}
				});
			}
			j$('#FXVisualforcepageWarnings').html(FXVisualforcepageWarningshtml);
			var FXSystemPermissionWarningshtml = '';
			if (result.SystemPermissions != undefined)
			{
				var grantedpermissions = [];
				var minpermissions = [];
				minpermissions.push('View Setup and Configuration');
				minpermissions.push('API Enabled');
				j$.each(result.SystemPermissions, function(index, d)
				{
					if (d.HasAccess == true)
					{
						grantedpermissions.push(d.Label);
					}
				});
				for (var i = 0; i < minpermissions.length; i++)
				{
					var iexists = j$.inArray(minpermissions[i], grantedpermissions);
					if (iexists < 0)
					{
						FXSystemPermissionWarningshtml += '<p>User has not been granted access to ' + minpermissions[i] + ' </p>';
					}
				}
			}
			j$('#FXSystemPermissionWarnings').html(FXSystemPermissionWarningshtml);
			var FXObjectWarningshtml = '';
			if (result.FXObjects != undefined)
			{
				j$.each(result.FXObjects, function(index, d)
				{
					var fp = FindFieldPermissions(d.APIName);
					var FX5Fields = [];
					j$.each(fp, function(index, f)
					{
						if (f.Name.startsWith('FX5__') == true)
						{
							FX5Fields.push(f.Name);
						}
					});
					j$.each(fp, function(index, f)
					{
						if (f.Name.startsWith('FX5__') == false)
						{
							var isduplicate = j$.inArray('FX5__' + f.Name, FX5Fields);
							if (isduplicate >= 0)
							{
								FXObjectWarningshtml += '<p>Object ' + d.APIName + ' Field ' + f.Name + ' is a duplicate of a managed package field.</p>';
							}
						}
					});
				});
			}
			j$('#FXObjectWarnings').html(FXObjectWarningshtml);
			callback(true);
		}
		else if (pass == 2)
		{
			var datatableFXObjectsresult = '';
			if (result.FXObjects != undefined)
			{
				datatableFXObjectsresult += '<table id="FXObjectsTable" class="display" cellspacing="0" width="100%"><thead><tr>';
				datatableFXObjectsresult += '<th>Label</th>';
				datatableFXObjectsresult += '<th>API Name</th>';
				datatableFXObjectsresult += '<th>Tab Settings</th>';
				datatableFXObjectsresult += '<th>Read</th>';
				datatableFXObjectsresult += '<th>Create</th>';
				datatableFXObjectsresult += '<th>Edit</th>';
				datatableFXObjectsresult += '<th>Delete</th>';
				datatableFXObjectsresult += '<th>View All</th>';
				datatableFXObjectsresult += '<th>Modify All</th>';
				datatableFXObjectsresult += '<th>Field Count</th>';
				datatableFXObjectsresult += '<th>Field Read Access Count</th>';
				datatableFXObjectsresult += '<th>Field Edit Access Count</th>';
				datatableFXObjectsresult += '<th>Record Type Count</th>';
				datatableFXObjectsresult += '<th>Record Type Assigned Count</th>';
				datatableFXObjectsresult += '</tr></thead>';
				datatableFXObjectsresult += '<tbody>';
				j$.each(result.FXObjects,
					function(index, d)
					{
						datatableFXObjectsresult += '<tr>';
						datatableFXObjectsresult += '<td><a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + d.Label + '</a></td>';
						datatableFXObjectsresult += '<td><a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + d.APIName + '</a></td>';
						
						datatableFXObjectsresult += '<td>';
						if (d.TabPermissions && d.TabPermissions.length > 0)
						{
							var tabpermresult = 'None / Hidden';
							for (var it1 = 0; it1 < d.TabPermissions.length; it1++)
							{
								var tabperm = d.TabPermissions[it1];
								if (tabperm.Assigned == true)
								{
									tabpermresult = tabperm.Label;
								}
							}
							datatableFXObjectsresult += '<a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + tabpermresult + '</a>';
						}
						datatableFXObjectsresult += '</td>'

						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasRead, true, d.HasReadGrantedBy, d, 'Object') + '</td>'
						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasCreate, true, d.HasCreateGrantedBy, d, 'Object') + '</td>';
						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasEdit, true, d.HasEditGrantedBy, d, 'Object') + '</td>';
						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasDelete, true, d.HasDeleteGrantedBy, d, 'Object') + '</td>';
						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasViewAll, true, d.HasViewAllGrantedBy, d, 'Object') + '</td>';
						datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasModifyAll, true, d.HasModifyAllGrantedBy, d, 'Object') + '</td>';
						var fc = GetFieldCount(d.fields, true, false, false);
						if (fc > 0)
						{
							datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, true, false, false) + '</a></td>';
							datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, false, true, false) + '</a></td>';
							datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, false, false, true) + '</a></td>';
						}
						else
						{
							datatableFXObjectsresult += '<td>0</td>';
							datatableFXObjectsresult += '<td>0</td>';
							datatableFXObjectsresult += '<td>0</td>';
						}
						var rt1 = GetRecordTypeCount(d.recordtypes, true) > 0 ? '<a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + GetRecordTypeCount(d.recordtypes, true) + '</a>' :'0';
						var rt2 = GetRecordTypeCount(d.recordtypes, false) > 0 ? '<a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + GetRecordTypeCount(d.recordtypes, false) + '</a>' :'0';
						datatableFXObjectsresult += '<td>'+ rt1 + '</td>';
						datatableFXObjectsresult += '<td>'+ rt2 + '</td>';
						datatableFXObjectsresult += '</tr>';
					});
				datatableFXObjectsresult += '</tbody>';
				datatableFXObjectsresult += '</table>';
				j$('#fxobjectpermissiontable').html(datatableFXObjectsresult);
				j$('#FXObjectsTable').DataTable(
				{
					"scrollCollapse": true,
					"paging": false,
					"order": [0, "asc"],
					"stateSave": true,
					"searching": true,
					"columnDefs": [
					{
						"targets": [2, 3, 4, 5, 6, 7],
						"visible": true,
						"searchable": false,
						"orderDataType": "dom-checkbox-glyphicon"
					}]
				});
			}
			var datatableFXRelatedObjectsresult = '';
			if (result.FXRelatedObjects != undefined)
			{
				datatableFXRelatedObjectsresult += '<table id="FXRelatedObjectsTable" class="display" cellspacing="0" width="100%"><thead><tr>';
				datatableFXRelatedObjectsresult += '<th>Label</th>';
				datatableFXRelatedObjectsresult += '<th>API Name</th>';
				datatableFXRelatedObjectsresult += '<th>Tab Settings</th>';
				datatableFXRelatedObjectsresult += '<th>Read</th>';
				datatableFXRelatedObjectsresult += '<th>Create</th>';
				datatableFXRelatedObjectsresult += '<th>Edit</th>';
				datatableFXRelatedObjectsresult += '<th>Delete</th>';
				datatableFXRelatedObjectsresult += '<th>View All</th>';
				datatableFXRelatedObjectsresult += '<th>Modify All</th>';
				datatableFXRelatedObjectsresult += '<th>Field Count</th>';
				datatableFXRelatedObjectsresult += '<th>Field Read Access Count</th>';
				datatableFXRelatedObjectsresult += '<th>Field Edit Access Count</th>';
				datatableFXRelatedObjectsresult += '<th>Record Type Count</th>';
				datatableFXRelatedObjectsresult += '<th>Record Type Assigned Count</th>';
				datatableFXRelatedObjectsresult += '</tr></thead>';
				datatableFXRelatedObjectsresult += '<tbody>';
				j$.each(result.FXRelatedObjects,
					function(index, d)
					{
						datatableFXRelatedObjectsresult += '<tr>';
						datatableFXRelatedObjectsresult += '<td><a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + d.Label + '</a></td>';
						datatableFXRelatedObjectsresult += '<td><a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + d.APIName + '</a></td>';
						
						datatableFXRelatedObjectsresult += '<td>';
						if (d.TabPermissions && d.TabPermissions.length > 0)
						{
							var tabpermresult = 'None / Hidden';
							for (var it1 = 0; it1 < d.TabPermissions.length; it1++)
							{
								var tabperm = d.TabPermissions[it1];
								if (tabperm.Assigned == true)
								{
									tabpermresult = tabperm.Label;
								}
							}
							datatableFXRelatedObjectsresult += '<a onclick="ShowObjectModal(&apos;' + d.APIName + '&apos;);">' + tabpermresult + '</a>';
						}
						datatableFXRelatedObjectsresult += '</td>'

						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasRead, true, d.HasReadGrantedBy, d, 'Object') + '</td>'
						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasCreate, true, d.HasCreateGrantedBy, d, 'Object') + '</td>';
						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasEdit, true, d.HasEditGrantedBy, d, 'Object') + '</td>';
						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasDelete, true, d.HasDeleteGrantedBy, d, 'Object') + '</td>';
						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasViewAll, true, d.HasViewAllGrantedBy, d, 'Object') + '</td>';
						datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasModifyAll, true, d.HasModifyAllGrantedBy, d, 'Object') + '</td>';
						var fc = GetFieldCount(d.fields, true, false, false);
						if (fc > 0)
						{
							datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, true, false, false) + '</a></td>';
							datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, false, true, false) + '</a></td>';
							datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;);">' + GetFieldCount(d.fields, false, false, true) + '</a></td>';
						}
						else
						{
							datatableFXRelatedObjectsresult += '<td>0</td>';
							datatableFXRelatedObjectsresult += '<td>0</td>';
							datatableFXRelatedObjectsresult += '<td>0</td>';
						}
						var rt1 = GetRecordTypeCount(d.recordtypes, true) > 0 ? '<a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + GetRecordTypeCount(d.recordtypes, true) + '</a>' :'0';
						var rt2 = GetRecordTypeCount(d.recordtypes, false) > 0 ? '<a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + GetRecordTypeCount(d.recordtypes, false) + '</a>' :'0';
						datatableFXRelatedObjectsresult += '<td>'+ rt1 + '</td>';
						datatableFXRelatedObjectsresult += '<td>'+ rt2 + '</td>';
						datatableFXRelatedObjectsresult += '</tr>';
					});
				datatableFXRelatedObjectsresult += '</tbody>';
				datatableFXRelatedObjectsresult += '</table>';
				j$('#fxRelatedobjectpermissiontable').html(datatableFXRelatedObjectsresult);
				j$('#FXRelatedObjectsTable').DataTable(
				{
					"scrollCollapse": true,
					"paging": false,
					"order": [0, "asc"],
					"stateSave": true,
					"searching": true,
					"columnDefs": [
					{
						"targets": [2, 3, 4, 5, 6, 7],
						"visible": true,
						"searchable": false,
						"orderDataType": "dom-checkbox-glyphicon"
					}]
				});
			}
			callback(true);
		}
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
		conn.metadata.list(lstquery, '36.0', function(err, metadata)
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
		conn.metadata.list(lstquery, '36.0', function(err, metadata)
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

	function DescribeAllSObjects(conn, callback)
	{
		GetAllCustomObject(conn, function(err, fullNames)
		{
			if (err)
			{
				callback(err, null);
			}
			else
			{
				var results = [];
				DescribeAllSObjects2(conn, results, 10, '', fullNames, function(err, result)
				{
					if (err && !result)
					{
						callback(err, null);
					}
					else
					{
						var missing = [];
						var found = [];
						if (result != undefined)
						{
							for (var i = 0; i < result.length; i++)
							{
								found.push(result[i].fullName);
							}
						}
						for (var i = 0; i < fullNames.length; i++)
						{
							if (found.indexOf(fullNames[i]) < 0)
							{
								missing.push(fullNames[i]);
							}
						}
						if (missing.length > 0)
						{
							console.log('Missing DescribeAllSObjects Objects:' + missing);
						}
						for (var i = 0; i < result.length; i++)
						{
							result[i].IsCustomTab = false;
							result[i].OneFieldIsPermissionable = true;
							result[i].IsPermissionable = true;
							result[i].isCustomSetting = false;
							if (result[i].fullName == 'User')
							{
								result[i].IsPermissionable = false;
							}
							if (result[i].customSettingsType)
							{
								result[i].isCustomSetting = true;
								result[i].IsPermissionable = false;
								result[i].OneFieldIsPermissionable = false;
							}
						}
						QueryToolingRecords(conn, 'Select Id, DeveloperName, NamespacePrefix From CustomObject', function(toolingerr, toolingresult)
						{
							if (toolingerr)
							{
								callback(toolingerr, null);
							}
							else
							{
								if (toolingresult)
								{
									j$.each(toolingresult, function(index, tr)
									{
										var objname = (tr.NamespacePrefix != undefined && tr.NamespacePrefix != null ? tr.NamespacePrefix + '__' : '') + tr.DeveloperName;
										for (var i = 0; i < result.length; i++)
										{
											if (result[i].fullName == objname || result[i].fullName == objname + '__c')
											{
												result[i].CusomObjectId = tr.Id;
												break;
											}
										}
									});
								}
								GetAllCustomTabs(conn, function(taberr, tabsresult)
								{
									if (taberr)
									{
										callback(tBerr, null);
									}
									else
									{

										var tabnames = [];
										j$.each(tabsresult, function(index, tab)
										{
											var objname = tab.fullName;
											tabnames.push(objname);
											if (objname.startsWith('standard-'))
											{
												objname = objname.substring(10);
											}
											var tabfound = false;
											for (var i = 0; i < result.length; i++)
											{
												if (result[i].fullName == objname)
												{
													result[i].CusomTab = tab;
													tabfound = true;
													break;
												}
											}
											if (tabfound == false)
											{
												//tab only
												var ctab = {IsCustomTab:true,CusomObjectId: tab.id,CusomTab:tab,label:tab.label,fullName:tab.fullName,fields:[],OneFieldIsPermissionable:false,isCustomSetting:false,recordtypes:[],IsPermissionable: false};
												result.push(ctab);
											}
										});

										callback(missing.length > 0 ? err : null, result, tabnames);
									}
								});
							}
						});
					}
				});
			}
		});
	}

	function DescribeAllSObjects2(conn, metaresults, chunksize, errors, fullNames, callback)
	{
		ReadMetaData(conn, 'CustomObject', fullNames, chunksize, errors, function(err, erroronnames, result)
		{
			if (result)
			{
				if (Array.isArray(result))
				{
					for (var i2 = 0; i2 < result.length; i2++)
					{
						metaresults.push(result[i2]);
					}
				}
				else
				{
					metaresults.push(result);
				}
			}
			if (err && chunksize > 1 && erroronnames && erroronnames.length > 0)
			{
				if (errors != '')
				{
					errors += ' | ';
				}
				errors += err + ' | RETYING DESCRIBE FOR OBJECTS ONE AT A TIME! |';
				//somthing with wrong lets try one at a time to find the culprit
				DescribeAllSObjects2(conn, metaresults, 1, errors, erroronnames, callback);
			}
			else
			{
				callback(err, metaresults.length > 0 ? metaresults : null);
			}
		});
	}

	function ChunkArrayInGroups(array, unit)
	{
		var results = [],
			length = Math.ceil(array.length / unit);
		for (var i = 0; i < length; i++)
		{
			results.push(array.slice(i * unit, (i + 1) * unit));
		}
		return results;
	}

	function ReadMetaData(conn, type, names, chunksize, errors, callback)
	{
		var batchs = [];
		var metaresults2 = [];
		var errorhasoccured = false;
		var smallarrays = ChunkArrayInGroups(names, chunksize);
		if (smallarrays.length > 0)
		{
			for (var i = 0; i < smallarrays.length; i++)
			{
				batchs.push(i);
			}
			var erroronnames = [];
			//var errors = '';
			for (var i = 0; i < smallarrays.length; i++)
			{
				ReadMetaDataPart(conn, i, type, smallarrays[i], function(err, batch, returntype, returnNames, returnValue)
				{
					if (err)
					{
						if (returnNames != undefined)
						{
							for (var i3 = 0; i3 < returnNames.length; i3++)
							{
								erroronnames.push(returnNames[i3]);
							}
						}
						if (errors != '')
						{
							errors += ' | ';
						}
						errors += err;
					}
					if (returnValue != undefined)
					{
						if (Array.isArray(returnValue))
						{
							for (var i2 = 0; i2 < returnValue.length; i2++)
							{
								metaresults2.push(returnValue[i2]);
							}
						}
						else
						{
							metaresults2.push(returnValue);
						}
					}
					var mybatchindex = batchs.indexOf(batch);
					if (mybatchindex < 0)
					{
						errorhasoccured = true;
						callback('batch not found!', errors, null, null);
					}
					else
					{
						batchs.splice(mybatchindex, 1);
						if (batchs.length == 0)
						{
							callback(errors != '' ? errors : null, erroronnames.length > 0 ? erroronnames : null, metaresults2);
						}
					}
				});
			}
		}
	}

	function ReadMetaDataPart(conn, batch, type, names, callback)
	{
		//var conn = new jsforce.Connection({accessToken : '{!$Api.Session_ID}'});
		conn.metadata.read(type, names, function(err, metadata)
		{
			if (err)
			{
				callback(err + " ReadMetaDataPart Error Details: type: " + type + " names: " + names, batch, type, names, null);
			}
			else
			{
				//var result = {batch:batch, error:err, metadata:metadata};
				callback(null, batch, type, names, metadata);
			}
		});
	}

	function GetFXLicenseWarningshtml(isFXmobileTicket, isFXBackofficeTicket, isFXmobileCPQ, isFXBackofficeCPQ, isFXBackOfficeSchedulingAndDispatch, isEAM, isTimecard, isMapping)
	{
		var FXhtml = '';
		var assigned = [];
		if (RemoteGetObjectInfoResult.PackageLicense != undefined)
		{
			j$.each(RemoteGetObjectInfoResult.PackageLicense, function(index, d)
			{
				assigned.push(d.Name);
			});
		}
		if (isFXmobileTicket || isFXBackofficeTicket)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>Ticket User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX e-Ticketing', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>Ticket User: User has not been granted access to FieldFX e-Ticketing.</p>';
			}
		}
		if (isFXmobileCPQ || isFXBackofficeCPQ)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>CPQ User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX e-Ticketing', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>CPQ User: User has not been granted access to FieldFX e-Ticketing.</p>';
			}
			var iexists3 = j$.inArray('FieldFX CPQ', assigned);
			if (iexists3 < 0)
			{
				FXhtml += '<p>CPQ User: User has not been granted access to FieldFX CPQ.</p>';
			}
		}
		if (isFXBackOfficeSchedulingAndDispatch)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>FX Scheduling & Dispatch User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX e-Ticketing', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>FX Scheduling & Dispatch User: User has not been granted access to FieldFX e-Ticketing.</p>';
			}
			var iexists3 = j$.inArray('FieldFX Job Scheduling & Dispatch', assigned);
			if (iexists3 < 0)
			{
				FXhtml += '<p>FX Scheduling & Dispatch User: User has not been granted access to FieldFX Job Scheduling & Dispatch.</p>';
			}
		}
		if (isEAM)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>EAM User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX EAM', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>EAM User: User has not been granted access to FieldFX EAM.</p>';
			}
		}
		if (isTimecard)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>Timecard User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX Timecards', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>Timecard User: User has not been granted access to FieldFX Timecards.</p>';
			}
		}
		if (isMapping)
		{
			var iexists = j$.inArray('FieldFX Base Package', assigned);
			if (iexists < 0)
			{
				FXhtml += '<p>FX Scheduling & Dispatch Mapping User: User has not been granted access to FieldFX Base Package.</p>';
			}
			var iexists2 = j$.inArray('FieldFX Mapping', assigned);
			if (iexists2 < 0)
			{
				FXhtml += '<p>FX Scheduling & Dispatch Mapping User: User has not been granted access to FieldFX Mapping.</p>';
			}
		}
		return FXhtml;
	}

	function GetFXObjectPermissionsWarningshtml(isFXmobileTicket, isFXBackofficeTicket, isFXmobileCPQ, isFXBackofficeCPQ, isFXBackOfficeSchedulingAndDispatch, isEAM, isTimecard, isMapping)
	{
		var FXObjectPermissionsWarningshtml = '';
		if (RemoteGetObjectInfoResult.FXObjects != undefined)
		{
			var MinMobileTicketingObjectPermissions = GetMinMobileTicketingObjectPermissions();
			var MinBackOfficeTicketingObjectPermissions = GetMinBackOfficeTicketingObjectPermissions();
			var MinMobileCPQPermissions = GetMinMobileCPQPermissions();
			var MinBackOfficeCPQObjectPermissions = GetMinBackOfficeCPQObjectPermissions();
			var MinBackOfficeSchedulingAndDispatchObjectPermissions = GetMinBackOfficeSchedulingAndDispatchObjectPermissions();
			var MinEAMObjectPermissions = GetMinEAMObjectPermissions();
			var MinTimecardObjectPermissions = GetMinTimecardObjectPermissions();
			j$.each(RemoteGetObjectInfoResult.FXObjects, function(index, d)
			{
				if (isFXmobileTicket && MinMobileTicketingObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinMobileTicketingObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>Ticket - Mobile User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if (isFXBackofficeTicket && MinBackOfficeTicketingObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinBackOfficeTicketingObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>Ticket - Back office User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if (isFXmobileCPQ && MinMobileCPQPermissions.hasItem(d.APIName))
				{
					var minperms = MinMobileCPQPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>CPQ - Mobile User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if (isFXBackofficeCPQ && MinBackOfficeCPQObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinBackOfficeCPQObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>CPQ - Back Office User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if ((isFXBackOfficeSchedulingAndDispatch || isMapping) && MinBackOfficeSchedulingAndDispatchObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinBackOfficeSchedulingAndDispatchObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>FX Scheduling & Dispatch - Back Office User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if (isEAM && MinEAMObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinEAMObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>EAM User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
				if (isTimecard && MinTimecardObjectPermissions.hasItem(d.APIName))
				{
					var minperms = MinTimecardObjectPermissions.items[d.APIName];
					var pread = minperms.indexOf('R') > -1;
					var pcreate = minperms.indexOf('C') > -1;
					var pedit = minperms.indexOf('E') > -1;
					var pdelete = minperms.indexOf('D') > -1;
					var missingaccess = '';
					if (pread && d.HasRead == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Read';
					}
					if (pcreate && d.HasCreate == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Create';
					}
					if (pedit && d.HasEdit == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Edit';
					}
					if (pdelete && d.HasDelete == false)
					{
						if (missingaccess != '')
						{
							missingaccess += ', ';
						}
						missingaccess += 'Delete';
					}
					if (missingaccess != '')
					{
						FXObjectPermissionsWarningshtml += '<p>Timecard User: User has not been granted <b>' + missingaccess + '</b> access to <b>' + d.APIName + '</b>.</p>';
					}
				}
			});
		}
		return FXObjectPermissionsWarningshtml;
	}

	function GetMinMobileTicketingObjectPermissions()
	{
		var h1 = new HashTable();
		h1.setItem('Account', 'R');
		h1.setItem('FX5__Attachment_Ext__c', 'R');
		h1.setItem('FX5__Audit_Log__c', 'RCE');
		h1.setItem('FX5__Catalog_Item__c', 'R');
		h1.setItem('FX5__Checklist__c', 'R');
		h1.setItem('FX5__Checklist_Step__c', 'R');
		h1.setItem('FX5__Classification__c', 'R');
		h1.setItem('FX5__Contact_Qualification__c', 'R');
		h1.setItem('FX5__Crew_Planning__c', 'R');
		h1.setItem('FX5__eForm_Config__c', 'R');
		h1.setItem('FX5__Equipment__c', 'R');
		h1.setItem('FX5__Equipment_Planning__c', 'R');
		h1.setItem('FX5__Equipment_Qualification__c', 'R');
		h1.setItem('FX5__Job__c', 'RCED');
		h1.setItem('FX5__Job_Contact__c', 'R');
		h1.setItem('FX5__Price_Book__c', 'R');
		h1.setItem('FX5__Price_Book_Assignment__c', 'R');
		h1.setItem('FX5__Price_Book_Item__c', 'R');
		h1.setItem('FX5__Price_Book_Item_Service_Type__c', 'R');
		h1.setItem('FX5__Qualification__c', 'R');
		h1.setItem('FX5__Quote__c', 'RCED');
		h1.setItem('FX5__Quote_Item__c', 'RCED');
		h1.setItem('FX5__Report_Template__c', 'R');
		h1.setItem('FX5__Service_Type__c', 'R');
		h1.setItem('FX5__Status__c  ', 'R');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Status_Workflow__c', 'R');
		h1.setItem('FX5__Sync_Assignment__c', 'R');
		h1.setItem('FX5__Sync_Configuration__c', 'R');
		h1.setItem('FX5__Ticket__c', 'RCED');
		h1.setItem('FX5__Ticket_Checklist_Step__c', 'RCED');
		h1.setItem('FX5__Ticket_Item__c', 'RCED');
		h1.setItem('FX5__Ticket_Log__c', 'RCED');
		h1.setItem('FX5__Well__c', 'R');
		return h1;
	}

	function GetMinBackOfficeTicketingObjectPermissions()
	{
		var h1 = new HashTable();
		h1.setItem('Account', 'RCE');
		h1.setItem('FX5__Attachment_Ext__c', 'RCE');
		h1.setItem('FX5__Audit_Log__c', 'RE');
		h1.setItem('FX5__Catalog_Item__c', 'RCE');
		h1.setItem('FX5__Checklist__c', 'RCE');
		h1.setItem('FX5__Checklist_Step__c', 'RCE');
		h1.setItem('FX5__Classification__c', 'RCE');
		h1.setItem('FX5__Contact_Qualification__c', 'RCE');
		h1.setItem('FX5__Crew_Planning__c', 'RCE');
		h1.setItem('FX5__eForm_Config__c', 'RCE');
		h1.setItem('FX5__Equipment__c', 'RCE');
		h1.setItem('FX5__Equipment_Planning__c', 'RCE');
		h1.setItem('FX5__Equipment_Qualification__c', 'RCE');
		h1.setItem('FX5__Job__c', 'RCED');
		h1.setItem('FX5__Job_Contact__c', 'RCE');
		h1.setItem('FX5__Price_Book__c', 'RCE');
		h1.setItem('FX5__Price_Book_Assignment__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item_Service_Type__c', 'RCE');
		h1.setItem('FX5__Qualification__c', 'RCE');
		h1.setItem('FX5__Quote__c', 'RCED');
		h1.setItem('FX5__Quote_Item__c', 'RCED');
		h1.setItem('FX5__Report_Template__c', 'R');
		h1.setItem('FX5__Service_Type__c', 'RCE');
		h1.setItem('FX5__Status__c  ', 'RCE');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Status_Workflow__c', 'RCE');
		h1.setItem('FX5__Sync_Assignment__c', 'RCE');
		h1.setItem('FX5__Sync_Configuration__c', 'RCE');
		h1.setItem('FX5__Ticket__c', 'RCED');
		h1.setItem('FX5__Ticket_Checklist_Step__c', 'RCED');
		h1.setItem('FX5__Ticket_Item__c', 'RCED');
		h1.setItem('FX5__Ticket_Log__c', 'RCED');
		h1.setItem('FX5__Warehouse__c', 'RCE');
		h1.setItem('FX5__Well__c', 'R');
		return h1;
	}

	function GetMinMobileCPQPermissions()
	{
		var h1 = new HashTable();
		/*
		h1.setItem('Account', 'R');
		h1.setItem('FX5__Attachment_Ext__c', 'R');
		h1.setItem('FX5__Audit_Log__c', 'RCE');
		h1.setItem('FX5__Catalog_Item__c', 'R');
		h1.setItem('FX5__Checklist__c', 'R');
		h1.setItem('FX5__Checklist_Step__c', 'R');
		h1.setItem('FX5__Classification__c', 'R');
		h1.setItem('FX5__Contact_Qualification__c', 'R');
		h1.setItem('FX5__Crew_Planning__c', 'R');
		h1.setItem('FX5__eForm_Config__c', 'R');
		h1.setItem('FX5__Equipment__c', 'R');
		h1.setItem('FX5__Equipment_Planning__c', 'R');
		h1.setItem('FX5__Equipment_Qualification__c', 'R');
		h1.setItem('FX5__Job__c', 'RCED');
		h1.setItem('FX5__Job_Contact__c', 'R');
		h1.setItem('FX5__Price_Book__c', 'R');
		h1.setItem('FX5__Price_Book_Assignment__c', 'R');
		h1.setItem('FX5__Price_Book_Item__c', 'R');
		h1.setItem('FX5__Price_Book_Item_Service_Type__c', 'R');
		h1.setItem('FX5__Qualification__c', 'R');
		h1.setItem('FX5__Quote__c', 'RCED');
		h1.setItem('FX5__Quote_Item__c', 'RCED');
		h1.setItem('FX5__Report_Template__c', 'R');
		h1.setItem('FX5__Service_Type__c', 'R');
		h1.setItem('FX5__Status__c  ', 'R');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Status_Workflow__c', 'R');
		h1.setItem('FX5__Sync_Assignment__c', 'R');
		h1.setItem('FX5__Sync_Configuration__c', 'R');
		h1.setItem('FX5__Ticket__c', 'RCED');
		h1.setItem('FX5__Ticket_Checklist_Step__c', 'RCED');
		h1.setItem('FX5__Ticket_Item__c', 'RCED');
		h1.setItem('FX5__Ticket_Log__c', 'RCED');
		h1.setItem('FX5__Well__c', 'R');
		*/
		h1.setItem('FX5__Price_Book_Rule__c', 'R');
		h1.setItem('FX5__Price_Book_Rule_Action__c', 'R');
		return h1;
	}

	function GetMinBackOfficeCPQObjectPermissions()
	{
		var h1 = new HashTable();
		/*
		h1.setItem('Account', 'RCE');
		h1.setItem('FX5__Attachment_Ext__c', 'RCE');
		h1.setItem('FX5__Audit_Log__c', 'RE');
		h1.setItem('FX5__Catalog_Item__c', 'RCE');
		h1.setItem('FX5__Checklist__c', 'RCE');
		h1.setItem('FX5__Checklist_Step__c', 'RCE');
		h1.setItem('FX5__Classification__c', 'RCE');
		h1.setItem('FX5__Contact_Qualification__c', 'RCE');
		h1.setItem('FX5__Crew_Planning__c', 'RCE');
		h1.setItem('FX5__eForm_Config__c', 'RCE');
		h1.setItem('FX5__Equipment__c', 'RCE');
		h1.setItem('FX5__Equipment_Planning__c', 'RCE');
		h1.setItem('FX5__Equipment_Qualification__c', 'RCE');
		h1.setItem('FX5__Job__c', 'RCED');
		h1.setItem('FX5__Job_Contact__c', 'RCE');
		h1.setItem('FX5__Price_Book__c', 'RCE');
		h1.setItem('FX5__Price_Book_Assignment__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item_Service_Type__c', 'RCE');
		h1.setItem('FX5__Qualification__c', 'RCE');
		h1.setItem('FX5__Quote__c', 'RCED');
		h1.setItem('FX5__Quote_Item__c', 'RCED');
		h1.setItem('FX5__Report_Template__c', 'R');
		h1.setItem('FX5__Service_Type__c', 'RCE');
		h1.setItem('FX5__Status__c  ', 'RCE');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Status_Workflow__c', 'RCE');
		h1.setItem('FX5__Sync_Assignment__c', 'RCE');
		h1.setItem('FX5__Sync_Configuration__c', 'RCE');
		h1.setItem('FX5__Ticket__c', 'RCED');
		h1.setItem('FX5__Ticket_Checklist_Step__c', 'RCED');
		h1.setItem('FX5__Ticket_Item__c', 'RCED');
		h1.setItem('FX5__Ticket_Log__c', 'RCED');
		h1.setItem('FX5__Warehouse__c', 'R');
		h1.setItem('FX5__Well__c', 'R');
		*/
		h1.setItem('FX5__Price_Book_Rule__c', 'RCE');
		h1.setItem('FX5__Price_Book_Rule_Action__c', 'RCE');
		return h1;
	}

	function GetMinEAMObjectPermissions()
	{
		var h1 = new HashTable();
		h1.setItem('FX5__Catalog_Item__c', 'RCE');
		h1.setItem('Contact', 'RCE');
		h1.setItem('FX5__Contact_Qualification__c', 'RCE');
		h1.setItem('FX5__Equipment__c', 'RCE');
		h1.setItem('FX5__Equipment_Qualification__c', 'RCE');
		h1.setItem('FX5__Preventative_Maintenance_Criterion__c', 'RCE');
		h1.setItem('FX5__Preventative_Maintenance_Schedule__c', 'RCE');
		h1.setItem('FX5__Qualification__c', 'RCE');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Work_Order__c', 'RCE');
		h1.setItem('FX5__Work_Order_Item__c', 'RCE');
		h1.setItem('FX5__Work_Order_Qualification__c', 'RCE');
		h1.setItem('FX5__Work_Order_Task__c', 'RCED');
		return h1;
	}

	function GetMinTimecardObjectPermissions()
	{
		var h1 = new HashTable();
		h1.setItem('FXT2__Timecard__c', 'RCE');
		return h1;
	}

	function GetMinBackOfficeSchedulingAndDispatchObjectPermissions()
	{
		var h1 = new HashTable();
		h1.setItem('Account', 'RCE');
		h1.setItem('FX5__Attachment_Ext__c', 'RCE');
		h1.setItem('FX5__Audit_Log__c', 'RE');
		h1.setItem('FX5__Catalog_Item__c', 'RCE');
		h1.setItem('FX5__Checklist__c', 'RCE');
		h1.setItem('FX5__Checklist_Step__c', 'RCE');
		h1.setItem('FX5__Classification__c', 'RCE');
		h1.setItem('FX5__Contact_Qualification__c', 'RCE');
		h1.setItem('FX5__Crew_Planning__c', 'RCE');
		h1.setItem('FX5__eForm_Config__c', 'RCE');
		h1.setItem('FX5__Equipment__c', 'RCE');
		h1.setItem('FX5__Equipment_Planning__c', 'RCE');
		h1.setItem('FX5__Equipment_Qualification__c', 'RCE');
		h1.setItem('FX5__Job__c', 'RCED');
		h1.setItem('FX5__Job_Contact__c', 'RCE');
		h1.setItem('FX5__Price_Book__c', 'RCE');
		h1.setItem('FX5__Price_Book_Assignment__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item__c', 'RCE');
		h1.setItem('FX5__Price_Book_Item_Service_Type__c', 'RCE');
		h1.setItem('FX5__Qualification__c', 'RCE');
		h1.setItem('FX5__Quote__c', 'RCED');
		h1.setItem('FX5__Quote_Item__c', 'RCED');
		h1.setItem('FX5__Report_Template__c', 'R');
		h1.setItem('FX5__Service_Type__c', 'RCE');
		h1.setItem('FX5__Status__c  ', 'RCE');
		h1.setItem('FX5__Status_History__c', 'RCE');
		h1.setItem('FX5__Status_Workflow__c', 'RCE');
		h1.setItem('FX5__Sync_Assignment__c', 'RCE');
		h1.setItem('FX5__Sync_Configuration__c', 'RCE');
		h1.setItem('FX5__Ticket__c', 'RCED');
		h1.setItem('FX5__Ticket_Checklist_Step__c', 'RCED');
		h1.setItem('FX5__Ticket_Item__c', 'RCED');
		h1.setItem('FX5__Ticket_Log__c', 'RCED');
		h1.setItem('FX5__Warehouse__c', 'RCE');
		h1.setItem('FX5__Well__c', 'R');
		return h1;
	}

	function GetFieldCount(fields, all, read, edit)
	{
		var i = 0;
		j$.each(fields,
			function(i2, f)
			{
				if (all == true)
				{
					i++;
				}
				else if (read == true && f.HasRead)
				{
					i++;
				}
				else if (edit == true && f.HasEdit)
				{
					i++;
				}
			}
		);
		return i;
	}

	function GetRecordTypeCount(fields, all)
	{
		var i = 0;
		if (fields)
		{
			j$.each(fields,
				function(i2, f)
				{
					if (all == true)
					{
						i++;
					}
					else if (f.Assigned)
					{
						i++;
					}
				}
			);
		}
		return i;
	}

	function GetSpanPermission(hasaccess, ispermissionable, grantedby, CusomObject, sftype)
	{
		var results = '';
		if (sftype == 'Object' && CusomObject.IsPermissionable == false)
		{
			return results;
		}
		results += '<div class="dropdown">';
		results += ' <span class="glyphicon ' + (hasaccess == true ? 'glyphicon-check dropdown-toggle' : 'glyphicon-unchecked') + ' ' + (ispermissionable == false ? 'text-grey' : '') + '" data-checked="' + hasaccess + '" type="button" data-toggle="dropdown"></span>';
		if (hasaccess == true && grantedby && grantedby.length > 0 && ispermissionable)
		{
			results += '<ul class="dropdown-menu">';
			results += '<li role="presentation"><p style="text-align: center;font-weight: bold;" role="menuitem" tabindex="-1">Assigned From</p></li>';
			results += '<li role="presentation" class="divider"></li>';
			var gresults = '';
			j$.each(grantedby,
				function(i2, ri)
				{
					var myname = (ri.IsProfile ? '*' : '') + ri.Name;
					var mysobjectId = '';
					var mysobjectId = (CusomObject != undefined && CusomObject.CusomObjectId != undefined && CusomObject.CusomObjectId != null ? CusomObject.CusomObjectId.substring(0, 15) : '');
					if (mysobjectId == '' && CusomObject != undefined && CusomObject.APIName != undefined && CusomObject.APIName != null)
					{
						mysobjectId = CusomObject.APIName;
					}
					var sfurl = '';
					if (sftype == 'Field')
					{
						var urlSValue = (ri.IsProfile == true ? 'ObjectsAndTabs' : 'EntityPermissions');
						sfurl = "/" + ri.Id.substring(0, 15) + "?s=" + urlSValue + "&o=" + mysobjectId;
					}
					else if (sftype == 'SystemPermissions')
					{
						sfurl = "/" + ri.Id.substring(0, 15) + "?s=SystemPermissions";
					}
					else if (sftype == 'ClassAccess')
					{
						sfurl = "/" + ri.Id.substring(0, 15) + "?s=ClassAccess";
					}
					else if (sftype == 'PageAccess')
					{
						sfurl = "/" + ri.Id.substring(0, 15) + "?s=PageAccess";
					}
					else
					{
						sfurl = "/" + ri.Id.substring(0, 15);
					}
					if (salesforceAccessURL != '')
					{
						sfurl = salesforceAccessURL + encodeURIComponent(sfurl);
					}
					results += '<li><font style="text-decoration: underline;hover: #008CBA;"><a href="' + sfurl + '"" target="_blank">' + myname + '</a></font></li>';
				});
			results += '</ul>';
		}
		results += '</div>';
		results += '</div>';
		return results;
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