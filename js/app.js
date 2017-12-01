let map;	// holds google map
let singapore = {	// holds lat lng of the region of interest
	lat: 1.3521,
	lng: 103.8198
};
let coordinates = [];	// used to hold coordinates of places retrieved from local storage
//	checking if local storage has coordinates of places
if (localStorage.coordinates) {
	coordinates = JSON.parse(localStorage.getItem("coordinates"));
} else {	// loading the loadinng screen since no local strorage
	$("#loading").toggleClass("hide");
	$(".info-close-btn").toggleClass("hide");
	$("#information").toggleClass("hide");
	$("#infodesk").toggleClass("hide-infodesk");
}
let hangouts = ["Universal Studios Singapore", "Sentosa Island", "Singapore Zoo", "Night Safari", "Jurong Bird Park",
	"Burmese Buddhist Temple", "Gardens By The Bay", "Orchard Road", "Singapore Botanic Gardens", "Chinatown",
	"Singapore Flyer", "Sands Skypark", "Clarke Quay", "Helix Bridge", "Fountain of Wealth",
	"Sri Mariamman Temple", "Raffles Hotel", "ArtScience Museum", "Buddha Tooth Relic Temple and Museum"
];		// holds the names of the places to load
let addressPos;	// used to hold name of the place while geocoding using google
let marker;	// used to intialize each google map marker
let markers = [];	// used to hold all the google map markers
let currentMarker = null;	// used to hold the current active google map marker
let currentPointer = 0;	// used to diffrentiate between active and newly activated google map markers
let infoWindow;	// used to initialize google maps marker info windows
let placeName = ko.observable();	// used to hold currently activated google map maker's venue name
let imgurl = ko.observable();	// used to hold currently activated google map maker's venue image url
let desc = ko.observable();	// used to hold currently activated google map maker's venue description
let placeAddress = ko.observable();	// used to hold currently activated google map maker's venue address
let placeContact = ko.observable();	// used to hold currently activated google map maker's venue contact number

// function to initialize the google map
function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: singapore,
		zoom: 11
	});
	// checking whether geocoding is required or local data is available
	let geocoder = new google.maps.Geocoder();
	if (!localStorage.coordinates) {
		for (let i = 0; i < hangouts.length; i++) {
			addressPos = hangouts[i];
			geocodeAddress(geocoder, map, addressPos);
		}
	} else {
		for (let j = 0; j < coordinates.length; j++) {
			createMarker(coordinates[j].result, coordinates[j].name);
		}
		placeMarkers();
	}
}

// function to perform geocoding to obtain the lat and lng og each place
function geocodeAddress(geocoder, resultsMap, addressPos) {
	let address = `${addressPos}, Singapore`;
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status === 'OK') {
			coordinates.push({
				result: results,
				name: addressPos
			});
			createMarker(results, addressPos);
			if (addressPos === hangouts[hangouts.length - 1]) {
				setTimeout(function() {
					localStorage.setItem("coordinates", JSON.stringify(coordinates));
				}, 5000);
				placeMarkers();
				// removing the loading screen
				$("#infodesk").toggleClass("hide-infodesk");
				$("#loading").toggleClass("hide");
				$(".info-close-btn").toggleClass("hide");
				$("#information").toggleClass("hide");
			}
		} else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			setTimeout(function() {
				geocodeAddress(geocoder, resultsMap, addressPos);
			}, 200);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

// funtion to create google maps markers
function createMarker(results, name) {
	marker = new google.maps.Marker({
		position: results[0].geometry.location,
		map: null,
		animation: google.maps.Animation.DROP,
		title: name
	});
	markers.push(marker);
}

// function to place the created google maps markers
function placeMarkers() {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
	markerEvents();
}

// function to add events to the google maps markers
function markerEvents() {
	let origin = 1;
	for (let i = 0; i < markers.length; i++) {
		google.maps.event.addListener(markers[i], 'click', function() {
			if (currentMarker) {
				closeInfoWindow(currentMarker, origin);
				currentMarker.setAnimation(null);
				if (currentMarker === markers[i]) {
					currentPointer++;
				}
			}
			if (currentPointer !== 1) {
				currentMarker = markers[i];
				makeInfoWindow(currentMarker);
				markers[i].setAnimation(google.maps.Animation.BOUNCE);
			}
			if (currentPointer === 1) {
				currentPointer = 0;
				currentMarker = null;
			}
		});
	}
}

// function to create google maps infowindows
function makeInfoWindow(mark) {
	let origin = 2;
	infoWindow = new google.maps.InfoWindow({
		content: `<div><h3>${mark.getTitle()}</h3><a id="infoWindow" href="#">More Info Here</a></div>`
	});
	infoWindow.open(map, mark)
	infoWindow.addListener('closeclick', function() {
		closeInfoWindow(mark, origin);
	});
}

