async function main(){


if (typeof jQuery !== 'undefined') {  
		console.log("background js running");
		var timesheetData = "";
		await injectJQueryScript();

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

											if(rowdata["BU"].startsWith('*')) {
													insertPersonalHour(rowdata);
													continue;

											}else{
													await insertProjectBU(rowdata,rowNum);
													insertProjectCode(rowdata,rowNum);
													
													// console.log("before Select Activity ",new Date().toLocaleTimeString());
													var success = await selectActivity(rowdata,rowNum,3);
													if(!success){
														continue;
														await sleep(500);
													}
													// await sleep(2000);
													// console.log("after selectActivity", new Date().toLocaleTimeString());
													insertProjectHour(rowdata,rowNum);
													if( checkIfCommentExist(rowdata)){await insertComment(rowdata,rowNum);}
													await sleep(500);
													// console.log("after insertProjectHour" ,new Date().toLocaleTimeString());
													displayInternalProject(rowNum);
													rowNum = rowNum +1 ;

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