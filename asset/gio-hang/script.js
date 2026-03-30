// import sanpham.json
async function getData() {
  const respone = await fetch("/asset/chi-tiet-san-pham/product-detail.json");
  return respone.json();
}

//fetch cartList
const cartList = JSON.parse(sessionStorage.getItem("cartList"));
console.log(cartList);

// check if cart is empty

async function emptyCart() {
  const cart__content = document.querySelector(".cart__content");
  const cart_empty = document.querySelector(".cart-empty");
  if (cartList == null || cartList.length == 0) {
    cart_empty.classList.remove("display-none");
    cart__content.classList.add("display-none");
  } else {
    cart__content.classList.remove("display-none");
    cart_empty.classList.add("display-none");
  }

  return Promise.resolve();
}

/* populate and add function to item */

async function populate() {
  const sanpham = await getData();
  for (let i = 0; i < cartList.length; i++) {
    // addItem(i);
    addItem(cartList[i], i, sanpham);
  }

  return Promise.resolve();
}

function addItem(cartItem, cartIndex, sanpham) {
  const cart__item_box = document.querySelector(".cart__item-box");
  const cart__item = document.createElement("div");
  cart__item.classList.add("cart__item");
  cart__item.setAttribute("data-index", cartIndex);
  cart__item_box.appendChild(cart__item);

  const loader_container = document.createElement("div");
  const cart_item__img = document.createElement("div");
  const cart_item__quantity = document.createElement("div");
  const cart_item__info = document.createElement("div");
  const cart_item__remove = document.createElement("div");
  const cart_item__remove_popover = document.createElement("div");

  loader_container.classList.add("loader-container", "display-none");
  cart_item__img.classList.add("cart_item__img");
  cart_item__quantity.classList.add("cart_item__quantity");
  cart_item__info.classList.add("cart_item__info");
  cart_item__remove.classList.add("cart_item__remove");
  cart_item__remove_popover.classList.add("cart_item__remove_popover");

  cart__item.appendChild(loader_container);
  cart__item.appendChild(cart_item__img);
  cart__item.appendChild(cart_item__quantity);
  cart__item.appendChild(cart_item__info);
  cart__item.appendChild(cart_item__remove);
  cart__item.appendChild(cart_item__remove_popover);

  // loader
  const loader = document.createElement("div");
  loader.classList.add("loader");
  loader_container.appendChild(loader);

  // item img
  const item_img = document.createElement("img");
  item_img.classList.add("item__img");
  if (cartItem.colors == null) {
    item_img.setAttribute("src", sanpham[cartItem.id].colors[0].image);
  } else {
    item_img.setAttribute(
      "src",
      sanpham[cartItem.id].colors[cartItem.colors].image,
    );
  }
  cart_item__img.appendChild(item_img);

  //item quantity
  const btn_plus = document.createElement("div");
  btn_plus.classList.add("btn-plus");
  const btn_plus_img = document.createElement("img");
  btn_plus_img.setAttribute("src", "./asset/gio-hang/images/up-arrow.jpg");
  btn_plus.appendChild(btn_plus_img);

  const quantity_number = document.createElement("div");
  quantity_number.innerHTML = cartItem.quantity;
  quantity_number.classList.add("quantity-number");
  quantity_number.setAttribute("data-quantity", cartItem.quantity);

  const btn_minus = document.createElement("div");
  btn_minus.classList.add("btn-minus");
  const btn_minus_img = document.createElement("img");
  btn_minus_img.setAttribute("src", "./asset/gio-hang/images/down-arrow.jpg");
  btn_minus.appendChild(btn_minus_img);

  cart_item__quantity.appendChild(btn_plus);
  cart_item__quantity.appendChild(quantity_number);
  cart_item__quantity.appendChild(btn_minus);

  //item info
  const item_name = document.createElement("h3");
  const item_variant = document.createElement("p");
  const item_price = document.createElement("p");

  item_name.classList.add("item-name");
  item_name.innerHTML = sanpham[cartItem.id].full_name;

  item_variant.classList.add("item-variant");

  item_variant.innerHTML = sanpham[cartItem.id].colors[cartItem.colors].variant;

  item_price.classList.add("item-price");

  item_price.innerHTML =
    addThousandsSeparator(sanpham[cartItem.id].pricing.sale_price) + " đ";

  cart_item__info.appendChild(item_name);
  cart_item__info.appendChild(item_variant);
  cart_item__info.appendChild(item_price);

  // remove item
  const trash_icon = document.createElement("div");
  trash_icon.classList.add("icon");
  const trash_icon_img = document.createElement("img");
  trash_icon_img.setAttribute("src", "./asset/gio-hang/images/trash-icon.png");
  trash_icon.appendChild(trash_icon_img);
  cart_item__remove.appendChild(trash_icon);

  // remove item popover
  const confirm_removal = document.createElement("div");
  confirm_removal.classList.add("confirm-removal");
  confirm_removal.innerHTML = "Xác nhận xóa sản phẩm?";

  const row = document.createElement("div");
  row.classList.add("row");
  const remove_agree = document.createElement("div");
  remove_agree.classList.add("btn");
  remove_agree.classList.add("cart_item__remove_agree");
  remove_agree.innerHTML = "Xóa";

  const remove_close = document.createElement("div");
  remove_close.classList.add("btn");
  remove_close.classList.add("cart_item__remove_close");
  remove_close.innerHTML = "Hủy";

  row.appendChild(remove_agree);
  row.appendChild(remove_close);

  cart_item__remove_popover.appendChild(confirm_removal);
  cart_item__remove_popover.appendChild(row);
}

