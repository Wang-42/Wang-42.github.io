// import sanpham.json
const sanpham = fetch('./asset/sanpham.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(sanpham => {
        console.log(sanpham);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

console.log(JSON.parse(sessionStorage.getItem("cartList")));

function addItem(itemID) {
    const cart__item_box = document.querySelector("cart__item-box")
}

function main() {
    // remove item onclick events
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


}
main();