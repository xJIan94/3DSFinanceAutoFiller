async function main(){


if (typeof jQuery !== 'undefined') {
		console.log("background js running");
		var timesheetData = "";
		await injectJQueryScript();




		  port.onMessage.addListener(function(msg) {
		      console.log(msg);
		      if (msg.question == "Who's there?")
		        port.postMessage({answer: "Madame"});
		      else if (msg.question == "Madame who?")
		        port.postMessage({answer: "Madame... Bovary"});
		  });

		chrome.storage.local.get('timesheetData',async function (result) {
			timesheetData = result.timesheetData;
			keys = Object.keys(timesheetData);
			console.log(timesheetData);

						// check title EX_ICLIENT_WRK_PAGE_TITLE_60 is Time Report Summary or not
						if( document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#EOTL_SS_HDR_TITLE h1").innerHTML == "Create Time Report" ){
							console.log("start injecting");
							var rowNum =0;
							openPersonalHoursTable();
							await waitUntilActionCompleted();
							for (var key in timesheetData){

									rowdata = timesheetData[key];

									console.log("Start looping , key="+key+", row number "+rowNum);
									// console.log(rowdata);
									if(rowdata.hasOwnProperty('BU')) {
											rowdata["BU"] = String(rowdata["BU"]);
											if(rowdata["BU"].startsWith('*')) {
													insertPersonalHour(rowdata);
													continue;

											}else{
													let tempRowNum = rowNum;
													rowNum = rowNum +1 ;
													await insertProjectBU(rowdata,tempRowNum);
													insertProjectCode(rowdata,tempRowNum);

													if(rowdata.hasOwnProperty("TASK")) {
														var success = await selectActivity(rowdata,tempRowNum,3);
														if(!success){
						                  port.postMessage({ContentFailRow: rowdata});
															break;
															await sleep(500);
														}
													}

													// await sleep(2000);
													// console.log("after selectActivity", new Date().toLocaleTimeString());
													insertProjectHour(rowdata,tempRowNum);
													if( checkIfCommentExist(rowdata)){await insertComment(rowdata,tempRowNum);}
													await sleep(500);
													// console.log("after insertProjectHour" ,new Date().toLocaleTimeString());

													}
										}
								}//done injecting

						}

		});
	} else {
		console.log("jQuery not loaded");
			// jQuery not loaded
}
}

main();
