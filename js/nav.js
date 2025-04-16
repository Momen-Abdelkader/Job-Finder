fetch('../html/nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav').innerHTML = data;
        const currentPath = window.location.pathname.split('/').pop();
        const links = document.querySelectorAll('#nav a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });
