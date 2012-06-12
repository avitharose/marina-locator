var marina = {};
marina.views = {};

$(function() {

	function deviceReady() {
    marina.views.main.show();
	}

	document.addEventListener("deviceready", deviceReady, false);

});

