import items from "./items.json";
import formatCurrency from "./util/formatCurrency";

const IMAGE_URL = "https://dummyimage.com/600x360";

const storeItemContainer = document.querySelector("[data-store-container]");

function createItem(item) {
  if (!storeItemContainer) return;
  const storeItemtemplate = document.querySelector("#store-item-template");

  const storeItem = storeItemtemplate.content.cloneNode(true);

  const container = storeItem.querySelector("[data-store-item]");
  container.dataset.id = item.id;

  const name = storeItem.querySelector("[data-name]");
  name.innerText = item.name;

  const category = storeItem.querySelector("[data-category]");
  category.innerText = item.category;

  const image = storeItem.querySelector("[data-image]");
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

  const price = storeItem.querySelector("[data-price]");
  price.innerText = formatCurrency(item.priceCents / 100);

  storeItemContainer.appendChild(storeItem);
}

export function setupStore() {
  items.forEach(createItem);
}
