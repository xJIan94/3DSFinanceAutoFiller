document.addEventListener('DOMContentLoaded', function() {
  var openPageButton = document.getElementById('openPage');
  var updatePageButton = document.getElementById('updatePage');

  // chrome.tabs.onActivated.addListener(function(tab,win){
  //   alert(tab.url);
  //   if(tab.url.indexOf("dsxfinance") >=0 )
  //     {
  //       alert(tab.url);
  //       document.getElementById("updatePage").disabled = false;
  //     }
  //   else{

  //       document.getElementById("updatePage").disabled = true;
  //   }

  // });

  // chrome.tabs.onUpdated.addListener(function(tab){
  //   if(tab.url.indexOf("dsxfinance") >=0 )
  //     {
  //       alert(tab.url);
  //       document.getElementById("updatePage").disabled = false;
  //     }
  //   else{

  //       document.getElementById("updatePage").disabled = true;
  //   }

  // });
  

  openPageButton.addEventListener('click', function() {
    var actionurl = "https://dsxfinance.dsone.3ds.com/psp/FSPRD/EMPLOYEE/ERP/s/WEBLIB_TE_NAV.WEBLIB_FUNCTION.FieldFormula.iScript_AddTimeReport?TE.Menu.Var=ADMIN";
    chrome.tabs.create({ url: actionurl})
  }, false);

  updatePageButton.addEventListener('click', function() {
    console.log("updatePageButton click");


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

