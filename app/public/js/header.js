// Header Navigation and Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navigationToggle = document.querySelector('.gem-c-layout-super-navigation-header__navigation-top-toggle-button');
    const searchToggle = document.querySelector('.gem-c-layout-super-navigation-header__search-toggle-button');
    const navigationMenu = document.querySelector('.gem-c-layout-super-navigation-header__navigation-dropdown-menu');
    const searchContainer = document.querySelector('.gem-c-layout-super-navigation-header__search-container');
    const searchForm = document.querySelector('.gem-c-search__form');

    // Toggle navigation menu
    if (navigationToggle && navigationMenu) {
        navigationToggle.addEventListener('click', function() {
            const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true';
            navigationToggle.setAttribute('aria-expanded', !isExpanded);
            navigationMenu.setAttribute('aria-hidden', isExpanded);
            
            // Close search if open
            if (searchToggle && searchContainer) {
                searchToggle.setAttribute('aria-expanded', 'false');
                searchContainer.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Toggle search panel
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', function() {
            const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
            searchToggle.setAttribute('aria-expanded', !isExpanded);
            searchContainer.setAttribute('aria-hidden', isExpanded);
            
            // Close navigation if open
            if (navigationToggle && navigationMenu) {
                navigationToggle.setAttribute('aria-expanded', 'false');
                navigationMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = searchForm.querySelector('.gem-c-search__input');
            if (searchInput && searchInput.value.trim()) {
                // Implement your search functionality here
                console.log('Searching for:', searchInput.value.trim());
            }
        });
    }

    // Close panels on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navigationToggle && navigationMenu) {
                navigationToggle.setAttribute('aria-expanded', 'false');
                navigationMenu.setAttribute('aria-hidden', 'true');
            }
            if (searchToggle && searchContainer) {
                searchToggle.setAttribute('aria-expanded', 'false');
                searchContainer.setAttribute('aria-hidden', 'true');
            }
        }
    });
}); 