var marina = {};
marina.views = {};

$(function() {

  console.log('in $()');

	function deviceReady() {
    $('#spinner').spin();
    console.log('device ready, show main view');
    marina.views.main().show();
	}

	document.addEventListener("deviceready", deviceReady, false);

});

