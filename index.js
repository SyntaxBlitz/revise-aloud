var paragraphs;
var currentParagraph;

window.onload = function () {
	var startButton = document.getElementById("startButtonLink");
	startButton.onclick = startProcess;
};

var startProcess = function () {
	paragraphs = getParagraphArray();
	initialiseRecordingInterface();

	showRenderView();
};

var initialiseRecordingInterface = function () {
	var currentParagraphDiv = document.getElementById("currentParagraph");
	currentParagraphDiv.innerText = "Press space to begin.";

	currentParagraph = -1;

	document.onkeydown = documentKeyDown;
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

var advanceParagraph = function () {
	if (currentParagraph + 1 < paragraphs.length) {
		currentParagraph++;
		
		var currentParagraphDiv = document.getElementById("currentParagraph");
		currentParagraphDiv.innerText = paragraphs[currentParagraph];
	}
};

var backParagraph = function () {
	if (currentParagraph > 0)
		currentParagraph--;
	var currentParagraphDiv = document.getElementById("currentParagraph");
	currentParagraphDiv.innerText = paragraphs[currentParagraph];
}

var documentKeyDown = function (e) {
	if (e.key === 32 || e.keyCode === 32 || e.which === 32) {			// SPACE
		advanceParagraph();
	} else if (e.key === 37 || e.keyCode === 37 || e.which === 37) {	// LEFT ARROW
		backParagraph();
	}
};