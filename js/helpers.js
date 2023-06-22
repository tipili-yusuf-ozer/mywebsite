function Stylesheets(title){ //Rules in the document titled as parameter

    Array.from(document.styleSheets).forEach((item)=>{
        if (item.title==title)
        {
            this.sheet=item; 
            }
        });
    
this.getRule= (ruleselector)=>{ //returns the rule that modifies the property(written in css notaiton)
    return Array.from(this.sheet.cssRules).filter((item)=>{
        if (item.type!=item.STYLE_RULE){
            return false;
        }
        if (item.selectorText.includes(ruleselector)){
            return true;
        }
    })[0];
};
}
async function asyncForEach(arr, callback){
for (let i=0; i<arr.length; i++){
    await callback(arr[i])
}
}