async function changeItemQuantity() {
  const cart_item__quantity = document.getElementsByClassName(
    "cart_item__quantity",
  );
  const loader_container = document.querySelectorAll(
    ".cart__item > .loader-container",
  );

  for (let i = 0; i < cart_item__quantity.length; i++) {
    let current = cart_item__quantity[i];
    let btn_plus = current.children[0];
    let quantity = current.children[1];
    let btn_minus = current.children[2];
    let loader = loader_container[i];

    btn_plus.addEventListener("click", function () {
      loader.classList.remove("display-none");
      setTimeout(() => {
        loader.classList.add("display-none");
        quantity.dataset.quantity++;
        cartList[current.parentElement.dataset.index].quantity++;
        window.sessionStorage.setItem("cartList", JSON.stringify(cartList));
        quantity.innerHTML = quantity.dataset.quantity;
        updateTotalCost();
      }, 200);
    });

    btn_minus.addEventListener("click", function () {
      if (quantity.dataset.quantity > 1) {
        loader.classList.remove("display-none");
        setTimeout(() => {
          loader.classList.add("display-none");
          quantity.dataset.quantity--;
          cartList[current.parentElement.dataset.index].quantity--;
          window.sessionStorage.setItem("cartList", JSON.stringify(cartList));
          quantity.innerHTML = quantity.dataset.quantity;
          updateTotalCost();
        }, 200);
      }
    });
  }
}

function updateCartIndex() {
  let cart__item;
  for (
    let i = 0;
    i < document.getElementsByClassName("cart__item").length;
    i++
  ) {
    cart__item = document.getElementsByClassName("cart__item")[i];
    cart__item.setAttribute("data-index", i);
  }
}

function addRemoveFunct() {
  const rmbtn = document.querySelectorAll(".cart_item__remove");
  const loading = document.querySelector(".loader-container");

  for (let i = 0; i < rmbtn.length; i++) {
    let current = rmbtn[i];
    let popover = current.nextElementSibling;
    current.addEventListener("click", function () {
      popover.classList.add("popover");
    });
    let cart_item__remove_agree = document.getElementsByClassName(
      "cart_item__remove_agree",
    )[i];
    cart_item__remove_agree.addEventListener("click", function () {
      loading.classList.remove("display-none");
      // remove item from cart
      setTimeout(() => {
        loading.classList.add("display-none");
        cartList.splice(current.parentElement.dataset.index, 1);
        emptyCart();
        console.log(cartList);
        window.sessionStorage.setItem("cartList", JSON.stringify(cartList));
        cart_item__remove_agree.parentElement.parentElement.parentElement.remove();
        updateCartIndex();
        updateTotalCost();
      }, 200);
    });
    let cart_item__remove_close = document.getElementsByClassName(
      "cart_item__remove_close",
    )[i];
    cart_item__remove_close.addEventListener("click", function () {
      popover.classList.remove("popover");
    });
  }
}

// total cost

async function updateTotalCost() {
  const sanpham = await getData();

  //total cost
  let totalCost = 0;
  for (let i = 0; i < cartList.length; i++) {
    totalCost +=
      sanpham[cartList[i].id].pricing.sale_price * cartList[i].quantity;
  }
  console.log(totalCost);

  //update html
  const cost_amount = document.querySelector(".cart_cost__amount");
  cost_amount.innerHTML = addThousandsSeparator(totalCost) + " đ";
  cost_amount.setAttribute("data-total-cost", totalCost);

  // for thanh toan
  sessionStorage.setItem("totalCost", cost_amount.dataset.totalCost);
  sessionStorage.setItem("totalCostVND", cost_amount.innerHTML);

  return Promise.resolve();
}

function addThousandsSeparator(price) {
  let intToPrice = "";
  let totalCost_string = JSON.stringify(price);
  let start = 0;
  let end = totalCost_string.length % 3;
  end == 0 ? (end = 3) : 0;
  let temp = end;
  intToPrice += totalCost_string.slice(start, end) + ",";
  for (let i = totalCost_string.length - temp; i > 3; i -= 3) {
    start = end;
    end += 3;
    intToPrice += totalCost_string.slice(start, end) + ",";
  }
  intToPrice += totalCost_string.slice(
    totalCost_string.length - 3,
    totalCost_string.length,
  );
  return intToPrice;
}

async function main() {
  await emptyCart();
  await populate();
  updateTotalCost();
  addRemoveFunct();
  changeItemQuantity();
}

document.addEventListener("DOMContentLoaded", main);
