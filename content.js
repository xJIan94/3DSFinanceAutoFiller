function insertSpecialCase(keyNumber) {
    var type = {"Admin":'1',"Training":'5',"Sick":'11',"Leave":'9'};
    if(timesheetData[keyNumber].BU.toLowerCase().search('adminstration') > 0){
        insertCase(keyNumber,type["Admin"]);
    }else if (timesheetData[keyNumber].BU.toLowerCase().search('training received') > 0) {
        insertCase(keyNumber,type["Training"]);
    }else if (timesheetData[keyNumber].BU.toLowerCase().search('paid vacation') > 0) {
        insertCase(keyNumber,type["Leave"]);
    }else if (timesheetData[keyNumber].BU.toLowerCase().search('sick leave') > 0) {
        insertCase(keyNumber,type["Sick"]);
    }
}

function insertCase(keyNumber,type) {
      //POL_TIME(day)$1
      if(typeof timesheetData[keyNumber].Mon !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME1\\$'+type).val(timesheetData[keyNumber].Mon); }
      if(typeof timesheetData[keyNumber].Tue !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME2\\$'+type).val(timesheetData[keyNumber].Tue); }
      if(typeof timesheetData[keyNumber].Wed !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME3\\$'+type).val(timesheetData[keyNumber].Wed); }
      if(typeof timesheetData[keyNumber].Thu !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME4\\$'+type).val(timesheetData[keyNumber].Thu); }
      if(typeof timesheetData[keyNumber].Fri !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME5\\$'+type).val(timesheetData[keyNumber].Fri); }
      if(typeof timesheetData[keyNumber].Sat !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME6\\$'+type).val(timesheetData[keyNumber].Sat); }
      if(typeof timesheetData[keyNumber].Sun !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME7\\$'+type).val(timesheetData[keyNumber].Sun); }
}


// Need to add a loop to flash all the data



if (typeof jQuery !== 'undefined') {  
      console.log("background js running");
      var timesheetData = "";

      // chrome.storage.onChanged.addListener(function(changes, namespace) {
      //    for (key in changes) {
      //      var storageChange = changes['timesheetData'];
      //      console.log('Storage key "%s" in namespace "%s" changed. ' +
      //                  'Old value was "%s", new value is "%s".',
      //                  key,
      //                  namespace,
      //                  storageChange.oldValue,
      //                  storageChange.newValue);
      //      var timesheetData = storageChange.newValue;
           
      //    }
      // });
       chrome.storage.local.get('timesheetData', function (result) {
            timesheetData = result.timesheetData;
            keys = Object.keys(timesheetData);
            console.log(timesheetData);
            // debugger;
            // check title EX_ICLIENT_WRK_PAGE_TITLE_60 is Time Report Summary or not
            if($('#ptifrmtgtframe').contents().find('#win0divEX_ICLIENT_WRK_PAGE_TITLE_60 span').text() == "Time Report Summary" ){
                      console.log("start injecting");
                      var rowNum =0;
                      for (var i = 0; i < keys.length; i++) {
                        console.log("Start looping, i="+i+" , key="+keys[i]+", row number "+rowNum);
                        if(typeof timesheetData[keys[i]].BU !== 'undefined') { 
                              if(timesheetData[keys[i]].BU.startsWith(' ')){

                                  var temp = timesheetData[keys[i]].BU.substr(1);
                                  $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val(temp);
                                  
                              }else if(timesheetData[keys[i]].BU.startsWith('*')) {
                                    insertSpecialCase(keys[i]);
                                    
                                    continue;
                              }else{
                                  $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val(timesheetData[keys[i]].BU);

                              }
                          }
                        if(typeof timesheetData[keys[i]].PJ !== 'undefined') { 

                          if(timesheetData[keys[i]].PJ.startsWith(' ')){

                                var temp = timesheetData[keys[i]].PJ.substr(1);
                                $('#ptifrmtgtframe').contents().find('#PROJECT_CODE\\$'+rowNum).val(temp);
                            
                            }else{
                                $('#ptifrmtgtframe').contents().find('#PROJECT_CODE\\$'+rowNum).val(timesheetData[keys[i]].PJ); 
                            }

                        }
                        if(typeof timesheetData[keys[i]].Mon !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME1\\$'+rowNum).val(timesheetData[keys[i]].Mon); }
                        if(typeof timesheetData[keys[i]].Tue !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME2\\$'+rowNum).val(timesheetData[keys[i]].Tue); }
                        if(typeof timesheetData[keys[i]].Wed !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME3\\$'+rowNum).val(timesheetData[keys[i]].Wed); }
                        if(typeof timesheetData[keys[i]].Thu !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME4\\$'+rowNum).val(timesheetData[keys[i]].Thu); }
                        if(typeof timesheetData[keys[i]].Fri !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME5\\$'+rowNum).val(timesheetData[keys[i]].Fri); }
                        if(typeof timesheetData[keys[i]].Sat !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME6\\$'+rowNum).val(timesheetData[keys[i]].Sat); }
                        if(typeof timesheetData[keys[i]].Sun !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME7\\$'+rowNum).val(timesheetData[keys[i]].Sun); }
                        
                        rowNum = rowNum +1 ;
                      }
                        //done injecting
                      /*
                      //check wrong project code
                      //$('#ptifrmtgtframe').contents().find(".PSERROR").val()
                        
                    //click the button "EX_ICLIENT_WRK_PB_UPDATE" check for any invalid data

                    
                    */ 
            }
            
        });
} else {
    console.log("jQuery not loaded");
    // jQuery not loaded
}
