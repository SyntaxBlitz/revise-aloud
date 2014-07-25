navigator.getUserMedia = navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia;

var audioContext;

var SAMPLES = 8192;
var audioBuffer = [				// left and right channels
	new Float32Array(0),
	new Float32Array(0)
];
var scriptProcessor;

var isRecording = false;

var paragraphs;
var currentParagraph;

var paragraphRanges = [];

window.onload = function () {
	initialiseMedia();

	var startButton = document.getElementById("startButtonLink");
	startButton.onclick = startProcess;
};

var initialiseMedia = function () {
	audioContext = new AudioContext();
	navigator.getUserMedia({audio: true}, mediaSuccess, mediaError);
};

var mediaSuccess = function (stream) {
	var sourceNode = audioContext.createMediaStreamSource(stream);
	scriptProcessor = audioContext.createScriptProcessor(SAMPLES, 2, 2);
	console.log(scriptProcessor);
	
	sourceNode.connect(scriptProcessor);
	scriptProcessor.connect(audioContext.destination);

};

var saveToBuffer = function (inputBuffer) {
	var newBuffer = [
		new Float32Array(audioBuffer[0].length + inputBuffer.getChannelData(0).length),
		new Float32Array(audioBuffer[1].length + inputBuffer.getChannelData(1).length)
	];

	newBuffer[0].set(audioBuffer[0]);
	newBuffer[1].set(audioBuffer[1]);

	newBuffer[0].set(inputBuffer.getChannelData(0), audioBuffer[0].length);
	newBuffer[1].set(inputBuffer.getChannelData(1), audioBuffer[1].length);

	audioBuffer = newBuffer;
};

var mediaError = function (e) {
	console.error(e);
};

var startRecording = function () {
	isRecording = true;
	document.getElementById("isRecording").textContent = "Recording!";

	scriptProcessor.onaudioprocess = function (e) {
		saveToBuffer(e.inputBuffer);
		// console.log(audioBuffer[0].length);
	};
};

var stopRecording = function () {
	isRecording = false;
	document.getElementById("isRecording").textContent = "Not recording";

	scriptProcessor.onaudioprocess = function (e) {
		// hi
	};
};

var startProcess = function () {
	paragraphs = getParagraphArray();
	createRangeArray();

	initialiseRecordingInterface();

	showRenderView();
};

var initialiseRecordingInterface = function () {
	var currentParagraphDiv = document.getElementById("currentParagraph");
	currentParagraphDiv.textContent = "Press space to begin.";

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

var createRangeArray = function () {
	for (var i = 0; i < paragraphs.length; i++) {
		paragraphRanges.push([]);
	}
};

var advanceParagraph = function () {
	var currentFrameCount = audioBuffer[0].length;

	paragraphRanges[currentParagraph].push({
		start: lastEnd,
		end: currentFrameCount
	});

	lastEnd = currentFrameCount;

	if (currentParagraph + 1 < paragraphs.length) {
		currentParagraph++;
		
		var currentParagraphDiv = document.getElementById("currentParagraph");
		currentParagraphDiv.textContent = paragraphs[currentParagraph];
	} else {

	}
};

var backParagraph = function () {
	if (currentParagraph > 0)
		currentParagraph--;

	lastEnd = audioBuffer[0].length;	// throw out everything in between the last 'space' and now

	var currentParagraphDiv = document.getElementById("currentParagraph");
	currentParagraphDiv.textContent = paragraphs[currentParagraph];
};

var restartParagraph = function () {
	var currentFrameCount = audioBuffer[0].length;

	paragraphRanges[currentParagraph].push({
		start: lastEnd,
		end: currentFrameCount
	});

	lastEnd = currentFrameCount;
};

var documentKeyDown = function (e) {
	if (e.key === 32 || e.keyCode === 32 || e.which === 32) {			// SPACE
		advanceParagraph();
		if (!isRecording)
			startRecording();
	} else if (e.key === 37 || e.keyCode === 37 || e.which === 37) {	// LEFT ARROW
		backParagraph();
	} else if (e.key === 80 || e.keyCode === 80 || e.which === 80) {	// P KEY
		if (!isRecording)
			startRecording();
		else
			stopRecording();
	} else if (e.key === 82 || e.keyCode === 82 || e.which === 82) {	// R KEY
		restartParagraph();
	}
};