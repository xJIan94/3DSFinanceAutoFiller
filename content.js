if (typeof jQuery !== 'undefined') {  
	console.log("background js running");
	var timesheetData = "";
	injectJQueryScript();

	chrome.storage.local.get('timesheetData', function (result) {
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
												insertProjectHour(rowdata,rowNum);
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
