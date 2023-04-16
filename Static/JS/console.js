console.log("working");

let streets = L.tileLayer(
	'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	  maxZoom: 18,
	  accessToken: API_KEY
	});
  
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
	});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
	});

let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets,
	"Dark Mode": dark
  };
  
let allEarthquakes = new L.layerGroup();
let tectonicPlates = new L.layerGroup();
let majorEQ = new L.layerGroup();
  
let overlays = {
	"Earthquakes": allEarthquakes,
	"Tectonic Plates": tectonicPlates,
	"Major Earthquakes": majorEQ
};


L.control.layers(baseMaps, overlays).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
	
	
	function styleInfo(feature) {
		return {
			opacity: 1,
			fillOpacity: 1,
			fillColor: getColor(feature.properties.mag),
			color: "#000000",
			radius: getRadius(feature.properties.mag),
			stroke: true,
			weight: 0.5,
		};
	}
	
	function getColor(magnitude) {
		if (magnitude > 5) {
		  return "#ea2c2c";
		}
		if (magnitude > 4) {
		  return "#ea822c";
		}
		if (magnitude > 3) {
		  return "#ee9c00";
		}
		if (magnitude > 2) {
		  return "#eecc00";
		}
		if (magnitude > 1) {
		  return "#d4ee00";
		}
		return "#98ee00";
	}
	
	
	function getRadius(magnitude) {
		if (magnitude === 0) {
			return 1;
		}
		return magnitude * 4;
	}

	L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
			console.log(data);
			return L.circleMarker(latlng);
		},
		style: styleInfo,
		onEachFeature: function (feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
		}
	}).addTo(allEarthquakes);

	allEarthquakes.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

	function styleInfo(feature) {
		return {
			opacity: 1,
			fillOpacity: 1,
			fillColor: getColor(feature.properties.mag),
			color: "#000000",
			radius: getRadius(feature.properties.mag),
			stroke: true,
			weight: 0.5
		};
	}
	
	function getColor(magnitude) {
		if (magnitude > 5) {
		  return "#ea2c2c";
		}
		if (magnitude > 4) {
		  return "#ea822c";
		}
		return "#98ee00";
	}
	
	function getRadius(magnitude) {
		if (magnitude === 0) {
			return 1;
		}
		return magnitude * 4
	}
	
	
	L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng);
		},
		style: styleInfo,
		onEachFeature: function (feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.map + "<br>Location: " + feature.properties.place);
		}	
	}).addTo(majorEQ);
	majorEQ.addTo(map);
});
	
let legend = L.control({
	position: "bottomright"
});
	
legend.onAdd = function () {
	let div = L.DomUtil.create("div", "info legend");

	const magnitudes = [0, 1, 2, 3, 4, 5];

	const colors = [
		"#98ee00",
		"#d4ee00",
		"#eecc00",
		"#ee9c00",
		"#ea822c",
		"#ea2c2c"
	];

	for (var i = 0; i < magnitudes.length; i++) {
		console.log(colors[i]);
		div.innerHTML +=
		  "<i style='background: " + colors[i] + "'></i> " +
		  magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
		}
		return div;
};
	
	legend.addTo(map);

	d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) {
		L.geoJson(data, {
			style: {
				color: "orange",
				weight: 2.25
			}
		}).addTo(tectonicPlates);
		tectonicPlates.addTo(map);
    
	});
});