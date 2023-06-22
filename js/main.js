let projects=new Carousel("div[id='projects-slide']");
(function(){
sidebar_cursor_inserter();
init_cards(document.getElementsByClassName("card-container")[0]);
     //initialize carousel
    // hoverable_card(document.getElementsByClassName("card")); // add hover to cards
    // resizeableBackground('container-carousel', "media/terminal.png");
    let observer=new IntersectionObserver(intersectionCallback, {root: null, rootmargin: "0px", threshold: 0.9});
        observer.observe(document.querySelector("div[id='carousel-container']"));
        observer.observe(document.querySelector("div[id='reading']"));
        observer.observe(document.querySelector("div[id='aboutme']"))
})();