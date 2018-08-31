async function main() {


  if (typeof jQuery !== 'undefined') {
    console.log("background js running");
    var timesheetData = "";
    var insertResult = "Success";
    await injectJQueryScript();


    chrome.storage.local.get('timesheetData', async function(result) {
      timesheetData = result.timesheetData;
      keys = Object.keys(timesheetData);
      console.log(timesheetData);

      try{
        // check title EX_ICLIENT_WRK_PAGE_TITLE_60 is Time Report Summary or not
        if (document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#EOTL_SS_HDR_TITLE h1").innerHTML.indexOf("Time Report") >= 0 ) {
          console.log("start injecting");
          var rowNum = 0;
          openPersonalHoursTable();
          await waitUntilActionCompleted();
          for (var key in timesheetData) {

            rowdata = timesheetData[key];

            console.log(">> Looping : key=" + key + ", row number " + rowNum);
            console.log('rowdata =',rowdata);
            // console.log(rowdata);
            if (rowdata.hasOwnProperty('BU')) {
              rowdata["BU"] = String(rowdata["BU"]);
              if (rowdata["BU"].startsWith('*')) {
                console.log('#Step : insert Personal Hour');
                insertPersonalHour(rowdata);
                continue;

              } else {
                let tempRowNum = rowNum;
                rowNum = rowNum + 1;
                console.log('#Step-1: insert Project BU');
                await insertProjectBU(rowdata, tempRowNum);
                console.log('#Step-2: insert Project Code');
                insertProjectCode(rowdata, tempRowNum);

                console.log('#Step-3: select Activity');
                //if (rowdata.hasOwnProperty("TASK")) {
                  var success = await selectActivity(rowdata, tempRowNum, 3);
                  if (!success) {
                    rowdata.error = "Missing/ Invalid Project Code";
                    port.postMessage({
                      ContentFailRow: rowdata
                    });
                    rowNum = rowNum - 1;
                    continue;
                    await sleep(500);
                  }
                //}

                // await sleep(2000);
                // console.log("after selectActivity", new Date().toLocaleTimeString());
                console.log('#Step-4: insert Project Hour');
                insertProjectHour(rowdata, tempRowNum);
                if (checkIfCommentExist(rowdata)) {
                  console.log('#Step-5: insert Comment');
                  await insertComment(rowdata, tempRowNum);
                }
                await sleep(500);
                // console.log("after insertProjectHour" ,new Date().toLocaleTimeString());

              }
            }
          } //done injecting

        }else{
          throw "Error : Page title doesn't contain 'Time Report'. Kindly load the correct page.";
        }
      }
      catch(e){
        // error occured
        console.log("Error occured :", e);
        insertResult = "Failed";
      }
      finally{
        // everything completed
        console.log("InsertStatus :", insertResult);
        port.postMessage({
          InsertResult: insertResult
        });

      }
      
    });

  } else {
    console.log("jQuery not loaded");
    // jQuery not loaded
  }
}

main();
