var wineNewsApp = {
	deviceReady: false,
	hasLoadedData: false
};

$(function() {

	wineNewsApp.util.tryLog(this, function() {
		$.mobile.showPageLoadingMsg();
		wineNewsApp.views.pageWaitOnAjaxStart();
		wineNewsApp.controllers.init();
		wineNewsApp.views.init();
	},
	function() {
		$.mobile.hidePageLoadingMsg();
	});

	function initialDataLoad(online) {
		console.log('device is online = ' + online);
		if (!wineNewsApp.hasLoadedData) {
			wineNewsApp.hasLoadedData = online;
			wineNewsApp.controllers.winenews.refresh($.mobile.activePage);
		}
	}

	function onOnLine() {
    console.log('device is online');
		initialDataLoad(true);
	}

	function onOffLine() {
    console.log('device is offline');
		initialDataLoad(false);
	}

	function onDeviceReady() {
		console.log('device ready');
		wineNewsApp.deviceReady = true;
		wineNewsApp.util.checkNetworkStatus();
    if(wineNewsApp.util.isConnected()) {
      onOnLine();
    } else {
      onOffLine();
    }
	}

	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("offline", onOffLine, false);
	document.addEventListener("offline", onOffLine, false);

});

