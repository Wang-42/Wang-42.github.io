// danh sach gio hang
//const cartList = JSON.parse(sessionStorage.getItem("cartList"))
if (JSON.parse(sessionStorage.getItem("cartList")) == null) {
  let temp = [];
  window.sessionStorage.setItem("cartList",JSON.stringify(temp));
};

var cartItem = {
  "id": 0,
  "quantity": 1,
  "colors": 0
};

// kiem tra san pham trung
function isDuplicate(cart_item) {
  const cartList = JSON.parse(sessionStorage.getItem("cartList"));
  let flag = -1;
  cartList.forEach((item,index) => {
    if (cart_item.id == item.id && cart_item.colors == item.colors)
      flag = index;
  })
  return flag;
}

// Hàm này trả về chuỗi giá sản phẩm theo định dạng VN
function formatPrice(price) {
  const value = Number(price);
  if (Number.isNaN(value)) return "Đang cập nhật";
  return value.toLocaleString("vi-VN") + "₫";
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function createSpecItem(label, value) {
  return `
    <div>
      <dt>${label}</dt>
      <dd>${value || "Đang cập nhật"}</dd>
    </div>
  `;
}

function renderProduct(product) {
  if (!product) {
    document.body.innerHTML =
      "<h2 style='padding: 40px'>Không tìm thấy sản phẩm</h2>";
    return;
  }

  // title
  document.title = product.full_name || "Chi tiết sản phẩm";

  // breadcrumb / heading
  const breadcrumb = document.querySelector(".breadcrumb");
  const productName = document.getElementById("productName");
  const detailTitle = document.getElementById("detailTitle");


  breadcrumb.children[2].children[0].textContent = product.brand;
  breadcrumb.children[2].children[0].setAttribute("href", "./" + product.brand.toLowerCase() + ".html");

  const pdCrumb = document.createElement("li");
  pdCrumb.innerHTML = "<a href=\"#\">" + product.product_name + "</a></li>";
  const sep = document.createElement("span");
  sep.textContent = "/";
  breadcrumb.appendChild(sep);
  breadcrumb.appendChild(pdCrumb); 

  if (productName) {
    productName.textContent = product.full_name || "Sản phẩm";
  }

  if (detailTitle) {
    detailTitle.textContent = `Những điểm nổi bật của ${
      product.short_name || product.full_name || "sản phẩm"
    }`;
  }

  // image
  const mainImage = document.getElementById("mainProductImage");
  const firstColor =
    Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors[0]
      : null;

  if (mainImage) {
    if (firstColor?.image) {
      mainImage.src = firstColor.image;
      mainImage.alt = `${product.full_name || "Sản phẩm"} - ${
        firstColor.variant || "Mặc định"
      }`;
    } else {
      mainImage.removeAttribute("src");
      mainImage.alt = product.full_name || "Sản phẩm";
    }
  }

  // price
  const salePrice = document.getElementById("salePrice");
  const originalPrice = document.getElementById("originalPrice");
  const discountNote = document.getElementById("discountNote");

  const sale = Number(product.pricing?.sale_price || 0);
  const original = Number(product.pricing?.original_price || 0);
  const discount = Number(product.pricing?.discount_percent || 0);
  const savedMoney = Math.max(original - sale, 0);

  if (salePrice) {
    salePrice.textContent = sale > 0 ? formatPrice(sale) : "Đang cập nhật";
  }

  if (originalPrice) {
    originalPrice.textContent =
      original > 0 ? formatPrice(original) : "Đang cập nhật";
  }

  if (discountNote) {
    discountNote.textContent =
      discount > 0 && savedMoney > 0
        ? `Giảm trực tiếp ${formatPrice(savedMoney)}, tương đương ${discount}%.`
        : "Sản phẩm đang được bán theo giá niêm yết.";
  }

  // colors
  const colorOptions = document.getElementById("colorOptions");
  if (colorOptions) {
    colorOptions.innerHTML = "";

    (product.colors || []).forEach((color, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `color-chip ${index === 0 ? "is-selected" : ""}`;
      btn.textContent = color.variant || `Màu ${index + 1}`;

      // cartItem color index
      btn.setAttribute("data-index", index);

      btn.addEventListener("click", () => {
        document.querySelectorAll(".color-chip").forEach((item) => {
          item.classList.remove("is-selected");
        });

        btn.classList.add("is-selected");

        cartItem.colors = btn.dataset.index;
        console.log(cartItem);

        if (mainImage && color.image) {
          mainImage.src = color.image;
          mainImage.alt = `${product.full_name || "Sản phẩm"} - ${
            color.variant || "Mặc định"
          }`;
        }
      });

      colorOptions.appendChild(btn);
    });
  }

  // thanh-toan gio-hang
  document.querySelectorAll(".cta-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      let cart_index = isDuplicate(cartItem);
      if (cart_index == -1) {
        const cartList = JSON.parse(sessionStorage.getItem("cartList"));
        cartList.push(cartItem);
        window.sessionStorage.setItem("cartList",JSON.stringify(cartList));
      }
      else {
        const cartList = JSON.parse(sessionStorage.getItem("cartList"));
        cartList[cart_index].quantity++;
        window.sessionStorage.setItem("cartList",JSON.stringify(cartList));
      }
    })
  })

  // specs
  const categoryProduct = product.category;
  const specList = document.getElementById("specList");

  if (specList) {
    if (categoryProduct === "smartphone") {
      specList.innerHTML = `
        ${createSpecItem("Màn hình", product.display)}
        ${createSpecItem("Chip", product.chip)}
        ${createSpecItem("RAM / ROM", product.ram_rom)}
        ${createSpecItem("Camera sau", product.main_camera)}
        ${createSpecItem("Camera trước", product.selfie_camera)}
        ${createSpecItem("Hệ điều hành", product.os)}
        ${createSpecItem("Độ bền", product.durability)}
      `;
    } else {
      specList.innerHTML = `
        ${createSpecItem("Khả năng kết nối", product.connectivity)}
        ${createSpecItem("Chuẩn sạc", product.charging_port)}
        ${createSpecItem("Chip", product.chip)}
        ${createSpecItem("Công nghệ âm thanh", product.audio_technology)}
        ${createSpecItem("Mic", product.microphone)}
        ${createSpecItem("Điều khiển", product.controls)}
        ${createSpecItem("Dung lượng pin", product.battery)}
        ${createSpecItem("Độ bền", product.water_resistance)}
      `;
    }
  }

  // description
  const detailStory = document.getElementById("detailStory");
  if (detailStory) {
    let html = "";

    if (product.description?.intro?.length) {
      html += product.description.intro
        .map((text) => `<p>${text}</p>`)
        .join("");
    }

    if (product.description?.sections?.length) {
      html += product.description.sections
        .map(
          (section) => `
            <h3>${section.title || "Thông tin thêm"}</h3>
            <p>${section.content || "Đang cập nhật"}</p>
          `,
        )
        .join("");
    }

    detailStory.innerHTML = html || "<p>Đang cập nhật nội dung chi tiết.</p>";
  }
}

async function initProductDetail() {
  try {
    const response = await fetch(
      "./asset/chi-tiet-san-pham/product-detail.json",
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const products = await response.json();

    const slug = getQueryParam("slug");
    const id = getQueryParam("id");

    // cartItem product id
    cartItem.id = id;
    cartItem.id--;

    let product = null;

    if (slug) {
      product = products.find((item) => item.slug === slug);
    } else if (id) {
      product = products.find((item) => String(item.id) === String(id));
    }

    // fallback: nếu không có slug/id thì lấy sản phẩm đầu tiên
    if (!product && Array.isArray(products) && products.length > 0) {
      product = products[0];
    }

    renderProduct(product);
  } catch (error) {
    console.error("Lỗi load dữ liệu sản phẩm:", error);
    document.body.innerHTML =
      "<h2 style='padding: 40px'>Không thể tải dữ liệu sản phẩm</h2>";
  }
}

document.addEventListener("DOMContentLoaded", initProductDetail);
