function displayActivity() {

  var activityTitle = document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelectorAll('img[name^=DESCR_LBL]');
  for (i = 0; i < activityTitle.length; i++) {
    activityTitle[i].parentElement.parentElement.innerHTML = activityTitle[i].title;

  }
}

function displayPJ() {

  var pj = document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelectorAll('img[name^=DESCR_LABEL]');
  for (i = 0; i < pj.length; i++) {
    pj[i].parentElement.parentElement.innerHTML = pj[i].title;
  }
}

if (document.querySelectorAll("#ptifrmtgtframe")[0].contentWindow.document.querySelector("#EOTL_SS_HDR_TITLE h1").innerHTML.indexOf("Time Report") > 0) {

  displayPJ();
  displayActivity();
}
