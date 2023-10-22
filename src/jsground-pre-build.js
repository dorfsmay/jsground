var jsgroundInitialValues = {};

function deleteOldScript(funcId) {
  let theScript;
  theScript = document.getElementById(funcId);
  if (theScript) {
    theScript.parentNode.removeChild(theScript);
  }
}

function jsgroundLoad(textId, functionName) {
  // functionName will be both the name of the function and the id of its script.
  deleteOldScript(functionName);
  const theCode = document.getElementById(textId);
  const theScript = document.createElement("script");
  theScript.id = functionName;
  theScript.text =
    "function " + functionName + '(){"use strict"; ' + theCode.value + "}";
  document.body.appendChild(theScript);
}

async function copyToClipboard(textId) {
  text = document.getElementById(textId);
  try {
    await navigator.clipboard.writeText(text.value);
  } catch (e) {
    console.error("Error when trying to copy to clipboard: ", e);
  }
}

function resetFunc(uid, textId) {
  document.getElementById(textId).value = jsgroundInitialValues[uid];
}

function addJsGround(uid, ground) {
  const textId = "jsgroundText" + uid;
  ground.classList.remove("jsground");
  ground.classList.add("jsgrounded");

  ground.innerHTML = html;
  text = ground.getElementsByTagName("textarea")[0];
  text.id = textId;
  text.value = jsgroundInitialValues[uid];

  [runButton, clearButton, resetButton, copyButton] =
    ground.getElementsByTagName("button");

  const runFunctionName = "jsgroundRun" + uid;
  runString =
    'jsgroundLoad("' +
    textId +
    '", "' +
    runFunctionName +
    '") ; ' +
    runFunctionName +
    "();";
  runButton.setAttribute("onclick", runString);

  clearButton.setAttribute(
    "onclick",
    `{e = document.getElementById("${textId}") ; e.value = "" ; e.focus()}`,
  );

  resetButton.setAttribute("onclick", `resetFunc("${uid}", "${textId}")`);

  copyButton.setAttribute("onclick", `copyToClipboard("${textId}")`);
}

function populateJsGround() {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);

  let counter = 0;
  const jsGrounds = [...document.getElementsByClassName("jsground")];
  for (let ground of jsGrounds) {
    uid = counter.toString().padStart(4, "0");
    jsgroundInitialValues[uid] = ground.innerText;
    counter++;
    addJsGround(uid, ground);
  }
}

populateJsGround();
