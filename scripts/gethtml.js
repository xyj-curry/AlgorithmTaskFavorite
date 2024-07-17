chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "gethtml") {
		const element = document.querySelector(request.selector);
		if (element) {
			if (request.web == "atcoder") {
				sendResponse(element.firstChild.nodeValue);
			} else {
				sendResponse(element.innerHTML);
			}
		} else {
			sendResponse("");
		}
	}
	return true;
});