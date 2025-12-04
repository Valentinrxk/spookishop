// *¨Filter dropdowns

const colorFilterContainer = document.querySelector(".color-filter"),
  colorFilterTitle = document.querySelector(".color-filter h4"),
  genreFilterContainer = document.querySelector(".genre-filter"),
  genreFilterTitle = document.querySelector(".genre-filter h4"),
  colorForm = document.getElementById("filter-color-form"),
  categoriesForm = document.getElementById("filter-categories-form"),
  productsContainer = document.querySelector(".shop-products"),
  clearFilters = document.querySelector(".clear-filters");

const dropdown = (container, title) => {
  title.addEventListener("click", () => {
    container.classList.toggle("dropdown-closed");
    if (title.innerHTML === `<i class="fa-solid fa-caret-down"></i>Por color`) {
      title.innerHTML = `<i class="fa-solid fa-caret-right"></i>Por color`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-right"></i>Por color`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-down"></i>Por color`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-down"></i>Por tipo`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-right"></i>Por tipo`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-right"></i>Por tipo`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-down"></i>Por tipo`;
    }
  });
};

const filterDropdowns = () => {
  dropdown(colorFilterContainer, colorFilterTitle);
  dropdown(genreFilterContainer, genreFilterTitle);
};

// * Fetching local json

const fetchproducts = async () => {
  try {
    let getProducts = fetch("assets/json/data.json"),
      products = await (await getProducts).json();
    renderShop(products);
    return products;
  } catch (err) {
    console.log(err);
  }
};

const renderShop = async (products) => {
  let product = await products;
  let card = product.map((item) => renderCard(item)).join("");
  productsContainer.innerHTML = card;
};

const renderCard = (products) => {
  let { title, image, price, color } = products;
  return `<div class="products-card">
  <div class="title">
      <h5>${title}</h5>
  </div>
  <img src="${image}" alt="imagen del producto" draggable="false">
  <span class="products-price">
      $${price}
  </span>
  <div class="products-size">
      <select>
          <option selected disabled>Elija un talle</option>
          <option>Chico</option>
          <option>Mediano</option>
          <option>Grande</option>
          <option>Extra grande</option>
      </select>
      <span class="custom-caret">
          <i class="fa-solid fa-caret-down"></i>
      </span>
  </div>
  <div class="products-cart" data-name="${title}" data-image="${image}" data-price="${price}" data-color="${color}">
      <span>Agregar al carrito</span>
      <i class="fa-solid fa-cart-plus"></i>
  </div>
</div>
  `;
};

// * Filtering

// Input options

const orange = document.getElementById("orange-cb"),
  black = document.getElementById("black-cb"),
  pink = document.getElementById("pink-cb"),
  sale = document.getElementById("discount-cb"),
  newCollection = document.getElementById("new-cb");

const filterShopByColor = async (products) => {
  let product = await products;

  if (orange.checked) {
    let card = product
      .filter((item) => item.color === "Orange")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (black.checked) {
    let card = product
      .filter((item) => item.color === "Black")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (pink.checked) {
    let card = product
      .filter((item) => item.color === "Pink")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  }
};

const filterByCategories = async (products) => {
  let product = await products;

  if (sale.checked) {
    let card = product
      .filter((item) => item.type === "Sale")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (newCollection.checked) {
    let card = product
      .filter((item) => item.type === "New")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  }
};

const showClearFiltersButton = () => {
  clearFilters.style.display = "flex";
  setTimeout(() => {
    clearFilters.style.opacity = "1";
  }, 100);
};

const hideClearFiltersButton = () => {
  clearFilters.style.opacity = "0";
  clearFilters.style.display = "none";
};

const clearFormChecks = () => {
  colorForm.reset();
  categoriesForm.reset();
};

// Adding product to cart

let cartInfo = JSON.parse(localStorage.getItem("cart")) || [],
  cartBuyButton = document.querySelector(".cart-btn");

const saveToLocalStorage = (cartList) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};

const getItemData = (name, price, image, color, size) => {
  return { name, price, image, color, size };
};

const createShopItem = (item) => {
  cartInfo = [...cartInfo, item];
};

const renderCartCard = (item) => {
  let { name, price, image, color, size } = item;
  return `
<div class="cart-items-card">
  <img src="${image}" alt="vista previa del artículo del carrito" draggable="false">
  <div class="cart-item-info">
    <h4>Remera ${name}</h4>
    <h5>${color}</h5>
    <h6>${size}</h6>
    <p class="cart-item-price">Precio: $${price}</p>
  </div>
</div>
  `;
};

const renderCart = (cartList) => {
  let containter = document.querySelector(".cart-items-card-container");
  let cartCard = cartList.map((item) => renderCartCard(item)).join("");
  containter.innerHTML = cartCard;
};

const renderEmptyCartMsg = (cart) => {
  let msg = document.querySelector(".empty-msg");
  if (!cart.length) {
    return (msg.style.display = "block");
  }
  msg.style.display = "none";
};

const addProductToCart = () => {
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("products-cart")) {
      return;
    }
    let order = e.target.dataset,
      size = e.target.parentElement.children[3].children[0].value;
    let { name, price, image, color } = order;
    let shopItemData = getItemData(name, price, image, color, size);
    if (size === "Elija un talle") {
      return renderMsg(false, "Por favor, seleccione un talle de remera");
    } else {
      renderMsg(
        true,
        `La remera ${shopItemData.name} ${shopItemData.color} se ha añadido a su carrito`
      );
      createShopItem(shopItemData);
      saveToLocalStorage(cartInfo);
      renderCart(cartInfo);
      renderTotal();
      renderEmptyCartMsg(cartInfo);
      manageButtons(cartBuyButton);
    }
  });
};

const manageButtons = (button) => {
  let clearCart = document.querySelector(".clear-cart");
  if (!cartInfo.length) {
    clearCart.style.display = "none";
    button.classList.add("btn-disabled");
    button.classList.remove("btn-active");
    return;
  }
  clearCart.style.display = "block";
  button.classList.remove("btn-disabled");
  button.classList.add("btn-active");
};

const clearCart = () => {
  let cartPopup = document.querySelector(".cart-popup");
  cartPopup.addEventListener("click", (e) => {
    if (!e.target.classList.contains("clear-cart")) {
      return;
    }
    cartInfo = [];
    saveToLocalStorage([]);
    renderCart([]);
    renderTotal();
    renderEmptyCartMsg([]);
    manageButtons(cartBuyButton);
  });
};

const finishOrder = () => {
  cartPopup.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-active")) {
      return;
    } else if (confirm("¿Desea comprar ahora?")) {
      alert("¡Gracias por confiar en nosotros! :)");
      cartInfo = [];
      renderTotal();
      saveToLocalStorage([]);
      renderCart([]);
      renderEmptyCartMsg([]);
    }
  });
};

const getCartTotal = () => {
  return cartInfo.reduce((prevVal, currentVal) => {
    return prevVal + Number(currentVal.price);
  }, 0);
};

const renderTotal = () => {
  let total = document.querySelector(".cart-total");
  total.innerHTML = `
  $ ${getCartTotal().toFixed(2)}
  `;
};

const renderMsg = (valid = false, msg = "") => {
  let message = document.querySelector(".msg");
  if (!valid) {
    setTimeout(() => {
      message.style.transform = "translateY(0)";
      message.style.backgroundColor = "#db8d82";
      message.innerHTML = `${msg} <i class="fa-solid fa-circle-xmark"></i>`;
    }, 400);
    setTimeout(() => {
      message.style.transform = "translateY(100%)";
    }, 2000);
  } else {
    setTimeout(() => {
      message.style.transform = "translateY(0)";
      message.style.backgroundColor = "#7db17d";
      message.innerHTML = `${msg} <i class="fa-solid fa-circle-check"></i>`;
    }, 400);
    setTimeout(() => {
      message.style.transform = "translateY(100%)";
    }, 2000);
  }
};

const init = () => {
  fetchproducts();
  filterDropdowns();
  colorForm.addEventListener("change", () => {
    filterShopByColor(fetchproducts());
    showClearFiltersButton();
  });
  categoriesForm.addEventListener("change", () => {
    filterByCategories(fetchproducts());
    showClearFiltersButton();
  });
  clearFilters.addEventListener("click", () => {
    hideClearFiltersButton();
    clearFormChecks();
    renderShop(fetchproducts());
  });
  addProductToCart();
  document.addEventListener("DOMContentLoaded", () => {
    renderEmptyCartMsg(cartInfo);
    renderCart(cartInfo);
    manageButtons(cartBuyButton);
    renderTotal();
  });
  clearCart();
  finishOrder();
};

init();
