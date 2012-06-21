var marina = {};
marina.views = {};

$(function() {

  console.log('in $()');

	function deviceReady() {
    marina.util.startSpinner();
    console.log('device ready, show main view');
    marina.views.main().show();
	}

	document.addEventListener("deviceready", deviceReady, false);

});

