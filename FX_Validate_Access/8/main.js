var j$ = jQuery.noConflict();
var RemoteGetObjectInfoResult;
var salesforceAccessURL = '';

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

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

function ShowRecordTypePermissionsModal(sobject, sobjectlabel)
{
    j$('#RTHeader').html(sobjectlabel + ' Record Type Assigments');
    var fp = FindRTPermissions(sobject);
    var fs = FindSobject(sobject);
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
                datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.Assigned, true, d.AssignedGrantedBy,fs,'Object') + '</td>'
                datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.Default, true, [],fs,'Object') + '</td>'
                datatableFieldPermissionsresult += '</tr>';
            });
        datatableFieldPermissionsresult += '</tbody>';
        datatableFieldPermissionsresult += '</table>';
        j$('#RTBody').html(datatableFieldPermissionsresult);
    }
    j$('#RecordTypePermissionsModal').modal('show');
}

function ShowFieldPermissionsModal(sobject, sobjectlabel)
{
    j$('#FPHeader').html(sobjectlabel + ' Field Permissions');
    var fp = FindFieldPermissions(sobject);
    var fs = FindSobject(sobject);
    var datatableFieldPermissionsresult = '';
    if (fp != undefined && fp != null)
    {
       // datatableFieldPermissionsresult += '<div class="table-responsive">';
        datatableFieldPermissionsresult += '<div><table id="FieldPermissionsTable" class="display" style="display:none;" cellspacing="0" width="100%"><thead><tr>';
        datatableFieldPermissionsresult += '<th>Label</th>';
        datatableFieldPermissionsresult += '<th>API Name</th>';
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
                datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.HasRead, d.ReadIsAssignable, d.HasReadGrantedBy,fs,'Object') + '</td>'
                datatableFieldPermissionsresult += '<td>' + GetSpanPermission(d.HasEdit, d.EditIsAssignable, d.HasEditGrantedBy,fs,'Object') + '</td>'
                datatableFieldPermissionsresult += '</tr>';
            });
        datatableFieldPermissionsresult += '</tbody>';
        datatableFieldPermissionsresult += '</table></div>';
        //datatableFieldPermissionsresult += '</div>'
        j$('#FPBody').html(datatableFieldPermissionsresult);
    }
    j$('#FilePermissionsModal').modal('show');
}

