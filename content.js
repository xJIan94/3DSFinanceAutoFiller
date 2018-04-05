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
						if($('#ptifrmtgtframe').contents().find('#win0divEX_ICLIENT_WRK_PAGE_TITLE_60 span').text() == "Time Report Summary" ){
							console.log("start injecting");
							var rowNum =0;

							for (var key in timesheetData){

									rowdata = timesheetData[key];

									console.log("Start looping , key="+key+", row number "+rowNum);
									// console.log(rowdata);
									if(rowdata.hasOwnProperty('BU')) { 

											if(rowdata["BU"].startsWith('*')) {
													insertPersonalHour(rowdata);
													continue;

											}else{
													insertProjectBU(rowdata,rowNum);
													insertProjectCode(rowdata,rowNum);
													// console.log("before Select Activity ",new Date().toLocaleTimeString());
													// await selectActivity(rowdata,rowNum);
													// await sleep(2000);
													// console.log("after selectActivity", new Date().toLocaleTimeString());
													insertProjectHour(rowdata,rowNum);
													// await sleep(2000);
													// console.log("after insertProjectHour" ,new Date().toLocaleTimeString());
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