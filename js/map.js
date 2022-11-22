var map = L.map('map', {
    zoomControl: false
}).setView([0, 0], 3);

L.tileLayer('maps/{z}/{x}/{y}.jpg', {
    minZoom: 2,
    maxZoom: 3,
    continuousWorld: false,
    noWrap: true,
    attribution: '&copy; <a href="Patreon.com/kindafunny">Kinda Funny</a> Patreon'
}).addTo(map);

var searchbox = L.control.searchbox({
    position: 'topright',
    expand: 'left',
    width: '450px',
    autocompleteFeatures: ['setValueOnClick']
}).addTo(map);

var fuse = new Fuse(friends, {
    isCaseSensitive: false,
    shouldSort: true,
    threshold: .4,
    location: 0,
    distance: 100,
    keys: ['name'],
    minMatchCharLength: 2
});

var marker = new L.marker;

searchbox.onInput("keyup", function (e) {
    if (e.keyCode == 13) {
        search();
    } else {
        var value = searchbox.getValue();
        if (value != "") {
            var results = fuse.search(value);
            var objRes = results.map(res => res.item).slice(0, 5)
            var match = [];
            for (var i = 0; i < 5; i++) {
                match.push(objRes[i].name);
            }
            searchbox.setItems(match);
        } else {
            searchbox.clearItems();
        }
    }
});

searchbox.onButton("click", search);

//For fast latLong
/*
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);
*/

function search() {
    var value = searchbox.getValue();
    if (value != "") {
        marker.removeFrom(map);
        var results = fuse.search(value);
        console.log(results);
        $('#results').text(JSON.stringify(results, null, 2));
        $('html, body').animate({
        }, 1000);
        marker = L.marker([results[0].item.locX, results[0].item.locY], { draggable: true}).addTo(map);
        marker.bindPopup(value);
    }

    setTimeout(function () {
        searchbox.hide();
        searchbox.clear();
    }, 600);
}