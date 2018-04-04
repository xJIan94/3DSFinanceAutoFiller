function insertPersonalHour(rowdata) {
    var type = {"Admin":'1',"Training":'5',"Sick":'11',"Leave":'9'};
    // var rowdata = timesheetData[keyNumber];
    console.log(rowdata);
    if(rowdata["BU"].toLowerCase().search('adminstration') > 0){
        insertPersonalHourRow(rowdata,type["Admin"]);
    }else if (rowdata["BU"].toLowerCase().search('training received') > 0) {
        insertPersonalHourRow(rowdata,type["Training"]);
    }else if (rowdata["BU"].toLowerCase().search('paid vacation') > 0) {
        insertPersonalHourRow(rowdata,type["Leave"]);
    }else if (rowdata["BU"].BU.toLowerCase().search('sick leave') > 0) {
        insertPersonalHourRow(rowdata,type["Sick"]);
    }
}

function insertPersonalHourRow(rowdata,type) {

      var day = { "Mon":'1', "Tue":'2' , "Wed":'3', "Thu":'4', "Fri":'5', "Sat":'6', "Sun":'7' };
      
      for (var key in rowdata){
        if(rowdata.hasOwnProperty(key)){// check if the key exist
            //console.log(key, rowdata[key]);
            if(day.hasOwnProperty(key)){
                $('#ptifrmtgtframe').contents().find('#POL_TIME'+day[key]+'\\$'+type).val(rowdata[key]);
            }
            
        }
      }
}

function insertProjectHour(rowdata,rowNum){
      var day = { "Mon":'1', "Tue":'2' , "Wed":'3', "Thu":'4', "Fri":'5', "Sat":'6', "Sun":'7' };
      
      for (var key in rowdata){
        if(rowdata.hasOwnProperty(key)){// check if the key exist
            
            if(day.hasOwnProperty(key)){
              // console.log(key, rowdata[key],"---> ",rowNum);
                $('#ptifrmtgtframe').contents().find('#TIME'+day[key]+'\\$'+rowNum).val(rowdata[key]);
            }
            
        }
      }
}

async function insertProjectBU(rowdata,rowNum){

      console.log(rowdata);
      rowdata["BU"].replace(/ /g,''); // replace the space inside the BU code
      await checkIfNextRowExist(rowNum);
      $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val(rowdata["BU"]);

}

async function checkIfNextRowExist(rowNum){
      if( typeof $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val() == 'undefined' ){
        addNewRow(rowNum);
        await waitUntilActionCompleted();
        
      }

}

function insertProjectCode(rowdata,rowNum){

  if(rowdata.hasOwnProperty("PJ")){// check if the Project Code exist
            
      console.log(rowdata);
      rowdata["PJ"].replace(/ /g,''); // replace the space inside the BU code
      $('#ptifrmtgtframe').contents().find('#PROJECT_CODE\\$'+rowNum).val(rowdata["PJ"]);
            
  }else{
      console.log("Project Code Didn't EXIST!!!")
  }
      
}

function injectInlineScript(injectedCode){

  var injectedCode = '(' + injectedCode + ')();';

  var script = document.createElement('script');
  script.textContent = injectedCode;
  //(document.body || document.head || document.documentElement).appendChild(script);
  document.getElementsByTagName('head')[0].appendChild(script);
  console.log(script);
  script.parentNode.removeChild(script);

}

async function checkIfJqueryExist(){
  return false;
}

async function injectJQueryScript(){
  
  var jq = document.createElement('script');
  // jq.src = "jquery.min.js";
  jq.src = "//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
  document.getElementsByTagName('head')[0].appendChild(jq);
  console.log(jq);
  await sleep(3500);

}

async function waitUntilActionCompleted(){
  await sleep(2000);
  var loading = $('#ptifrmtgtframe').contents().find('#WAIT_win0').css('display');
  console.log(loading);
  if (loading == 'none'){
    return true;
    console.log("action done")

  }else if(loading == 'block'){
    console.log("action not done")
    await sleep(350);
    return waitUntilActionCompleted();
    
  }else{
    console.log("ERROR! system unable to check is the page done loading!");
    return false;
  } 
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 function openActivityMenu(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'ACTIVITY_CODE$prompt$"+rowNum+"');}";


        // await sleep(100);
        injectInlineScript(code);
        console.log("Open Activity Menu for Row "+rowNum);
}

async function selectActivity(rowdata,rowNum){

      openActivityMenu(rowNum);
      await waitUntilActionCompleted();
      var noOfActivity = 1;
      var temp = $('iFrame').contents().find('#PTSRCHRESULTS0 #SEARCH_RESULTLAST').parent().next().text();

      if ( Number(temp) > noOfActivity){
          noOfActivity = [Number]$('iFrame').contents().find('#PTSRCHRESULTS0 #SEARCH_RESULTLAST').parent().next().text();
      }
      var task = rowdata["TASK"];
      // var task = rowdata["TASK"].toLowerCase();
      var taskId = '';

      console.log(noOfActivity,task);
      for (var i = 0; i < noOfActivity; i++) {
        var activityMenuText = $('iFrame').contents().find('#PTSRCHRESULTS0 span#RESULT6\\$'+i).text();
        console.log(activityMenuText);
        if( activityMenuText.toLowerCase().search(task.toLowerCase()) >= 0){
            taskId = $('iFrame').contents().find('#PTSRCHRESULTS0 a[name=RESULT0\\$'+i+']').text();
            console.log(taskId);
            closeActivityMenu;
            await waitUntilActionCompleted();
            $('#ptifrmtgtframe').contents().find('#ACTIVITY_CODE\\$'+rowNum).val(taskId);
            return true;
        }
      }
      console.log("ERROR!!! Activity '"+task+"' for row "+rowNum+" could not be found!!!");
      return false;
}

 function closeActivityMenu(){
        var code = "function(){"+
                              "var tempvalue = $('iFrame').get(0).contentWindow.document.win0;"+
                              "$('iFrame').get(0).contentWindow.doUpdateParent(tempvalue,'\\#ICCancel');}";


        // await sleep(100);
        injectInlineScript(code);
        console.log("Closed Activity Menu");

}


 function addNewRow(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$new$"+rowNum+"$$0');}";


        injectInlineScript(code);
        console.log("Add New Row for Row "+rowNum);
}

 function deleteRow(rowNum){

        var code = "function(){"+
                   "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                   "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$delete$"+rowNum+"$$0');}";


 
        injectInlineScript(code);
        console.log("Deleted Row "+rowNum);
}
// oParentWin.aAction_win0(oParentWin.document.win0,"EX_TIME_DTL$delete$6$$0");closeMsg(this);