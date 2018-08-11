document.addEventListener('DOMContentLoaded', function() {

  // State
  var scriptRunningState = false;
  var scriptDoneRunning = false;
  var errorRow = [];
  var InsertStatus = [];
  var overlay = true;

  // between content and backgrund
  chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
      if (msg.content == "Testing"){
				port.postMessage({
					reply: "It works"
				});
			}
      else if (msg.hasOwnProperty('ContentFailRow')) {
        errorRow.push(msg.ContentFailRow);
        chrome.runtime.sendMessage({
          failedRow: msg.ContentFailRow
        }, function(response) {
          console.log("Background- send error", response.background);
        });
      }
      else if (msg.hasOwnProperty('InsertResult')) {
        InsertStatus.push(msg.InsertResult);
        chrome.runtime.sendMessage({
          InsertStatus: msg.InsertResult
        }, function(response) {
          console.log("Background- send InsertStatus", response.background);
        });
      }

    });
  });

  // between background and popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a popup script:" + sender.tab.url :
        "to the background");
      if (request.popup == "initial") {
        console.log("Background - initial popup", errorRow);
        sendResponse({
          background: errorRow
        });
        overlapDisplay();
      } else if (request.popup == "deleteLOG") {
        errorRow = [];
      } else if (request.popup == "startOverlap") {
        overlay = true;
        overlapDisplay();
        console.log("OverlapTriggered", overlay);
      } else if (request.popup == "stopOverlap") {
        overlay = false;
      } else if (request.popup == "overlapStatus") {
        sendResponse({
          background_overlay: overlay
        });
      }
    });

  function overlapDisplay() {
    if (overlay) {
      chrome.tabs.executeScript(null, {
        file: "handoverDisplay.js"
      });
      console.log("overlapDisplay running");
      setTimeout(overlapDisplay, 3000);
    }
  }


}, false);
