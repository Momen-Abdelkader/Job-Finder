fetch('../html/search.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('search').innerHTML = data;
    });
