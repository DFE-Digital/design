

 //set active state on side navigations
 let uri = window.location.pathname;
 if(uri.match("ncs-design-system/components")){
   //remove leading /
   uri = uri.substring(1).split('/')
   //get the last segment of the uri
   let segment = uri[uri.length - 1];

   var allSideMenuItemLinks = document.querySelectorAll(`.dfe-vertical-nav__section li a`);
   for(let i=0; i<allSideMenuItemLinks.length; i++){

      //remove "current" on all nav item
      allSideMenuItemLinks[i].parentElement.classList.remove("dfe-vertical-nav__section-item--current");

      //add "currrent" on only the selected item
      if(allSideMenuItemLinks[i].getAttribute('href').match(segment)){
        console.log(allSideMenuItemLinks[i].parentElement)
        allSideMenuItemLinks[i].parentElement.classList.add("dfe-vertical-nav__section-item--current");
      }
   }
 }

// initialize the iFrame resizer
var iframe = document.querySelectorAll('[data-module="app-iframe"]');
for(let i=0; i<iframe.length; i++){
    iframe[i].onload = function() {
    iframe[i].style.height = 20 + iframe[i].contentWindow.document.body.scrollHeight + 'px';
    }
}