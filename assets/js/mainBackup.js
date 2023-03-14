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

function ChangeSelect() {
    optionSelected = idSelecCategory.value;
    if (optionSelected != 'all') {
        let newUrl = api + "?category=" + optionSelected;
        FetchApi(newUrl);
    } else {
        FetchApi(api);
    }
}

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./assets/js/serviceworker.js').then(function (registration) {
            // reg success
            console.log('success with scope:', registration.scope);
        }, function (err) {
            // reg fail
            console.log('failed with scope:', err);
        });
    });
}

var networkUpdate = fetch(api)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {

        FetchApi(api);
    })

caches.match(api)
    .then(function (response) {
        if (!response) throw Error('no data on cache')
        return response.json()
    }).then(function (data) {
        if (!networkDataReceived) {
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function () {
        return networkUpdate
    }) 
