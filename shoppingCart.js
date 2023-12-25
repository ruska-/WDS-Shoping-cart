import items from "./items.json";
import formatCurrency from "./util/formatCurrency";

const cartButton = document.querySelector("[data-cart-button]");
const cartItemsWrapper = document.querySelector("[data-cart-items-wrapper]");
let shoppingCart = loadCart();
const IMAGE_URL = "https://dummyimage.com/210x130";
const cartItemContainer = document.querySelector("[data-cart-container]");
const cartItemtemplate = document.querySelector("#cart-item-template");
const cartQuantityElem = document.querySelector("[data-cart-quantity]");
const cartTotalAmount = document.querySelector("[data-cart-total-amount]");
const shoppingCartElem = document.querySelector("[data-shopping-cart]");
const SESSION_STORAGE_KEY = "SHOPPING_CART-cart";

export function setupShoppingCart() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-add-to-cart-button]")) {
      const itemId = e.target.closest("[data-store-item]").dataset.id;
      addToCart(parseInt(itemId));
    }

    if (e.target.matches("[data-remove-from-cart-button]")) {
      const itemId = e.target.closest("[data-cart-item-container]").dataset.id;
      removeFromCart(parseInt(itemId));
    }
  });

  cartButton.addEventListener("click", (e) => {
    cartItemsWrapper.classList.toggle("invisible");
  });

  shoppingCart = loadCart();
  renderCart();
}

export function addToCart(id) {
  const item = shoppingCart.find((i) => i.id === id);
  if (!item) {
    shoppingCart.push({ id: id, quantity: 1 });
  } else {
    item.quantity++;
  }

  cartItemContainer.innerHTML = "";
  renderCart();
  saveCart();
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

function loadCart() {
  return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) || [];
}

function createItem(shoppingCartItem) {
  const cartItem = cartItemtemplate.content.cloneNode(true);

  const item = items.find((i) => shoppingCartItem.id == i.id);

  const container = cartItem.querySelector("[data-cart-item-container]");
  container.dataset.id = item.id;

  const name = cartItem.querySelector("[data-cart-item-name]");
  name.innerText = item.name;

  const quantity = cartItem.querySelector("[data-cart-item-quantity]");
  if (shoppingCartItem.quantity > 1)
    quantity.innerText = `x${shoppingCartItem.quantity}`;

  const image = cartItem.querySelector("[data-cart-item-image]");
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

  const price = cartItem.querySelector("[data-cart-item-price-total]");
  price.innerText = formatCurrency(
    (item.priceCents * shoppingCartItem.quantity) / 100
  );

  cartItemContainer.appendChild(cartItem);
}

function removeFromCart(id) {
  const item = shoppingCart.find((i) => i.id === id);
  if (item.quantity === 1) {
    shoppingCart = shoppingCart.filter((i) => i.id !== id);
  } else {
    item.quantity--;
  }

  renderCart();
  saveCart();
}

function calculateCartTotal() {
  return shoppingCart.reduce((sum, shoppingCartItem) => {
    const item = items.find((i) => i.id === shoppingCartItem.id);
    sum = sum + (item.priceCents * shoppingCartItem.quantity) / 100;
    return sum;
  }, 0);
}

function calculateCartItemsQuantity() {
  return shoppingCart.reduce((sum, item) => {
    return (sum += item.quantity);
  }, 0);
}

function renderCart() {
  if (shoppingCart.length === 0) {
    shoppingCartElem.classList.add("invisible");
    return;
  }

  if (shoppingCart.length === 1) {
    shoppingCartElem.classList.remove("invisible");
  }

  const cartTotalQuantity = calculateCartItemsQuantity();
  cartItemContainer.innerHTML = "";
  
  shoppingCart.forEach((item) => createItem(item));
  cartQuantityElem.innerText = cartTotalQuantity;
  cartTotalAmount.innerText = formatCurrency(calculateCartTotal());
}
