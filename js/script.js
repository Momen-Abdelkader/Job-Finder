document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('darkmode');
    }

    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('darkmode');
        
        const currentTheme = body.classList.contains('darkmode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
});