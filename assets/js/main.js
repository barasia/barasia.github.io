const idSelecCategory = document.getElementById('select-category');
const idList = document.getElementById('list');
const idCounter = document.getElementById('counter');
const api = "https://my-json-server.typicode.com/barasia/api-fake/animals";
var optionSelected = '';
var optionResults = '';
var dataResults = '';
var counterResults = 0;
var categoryResults = '';
var categories = [];
var networkDataReceived = false

/*
FetchApi(api);
function FetchApi(api) {
    counterResults = 0;
    dataResults = '';

    fetch(api)
        .then((response) => response.json())
        .then((json) => {
            let datas = json;

            datas.map(function (data) {
                dataResults += "<div>";
                dataResults += "<h5>" + `${data.name}` + "</h5>";
                dataResults += "<p>" + `${data.category}` + "</p>";
                dataResults += "</div>";

                if (!categories.includes(data.category)) {
                    categories.push(data.category);
                    optionResults += "<option value='" + `${data.category}` + "'>" + `${data.category}` + "</option>";
                }

                counterResults++;
            });
        })
        .catch(function (error) {
            dataResults += "<div>";
            dataResults += "<p>" + `${error}` + "</p>";
            dataResults += "</div>";
        })
        .finally(() => {
            idSelecCategory.innerHTML = "<option value=''>--- Choose Option ---</option><option value='all'>ALL</option>" + optionResults;
            idCounter.innerHTML = "<h3> [" + `${counterResults}` + "] results " + `${optionSelected}` + " </h3>";
            idList.innerHTML = dataResults;
            networkDataReceived = true;
        });

}
*/

function ChangeSelect() {
    optionSelected = idSelecCategory.value;
    if (optionSelected != 'all') {
        let newUrl = api + "?category=" + optionSelected;
        NetworkUpdate(newUrl);
    } else {
        NetworkUpdate(api);
    }
}

function renderPage(datas) {
    counterResults = 0;
    dataResults = '';
    if (datas == 'error') {
        // if error
        dataResults += "<div>";
        dataResults += "<p>" + `${error}` + "</p>";
        dataResults += "</div>";
    } else {
        // if success
        datas.forEach((data) => {
            dataResults += "<div>";
            dataResults += "<h5>" + `${data.name}` + "</h5>";
            dataResults += "<p>" + `${data.category}` + "</p>";
            dataResults += "</div>";

            if (!categories.includes(data.category)) {
                categories.push(data.category);
                optionResults += "<option value='" + `${data.category}` + "'>" + `${data.category}` + "</option>";
            }

            counterResults++;
        });
    }
    // append HTML
    idSelecCategory.innerHTML = "<option value=''>--- Choose Option ---</option><option value='all'>ALL</option>" + optionResults;
    idCounter.innerHTML = "<h3> [" + `${counterResults}` + "] results " + `${optionSelected}` + " </h3>";
    idList.innerHTML = dataResults;
    networkDataReceived = true;

}

// data from online
const NetworkUpdate = (url_api = api) => {
    fetch(url_api)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            networkDataReceived = true;
            return renderPage(data)
        }).catch(function (err) {
            console.log('api trouble', err)
        })
}

// Register PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
            console.log('SW success registered ... ');
            return caches.match('firstReload.json')
        }).then(function (cacheMatchFirstReload) {
            if (!cacheMatchFirstReload) {
                window.location.reload()
            }
        }, function (err) {
            console.log('failed register SW with scope:', err);
        });
    });
}

caches.match(api)
    .then(function (response) {
        return response.json()
    }).then(function (data) {
        if (!networkDataReceived) {
            renderPage(data)
        }
    }).catch(function () {
        NetworkUpdate(api)
    })

