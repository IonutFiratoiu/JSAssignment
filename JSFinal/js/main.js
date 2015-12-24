/* ======================================================================================
 INSERT MAP
 ====================================================================================*/
var map;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(45.5403, 24.5463),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
};

google.maps.event.addDomListener(window, 'load', initialize);


/*==========================================================================
 *       STAR RATING
 *       ====================================================================
 * */

var name = document.getElementById('clientname');
var city = document.getElementById('city');
var starRating = document.getElementsByClassName('star-rating');
var stars = document.getElementsByClassName('star');
var dr = document.getElementsByClassName('drating');


//var star = stars[i];

starRating = document.getElementsByClassName('star-rating');

var mouseoverstar = function () {
    var rating = this.getAttribute("data-value");
    for (var j = 0; j < parseInt(rating, 10); j++) {
        stars[j].classList.add('active');
    }
};
for (var i = 0; i < 5; i++) {
    stars[i].addEventListener('mouseover', mouseoverstar);
}

for (var i = 0; i < 5; i++) {
    stars[i].addEventListener('click', function () {
        var rating = parseInt(this.getAttribute("data-value"));
        console.log(rating);
        for (var k = 0; k <= 4; k++) {
            stars[k].classList.remove('active');
        }
        for (var j = 0; j <= rating - 1; j++) {
            stars[j].classList.add('active');
        }
        starRating = rating;

        for (var i = 0; i < 5; i++) {
            stars[i].removeEventListener('mouseout', mouseoutstar);
            stars[i].removeEventListener('mouseover', mouseoverstar);
        }

    });


}

var mouseoutstar = function () {
    for (var j = 0; j < stars.length; j++) {
        stars[j].classList.remove('active');
    }
};
for (var i = 0; i < 5; i++) {
    stars[i].addEventListener('mouseout', mouseoutstar);
}

var resetStars = function(){
    for(var i = 0 ; i < 5 ; i++){
        stars[i].addEventListener('mouseout', mouseoutstar);
        stars[i].addEventListener('mouseover', mouseoverstar);
        starRating = 0;
        stars[i].classList.remove('active');
    }
};


/*========================================================================
 Validation
 ========================================================================
 * */

function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('city'), {types: ['geocode']});
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
    });
};

var codeAddress = function () {
    var address = document.getElementById('city');
    geocoder.geocode({'address': address.value}, function (results, status) {
        unlockForm();
        hideLoading();
        var addrLocation = results[0].geometry.location;
        if (status == google.maps.GeocoderStatus.OK) {
            onResponseFromGoogle(results);
            map.setCenter(addrLocation);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            map.setZoom(9);
            map.panTo(marker.position);
        }
    });
};

window.addEventListener('load', initAutocomplete);

/*=====================================================================================
 ADD IN TABLE
 * ===================================================================================*/

var table = document.getElementById('table');
var count = document.getElementById('count');
var form = document.getElementById('form');
var avgRating = document.getElementById('avg-rating');
var tableBody = document.getElementsByTagName('tbody')[0];
var store = [];

form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = getValues();
    if (isValidData(data)) {
        lockForm();
        showLoading();
        codeAddress(data.city);
    }

    return false;
});

var getValues = function () {
    var object = {
        name: clientname.value,
        city: city.value,
        rating: starRating + "/5"
    };
    return object;
};

var createRow = function (values) {
    var tr = document.createElement("tr");
    tr.innerHTML = tmpl("tpl", values);
    tableBody.appendChild(tr);

    resetStars();
};

var isValidData = function (data) {
    if ((isValidName) && (isValidCity) && (isValidRating)) {
        return true;
    }

};

var isValidName = function (name) {
    var regex = /^[a-zA-Z ]{2, }$/;
    var name = document.getElemetnById('name');

    if (regex.test(name.value)) {
        return true;
    }
    ;
};

var isValidCity = function () {
    if (codeAddress()) {
        return true;
    }
    ;
};

var isValidRating = function () {
    if (starRating != null)
        return true;
};

var updateTotal = function (arr) {
    count.innerHTML = arr.length;
};

var averageRating = function () {
    avgRating.innerHTML = parseInt(+avgRating.innerHTML) + starRating / parseInt(count.innerHTML);
};

var render = function (store) {
    populateTable(store);
    updateTotal(store);
    averageRating(store);
};

tableBody.addEventListener('click', function (event) {
    event.preventDefault();
    if (isRemoveBtn(event.target)) {
        removeRow(event.target);
    }
    ;
});

var isRemoveBtn = function (target) {
    return target.classList.contains("btn-danger");
};

var getIndexOfButton = function (target) {
    var tr = target.parentNode.parentNode;
    var allTrs = tableBody.getElementsByTagName('tr');
    allTrs = [].slice.call(allTrs);
    var index = allTrs.indexOf(tr);
    return index;
};

var removeRow = function (target) {
    var index = getIndexOfButton(target);
    removeFromStore(store, index);
    render(store);
};

var removeFromStore = function (store, index) {
    store.splice(index, 1);
};

var populateTable = function (store) {
    tableBody.innerHTML = '';
    for (var i = 0; i < store.length; i++) {
        var data = store[i];
        createRow(data);
    }
    ;
};

var onResponseFromGoogle = function (results) {
    if (results.length) {
        var data = {
            name: clientname.value,
            city: results[0].formatted_address,
            rating: starRating + "/5"
        };
        form.reset();
        store.push(data);
        render(store);
    }
};

var lockForm = function () {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
};

var unlockForm = function () {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
};

var loadingShow = document.getElementById('loading');

var showLoading = function () {
    loadingShow.style.display = 'inline-block';
};

var hideLoading = function () {
    loadingShow.style.display = 'none';
};
/*====================================================================
 MARKER
 *==================================================================== */



