document.addEventListener('DOMContentLoaded', function() {


  var openPageButton = document.getElementById('openPage');
  var updatePageButton = document.getElementById('updatePage');
  var clearErrorButton = document.getElementById('clearError');

  function addNewFailedProjectRow(failedProjectRow) {
    let failedProjectList = document.querySelector("#failedProjectList");
    let failedProjectItem = document.createElement('li');
    failedProjectItem.classList.add("list-group-item");
    failedProjectItem.appendChild(document.createTextNode(failedProjectRow.PJ + " , " + failedProjectRow.SCP + " : " + failedProjectRow.error));
    failedProjectList.appendChild(failedProjectItem);
  }

  function updateStatus(status){
    $('#status_msg').text(status);
    console.log(status, $('#status_msg'))
    if(status == "Success"){
      $('#status_alert').addClass('alert-success');
    }
    else if(status == "Failed"){
      $('#status_alert').addClass('alert-danger');
    }
    $('#status_alert').removeClass('hidden');
    $(updatePageButton).button('reset');
  }

  function ClearLog(){
    $('#status_alert').addClass('hidden');
    failedProjectList.innerHTML = "";
    chrome.runtime.sendMessage({
      popup: "deleteLOG"
    });
    console.log('Log cleared!');
  }

  $('#status_alert button.close').on('click', function(){
    $('#status_alert').addClass('hidden');
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
      if (request.hasOwnProperty('failedRow')){
        addNewFailedProjectRow(request.failedRow);
      }
      else if (request.hasOwnProperty('InsertStatus')){
        updateStatus(request.InsertStatus);
      }
    });

  chrome.runtime.sendMessage({
    popup: "initial"
  }, function(response) {
    let data = response.background;
    if (data.length > 0) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        addNewFailedProjectRow(data[i]);
      }
      $('#collapseProjectStatus').collapse();

    }
  });

  chrome.runtime.sendMessage({
    popup: "overlapStatus"
  }, function(response) {
    console.log(response.background_overlay);
    if (!response.background_overlay) {
      $('#toggle-overlay').bootstrapToggle('off');
    }
  });

  clearErrorButton.addEventListener('click', function() {
    ClearLog();
  }, false);

  $('#toggle-overlay').change(function() {
    if (this.checked) {
      chrome.runtime.sendMessage({
        popup: "startOverlap"
      });
      console.log("Running");
    } else if (!this.checked) {
      chrome.runtime.sendMessage({
        popup: "stopOverlap"
      });
    }
  });

  openPageButton.addEventListener('click', function() {
    var actionurl = "https://dsxfinance.dsone.3ds.com/psp/FSPRD/EMPLOYEE/ERP/s/WEBLIB_TE_NAV.WEBLIB_FUNCTION.FieldFormula.iScript_AddTimeReport?TE.Menu.Var=ADMIN";
    chrome.tabs.create({
      url: actionurl
    })
  }, false);

  updatePageButton.addEventListener('click', function() {
    console.log("updatePageButton click");
    var jsondata = document.getElementById('timesheet_data').value;

    // check if JSON input provided
    if(jsondata.length > 0){
      var timesheetData = JSON.parse(jsondata);

      // check for valid JSON data
      if (timesheetData.constructor == Array || timesheetData.constructor == Object || timesheetData.constructor == String) {
        console.log("correct Data type");
        console.log(timesheetData);

        // Save it using the Chrome extension storage API.
        chrome.storage.local.set({
          'timesheetData': timesheetData
        }, function() {
          // Notify that we saved.
          console.log('Settings saved');
        });
        $("#insert-data-form").removeClass("has-error");
        $("#insert-data-form").addClass("has-success");
        $(this).button('loading');
        ClearLog();

        // start : injection and execution
        chrome.tabs.getSelected(null, function(tab) {
          console.log(tab.url.indexOf("dsxfinance"));
          if (tab.url.indexOf("dsxfinance") >= 0) {

            chrome.tabs.executeScript(null, {
              file: "jquery.min.js"
            }, function() {
              chrome.tabs.executeScript(null, {
                file: "model.js"
              });
              chrome.tabs.executeScript(null, {
                file: "content.js"
              });
            });
            // alert("scirpt js done");
            //swindow.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
            console.log("execute content.js");
          }
        });
      }else{
        $("#insert-data-form").removeClass("has-success");
        $("#insert-data-form").addClass("has-error");
      }
    }else{
      $("#insert-data-form").removeClass("has-success");
      $("#insert-data-form").addClass("has-error");
    }
  }, false);


}, false);
