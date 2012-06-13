var marina = {};
marina.views = {};

$(function() {

	function deviceReady() {
    console.log('device ready, show main view');
    marina.views.main().show();
	}

	document.addEventListener("deviceready", deviceReady, false);

});

