window.onload = function () {
	var startButton = document.getElementById("startButtonLink");
	startButton.onclick = startProcess;
};

var startProcess = function () {
	var paragraphs = getParagraphArray();
	initialiseRecordingInterface();

	showRenderView();
};

var initialiseRecordingInterface = function () {

};

var showRenderView = function () {
	var enterText = document.getElementById("enterText");
	enterText.style.display = "none";

	var renderText = document.getElementById("renderText");
	renderText.style.display = "block";
};

var getParagraphArray = function () {
	var textarea = document.getElementById("enterField");
	var delimiterInput = document.getElementById("paragraphDelimiterInput");
	
	var contents = textarea.value;
	var delimiter = (delimiterInput.value === "")?
						"\n\n":
						delimiterInput.value;
	return contents.split(new RegExp(delimiter));
};