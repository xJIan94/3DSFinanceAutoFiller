var port = chrome.runtime.connect({name: "content"});


function insertPersonalHour(rowdata) {
    var type = {"Admin":'1',"Training":'5',"Sick":'11',"Leave":'9'};
    // var rowdata = timesheetData[keyNumber];
    tempBU = rowdata["BU"].toLowerCase();
    console.log(rowdata);
    if(tempBU.search('admin') > 0){
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
            console.log(key, rowdata[key]);
            if(day.hasOwnProperty(key)){
                $('#ptifrmtgtframe').contents().find('#POL_TIME'+day[key]+'\\$'+type).val(rowdata[key]);
            }

        }
      }
}

async function insertProjectHour(rowdata,rowNum){
      // await sleep(500);
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

      console.log("inserting BU -->"+ rowdata['BU'] );
      rowdata["BU"] = rowdata["BU"].replace(/ /g,''); // replace the space inside the BU code
      await checkIfNextRowExist(rowNum);
      $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val(rowdata["BU"]);

}

async function checkIfNextRowExist(rowNum){
      if( typeof $('#ptifrmtgtframe').contents().find('#BUSINESS_UNIT_CODE\\$'+rowNum).val() == 'undefined' ){
        addNewRow(rowNum-1);
        await waitUntilActionCompleted();
        await sleep(100);

      }

}

