
// scriptName is used both as the id for the script and the name of
// the function.
const scriptName = "jsGroundScript";

function deleteScript() {
  // Looping in case a bug introduced multiple one on the page
  while (true) {
    const script = document.getElementById(scriptName);
    if (!script) break;
    script.parentNode.removeChild(script);
  }
}


function getTextarea(element) {
  // This assumes the hierarchie:
  // button 🡒 jsground-topbar-right 🡒 jsground-topbar 🡒 jsground-container
  // If it changes, this is going to need to be adjusted.
  return element.parentNode.parentNode.parentNode.getElementsByTagName(
    "textarea",
  )[0];
}
function getTextareaChildText(childType, element) {
  const textArea = getTextarea(element);
  const children = textArea.getElementsByTagName("script");
  for (let child of children) {
    if (child.getAttribute("data-type") === childType) {
      // There should be only one
      return child.innerText;
    }
  }
  return undefined;
}
const getScript = (element) => getTextareaChildText("script", element);
const getInitialValue = (element) =>
  getTextareaChildText("initialValue", element);

function jsgroundLoad(runButton) {
  deleteScript();
  const textArea = getTextarea(runButton);
  const script = document.createElement("script");
  script.id = scriptName;
  // For future pupose (undo, calling without function name)
  // script.setAttribute("data-type", "script");
  script.text =
    "function " + scriptName + '(){"use strict"; ' + textArea.value + "}";
  textArea.appendChild(script);
}

async function jsgroundCopyToClipboard(copyButton) {
  const textArea = getTextarea(copyButton);
  try {
    await navigator.clipboard.writeText(textArea.value);
  } catch (e) {
    console.error("Error when trying to copy to clipboard: ", e);
  }
}

function jsgroundReset(resetButton) {
  const textArea = getTextarea(resetButton);
  const initialValue = getInitialValue(resetButton);
  textArea.value = initialValue;
}

function jsgroundClear(clearButton) {
  const textArea = getTextarea(clearButton);
  textArea.value = "";
}

function addJsGround(ground) {
  const initialValue = ground.innerText;
  const textId = "jsgroundText";
  ground.classList.remove("jsground");
  ground.classList.add("jsgrounded");

  ground.innerHTML = html;
  textArea = ground.getElementsByTagName("textarea")[0];
  textArea.id = textId;
  textArea.value = initialValue;

  const data = document.createElement("script");
  data.setAttribute("type", "application/json");
  data.setAttribute("data-type", "initialValue");
  data.text = initialValue;
  textArea.appendChild(data);

  [runButton, clearButton, resetButton, copyButton] =
    ground.getElementsByTagName("button");

  runButton.setAttribute("onclick", `jsgroundLoad(this) ; ${scriptName}()`);

  clearButton.setAttribute("onclick", "jsgroundClear(this)");
  resetButton.setAttribute("onclick", "jsgroundReset(this)");
  copyButton.setAttribute("onclick", "jsgroundCopyToClipboard(this)");
}

function populateJsGround() {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);

  let counter = 0;
  const jsGrounds = [...document.getElementsByClassName("jsground")];
  for (let ground of jsGrounds) {
    addJsGround(ground);
  }
}

populateJsGround();
