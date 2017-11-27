$(function () {

	function viewModel() {
		const self = this;

		self.toggle = function() {
			$(".hamburger").toggleClass("hide");
			$(".close-btn").toggleClass("hide");
			$("#sidebar").toggleClass("hide-sidebar");
		};

	}

	viewModel();

	ko.applyBindings(new viewModel());

});

function initMap() {
	var map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 13
	});
}