function insertProjectCode(rowdata,rowNum){

  if(rowdata.hasOwnProperty("PJ")){// check if the Project Code exist

      // console.log(rowdata);
      rowdata["PJ"] = rowdata["PJ"].replace(/ /g,''); // replace the space inside the BU code
      console.log(rowdata);
      $('#ptifrmtgtframe').contents().find('#PROJECT_CODE\\$'+rowNum).val(rowdata["PJ"]).trigger("change");

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

/*async function waitUntilActionCompleted(){
  await sleep(1200);
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
*/
async function waitUntilActionCompleted(){
  await sleep(1200);
  var loading = $('#ptifrmtgtframe').contents().find('#WAIT_win0').css('display');
  console.log(loading);
  if (loading == 'none'){
    await sleep(500);
    return true;
    console.log("action done")

  }else if(loading == 'block'){
    console.log("action not done")
    await sleep(100);
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


 function openActivityMenu(rowNum){

        $('#ptifrmtgtframe').contents().find('#win0divACTIVITY_CODE\\$'+rowNum+' a')[0].click();
        console.log("Open Activity Menu for Row "+rowNum);
}



function searchForTaskID(noOfActivity,task){

      var taskId = '';
      task = task.toString().replace(/[^\w\s]/gi, '');// only allow number and word.

      console.log(noOfActivity,task);
      for (let i = 0; i < noOfActivity; i++) {
        var activityMenuText = $('iFrame').contents().find('#PTSRCHRESULTS0 span#RESULT6\\$'+i).text();

        activityMenuText = activityMenuText.replace(/[^\w\s]/gi, '');// only allow number and word.
        console.log(activityMenuText);
        if( activityMenuText.toLowerCase().search(task.toLowerCase()) >= 0){
            taskId = $('iFrame').contents().find('#PTSRCHRESULTS0  #RESULT6\\$'+i).parent().prev().prev().prev().text();
            console.log(taskId)
            taskId = taskId.replace(/\n/g,'');
            console.log(taskId)
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
          // await sleep(300000);
          // window.exit();
      }else{
          console.log("Before insertActivity",new Date().toLocaleTimeString());
          // insertActivity(taskId,rowNum);

          $('#ptifrmtgtframe').contents().find('#ACTIVITY_CODE\\$'+rowNum).val(taskId);
      }
}

async function selectActivity(rowdata,rowNum,numOfTryAllowed){
      openActivityMenu(rowNum);
      await waitUntilActionCompleted();
      if(numOfTryAllowed >0){
          if( checkIfActivityMenuGetOpen() ){
              var noOfActivity = getActivityAmount();
              var task = rowdata["TASK"];
              taskId = searchForTaskID(noOfActivity,task);
              closeActivityMenu();
              await waitUntilActionCompleted();
              tryToInputTask(task,taskId,rowNum);

              return true;
          }else if(checkIfErrorMenuOpen()){
              closeErrorMenu();
              await selectActivity(rowdata,rowNum,numOfTryAllowed-1);
              if(numOfTryAllowed == 1){
                  deleteRow(rowNum);
                  console.log("Warning!! The following row cannot be inserted!");
                  await waitUntilActionCompleted();
                  numOfTryAllowed =0;
                 return false;
              }
          }
      }
      return false;

}

function checkIfCommentExist(rowdata){
    if(rowdata.hasOwnProperty('SCP')){
        return true;
    }else{
      return false;
    }
}

async function insertComment(rowdata,rowNum){
    openCommentPage(rowNum);
    await waitUntilActionCompleted();
    comment = rowdata["SCP"];
    // await sleep(700);
    addComment(comment,rowNum);
    // await sleep(1000);
    submitComment(rowNum);
    await waitUntilActionCompleted();
    // await sleep(750);
}

function returnMenuTitle(){
    var queryResult = '';
    queryResult = $('.PSMODALHEADER span').text();
    return queryResult;

}

function checkIfActivityMenuGetOpen(){
    var queryResult = returnMenuTitle();
    if ( queryResult == 'Look Up Activity'){
      return true;
    }else{
      return false;
    }

}



function checkIfErrorMenuOpen(){
    var queryResult = returnMenuTitle();
    if ( queryResult == ' Message ' || queryResult == 'Message'){
      return true;
    }else{
      return false;
    }
}

function closeErrorMenu(){
    $('#okbutton input').trigger('click');
    console.log("Closed Error Menu");
}

function closeActivityMenu(){

       $('iFrame').contents().find('#win0divSEARCHBELOW input.PSPUSHBUTTONTBCANCEL')[0].click();
        console.log("Closed Activity Menu");

}


 function addNewRow(rowNum){

        $('#ptifrmtgtframe').contents().find('a#EX_TIME_DTL\\$new\\$'+rowNum +'\\$\\$0')[0].click();
        console.log("Add New Row for Row "+rowNum);
}

 function deleteRow(rowNum){

        var code = "function(){"+
                   "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                   "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$delete$"+ rowNum +"$$0');}";

        injectInlineScript(code);
        console.log("Deleted Row "+rowNum);
}


function openCommentPage(rowNum){
      $('#ptifrmtgtframe').contents().find('#win0divDSX_TM_COMM_WK_DSX_COMMENT_IMG\\$'+rowNum+' a')[0].click();
      console.log("Click Comment for row "+rowNum);
}

function submitComment(){
      $('iFrame').contents().find('#win0divPSTOOLBAR input.PSPUSHBUTTONTBOK')[0].click();
      console.log("Submit Comment");
}

/*function submitComment(){
    var code = "function(){"+
                   "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                   "$('#ptifrmtgtframe').get(0).contentWindow.submitAction_win0(tempvalue,'#ICSave');}";
    injectInlineScript(code);
    console.log("Submit Comment");
}*/

/*function addComment(comment, rowNum){

    var code = "function(){"+
                   // "$('#ptifrmtgtframe').contents().find('#win0divDSX_EX_TIME_COMMENT1\\\$0').find('textarea').val('" + comment +"').change();}" ;
                   "$('#ptifrmtgtframe').contents().find('textarea').val('" + comment +"').change();}" ;
    injectInlineScript(code);
    console.log("Adding comment : "+ comment + "for row number : "+ rowNum);
}*/

function addComment(comment, rowNum){
      document.querySelectorAll("iFrame[id*='ptModFrame']")[0].contentWindow.document.querySelector("textarea").innerHTML = comment;
      console.log("Adding comment : "+ comment + "for row number : "+ rowNum);

}

function openPersonalHoursTable(){
  try{
    var check = document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#win0divPOL_DESCR\\$1 span").innerHTML;

  }
  catch(err){
    console.log("The Personal Hour table is not open");
    document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#EX_TRC_MAP_VW\\$expand\\$0").click();
  }

}



function displayInternalProject(rowNum){

    var activityTitle =  document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector('#win0divDESCR_LBL\\$'+rowNum+' a img').alt;
    document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector('#win0divDESCR_LBL\\$'+rowNum).innerHTML += activityTitle;
}

function clickUpdateTotalButton(){

    document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#PB_UPDATE_2").click();
}

function getTotalHours(){

    clickUpdateTotalButton();
    let totalHour = document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#win0divEX_TIME_HDR_WRK_GRAND_TOTAL span").innerHTML;
    return totalHour;

}

function getTotalHourPerRow(rowNum){
    let rowHour = document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#EX_TM_DT_DLY_WK_TOTAL\\$" + rowNum).innerHTML
    return rowHour;
}