// function to close google maps infowindows
function closeInfoWindow(mark, source) {
	if (source === 1) {
		infoWindow.close();
	} else {
		mark.setAnimation(null);
		currentPointer = 0;
	}
}

// event listener to load information about a place
$("#map").on("click", "a#infoWindow", function() {
	loadMoreInfo();
});

// function to retrieve venue details from foursquare
function loadMoreInfo() {
	let lookUp = currentMarker.title.replace(/\s+/g, '-');
	fetch(`https://api.foursquare.com/v2/venues/search?client_id=MHZVWYADEDLFMKG0A2C3W2EWPWE1SNVUNHRF1MVSDNMEFD0A&
		client_secret=3TP0125UX3HN1IUGPGDVSOYVV3A1QWD5NABNZSUWB2GFG12X&ll=40.7,-74&near="singapore"&query=${lookUp}&v=20131124&limit=5`)
		.then(result => result.json())
		.then(function(result) {
			let venueId = result.response.venues[0].id;
			fetch(`https://api.foursquare.com/v2/venues/${venueId}?client_id=MHZVWYADEDLFMKG0A2C3W2EWPWE1SNVUNHRF1MVSDNMEFD0A&
			client_secret=3TP0125UX3HN1IUGPGDVSOYVV3A1QWD5NABNZSUWB2GFG12X&ll=40.7,-74&v=20131124`)
				.then(result => result.json())
				.then(function(result) {
					populateInfo(result);
				});
		})
		.catch(function() {
			alert("Network Error when attempting to fetch resource 1");
		});
}

// function to display information about a place
function populateInfo(result) {
	placeName(result.response.venue.name);
	if (result.response.venue.bestPhoto.prefix) {
		imgurl(result.response.venue.bestPhoto.prefix + "original" + result.response.venue.bestPhoto.suffix);
	} else {
		imgurl("/images/notfound.png");
	}
	if (result.response.venue.description) {
		desc(result.response.venue.description);
	} else {
		desc("Description Not Found");
	}
	if (result.response.venue.location.formattedAddress) {
		placeAddress(result.response.venue.location.formattedAddress);
	} else {
		placeAddress("Address Not Found");
	}
	if (result.response.venue.contact.formattedPhone) {
		placeContact(result.response.venue.contact.formattedPhone);
	} else {
		placeContact("Contact Not Found");
	}
	setTimeout(function() {
		$("#infodesk").toggleClass("hide-infodesk");
	}, 200);
};

// function to set the sidebar list and place their recpective google maps markers
function setFilterList(list) {
	for (let i = 0; i < markers.length; i++) {
		if (markers[i].map !== map) {
			markers[i].setMap(map);
		}
	}
	list.filterList([]);
	for (let i = 0; i < hangouts.length; i++) {
		list.filterList.push({
			name: hangouts[i]
		});
	}
}

// function to open and close the sidebar
function toggleSidebar() {
	$(".hamburger").toggleClass("hide");
	$(".close-btn").toggleClass("hide");
	$("#sidebar").toggleClass("hide-sidebar");
	$("#filterbox").val("Filter...");
	$("#filterbox").focus(function() {
		$(this).val("");
	});
}

// function to perform filtering of the list of places in the sidebar
function applyFilter(list) {
	let tempArray = [];
	let str = $("#filterbox").val();
	console.log(str);
	for (let i = 0; i < list.filterList().length; i++) {
		let state = list.filterList()[i].name.toLowerCase().includes(str);
		if (state) {
			tempArray.push(list.filterList()[i]);
		}
	}
	if (tempArray.length > 0) {
		list.filterList(tempArray);
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
			for (let j = 0; j < list.filterList().length; j++) {
				if (list.filterList()[j].name.toLowerCase() === markers[i].title.toLowerCase()) {
					markers[i].setMap(map);
				}
			}
		}
	} else {
		alert("No Match Found");
	}
}

// knockout viewmodel
const viewModel = function() {
	const self = this;
	self.filterList = ko.observableArray([]); // used to store place names that are to be shown in the sidebar

	// function to set the values of the filterList
	self.setFilter = function() {
		setFilterList(self);
	};

	self.setFilter();

	// function to interact with the sidebar
	self.toggle = function() {
		toggleSidebar();
	};

	// function to load the filter functionality
	self.filter = function() {
		applyFilter(self);
	};

	// funtion to load infowindow when corresponding place is clicked in the sidebar list
	self.loadInfoWindow = function() {
		index = markers.findIndex(x => x.title === this.name);
		google.maps.event.trigger(markers[index], "click")
	};

	// function to close the place information window
	self.closeMoreInfo = function() {
		$("#infodesk").toggleClass("hide-infodesk");
	};

	// function to reset the sidebar places list after performing a filter
	self.reset = function() {
		self.setFilter();
	};
}

ko.applyBindings(new viewModel());