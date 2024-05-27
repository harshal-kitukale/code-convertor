document.addEventListener("DOMContentLoaded", () => {
  const codeInput = document.getElementById("codeInput");
  const languageSelect = document.getElementById("languageSelect");
  const convertBtn = document.getElementById("convertBtn");
  const debugBtn = document.getElementById("debugBtn");
  const qualityCheckBtn = document.getElementById("qualityCheckBtn");
  const responseDiv = document.getElementById("response");

  // const BASE_URL = 'https://code-converter-api-yfl2.onrender.com';
  const BASE_URL = "http://localhost:8080";
  // https://backend-hkw5.onrender.com/

  const handleButtonClick = async (endpoint) => {
    const code = codeInput.value.trim();
    const language = languageSelect.value;
    if (!code) {
      alert("Please enter your code.");
      return;
    }
    responseDiv.style.height = "200px";
    responseDiv.innerHTML = "Loading...";

    // console.log("object", endpoint, code, language);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, toLanguage: language }),
      });

      const data = await response.json();
      console.log(data.status);
      if(data?.status==500){
        return responseDiv.innerHTML = data.error;
      }
      const editedData = data?.codeData
        ?.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/```([^```]*?)```/gs, "<pre><code>$1</code></pre>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/^\* (.*)$/gm, "<li>$1</li>");
      responseDiv.style.height = "auto";
      let copyButton = document.createElement("button");
      copyButton.innerText = "Copy Code";
      copyButton.setAttribute("onclick", "copyToClipboard()");
      copyButton.className = "copy-button";
      // <button class="copy-button" onclick="myFunction()">Copy text</button>
      responseDiv.innerHTML = editedData;
      responseDiv.appendChild(copyButton);
    } catch (error) {
      responseDiv.innerHTML = "something wrong";
    }
  };

  convertBtn.addEventListener("click", () => handleButtonClick("/convert"));
  debugBtn.addEventListener("click", () => handleButtonClick("/debug"));
  qualityCheckBtn.addEventListener("click", () => handleButtonClick("/check"));
});

function copyToClipboard() {
  // Get the text content from the div
  const textToCopy = document.getElementsByTagName("pre")[0].innerText;

  // Use the Clipboard API to write text to the clipboard
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log(textToCopy);
      // alert('Text copied to clipboard');
      const copyButton = document.querySelector(".copy-button");
      copyButton.innerHTML = "Copied...";
      setTimeout(() => {
        copyButton.innerHTML = "Copy Code";
      }, 1000);
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
}
