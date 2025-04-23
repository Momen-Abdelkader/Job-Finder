function init() {
    createNav(true);
    initializeProfileNavigation();
}


// --------------------- Profile Tabs Navigation 

function initializeProfileNavigation() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', () => handleTabClick(tabLink));
    });
}


function handleTabClick(clickedTab) {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    deactivateAllTabs(tabLinks);
    activateClickedTab(clickedTab);
    hideAllTabContents();
    showSelectedTabContent(clickedTab.getAttribute('data-tab'));
}

function deactivateAllTabs(tabLinks) {
    tabLinks.forEach(link => link.classList.remove('active'));
}

function activateClickedTab(clickedTab) {
    clickedTab.classList.add('active');
}

function hideAllTabContents() {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
}

function showSelectedTabContent(tabId) {
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) selectedContent.classList.add('active');
}


// --------------------- Profile Tabs Navigation End


document.addEventListener('DOMContentLoaded', init);