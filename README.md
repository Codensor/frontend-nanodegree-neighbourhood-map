# Neighbourhood Map

## Table of Contents

- [Introduction](#introduction)
- [Instructions](#instructions)
- [Customization](#customization)
- [Contribution](#contribution)

## Introduction

This app is used to provide information about places in a region. The user can view the location of the places and get information of each of the displayed place. The user can modify this app to provide the information about different places in different regions. So what are you waiting for! load the app and find new places.

## Instructions

- ### Loading the App:

	Get this repo either by cloning, pulling, forking or downloading the zip file. Open the index.html file in the root location of Neighbourhood Map folder in your web browser. The App should load the map if the device is connected to the internet.

- ### Loading Assets:

	The app requires coordinates of the places that need to be displayed. The coordinates are obtained by google geocoding and hence can increase the load time of the app, but subsequent loading of the map will be faster since the coordinates are stored in the browser's local storage.

- ### Interacting with the App:

	- #### Main Window:
		The Main Window of the app contains the title, a google map with all the place markers and a link to the sidebar on the top-left corner.

	- #### Sidebar:
		clicking on the hamburger icon found at the top-left corner of the app will open the sidebar, to close the sidebar click on the cross icon found at the top-left corner of the app. The sidebar consists of a filter and a list of all the places displayed on the map.

		- ##### Filter and Reset:
			The filter can be used to filter the places based on the filter text input. Upon clicking the arrow next to the filter the app will provide the filter results. To reset the list of places after performing a filter click on the reset button found below the list in the sidebar.

		- ##### Venue List:
			The sidebar provides a list of places that are displayed on the map. Clicking on any of the names will trigger the marker on the map to bouce and show its info window, clicking it again will close the info window and stop the marker from bouncing.

	- #### Info Window:
		To open an info window click on the marker on the google map. The Info Window will display the place name and will also provide a link to load more information about the place. Clicking on the "More Info Here" link will open a window with more information about the place. The information displayed is obtained by using foursquare api. To close the window click on the cross mark found on the top-right corner of the window. To close the info window click on the cross mark within the info window or click on the corresponding marker.

		- ##### "More Info Here" Link:
			This link provide the following information about the place: Name, Image, Description, Address, Contact details.

## Customization

To customize the app to load different region and different places follow the below steps :

- Open the index.html file found in the root directory of the neighbourhood map. Find the header h1 element and change the title to the region you want, save and close the file.

- Open the app.js file found in the js folder in the root directory of the neighbourhood map. Select the variable singapore and press Alt+F3, this will select all the singapore instances in the file. Rename this to the region you want (i.e same as the title name in the HTML file) and press ESC to deselect the instances.

- Find the hangouts variable at begining of the app.js file and replace place names with the names found in the region you want.

- Find the geocodeAddress function and within it the setTimeout function, change the time according to the number of places that you have entered. To be sure change the time to 1000 * number of places you entered.

- Finally delete the corresponding local storage data (i.e coordinates) in your browser.

## Contribution

- Please check the CONTRIBUTING.md to know more about contributions.