function updateTotalCost() {
    const cart_cost= document.querySelector(".cart_cost__amount");
    const totalCostVND = sessionStorage.getItem("totalCostVND");
    cart_cost.innerHTML = totalCostVND;
}

function display_shipping(e) {
    const shipping = document.querySelector(".cart_checkout_info.shipping");
    if (e) {
        shipping.classList.remove("display_none");
    } else {
        shipping.classList.add("display_none");
    }
}

function shipping_checkbox() {
    const checkout_checkbox = document.querySelector(".checkout_checkbox");
    const shipping = checkout_checkbox.children[0];
    checkout_checkbox.addEventListener("click",function() {
        display_shipping(shipping.checked);
    });
}

function payments_options() {
    const payments_item = document.querySelectorAll(".payments_item");
    for (i = 0; i < payments_item.length; i++) {
        let curr = payments_item[i];
        curr.addEventListener("click", function() {
            for (j = 0; j < payments_item.length; j++) {
                if (payments_item[j].classList.contains("active")) {
                    payments_item[j].classList.remove("active");
                    payments_item[j].children[0].children[0].removeAttribute("checked");
                    payments_item[j].children[1].classList.remove("active");
                };
            }
            if (curr.classList.contains("active") == false) {
                curr.classList.add("active");
                curr.children[0].children[0].setAttribute("checked","");
                curr.children[1].classList.add("active");
            };
        });
    };
}

function main(){
    updateTotalCost();
    shipping_checkbox();
    payments_options();
}

main();