j$(document).ready(function()
{

    j$('#RecordTypePermissionsModal').on('shown.bs.modal', function()
    {
        j$('#RTPermissionsTable').show();
        var maxdocheight = j$(window).height() * .80;
        j$('#RTBody').css('max-height', maxdocheight);

        j$('#RTPermissionsTable').DataTable(
        {
            "scrollCollapse": true,
            "paging": false,
            "order": [0, "asc"],
            "stateSave": false,
            "searching": true,
            "columnDefs": [
            {
                "targets": [1, 2],
                "visible": true,
                "searchable": false,
                "orderDataType": "dom-checkbox-glyphicon"
            }]
        });
        j$('[data-toggle="popover"]').popover(
        {
            placement: "auto",
            container: "td3"
        });
    });

    j$('#FilePermissionsModal').on('shown.bs.modal', function()
    {
        j$('#FieldPermissionsTable').show();
        var maxdocheight = j$(window).height() * .80;
        j$('#FPBody').css('max-height', maxdocheight);

        j$('#FieldPermissionsTable').DataTable(
        {
            "scrollCollapse": false,
            "paging": false,
            "order": [0, "asc"],
            "stateSave": false,
            "searching": true,
            "columnDefs": [
            {
                "targets": [1, 2],
                "visible": true,
                "searchable": false,
                "orderDataType": "dom-checkbox-glyphicon"
            }]
        });
        
       // myTable.columns.adjust().responsive.recalc();

       //j$('#FieldPermissionsTable').DataTable().columns.adjust().responsive.recalc();
        //myTable.responsive.recalc();
        
        j$('[data-toggle="popover"]').popover(
        {
            placement: "auto",
            container: "td2"
        });
    });

    /*
    j$(".modal-fullscreen").on('show.bs.modal', function () 
    {
        setTimeout( function() 
        {
            j$(".modal-backdrop").addClass("modal-backdrop-fullscreen");
        }
        , 0
        );
    });

    j$(".modal-fullscreen").on('hidden.bs.modal', function () 
    {
        j$(".modal-backdrop").addClass("modal-backdrop-fullscreen");
    });
    */

    /* Create an array with the values of all the checkboxes in a column */
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

    var finalresult = {
        FXObjects: [],
        FXRelatedObjects: [],
        PermissionSets: [],
        PackageLicense: [],
        ApexClassAccess: [],
        VFPageAccess: [],
        SystemPermissions: []
    };
    dojforcelogin(mysessionId, myloginurl, myusername, mypassword, myproxyUrl, function(loginerr, conn)
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
                                            salesforceAccessURL = conn.instanceUrl + '/secur/frontdoor.jsp?sid='+ conn.accessToken+'&retURL='
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
                                                                for (var i = 0; i < Profilemeta.fields.length; i++)
                                                                {
                                                                    var myfield = Profilemeta.fields[i];
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
                                                                                        for (var i = 0; i < Permissionsetmeta.fields.length; i++)
                                                                                        {
                                                                                            var myfield = Permissionsetmeta.fields[i];
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
                                                                                                        for (var i = 0; i < PermissionSetQueryResults.length; i++)
                                                                                                        {
                                                                                                            var QueryResult = PermissionSetQueryResults[i];
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
                                                                                                    for (var i = 0; i < Profilemeta.fields.length; i++)
                                                                                                    {
                                                                                                        var myfield = Profilemeta.fields[i];
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
                                                                                                                for (var i2 = 0; i2 < PermissionSetQueryResults.length; i2++)
                                                                                                                {
                                                                                                                    var permsetresult = PermissionSetQueryResults[i2];
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
                                                                                                    DescribeAllSObjects(conn, function(DescribeAllSObjectserr, DescribeAllSObjectsResult)
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
                                                                                                                if (sobjecttype.toLowerCase().startsWith('fx5__') || sobjecttype.toLowerCase().startsWith('fxt2__') || sobjecttype == 'Account' || sobjecttype == 'Contact' || sobjecttype == 'User')
                                                                                                                {
                                                                                                                    RelatedFXObjectsHT.setItem(sobjecttype, item);
                                                                                                                    var fieldresults = getfieldResults(item);
                                                                                                                    var recordTyperesults = getrecordTyperesults(item);
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
                                                                                                                        OneFieldIsPermissionable: true,
                                                                                                                        fields: fieldresults,
                                                                                                                        recordtypes: recordTyperesults,
                                                                                                                        isCustom: false,
                                                                                                                        isCustomSetting: false,
                                                                                                                        CusomObjectId: item.CusomObjectId
                                                                                                                    };
                                                                                                                    finalresult.FXObjects.push(s1);
                                                                                                                    searchObjects.push(sobjecttype);
                                                                                                                }
                                                                                                                SobjectHT.setItem(sobjecttype, item);
                                                                                                                var myparents = [];
                                                                                                                var myfields = GetDescribeSObjectField(item.fields);
                                                                                                                for (var i = 0; i < myfields.length; i++)
                                                                                                                {
                                                                                                                    var field = myfields[i];
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
                                                                                                                    for (var i = 0; i < myparents.length; i++)
                                                                                                                    {
                                                                                                                        var myparent = myparents[0];
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
                                                                                                            for (var i = 0; i < RelatedFXObjectsHT.keys.length; i++)
                                                                                                            {
                                                                                                                var mykey = RelatedFXObjectsHT.keys[i];
                                                                                                                var parentname = RelatedFXObjectsHT.getItem(mykey);
                                                                                                                if (parentname != undefined)
                                                                                                                {
                                                                                                                    getRelatedObjects(RelatedFXObjectNames, parentname.fullName, ParentChildRelationships);
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    var a1 = '';
                                                                                                                }
                                                                                                            }
                                                                                                            //console.log(RelatedFXObjectNames);
                                                                                                            for (var i = 0; i < RelatedFXObjectNames.length; i++)
                                                                                                            {
                                                                                                                var RelatedFXObjectName = RelatedFXObjectNames[i];
                                                                                                                if (SobjectHT.hasItem(RelatedFXObjectName))
                                                                                                                {
                                                                                                                    var item = SobjectHT.getItem(RelatedFXObjectName);
                                                                                                                    var sobjecttype = item.fullName;
                                                                                                                    if (sobjecttype != undefined && RelatedFXObjectsHT.hasItem(sobjecttype) == false)
                                                                                                                    {
                                                                                                                        searchObjects.push(sobjecttype);
                                                                                                                        var fieldresults = getfieldResults(item);
                                                                                                                        var recordTyperesults = getrecordTyperesults(item);
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
                                                                                                                            OneFieldIsPermissionable: true,
                                                                                                                            fields: fieldresults,
                                                                                                                            recordtypes: recordTyperesults,
                                                                                                                            isCustom: false,
                                                                                                                            isCustomSetting: false,
                                                                                                                            CusomObjectId: item.CusomObjectId
                                                                                                                        };
                                                                                                                        finalresult.FXRelatedObjects.push(s1);
                                                                                                                    }
                                                                                                                }
                                                                                                            }
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
                                                                                                            if (searchPermissionSetnames.length > 0)
                                                                                                            {
                                                                                                                mypackage.types.push(
                                                                                                                {
                                                                                                                    'members': searchPermissionSetnames,
                                                                                                                    'name': 'PermissionSet'
                                                                                                                });
                                                                                                            }
                                                                                                            //var conn3 = new jsforce.Connection({accessToken : '{!$Api.Session_ID}'});
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
                                                                                                                                                //add results for profile
                                                                                                                                                var profilepackagename = 'unpackaged/profiles/' + MetaDataApiName(searchprofilename).replace(".", "%2E").replace("(", "%28").replace(")", "%29").replace("/", "%2F") + '.profile';
                                                                                                                                                if (zipresults.hasItem(profilepackagename) == true)
                                                                                                                                                {
                                                                                                                                                    var mydetail = zipresults.getItem(profilepackagename);
                                                                                                                                                    if (mydetail.Profile.fieldPermissions != undefined)
                                                                                                                                                    {
                                                                                                                                                        for (var i = 0; i < mydetail.Profile.fieldPermissions.length; i++)
                                                                                                                                                        {
                                                                                                                                                            var mypermission2 = mydetail.Profile.fieldPermissions[i];
                                                                                                                                                            SetFeildResult(mypermission2,myUser.ProfileId, finalresult, searchprofilename, true);
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    if (mydetail.Profile.objectPermissions != undefined)
                                                                                                                                                    {
                                                                                                                                                        for (var i = 0; i < mydetail.Profile.objectPermissions.length; i++)
                                                                                                                                                        {
                                                                                                                                                            var mypermission2 = mydetail.Profile.objectPermissions[i];
                                                                                                                                                            SetObjectResult(mypermission2,myUser.ProfileId, finalresult, searchprofilename, true);
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    if (mydetail.Profile.recordTypeVisibilities)
                                                                                                                                                    {
                                                                                                                                                        for (var i = 0; i < mydetail.Profile.recordTypeVisibilities.length; i++)
                                                                                                                                                        {
                                                                                                                                                            var myrtvis = mydetail.Profile.recordTypeVisibilities[i];
                                                                                                                                                            SetRecordTypeResult(myrtvis,myUser.ProfileId, finalresult, searchprofilename, true);
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
                                                                                                                                                    for (var i = 0; i < PermissionSetQueryResults.length; i++)
                                                                                                                                                    {
                                                                                                                                                        var QueryResult = PermissionSetQueryResults[i];
                                                                                                                                                        var permname = (QueryResult.NamespacePrefix != undefined && QueryResult.NamespacePrefix.length > 0 ? QueryResult.NamespacePrefix + '__' : '') + QueryResult.Name;
                                                                                                                                                        (QueryResult.NamespacePrefix != undefined && QueryResult.NamespacePrefix.length > 0 ? QueryResult.NamespacePrefix + '__' : '') + QueryResult.Name;
                                                                                                                                                        var permpackagename = 'unpackaged/permissionsets/' + permname.replace(".", "%2E").replace("(", "%28").replace(")", "%29").replace("/", "%2F") + '.permissionset';
                                                                                                                                                        if (zipresults.hasItem(permpackagename) == true)
                                                                                                                                                        {
                                                                                                                                                            var mydetail = zipresults.getItem(permpackagename);
                                                                                                                                                            if (mydetail.PermissionSet.fieldPermissions != undefined)
                                                                                                                                                            {
                                                                                                                                                                for (var i2 = 0; i2 < mydetail.PermissionSet.fieldPermissions.length; i2++)
                                                                                                                                                                {
                                                                                                                                                                    var mypermission2 = mydetail.PermissionSet.fieldPermissions[i2];
                                                                                                                                                                    SetFeildResult(mypermission2,QueryResult.Id, finalresult, QueryResult.Name, false);
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                            if (mydetail.PermissionSet.objectPermissions != undefined)
                                                                                                                                                            {
                                                                                                                                                                for (var i2 = 0; i2 < mydetail.PermissionSet.objectPermissions.length; i2++)
                                                                                                                                                                {
                                                                                                                                                                    var mypermission2 = mydetail.PermissionSet.objectPermissions[i2];
                                                                                                                                                                    SetObjectResult(mypermission2,QueryResult.Id, finalresult, QueryResult.Name, false);
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                            if (mydetail.PermissionSet.recordTypeVisibilities)
                                                                                                                                                            {
                                                                                                                                                                for (var i = 0; i < mydetail.PermissionSet.recordTypeVisibilities.length; i++)
                                                                                                                                                                {
                                                                                                                                                                    var myrtvis = mydetail.PermissionSet.recordTypeVisibilities[i];
                                                                                                                                                                    SetRecordTypeResult(myrtvis,QueryResult.Id, finalresult, searchprofilename, false);
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
                                                                                                                                                myquery = "SELECT Id, Status, IsProvisioned, AllowedLicenses, UsedLicenses, ExpirationDate, CreatedDate, LastModifiedDate, SystemModstamp, NamespacePrefix FROM PackageLicense where NamespacePrefix in('FXMAP','FXJSD','FXTKT','FX5','FXCPQ') and Id in (SELECT  PackageLicenseId FROM UserPackageLicense where UserId ='" + targetUserId + "')";
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
                                                                                                                                                                for (var i = 0; i < PackageLicenseQueryResults.length; i++)
                                                                                                                                                                {
                                                                                                                                                                    var QueryResult = PackageLicenseQueryResults[i];
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
                                                                                                                                                                            for (var i = 0; i < ApexClassQueryResults.length; i++)
                                                                                                                                                                            {
                                                                                                                                                                                var QueryResult = ApexClassQueryResults[i];
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
                                                                                                                                                                                        for (var i2 = 0; i2 < QueryResult.SetupEntityAccessItems.records.length; i2++)
                                                                                                                                                                                        {
                                                                                                                                                                                            var sa = QueryResult.SetupEntityAccessItems.records[i2];
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
                                                                                                                                                                                        for (var i = 0; i < ApexPageQueryResults.length; i++)
                                                                                                                                                                                        {
                                                                                                                                                                                            var QueryResult = ApexPageQueryResults[i];
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
                                                                                                                                                                                                    for (var i2 = 0; i2 < QueryResult.SetupEntityAccessItems.records.length; i2++)
                                                                                                                                                                                                    {
                                                                                                                                                                                                        var sa = QueryResult.SetupEntityAccessItems.records[i2];
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
                                                                                                                                                                                    ProcessFinalResult(finalresult, function(result)
                                                                                                                                                                                    {
                                                                                                                                                                                        j$('#pageloading').hide();
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

function dojforcelogin(sid, lurl, luser, lpass, lproxy, callback)
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

function SetObjectResult(mypermission,myProfieePermSerId, fresult, proPermName, IsProfile)
{
    try
    {
        var sobjectname = mypermission.object;
        for (var i2 = 0; i2 < fresult.FXObjects.length; i2++)
        {
            var myresultobject = fresult.FXObjects[i2];
            if (myresultobject.APIName == sobjectname)
            {
                //{APIName:sobjecttype,HasCreate:false,HasCreateGrantedBy:[],HasDelete:false,HasDeleteGrantedBy:[],HasEdit:false,
                //HasEditGrantedBy:[],HasModifyAll:false,HasModifyAllGrantedBy:[],HasRead:false,HasReadGrantedBy:[],HasViewAll:false,HasViewAllGrantedBy:[],
                //Label:item.label,OneFieldIsPermissionable:true,fields:fieldresults,isCustom:false,isCustomSetting:false}
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
                //{APIName:sobjecttype,HasCreate:false,HasCreateGrantedBy:[],HasDelete:false,HasDeleteGrantedBy:[],HasEdit:false,
                //HasEditGrantedBy:[],HasModifyAll:false,HasModifyAllGrantedBy:[],HasRead:false,HasReadGrantedBy:[],HasViewAll:false,HasViewAllGrantedBy:[],
                //Label:item.label,OneFieldIsPermissionable:true,fields:fieldresults,isCustom:false,isCustomSetting:false}
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

function SetRecordTypeResult(mypermission,myProfieePermSerId, fresult, proPermName, IsProfile)
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
                        if (mypermission.default && mypermission.default == 'true')
                        {
                            myresultobject.Default = true;
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
                        if (mypermission.default && mypermission.default == 'true')
                        {
                            myresultobject.Default = true;
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

function SetFeildResult(mypermission,myProfieePermSerId, fresult, proPermName, IsProfile)
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

function getRelatedObjects(results, parentApi, ParentChildernRelationships)
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
                    getRelatedObjects(results, childname, ParentChildernRelationships);
                }
            }
            else
            {
                var a1 = '';
            }
        }
    }
}

function getfieldResults(item)
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
            permissionable: true
        };
        fieldresults.push(fieldresult);
    }
    return fieldresults;
}

function getrecordTyperesults(item)
{
    var recordtyperesults = [];
    if(item.recordTypes)
    {
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
                        Assigned: false,
                        AssignedGrantedBy: [],
                        Label: flabel,
                        Name: recordtype.fullName
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
                    Assigned: false,
                    AssignedGrantedBy: [],
                    Label: flabel,
                    Name: recordtype.fullName
                };
                recordtyperesults.push(recordtyperesult);
            }
        }
    }
    
    return recordtyperesults;
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

function ProcessFinalResult(result, callback)
{
    console.log(result);
    RemoteGetObjectInfoResult = result;
    if (result.Userdetail != undefined)
    {
        j$('#userFullName').html('<a href="/' + result.Userdetail.Id + '?noredirect=1&isUserEntityOverride=1">' + result.Userdetail.Name + '</a>');
        if (result.Userdetail.UserRole != undefined)
        {
            j$('#userRole').html(result.Userdetail.UserRole.Name);
        }
        if (result.Userdetail.Profile != undefined)
        {
            j$('#userProfileName').html('<a href="/' + result.Userdetail.Profile.Id + '">' + result.Userdetail.Profile.Name + '</a>');
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
                datatablePermissionSetresult += '<td><a href="/' + d.Id + '">' + d.Label + '</a></td>';
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
    var datatableFXObjectsresult = '';
    if (result.FXObjects != undefined)
    {
        datatableFXObjectsresult += '<table id="FXObjectsTable" class="display" cellspacing="0" width="100%"><thead><tr>';
        datatableFXObjectsresult += '<th>Label</th>';
        datatableFXObjectsresult += '<th>API Name</th>';
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
                //datatableFXRelatedObjectsresult += '<td>' + d.Label + '</td>';
                datatableFXObjectsresult += '<td>';
                if (d.CusomObjectId)
                {
                    datatableFXObjectsresult += '<a href="'+salesforceAccessURL+ '/' + d.CusomObjectId + '" target="_blank">' +d.Label+'</a>';
                }
                else
                {
                    datatableFXObjectsresult += d.Label;
                }
                datatableFXObjectsresult += '</td>';
                //datatableFXRelatedObjectsresult += '<td>' + d.APIName + '</td>';
                datatableFXObjectsresult += '<td>';
                if (d.CusomObjectId)
                {
                    datatableFXObjectsresult += '<a href="'+salesforceAccessURL+ '/' + d.CusomObjectId + '" target="_blank">' +d.APIName+'</a>';
                }
                else
                {
                    datatableFXObjectsresult += d.APIName;
                }
                datatableFXObjectsresult += '</td>';
                
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasRead, true, d.HasReadGrantedBy,d,'Object') + '</td>'
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasCreate, true, d.HasCreateGrantedBy,d,'Object') + '</td>';
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasEdit, true, d.HasEditGrantedBy,d,'Object') + '</td>';
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasDelete, true, d.HasDeleteGrantedBy,d,'Object') + '</td>';
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasViewAll, true, d.HasViewAllGrantedBy,d,'Object') + '</td>';
                datatableFXObjectsresult += '<td>' + GetSpanPermission(d.HasModifyAll, true, d.HasModifyAllGrantedBy,d,'Object') + '</td>';
                datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, true, false, false) + '</a></td>';
                datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, false, true, false) + '</a></td>';
                datatableFXObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, false, false, true) + '</a></td>';

                datatableFXObjectsresult += '<td><a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getRTcount(d.recordtypes, true) + '</a></td>';
                datatableFXObjectsresult += '<td><a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getRTcount(d.recordtypes, false) + '</a></td>';
                
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
            "stateSave": false,
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
                //datatableFXRelatedObjectsresult += '<td>' + d.Label + '</td>';
                datatableFXRelatedObjectsresult += '<td>';
                if (d.CusomObjectId)
                {
                    datatableFXRelatedObjectsresult += '<a href="'+salesforceAccessURL+ '/' + d.CusomObjectId + '" target="_blank">' +d.Label+'</a>';
                }
                else
                {
                    datatableFXRelatedObjectsresult += d.Label;
                }
                datatableFXRelatedObjectsresult += '</td>';
                //datatableFXRelatedObjectsresult += '<td>' + d.APIName + '</td>';
                datatableFXRelatedObjectsresult += '<td>';
                if (d.CusomObjectId)
                {
                    datatableFXRelatedObjectsresult += '<a href="'+salesforceAccessURL+ '/' + d.CusomObjectId + '" target="_blank">' +d.APIName+'</a>';
                }
                else
                {
                    datatableFXRelatedObjectsresult += d.APIName;
                }
                datatableFXRelatedObjectsresult += '</td>';

                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasRead, true, d.HasReadGrantedBy,d,'Object') + '</td>'
                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasCreate, true, d.HasCreateGrantedBy,d,'Object') + '</td>';
                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasEdit, true, d.HasEditGrantedBy,d,'Object') + '</td>';
                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasDelete, true, d.HasDeleteGrantedBy,d,'Object') + '</td>';
                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasViewAll, true, d.HasViewAllGrantedBy,d,'Object') + '</td>';
                datatableFXRelatedObjectsresult += '<td>' + GetSpanPermission(d.HasModifyAll, true, d.HasModifyAllGrantedBy,d,'Object') + '</td>';
                datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, true, false, false) + '</a></td>';
                datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, false, true, false) + '</a></td>';
                datatableFXRelatedObjectsresult += '<td><a onclick="ShowFieldPermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getcount(d.fields, false, false, true) + '</a></td>';

                datatableFXRelatedObjectsresult += '<td><a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getRTcount(d.recordtypes, true) + '</a></td>';
                datatableFXRelatedObjectsresult += '<td><a onclick="ShowRecordTypePermissionsModal(&apos;' + d.APIName + '&apos;,&apos;' + d.Label + '&apos;);">' + getRTcount(d.recordtypes, false) + '</a></td>';

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
            "stateSave": false,
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
                datatableApexClassesresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy,null,'ClassAccess') + '</td>'
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
            "stateSave": false,
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
                datatableVisualforcePagesresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy,null,'PageAccess') + '</td>'
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
            "stateSave": false,
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
                datatableSystemPermissionsresult += '<td>' + GetSpanPermission(d.HasAccess, true, d.GrantedBy,null,'SystemPermissions') + '</td>'
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
            "stateSave": false,
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
    j$('[data-toggle="popover"]').popover();
    callback(true);
    //j$('#pageloading').hide();
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
            callback(null,records);
            //console.log("total in database : " + query.totalSize);
            //console.log("total fetched : " + query.totalFetched);
        })
        .on("error", function(err)
        {
            //console.error(err);
            callback(err,null);
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
            callback(null,records);
            //console.log("total in database : " + query.totalSize);
            //console.log("total fetched : " + query.totalFetched);
        })
        .on("error", function(err)
        {
            //console.error(err);
            callback(err,null);
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
                if (err)
                {
                    callback(err, null);
                }
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
                QueryToolingRecords(conn, 'Select Id, DeveloperName, NamespacePrefix From CustomObject', function (toolingerr, toolingresult)
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
                                var objname = (tr.NamespacePrefix != undefined && tr.NamespacePrefix != null ? tr.NamespacePrefix + '__': '') + tr.DeveloperName;
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
                        callback(missing.length > 0 ? err : null, result);
                    }
                });
                
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

function chunkArrayInGroups(array, unit)
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
    var smallarrays = chunkArrayInGroups(names, chunksize);
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

function getcount(fields, all, read, edit)
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

function getRTcount(fields, all)
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
    results += '<span class="glyphicon ' + (hasaccess == true ? 'glyphicon-check' : 'glyphicon-unchecked') + ' ' + (ispermissionable == false ? 'text-grey' : '') + '" data-checked="' + hasaccess + '" ';
    if (hasaccess == true)
    {
        var gresults = '';
        j$.each(grantedby,
            function(i2, ri)
            {
                if (gresults != '')
                {
                    gresults += '<br />';
                }
                var myname = (ri.IsProfile ? '*' : '') + ri.Name;
                var mysobjectId = '';
                var mysobjectId = (CusomObject != undefined && CusomObject.CusomObjectId != undefined && CusomObject.CusomObjectId != null ? CusomObject.CusomObjectId.substring(0,15) : '') ;

                if (mysobjectId == '' && CusomObject != undefined && CusomObject.APIName != undefined && CusomObject.APIName != null)
                {
                    mysobjectId = CusomObject.APIName;
                }
                var sfurl = '';



                if(sftype == 'Object')
                {
                    var urlSValue = (ri.IsProfile == true ? 'ObjectsAndTabs':'EntityPermissions');
                    sfurl = "/"+ ri.Id.substring(0,15)  +"?s="+urlSValue+"&o="+mysobjectId;
                }
                else if(sftype == 'SystemPermissions')
                {
                    sfurl = "/"+ ri.Id.substring(0,15)  +"?s=SystemPermissions";
                }
                else if(sftype == 'ClassAccess')
                {
                    sfurl = "/"+ ri.Id.substring(0,15)  +"?s=ClassAccess";
                }
                else if(sftype == 'PageAccess')
                {
                    sfurl = "/"+ ri.Id.substring(0,15)  +"?s=PageAccess";
                }
                else
                {
                    sfurl ="/"+ ri.Id.substring(0,15);
                }

                if (salesforceAccessURL != '')
                {
                    sfurl = salesforceAccessURL + encodeURIComponent(sfurl);
                }

                gresults += "<a href='"+sfurl+"' target='_blank'>" + myname + "</a>";
            });
        if (gresults != '')
        {
            results += ' tabindex="0" data-toggle="popover" title="Assigned From" data-trigger="hover focus" data-html="true" data-content="' + gresults + '" '; 
        }
    }
    results += '/>';
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