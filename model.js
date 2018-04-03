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

function insertProjectBU(rowdata,rowNum){
    

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
  await sleep(2500);

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function openActivityMenu(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'ACTIVITY_CODE$prompt$"+rowNum+"');}";


        await sleep(1000);
        injectInlineScript(code);
        console.log("Open Activity Menu for Row "+rowNum);
}

async function addNewRow(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$new$"+rowNum+"$$0');}";


        await sleep(1000);
        injectInlineScript(code);
        console.log("Add New Row for Row "+rowNum);
}

async function deleteRow(rowNum){

        var code = "function(){"+
                   "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                   "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$delete$"+rowNum+"$$0');}";


        await sleep(1000);
        injectInlineScript(code);
        console.log("Deleted Row "+rowNum);
}
// oParentWin.aAction_win0(oParentWin.document.win0,"EX_TIME_DTL$delete$6$$0");closeMsg(this);