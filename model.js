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
      var day = { "Mon":'1', "Tue":'2' , "Wed":'3', "Thu":'4', "Fri":'5', "Sat":'6', "Sun":'7' };

      var rowdata = timesheetData[keyNumber];
      console.log(rowdata);
      for (var key in rowdata){
        if(rowdata.hasOwnProperty(key)){// check if the key exist
            //console.log(key, rowdata[key]);
            if(day.hasOwnProperty(key)){
                $('#ptifrmtgtframe').contents().find('#POL_TIME'+day[key]+'\\$'+type).val(rowdata[key]);
            }
            
        }
      }

     /* if(typeof timesheetData[keyNumber].Mon !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME1\\$'+type).val(timesheetData[keyNumber].Mon); }
      if(typeof timesheetData[keyNumber].Tue !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME2\\$'+type).val(timesheetData[keyNumber].Tue); }
      if(typeof timesheetData[keyNumber].Wed !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME3\\$'+type).val(timesheetData[keyNumber].Wed); }
      if(typeof timesheetData[keyNumber].Thu !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME4\\$'+type).val(timesheetData[keyNumber].Thu); }
      if(typeof timesheetData[keyNumber].Fri !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME5\\$'+type).val(timesheetData[keyNumber].Fri); }
      if(typeof timesheetData[keyNumber].Sat !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME6\\$'+type).val(timesheetData[keyNumber].Sat); }
      if(typeof timesheetData[keyNumber].Sun !== 'undefined') { $('#ptifrmtgtframe').contents().find('#POL_TIME7\\$'+type).val(timesheetData[keyNumber].Sun); }*/
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

function injectJQueryScript(){

  
  var jq = document.createElement('script');
  jq.src = "//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
  document.getElementsByTagName('head')[0].appendChild(jq);
  console.log(jq);

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function openActivityMenu(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'ACTIVITY_CODE$prompt$"+rowNum+"');}";


        await sleep(2500);
        injectInlineScript(code);
}

async function addNewRow(rowNum){

        var code = "function(){"+
                              "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                              "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$new$"+rowNum+"$$0');}";


        await sleep(1000);
        injectInlineScript(code);
}

async function deleteRow(rowNum){

        var code = "function(){"+
                   "var tempvalue = $('#ptifrmtgtframe').get(0).contentWindow.document.win0;"+
                   "$('#ptifrmtgtframe').get(0).contentWindow.pAction_win0(tempvalue,'EX_TIME_DTL$delete$"+rowNum+"$$0');}";


        await sleep(1000);
        injectInlineScript(code);
}
// oParentWin.aAction_win0(oParentWin.document.win0,"EX_TIME_DTL$delete$6$$0");closeMsg(this);