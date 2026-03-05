/*-----remove item-----*/
//toggle popover
const rmbtn = document.getElementsByClassName("cart_item__remove");

for (let i = 0;i < rmbtn.length;i++) {
    let current = rmbtn[i];
    let popover = current.nextElementSibling;
    current.addEventListener("click", function(){
        popover.classList.add("popover");
    });
    let cart_item__remove_agree = document.getElementsByClassName("cart_item__remove_agree")[i];
    cart_item__remove_agree.addEventListener("click", function(){
        cart_item__remove_agree.parentElement.parentElement.parentElement.remove();
    });
    let cart_item__remove_close = document.getElementsByClassName("cart_item__remove_close")[i];
    cart_item__remove_close.addEventListener("click",function() {
        popover.classList.remove("popover");
    });
};


