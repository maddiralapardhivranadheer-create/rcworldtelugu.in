/* ================= CART ================= */

let cart = [];

let selectedProduct = null;
let directBuyProduct = null;


/* ADD TO CART */

function addToCart(name, price) {

    const product = Array.from(document.querySelectorAll(".product-card"))
        .find(card => card.getAttribute("data-name") === name);
    if (product && product.dataset.stock === "out") {
        alert(name + " is currently out of stock.");
        return;
    }

    cart.push({
        name: name,
        price: price
    });

    updateCart();

    alert(name + " added to cart!");

}


/* UPDATE CART */

function updateCart() {

    const cartCount = document.getElementById("cart-count");

    const cartItems = document.getElementById("cartItems");

    const cartTotal = document.getElementById("cartTotal");


    cartCount.textContent = cart.length;


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price;


        const div = document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <div>

                <strong>${item.name}</strong>

                <p>₹${item.price.toLocaleString("en-IN")}</p>

            </div>

            <button onclick="removeFromCart(${index})">

                Remove

            </button>

        `;


        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN");

}


/* REMOVE FROM CART */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* OPEN CART */

function openCart() {

    document
        .getElementById("cartPanel")
        .classList.add("open");

}


/* CLOSE CART */

function closeCart() {

    document
        .getElementById("cartPanel")
        .classList.remove("open");

}


/* ================= SEARCH ================= */

function openSearch() {

    document.getElementById("searchBox").style.display = "flex";

    document.getElementById("searchInput").focus();

}


function closeSearch() {

    document.getElementById("searchBox").style.display = "none";

}


document.querySelectorAll(".terrain-card").forEach((card) => {
    card.addEventListener("click", function () {
        const keyword = this.querySelector("h3").textContent.trim().toLowerCase();
        const category = (this.dataset.category || keyword).toLowerCase().trim();

        document.querySelectorAll(".terrain-card").forEach((item) => {
            item.classList.toggle("active", item === this);
        });

        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.value = category;
            searchProducts(category);
        }

        const productsSection = document.getElementById("products");
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});


function searchProducts(searchText) {

    const rawSearch = (searchText ?? document.getElementById("searchInput").value ?? "").toString();
    const search = rawSearch.toLowerCase().trim();
    const terrainCategories = ["rocks", "mud", "desert", "forest"];

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const name = (product.getAttribute("data-name") || "").toLowerCase();
        const category = (product.getAttribute("data-category") || "").toLowerCase();
        const keywords = (product.getAttribute("data-keywords") || "").toLowerCase();

        if (!search) {
            product.style.display = "block";
            return;
        }

        const exactTerrainCategory = terrainCategories.includes(search);

        if (exactTerrainCategory) {
            product.style.display = category === search ? "block" : "none";
            return;
        }

        const matches =
            name.includes(search) ||
            category.includes(search) ||
            keywords.includes(search);

        product.style.display = matches ? "block" : "none";
    });

}

function addBuyNowButtons() {
    document.querySelectorAll(".product-card").forEach((product) => {
        const bottom = product.querySelector(".product-bottom");
        if (!bottom || bottom.querySelector(".buy-now-btn")) return;

        const buyNowBtn = document.createElement("button");
        buyNowBtn.type = "button";
        buyNowBtn.className = "buy-now-btn";
        buyNowBtn.textContent = "BUY NOW";
        buyNowBtn.addEventListener("click", function () {
            const name = product.getAttribute("data-name");
            const priceText = product.querySelector("strong");
            const price = Number((priceText ? priceText.textContent : "0").replace(/[^\d]/g, ""));

            if (name) {
                buyNow(name, price);
            }
        });

        bottom.appendChild(buyNowBtn);
    });
}


/* ================= WISHLIST ================= */

function toggleWishlist(button) {

    button.classList.toggle("active");


    if (button.classList.contains("active")) {

        button.innerHTML = "♥";

    } else {

        button.innerHTML = "♡";

    }

}


/* ================= PRODUCT MODAL ================= */

function showProduct(name, price, specs, image) {

    selectedProduct = {
        name: name,
        price: parseInt(price.replace(/[₹,]/g, ""))
    };


    document.getElementById("modalName").textContent = name;

    document.getElementById("modalPrice").textContent = price;

    document.getElementById("modalSpecs").textContent = specs;

    document.getElementById("modalImage").src = image;


    document.getElementById("productModal").style.display = "flex";

}


function closeProduct() {

    document.getElementById("productModal").style.display = "none";

}


function addModalProduct() {

    if (selectedProduct) {

        addToCart(
            selectedProduct.name,
            selectedProduct.price
        );

        closeProduct();

    }

}

function buyNow(name, price) {
    const product = Array.from(document.querySelectorAll(".product-card"))
        .find(card => card.getAttribute("data-name") === name);
    if (product && product.dataset.stock === "out") {
        alert(name + " is currently out of stock.");
        return;
    }

    directBuyProduct = {
        name: name,
        price: Number(price)
    };

    closeProduct();
    document.getElementById("orderModal").style.display = "flex";
}

function buyNowFromModal() {
    if (selectedProduct) {
        buyNow(selectedProduct.name, selectedProduct.price);
    }
}


/* ================= ADMIN PANEL ================= */

function createProductCard(name, price, specs, image, category = "rocks", inStock = true) {

    const productGrid = document.getElementById("productGrid");

    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-name", name);
    card.setAttribute("data-category", category);
    card.setAttribute("data-keywords", name.toLowerCase() + " " + category + " offroad rc");
    card.dataset.stock = inStock ? "in" : "out";

    const productImage = document.createElement("div");
    productImage.className = "product-image";

    const img = document.createElement("img");
    img.src = image || "images/car1.jpg";
    img.alt = name;

    const wishlistBtn = document.createElement("button");
    wishlistBtn.className = "wishlist";
    wishlistBtn.textContent = "♡";
    wishlistBtn.addEventListener("click", function () {
        toggleWishlist(this);
    });

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "NEW";

    productImage.appendChild(img);
    productImage.appendChild(wishlistBtn);
    productImage.appendChild(badge);

    const productInfo = document.createElement("div");
    productInfo.className = "product-info";

    const meta = document.createElement("p");
    meta.textContent = "1:10 SCALE • 4WD";

    const title = document.createElement("h3");
    title.textContent = name.toUpperCase();

    const specRow = document.createElement("div");
    specRow.className = "specs";

    const speed = document.createElement("span");
    speed.textContent = "⚡ " + specs.split("•")[0].trim();

    const battery = document.createElement("span");
    battery.textContent = "🔋 " + (specs.split("•")[2] ? specs.split("•")[2].trim() : "2000mAh");

    specRow.appendChild(speed);
    specRow.appendChild(battery);

    const productBottom = document.createElement("div");
    productBottom.className = "product-bottom";

    const priceTag = document.createElement("strong");
    priceTag.textContent = "₹" + Number(price).toLocaleString("en-IN");

    const addBtn = document.createElement("button");
    addBtn.textContent = "ADD +";
    addBtn.addEventListener("click", function () {
        addToCart(name, price);
    });

    const buyNowBtn = document.createElement("button");
    buyNowBtn.textContent = "BUY NOW";
    buyNowBtn.className = "buy-now-btn";
    buyNowBtn.addEventListener("click", function () {
        buyNow(name, price);
    });

    productBottom.appendChild(priceTag);
    productBottom.appendChild(addBtn);
    productBottom.appendChild(buyNowBtn);

    const stockBadge = document.createElement("span");
    stockBadge.className = "stock-badge";
    stockBadge.textContent = inStock ? "IN STOCK" : "OUT OF STOCK";
    stockBadge.classList.toggle("out", !inStock);
    productInfo.appendChild(stockBadge);

    if (!inStock) {
        addBtn.disabled = true;
        buyNowBtn.disabled = true;
        addBtn.textContent = "OUT OF STOCK";
        buyNowBtn.textContent = "OUT OF STOCK";
    }

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "details-btn";
    detailsBtn.textContent = "VIEW VEHICLE";
    detailsBtn.addEventListener("click", function () {
        showProduct(name, "₹" + Number(price).toLocaleString("en-IN"), specs, image || "images/car1.jpg");
    });

    productInfo.appendChild(meta);
    productInfo.appendChild(title);
    productInfo.appendChild(specRow);
    productInfo.appendChild(productBottom);
    productInfo.appendChild(detailsBtn);

    card.appendChild(productImage);
    card.appendChild(productInfo);

    productGrid.appendChild(card);

}


/* ================= DYNAMIC ADMIN INVENTORY ================= */

const STORAGE_KEY = "rcWorldInventory";
const ADMIN_PASSWORD_KEY = "rcWorldAdminPassword";
const CATEGORY_NAMES_KEY = "rcWorldCategoryNames";
const HERO_VIDEO_KEY = "rcWorldHeroVideo";
const DEFAULT_ADMIN_PASSWORD = "rcworld123";
const DEFAULT_HERO_VIDEO = {
    videoUrl: "https://videos.pexels.com/video-files/855493/855493-hd_1920_1080_25fps.mp4",
    posterUrl: "images/hero-poster.svg"
};
const DEFAULT_CATEGORY_NAMES = {
    rocks: "Rocks",
    mud: "Mud",
    desert: "Desert",
    forest: "Forest"
};

function loadCategoryNames() {
    try {
        return {
            ...DEFAULT_CATEGORY_NAMES,
            ...(JSON.parse(localStorage.getItem(CATEGORY_NAMES_KEY)) || {})
        };
    } catch (error) {
        return { ...DEFAULT_CATEGORY_NAMES };
    }
}

let categoryNames = loadCategoryNames();

function updateCategoryNames() {
    document.querySelectorAll(".terrain-card").forEach(card => {
        const category = card.dataset.category;
        const title = card.querySelector("h3");
        if (title && categoryNames[category]) {
            title.textContent = categoryNames[category].toUpperCase();
        }
    });

    const categorySelect = document.querySelector('select[name="category"]');
    if (categorySelect) {
        Array.from(categorySelect.options).forEach(option => {
            if (categoryNames[option.value]) {
                option.textContent = categoryNames[option.value];
            }
        });
    }
}

const categoryNamesForm = document.getElementById("categoryNamesForm");
if (categoryNamesForm) {
    Object.entries(categoryNames).forEach(([category, name]) => {
        const input = categoryNamesForm.querySelector(`[name="${category}"]`);
        if (input) input.value = name;
    });

    categoryNamesForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedNames = {};
        Object.keys(DEFAULT_CATEGORY_NAMES).forEach(category => {
            updatedNames[category] = categoryNamesForm.elements[category].value.trim();
        });

        if (Object.values(updatedNames).some(name => !name)) {
            alert("Enter a name for every category.");
            return;
        }

        categoryNames = updatedNames;
        localStorage.setItem(CATEGORY_NAMES_KEY, JSON.stringify(categoryNames));
        updateCategoryNames();
        alert("Category names updated.");
    });
}

updateCategoryNames();

function loadHeroVideo() {
    try {
        return {
            ...DEFAULT_HERO_VIDEO,
            ...(JSON.parse(localStorage.getItem(HERO_VIDEO_KEY)) || {})
        };
    } catch (error) {
        return { ...DEFAULT_HERO_VIDEO };
    }
}

function applyHeroVideo(videoSettings) {
    const heroVideo = document.getElementById("heroVideo");
    const heroVideoSource = document.getElementById("heroVideoSource");
    if (!heroVideo || !heroVideoSource) return;

    heroVideoSource.src = videoSettings.videoUrl;
    heroVideo.poster = videoSettings.posterUrl || DEFAULT_HERO_VIDEO.posterUrl;
    heroVideo.load();
    heroVideo.play().catch(() => {});
}

const heroVideoForm = document.getElementById("heroVideoForm");
const savedHeroVideo = loadHeroVideo();
applyHeroVideo(savedHeroVideo);

if (heroVideoForm) {
    heroVideoForm.elements.videoUrl.value = savedHeroVideo.videoUrl;
    heroVideoForm.elements.posterUrl.value = savedHeroVideo.posterUrl;

    heroVideoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const videoSettings = {
            videoUrl: heroVideoForm.elements.videoUrl.value.trim(),
            posterUrl: heroVideoForm.elements.posterUrl.value.trim() || DEFAULT_HERO_VIDEO.posterUrl
        };

        localStorage.setItem(HERO_VIDEO_KEY, JSON.stringify(videoSettings));
        applyHeroVideo(videoSettings);
        alert("Starting background video updated.");
    });
}

function getAdminPassword() {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

function setAdminPassword(newPassword) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
}

const defaultAdminData = {
    products: [
        { name: "X4 Rock Crawler", price: 9999, category: "rocks", inStock: true },
        { name: "Mud Monster", price: 12499, category: "mud", inStock: true },
        { name: "Desert Runner", price: 15999, category: "desert", inStock: true }
    ],
    accessories: [
        { name: "Extra Battery", price: 2500 },
        { name: "Upgrade Kit", price: 3200 }
    ],
    services: [
        { name: "Annual Service", price: 4999 },
        { name: "Wheel Tune-Up", price: 1999 }
    ]
};

function loadAdminData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAdminData));
        return JSON.parse(JSON.stringify(defaultAdminData));
    }

    try {
        const parsed = JSON.parse(saved);
        return {
            products: Array.isArray(parsed.products) ? parsed.products : [],
            accessories: Array.isArray(parsed.accessories) ? parsed.accessories : [],
            services: Array.isArray(parsed.services) ? parsed.services : []
        };
    } catch (error) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAdminData));
        return JSON.parse(JSON.stringify(defaultAdminData));
    }
}

let adminData = loadAdminData();

function saveAdminData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
}

function renderAdminItems(group) {
    const container = document.getElementById(group + "AdminList");
    if (!container) return;

    container.innerHTML = "";

    adminData[group].forEach((item, index) => {
        const itemBox = document.createElement("div");
        itemBox.className = "admin-item";

        const info = document.createElement("div");
        info.className = "admin-item-info";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = item.name;
        nameInput.setAttribute("aria-label", "Update name for " + item.name);

        const title = document.createElement("strong");
        title.textContent = item.name;

        const priceText = document.createElement("span");
        priceText.textContent = "₹" + Number(item.price).toLocaleString("en-IN");

        info.appendChild(title);
        info.appendChild(priceText);

        const actions = document.createElement("div");
        actions.className = "admin-item-actions";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.value = item.price;
        priceInput.setAttribute("aria-label", "Update price for " + item.name);

        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", function () {
            const oldName = item.name;
            const newPrice = Number(priceInput.value);
            if (!newPrice || newPrice <= 0) {
                alert("Enter a valid price.");
                return;
            }
            adminData[group][index].price = newPrice;
            if (group === "products") {
                syncProductCard({ ...adminData[group][index], price: newPrice }, oldName);
            }
            saveAdminData();
            renderAdminItems(group);
            renderCatalogs();
            alert(item.name + " price updated.");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "danger";
        deleteBtn.addEventListener("click", function () {
            adminData[group].splice(index, 1);
            saveAdminData();
            renderAdminItems(group);
            renderCatalogs();
            alert(item.name + " deleted.");
        });

        actions.appendChild(priceInput);

        if (group === "products") {
            const categorySelect = document.createElement("select");
            ["rocks", "mud", "desert", "forest"].forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                option.selected = (item.category || "rocks") === category;
                categorySelect.appendChild(option);
            });
            categorySelect.setAttribute("aria-label", "Update category for " + item.name);

            const stockLabel = document.createElement("label");
            stockLabel.className = "admin-stock-toggle";
            const stockCheckbox = document.createElement("input");
            stockCheckbox.type = "checkbox";
            stockCheckbox.checked = item.inStock !== false;
            stockLabel.append(stockCheckbox, " In stock");
            actions.append(nameInput, categorySelect, stockLabel);

            updateBtn.addEventListener("click", function () {
                const oldName = item.name;
                const newName = nameInput.value.trim();
                if (!newName) {
                    alert("Enter a product name.");
                    return;
                }
                adminData[group][index].name = newName;
                adminData[group][index].category = categorySelect.value;
                adminData[group][index].inStock = stockCheckbox.checked;
                syncProductCard(adminData[group][index], oldName);
                saveAdminData();
                renderAdminItems(group);
            });
        }

        actions.appendChild(updateBtn);
        actions.appendChild(deleteBtn);

        itemBox.appendChild(info);
        itemBox.appendChild(actions);
        container.appendChild(itemBox);
    });
}

function syncProductCard(item, oldName = item.name) {
    const card = Array.from(document.querySelectorAll(".product-card"))
        .find(product => product.getAttribute("data-name") === oldName);
    if (!card) return;

    card.setAttribute("data-name", item.name);
    card.setAttribute("data-category", item.category || "rocks");
    card.setAttribute("data-keywords", item.name.toLowerCase() + " " + (item.category || "rocks") + " offroad rc");
    card.dataset.stock = item.inStock === false ? "out" : "in";
    const title = card.querySelector(".product-info h3");
    const price = card.querySelector(".product-bottom strong");
    const buttons = card.querySelectorAll(".product-bottom button");
    let stockBadge = card.querySelector(".stock-badge");
    if (!stockBadge) {
        stockBadge = document.createElement("span");
        stockBadge.className = "stock-badge";
        card.querySelector(".product-info")?.appendChild(stockBadge);
    }
    if (title) title.textContent = item.name.toUpperCase();
    if (price) price.textContent = "₹" + Number(item.price).toLocaleString("en-IN");
    buttons.forEach(button => {
        button.disabled = item.inStock === false;
        button.textContent = item.inStock === false ? "OUT OF STOCK" : (button.classList.contains("buy-now-btn") ? "BUY NOW" : "ADD +");
    });
    if (stockBadge) {
        stockBadge.textContent = item.inStock === false ? "OUT OF STOCK" : "IN STOCK";
        stockBadge.classList.toggle("out", item.inStock === false);
    }
}

function attachAdminForm(group) {
    const form = document.querySelector('.admin-form[data-group="' + group + '"]');
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = form.querySelector('input[name="name"]').value.trim();
        const price = Number(form.querySelector('input[name="price"]').value);
        const categoryField = form.querySelector('select[name="category"]');
        const specsField = form.querySelector('input[name="specs"]');
        const imageField = form.querySelector('input[name="image"]');
        const stockField = form.querySelector('input[name="inStock"]');
        const category = categoryField ? categoryField.value : "rocks";
        const specs = specsField ? specsField.value.trim() : "35 KM/H • 2000mAh • 4WD";
        const image = imageField ? imageField.value.trim() || "images/car1.svg" : "images/car1.svg";

        if (!name || !price || (group === "products" && !specs)) {
            alert("Please enter a valid name and price.");
            return;
        }

        adminData[group].push({ name, price, category, specs, image, inStock: stockField ? stockField.checked : true });
        saveAdminData();
        renderAdminItems(group);
        renderCatalogs();
        if (group === "products") {
            createProductCard(name, price, specs, image, category, stockField ? stockField.checked : true);
        }
        form.reset();
        alert(name + " added to " + (group === "products" ? category : group) + ".");
    });
}

function renderCatalogs() {
    const accessoriesGrid = document.getElementById("accessoriesGrid");
    const servicesGrid = document.getElementById("servicesGrid");

    if (accessoriesGrid) {
        accessoriesGrid.innerHTML = "";
        adminData.accessories.forEach(item => {
            const card = document.createElement("div");
            card.className = "catalog-card";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>Premium accessory for your RC setup and performance upgrades.</p>
                <strong>₹${Number(item.price).toLocaleString("en-IN")}</strong>
            `;
            accessoriesGrid.appendChild(card);
        });
    }

    if (servicesGrid) {
        servicesGrid.innerHTML = "";
        adminData.services.forEach(item => {
            const card = document.createElement("div");
            card.className = "catalog-card";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>Professional service support to keep the vehicle in top condition.</p>
                <strong>₹${Number(item.price).toLocaleString("en-IN")}</strong>
            `;
            servicesGrid.appendChild(card);
        });
    }
}

function openAdminPanel() {
    const loginBox = document.getElementById("adminAccess");
    const adminContent = document.getElementById("adminContent");

    if (!loginBox || !adminContent) return;

    loginBox.classList.add("hidden");
    adminContent.classList.remove("hidden");
}

function closeAdminPanel() {
    const adminSection = document.getElementById("admin");
    const loginBox = document.getElementById("adminAccess");
    const adminContent = document.getElementById("adminContent");

    if (!adminSection || !loginBox || !adminContent) return;

    adminContent.classList.add("hidden");
    loginBox.classList.remove("hidden");
    adminSection.classList.add("hidden");
    const passwordField = document.getElementById("adminPassword");
    if (passwordField) passwordField.value = "";
}

const adminTrigger = document.getElementById("adminTrigger");
if (adminTrigger) {
    adminTrigger.addEventListener("click", function () {
        const adminSection = document.getElementById("admin");
        if (!adminSection) return;

        adminSection.classList.remove("hidden");
        adminSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredPassword = document.getElementById("adminPassword").value;

        if (enteredPassword === getAdminPassword()) {
            openAdminPanel();
        } else {
            alert("Incorrect password. Use: " + getAdminPassword());
        }
    });
}

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId) || document.querySelector('[name="' + targetId.replace('adminChangePasswordForm-', '') + '"]') || null;

        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        this.textContent = isPassword ? "Hide" : "Show";
    });
});

const adminPasswordHint = document.getElementById("adminPasswordHint");
if (adminPasswordHint) {
    adminPasswordHint.textContent = "Current password: " + getAdminPassword();
}

const adminChangePasswordForm = document.getElementById("adminChangePasswordForm");
if (adminChangePasswordForm) {
    adminChangePasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentPassword = adminChangePasswordForm.querySelector('input[name="currentPassword"]').value.trim();
        const newPassword = adminChangePasswordForm.querySelector('input[name="newPassword"]').value.trim();
        const confirmPassword = adminChangePasswordForm.querySelector('input[name="confirmPassword"]').value.trim();

        if (currentPassword !== getAdminPassword()) {
            alert("Current password is incorrect.");
            return;
        }

        if (!newPassword || newPassword.length < 4) {
            alert("New password must be at least 4 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        setAdminPassword(newPassword);
        adminChangePasswordForm.reset();
        alert("Admin password changed successfully.");

        const passwordHint = document.getElementById("adminPasswordHint");
        if (passwordHint) {
            passwordHint.textContent = "Current password: " + getAdminPassword();
        }
    });
}

const adminLogoutBtn = document.getElementById("adminLogoutBtn");
if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", function () {
        closeAdminPanel();
    });
}

attachAdminForm("products");
attachAdminForm("accessories");
attachAdminForm("services");
renderAdminItems("products");
renderAdminItems("accessories");
renderAdminItems("services");
renderCatalogs();
addBuyNowButtons();
adminData.products.forEach(item => syncProductCard(item));


/* ================= VIDEO ================= */

function playVideo() {

    const video =
        document.querySelector(".action-video video");


    video.muted = false;

    video.controls = true;

    video.play();

}


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    document.getElementById("orderModal").style.display = "flex";

}


function closeOrderModal() {

    document.getElementById("orderModal").style.display = "none";
    directBuyProduct = null;

}


function submitOrder(event) {

    event.preventDefault();

    const form = event.target;

    const customerName = form.customerName.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const district = form.district.value.trim();
    const village = form.village.value.trim();
    const pincode = form.pincode.value.trim();
    const state = form.state.value.trim();

    if (!customerName || !phone || !address || !district || !village || !pincode || !state) {
        alert("Please fill all order details.");
        return;
    }

    const orderItems = directBuyProduct ? [directBuyProduct] : cart;
    if (orderItems.length === 0) {
        alert("Please add a product before ordering.");
        return;
    }

    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    const orderNumber = "RC-" + Date.now().toString().slice(-8);
    const orderDate = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });

    const productList = orderItems.map(item => 
        `- ${item.name}: ₹${item.price.toLocaleString("en-IN")}`
    ).join("\n");

    const message = `Hello RC World Telugu,\n\nI would like to place an order.\n\nOrder ID: ${orderNumber}\nOrder Date: ${orderDate}\n\nCustomer Details:\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\nDistrict: ${district}\nVillage / Area: ${village}\nPIN Code: ${pincode}\nState: ${state}\n\nOrder Items:\n${productList}\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm availability and delivery details.`;

    const whatsappNumber = "917416526027";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    closeOrderModal();
    closeCart();
    form.reset();
    if (!directBuyProduct) {
        cart = [];
    }
    directBuyProduct = null;
    updateCart();

}


document.getElementById("orderForm").addEventListener("submit", submitOrder);


/* ================= CLOSE MODAL ================= */

window.onclick = function(event) {

    const productModal = document.getElementById("productModal");
    const orderModal = document.getElementById("orderModal");

    if (event.target === productModal) {
        closeProduct();
    }

    if (event.target === orderModal) {
        closeOrderModal();
    }

};


/* ================= INITIALIZE ================= */

updateCart();
