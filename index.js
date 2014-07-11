window.onload = function () {
	var startButton = document.getElementById("startButtonLink");
	startButton.onclick = startProcess;
};

var startProcess = function () {
	var enterText = document.getElementById("enterText");
	enterText.style.display = "none";

	var renderText = document.getElementById("renderText");
	renderText.style.display = "block";
};