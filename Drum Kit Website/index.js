var a=["sounds/tom-1.mp3","sounds/tom-2.mp3","sounds/tom-3.mp3","sounds/tom-4.mp3","sounds/snare.mp3","sounds/crash.mp3","sounds/kick-bass.mp3"];
for(var i=0;i<7;i++){
document.querySelectorAll(".drum")[i].addEventListener("click",function(){
    var btnInnerHTML=this.innerHTML;
    switchChecker(btnInnerHTML);
    buttonAnim(btnInnerHTML);
});}
document.addEventListener("keydown",function (event) {
    switchChecker(event.key);
    buttonAnim(event.key);
})
function switchChecker(key){
        switch (key){
        case "w":
            var audio = new Audio(a[0]);
            audio.play();
            break;
        case "a":
            var audio = new Audio(a[1]);
            audio.play();
            break;
        case "s":
            var audio = new Audio(a[2]);
            audio.play();
            break;
        case "d":
            var audio = new Audio(a[3]);
            audio.play();
            break;
        case "j":
            var audio = new Audio(a[4]);
            audio.play();
            break;
        case "k":
            var audio = new Audio(a[5]);
            audio.play();
            break;
        case "l":
            var audio = new Audio(a[6]);
            audio.play();
            break;
        default:
            break
        }
}
function buttonAnim(key){
    var buttonPressed=document.querySelector("."+key);
    buttonPressed.classList.add("pressed");
    setTimeout(function(){
        buttonPressed.classList.remove("pressed");
    },100);
}
// var a=["sounds/tom-1.mp3","sounds/tom-2.mp3","sounds/tom-3.mp3","sounds/tom-4.mp3","sounds/snare.mp3","sounds/crash.mp3","sounds/kick-bass.mp3"];
// for(var i=0;i<7;i++){
// document.querySelectorAll(".drum")[i].addEventListener("click",function(){
//     var audio=new Audio(a[i]);
//     audio.play()
//     });}  This one doesnt work because when the fumction is called the for loop is already over so audio element cannot be created