var marina = {};
marina.views = {};

$(function() {

  console.log('in $()');
  $('#spinner').spin();

	function deviceReady() {
    console.log('device ready, show main view');
    marina.views.main().show();
    $('#spinner').spin(false);
	}

	document.addEventListener("deviceready", deviceReady, false);

});

