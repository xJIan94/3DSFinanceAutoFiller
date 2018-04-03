if (typeof jQuery !== 'undefined') {  
      console.log("background js running");
      var timesheetData = "";
      injectJQueryScript();
     
      chrome.storage.local.get('timesheetData', function (result) {
            timesheetData = result.timesheetData;
            keys = Object.keys(timesheetData);
            console.log(timesheetData);
       
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
                                    insertPersonalHour(timesheetData[keys[i]]);
                                    
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
                        insertProjectHour(timesheetData[keys[i]],rowNum);
                        /*if(typeof timesheetData[keys[i]].Mon !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME1\\$'+rowNum).val(timesheetData[keys[i]].Mon); }
                        if(typeof timesheetData[keys[i]].Tue !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME2\\$'+rowNum).val(timesheetData[keys[i]].Tue); }
                        if(typeof timesheetData[keys[i]].Wed !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME3\\$'+rowNum).val(timesheetData[keys[i]].Wed); }
                        if(typeof timesheetData[keys[i]].Thu !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME4\\$'+rowNum).val(timesheetData[keys[i]].Thu); }
                        if(typeof timesheetData[keys[i]].Fri !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME5\\$'+rowNum).val(timesheetData[keys[i]].Fri); }
                        if(typeof timesheetData[keys[i]].Sat !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME6\\$'+rowNum).val(timesheetData[keys[i]].Sat); }
                        if(typeof timesheetData[keys[i]].Sun !== 'undefined') { $('#ptifrmtgtframe').contents().find('#TIME7\\$'+rowNum).val(timesheetData[keys[i]].Sun); }
*/                        
                        rowNum = rowNum +1 ;
                      }
                        //done injecting
                      
                      //check wrong project code
                      
                      //openActivityMenu(6);
                      addNewRow(0);
                      //deleteRow(0);
                      //$('#ptifrmtgtframe').contents().find(".PSERROR").val()
                        
                    //click the button "EX_ICLIENT_WRK_PB_UPDATE" check for any invalid data

                    
                    
            }
            
        });
} else {
    console.log("jQuery not loaded");
    // jQuery not loaded
}
