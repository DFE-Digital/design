var servicesTab = document.getElementById("services-tab"), servicesPanel = document.getElementById("services-panel"), closeNav = document.getElementById("closeNav"); servicesTab.addEventListener("click", function (e) { e.preventDefault(), "none" === servicesPanel.style.display ? (servicesPanel.style.display = "block", servicesPanel.setAttribute("aria-hidden", "false"), servicesTab.setAttribute("aria-expanded", "true")) : (servicesPanel.style.display = "none", servicesPanel.setAttribute("aria-hidden", "true"), servicesTab.setAttribute("aria-expanded", "false")) }), document.addEventListener("keydown", function (e) { "Escape" !== e.key && "Esc" !== e.key || (e.preventDefault(), "block" === servicesPanel.style.display && (servicesPanel.style.display = "none", servicesPanel.setAttribute("aria-hidden", "true"), servicesTab.setAttribute("aria-expanded", "false"))) }), closeNav.addEventListener("click", function (e) { e.preventDefault(), servicesPanel.style.display = "none", servicesPanel.setAttribute("aria-hidden", "true"), servicesTab.setAttribute("aria-expanded", "false") });


