document.addEventListener('DOMContentLoaded', function() {


  var openPageButton = document.getElementById('openPage');
  var updatePageButton = document.getElementById('updatePage');
  // var displayBUPJButton = document.getElementById('displayBUPJ');
  var clearErrorButton = document.getElementById('clearError');

  // var toggleOverlay = document.querySelector("input[id=toggle-overlay]");

  function addNewFailedProjectRow(failedProjectRow){
    let failedProjectList = document.querySelector("#failedProjectList");
    let failedProjectItem = document.createElement('li');
    failedProjectItem.classList.add("list-group-item");
    failedProjectItem.appendChild(document.createTextNode(failedProjectRow.PJ+" , "+failedProjectRow.SCP +" : " + failedProjectRow.error));
    failedProjectList.appendChild(failedProjectItem);
  }


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.hasOwnProperty('failedRow'))
        addNewFailedProjectRow(request.failedRow);
  });

  chrome.runtime.sendMessage({popup: "initial"}, function(response) {
    let data = response.background;
    if(data.length > 0){
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        addNewFailedProjectRow(data[i]);
      }
      $('#collapseProjectStatus').collapse();

    }
  });

    chrome.runtime.sendMessage({popup: "overlapStatus"},function(response){
      console.log(response.background_overlay);
      if(!response.background_overlay){
          $('#toggle-overlay').bootstrapToggle('off');
      }
  });

  clearErrorButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({popup: "deleteLOG"});
  }, false);

  $('#toggle-overlay').change(function() {
    if(this.checked){
      chrome.runtime.sendMessage({popup: "startOverlap"});
      console.log("Running");
    }else if(!this.checked){
      chrome.runtime.sendMessage({popup: "stopOverlap"});
    }
  });

  // displayBUPJButton.addEventListener('click', function() {
  //   chrome.tabs.executeScript(null, { file: "handoverDisplay.js" });
  // }, false);

  openPageButton.addEventListener('click', function() {
    var actionurl = "https://dsxfinance.dsone.3ds.com/psp/FSPRD/EMPLOYEE/ERP/s/WEBLIB_TE_NAV.WEBLIB_FUNCTION.FieldFormula.iScript_AddTimeReport?TE.Menu.Var=ADMIN";
    chrome.tabs.create({ url: actionurl})
  }, false);

  updatePageButton.addEventListener('click', function() {
    console.log("updatePageButton click");
    $(this).button('loading');
    var timesheetData = JSON.parse(document.getElementById('timesheet_data').value);

    if(timesheetData.constructor == Array || timesheetData.constructor == Object  || timesheetData.constructor == String){
        console.log("correct Data type");
        console.log(timesheetData);

        // Save it using the Chrome extension storage API.
        chrome.storage.local.set({'timesheetData': timesheetData}, function() {
          // Notify that we saved.
          console.log('Settings saved');
        });
    }




    chrome.tabs.getSelected(null, function(tab) {
      console.log(tab.url.indexOf("dsxfinance"));
        if(tab.url.indexOf("dsxfinance") >=0)
        {

          chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
              chrome.tabs.executeScript(null, { file: "model.js" });
              chrome.tabs.executeScript(null, { file: "content.js" });
          });
          // alert("scirpt js done");
          //swindow.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
          console.log("execute background.js");

        }
    });
  }, false);


}, false);
