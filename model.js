function insertPersonalHour(rowdata) {
    var type = {"Admin":'1',"Training":'5',"Sick":'11',"Leave":'9'};
    // var rowdata = timesheetData[keyNumber];
    tempBU = rowdata["BU"].toLowerCase();
    console.log(rowdata);
    if(tempBU.search('adminstration') > 0){
        insertPersonalHourRow(rowdata,type["Admin"]);
    }else if (tempBU.search('training received') > 0) {
        insertPersonalHourRow(rowdata,type["Training"]);
    }else if (tempBU.search('paid vacation') > 0) {
        insertPersonalHourRow(rowdata,type["Leave"]);
    }else if (tempBU.search('sick leave') > 0) {
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

async function insertProjectHour(rowdata,rowNum){
      await sleep(1500);
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
      rowdata["BU"] = rowdata["BU"].replace(/ /g,''); // replace the space inside the BU code
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
      rowdata["PJ"] = rowdata["PJ"].replace(/ /g,''); // replace the space inside the BU code
      console.log(rowdata);
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
  await sleep(4500);

}

async function waitUntilActionCompleted(){
  await sleep(2500);
  var loading = $('#ptifrmtgtframe').contents().find('#WAIT_win0').css('display');
  console.log(loading);
  if (loading == 'none'){
    return true;
    console.log("action done")

  }else if(loading == 'block'){
    console.log("action not done")
    await sleep(300);
    return waitUntilActionCompleted();
    
  }else{
    console.log("ERROR! system unable to check is the page done loading!");
    return false;
  } 
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------------------------------Activity-----------------------------------

/* function openActivityMenu(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'ACTIVITY_CODE$prompt$"+rowNum+"');}";


        // await sleep(100);
        injectInlineScript(code);
        console.log("Open Activity Menu for Row "+rowNum);
}*/


 function openActivityMenu(rowNum){

        $('#ptifrmtgtframe').contents().find('#win0divACTIVITY_CODE\\$'+rowNum+' a')[0].click();
        console.log("Open Activity Menu for Row "+rowNum);
}


function searchForTaskID(noOfActivity,task){

      var taskId = '';

      console.log(noOfActivity,task);
      for (let i = 0; i < noOfActivity; i++) {
        var activityMenuText = $('iFrame').contents().find('#PTSRCHRESULTS0 span#RESULT6\\$'+i).text();
        console.log(activityMenuText);
        if( activityMenuText.toLowerCase().search(task.toLowerCase()) >= 0){
            taskId = $('iFrame').contents().find('#PTSRCHRESULTS0  #RESULT6\\$'+i).parent().prev().prev().prev().text();
            return taskId;
        }
      }
      return '';
}

function getActivityAmount(){

      var temp = $('iFrame').contents().find('#PTSRCHRESULTS0 #SEARCH_RESULTLAST').parent().next().text();
      if ( Number(temp) > 1){
          return Number(temp);
      }else{
          return 1;
      }
}

async function tryToInputTask(task,taskId,rowNum){
      if (taskId == ''){

          console.log("ERROR!!! Activity '"+task+"' for row "+rowNum+" could not be found!!!");
          window.exit();
      }else{
          console.log("Before insertActivity",new Date().toLocaleTimeString());
          // insertActivity(taskId,rowNum);
          closeActivityMenu();
          await waitUntilActionCompleted();
          $('#ptifrmtgtframe').contents().find('#ACTIVITY_CODE\\$'+rowNum).val(taskId);
      }
}

async function selectActivity(rowdata,rowNum){

      openActivityMenu(rowNum);
      await waitUntilActionCompleted();
      var noOfActivity = getActivityAmount();
      var task = rowdata["TASK"];
      taskId = searchForTaskID(noOfActivity,task);
      
      tryToInputTask(task,taskId,rowNum);

      return false;
}



/*function insertActivity(taskId,rowNum){
    
    console.log(taskId);
    
    
    
    await sleep(5000);
}
*/

function closeActivityMenu(){
  
       $('iFrame').contents().find('#win0divSEARCHBELOW input.PSPUSHBUTTONTBCANCEL')[0].click();
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
