(function (){
  "use strict";
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }


  

  if (select('.header-toggler')) {
    on('click', '.toggle-sidebar-btn', function(e) {
      select('header#header').classList.toggle('toggle-sidebar')
      console.log('hello')
    })
  }

  
})();
