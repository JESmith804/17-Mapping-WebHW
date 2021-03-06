// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});


function markerSize(value) {
   return value * 35000;
}

function Color(value) {
   if (value > 5) {
       return 'red'
   } else if (value > 4) {
       return 'darkorange'
   } else if (value > 3) {
       return 'tan'
   } else if (value > 2) {
       return 'yellow'
   } else if (value > 1) {
       return 'darkgreen'
   } else {
       return 'lightgreen'
   }
};

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
 // Give each feature a popup describing the place and time of the earthquake
 var earthquakes = L.geoJson(earthquakeData, {
   onEachFeature: function onEachFeature(feature, layer) {
       layer.bindPopup("<h3>" + feature.properties.place +
         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + feature.properties.mag);
     },





   pointToLayer: function (feature, latlng) {
     return new L.circle(latlng,
       {radius: markerSize(feature.properties.mag),
         fillColor: Color(feature.properties.mag),
         fillOpacity: .8,
         stroke: true,
         color: "black",
         weight: .5
     })
   }
 });

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

// loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<b style="background-color:' + Color(grades[i] + 1) + '">' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</b><br>' : '+');
  }
  return div;
};

legend.addTo(myMap);
}