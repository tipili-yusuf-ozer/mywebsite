// let sidebar_items=[].concat(Array.from(document.querySelectorAll("aside p")),Array.from(document.querySelectorAll("aside h4")),Array.from(document.querySelectorAll("aside a")));
function Carousel(str){ //carousel manager
    this.elem=document.querySelector(str); //select the carousel-slide element with css selector 'str'.
    this.slideindex=0; //index of current slide in carousel
    if (new.target){
        // this.elem.style.minWidth=this.elem.offsetWidth;
        // this.elem.style.minHeight=this.elem.offsetHeight;
        let tabs= Array.from(this.elem.querySelectorAll("button[role='tab']")); //select tab bars at the bottom
        this.slidelength=tabs.length;
        this.slides=[]
        this.firstrun=true;
        // Array.from(this.elem.getElementsByClassName("carousel-item-own")).forEach((item)=>{item.style.visibility="hidden"});
        let that=this;//save this for usage in listener functions. Note: listener functions' this is is document.  
        tabs.forEach((item, index, array)=>{item.addEventListener("click", ()=>{that.setslide(index)})}); //insert click event listener to tab bars
        let buttons = Array.from(that.elem.querySelectorAll("button[role='navigation']")); ///select control buttons
        
        buttons.forEach(function(button){button.addEventListener("click", ()=>{

            if (button.getAttribute("data-bs-slide")=="prev"){ 
                that.setslide(that.slideindex==0?that.slidelength-1:that.slideindex-1); //eğer button geriyse ve slideindex 0 ise sona git
            }
            else {
                that.setslide(that.slideindex==that.slidelength-1?0:that.slideindex+1); //diğer koşula benzer şekil
            }
        })});
    }
    this.setslide=async function (slideindexarg){ //function that changes active tab bars and slides. arguement is index of the slide to be activated 
        let tabs=Array.from(this.elem.querySelectorAll("button[role='tab']")); 
        tabs.forEach((item,index,array)=>{
            if (item.getAttribute("data-bs-slide-to")==""+slideindexarg){ // eğer tab bar'ın tıklanınca götürdüğü slide argumana eşitese o tab barı actif et.
                item.setAttribute("aria-current", "true");
                item.classList.add("active")
            }
            else{
                item.setAttribute("aria-current", "false"); // değilse o barı deactif et
                item.classList.remove("active");
            }
            }   
        );

        let slides=Array.from(this.elem.getElementsByClassName("carousel-item-own")); //içeriğin gösterildiği slide itemleri
        let current=null;
        let next=null;

        slides.forEach((item,index,array)=>{
            if (item.classList.contains("carousel-item-active")){
                current=item
            }
            if (index==slideindexarg){
                next=item              // indexi istenen index ise actif et0
            }
        });
        if(!this.firstrun){
            await textwriter.delete(current);
            current.classList.remove("carousel-item-active");
        }
        next.classList.add("carousel-item-active");
        await textwriter(next);

        this.firstrun=false;
    this.slideindex=slideindexarg; //son olarak slideindexi güncelle
    }
}
function hoverable_card(card_collection){ //card itemlerine hoverable özelliği atamak için kullanılır. Arguman: HTMLCollectionObject.
    Array.from(card_collection).forEach(function(item){
        item.addEventListener("mouseover", ()=>{
            let hovertext=item.getElementsByClassName("container-card-hover")[0];
            hovertext.style.display="flex";
            hovertext.style.visibility="visible";
        });
        item.addEventListener("mouseout", ()=>{
            let hovertext=item.getElementsByClassName("container-card-hover")[0];
                hovertext.style.display="none";
                hovertext.style.visibility="invisible";
            });
    });
}
function resizeableBackground(selector, imgpath){ //apply img as resizable background to element
    elem=document.getElementsByClassName(selector);
    Array.from(elem).forEach((item)=>window.addEventListener("DOMContentLoaded",()=>resizeImage(imgpath, item.offsetWidth,item.offsetHeight, (blob)=>item.style.backgroundImage="url("+URL.createObjectURL(blob)+")"))); //Add load listener function that resizes the img for the element 
    Array.from(elem).forEach((item)=>window.addEventListener("resize",()=>resizeImage(imgpath, item.offsetWidth,item.offsetHeight, (blob)=>item.style.backgroundImage="url("+URL.createObjectURL(blob)+")"))); //apply same listener to resize
    
    function resizeImage(filesrc, itemwidth, itemheight, callback) { //filesrc: path to image to be applied as background ,callback is passed to canvas.toBlob to apply blob as background to element
        var image = new Image();
        image.src=filesrc; //set image source to filesor
        image.onload = function() {  //this will run when image is being rendered from image.src
        var canvas = document.createElement('canvas');
        canvas.width = itemwidth;
        canvas.height = itemheight;
    
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, itemwidth, itemheight);
    
        canvas.toBlob(function(blob) {
            callback(blob);
        }, "image/png", 1);
        };
    }
    
}
let firstintersect={carousel: true, reading: true, aboutme: true,}
function intersectionCallback(entries, observer){
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            let body=document.body;
            let sheet= new Stylesheets("dynamic");
            let rule=sheet.getRule(".sidebar-text");
            let rule1= sheet.getRule(".cursor-blink");
            let rule2=sheet.getRule(".pop-text");
            let rule3=sheet.getRule(".container-namebar");
            let intersectitems=[document.getElementById('carousel-container'),document.getElementById('aboutme'),document.getElementById('reading')]
            if(entry.target==intersectitems[0]) //carousel
            {
                body.classList.add("bg-fade-anim");
                rule.style.fontFamily = "\'VT323\', monospace"
                rule.style.color="var(--bs-success)";
                rule1.style.display="inline"
                rule1.style.animationPlayState="running";
                rule3.style.borderRadius="0";
                rule3.style.borderColor="white";
                Array.from(document.querySelectorAll("aside li")).concat(Array.from(document.querySelector("aside"))).forEach((item)=>textwriter(item));
                if (firstintersect.carousel){
                    projects.setslide(0);
                    firstintersect.carousel=false;
                }
            }
            else{
                body.classList.remove("bg-fade-anim");
                rule1.style.display="none";
                rule1.style.animationPlayState="paused";
            }
            if(entry.target==intersectitems[2]) //reading
            {
                body.style.setProperty("background-color", "var(--bs-gray-300)");
                rule.style.fontFamily="\'Newsreader\', serif";
                rule.style.color="var(--bs-black)";
                (async function(elems){
                   await asyncForEach(Array.from(elems), async function(elem){
                    elem.style.animationPlayState="running";
                    await new Promise(function(res){
                        setTimeout(res, 500)
                    });
                    
                   });
                })(entry.target.getElementsByClassName("card"))
            }
            if(entry.target==intersectitems[1]){ //aboutme
                body.style.backgroundColor="white" 
                rule.style.fontFamily= "\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif"; 
                rule.style.color="var(--bs-alert)"
                rule2.style.visibility="visible"
                rule2.style.animationPlayState="running"
                rule3.style.borderRadius="30%";
                rule3.style.borderColor="black";
            }
            intersectitems.forEach((item)=>item!=entry.target?observer.observe(item):observer.unobserve(item)); 

}
})

    };

