document.addEventListener('DOMContentLoaded', function() {

	var errorRow = [];
	chrome.runtime.onConnect.addListener(function(port) {
	  console.log("Connected .....");
	  port.onMessage.addListener(function(msg) {
	  	console.log(msg);
	    if (msg.joke == "Knock knock")
	      port.postMessage({question: "Who's there?"});
	    else if (msg.answer == "Madame")
	      port.postMessage({question: "Madame who?"});
	    else if (msg.answer == "Madame... Bovary")
	      port.postMessage({question: "I don't get it."});
	  	// content
	  	else if (msg.content == "Testing")
	      port.postMessage({reply: "It works"});
	  	else if (msg.hasOwnProperty('ContentFailRow'))
	      errorRow.push(msg.ContentFailRow);
				chrome.runtime.sendMessage({failedRow: msg.ContentFailRow}, function(response) {
			    console.log(response.background);
			  });


	  });
	});


	chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.popup == "initial")
      sendResponse({background: errorRow});
  });

/*
	function initialPopupUI(){

	}*/



}, false);