async function textwriter(elem){
    
    if (elem?.textwriter=="writing"){
        await new Promise((resolve)=>{
            let m=setInterval(()=>{
                if (elem.textwriter=="done"){
                    clearInterval(m)
                    resolve()
                }
            }, 500)
        })        
    } 
    let wrote=false;
    asyncForEach(Array.from(elem.children), async function(item){
        if (!["H4", "H2", "H3", "P", "A"].includes(item.tagName)){
            // Array.from(item.children).forEach((item2)=>{item2!=null ? textwriter(item2):null});
            item!=null?textwriter(item):null;
            return;
        }
        elem.style.setProperty("visibility", "visible");
        elem.textwriter="writing";
        item.style.minWidth=item.offsetWidth + "px"
        let text=Array.from(item.childNodes[0].textContent)
        item.childNodes[0].textContent="";
        item.style.setProperty("display", "block", "important");
        
        var n=0;
        await new Promise(function(resolve){
            let m=setInterval(()=>{
                if (n<text.length){
                    item.childNodes[0].textContent+=text[n++]
                }
                else{
                    clearInterval(m);
                    resolve();
                }
            }, 10);
        });
        elem.textwriter="done";
    })


        
    
    textwriter.delete=async function(elem){
        if (elem?.textwriter=="writing"){
            await new Promise((resolve)=>{
                let m=setInterval(()=>{
                    if (elem.textwriter=="done"){
                        clearInterval(m)
                        resolve()
                    }
                }, 500)
            })        
        } 
        let wrote=false;
        await asyncForEach(elem.children,async function(item){
            if (!["H4", "H2", "H3", "P", "A"].includes(item.tagName) || item.classList.contains("cursor-blink")){
                retval=item!=null?await textwriter.delete(item):null;
                return retval;
            }
            elem.textwriter="writing";
            wrote=true;
            item.style.minWidth=item.offsetWidth + "px"
            let text=Array.from(item.childNodes[0].textContent)
            parsedarray=item.childNodes[0].textContent.split(" ");
            let n=parsedarray.length;
            await new Promise(function(resolve){
                m=setInterval(()=>{
                if(n>0){
                    item.childNodes[0].textContent=parsedarray.slice(0, n---1).join(" ");
                }
                else{
                    clearInterval(m);
                    resolve();
                    console.log("executed");
                }}
            ,10)});
            item.style.setProperty("display", "none", "important");
            item.childNodes[0].textContent=text.join("");
            return Promise.resolve();
            });
            wrote?elem.style.visibility="hidden":null;
            elem.textwriter="done";    
        }
      
}
function init_cards(elem){
    let cards=elem.getElementsByClassName("card");
    window.addEventListener("resize", function handler(e){
        if (cards[0].style.animationPlayState=="running"){
            this.removeEventListener("resize", handler);
            console.log("this");
        }    
        else{
            init_cards(elem);
        }

    });
    let height=elem.clientHeight;
    let width=elem.clientWidth;

    Array.from(cards).forEach((card,index)=>{
    
        let translateheight=index<2?(height-(card.offsetHeight+Number.parseInt(window.getComputedStyle(card).marginTop)))/2:-(height-(card.offsetHeight+Number.parseInt(window.getComputedStyle(card).marginTop)))/2
        let translatewidth=index%2==0? (width-card.offsetWidth)/2:-(width-card.offsetWidth)/2
        let str="translate("+translatewidth+"px"+","+translateheight+"px"+")"
        card.style.setProperty("transform", str);
    });
}

function sidebar_cursor_inserter(){
    cursorelement=document.createElement("a")
    cursorelement.textContent="_"
    cursorelement.classList.add("cursor-blink");
    cursorelement.style.textDecoration="none";
    let elems=[].concat(Array.from(document.querySelectorAll("aside p")),Array.from(document.querySelectorAll("aside h4")),Array.from(document.querySelectorAll("aside a")));

    elems.forEach((item)=>{item.append(cursorelement.cloneNode(true))});
}
