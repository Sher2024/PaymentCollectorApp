// Select elements
const paymentTargetInput = document.getElementById("paymentTarget");
const setTargetButton = document.getElementById("setTarget");
const currentTargetDisplay = document.getElementById("currentTarget");
const payerNameInput = document.getElementById("payerName");
const payerAmountInput = document.getElementById("payerAmount");
const paymentMethodSelect = document.getElementById("paymentMethod");
const addPayerButton = document.getElementById("addPayer");
const payerList = document.getElementById("payerList");
const totalAmountDisplay = document.getElementById("totalAmount");

let paymentTarget = localStorage.getItem("paymentTarget") || 0;
let payers = JSON.parse(localStorage.getItem("payers")) || [];

// Display stored target amount
if (paymentTarget > 0) {
    currentTargetDisplay.textContent = `Current Target: GHS ${paymentTarget}`;
}

const popupMessage = document.createElement('div');
popupMessage.className = 'popup-message';
popupMessage.textContent = 'Payment target set!';
document.body.appendChild(popupMessage);

const addPayerPopupMessage = document.createElement('div');
addPayerPopupMessage.className = 'popup-message';
addPayerPopupMessage.textContent = 'Payer added successfully!';
document.body.appendChild(addPayerPopupMessage);

const errorPopupMessage = document.createElement('div');
errorPopupMessage.className = 'popup-message error';
errorPopupMessage.textContent = 'Enter a valid payment target.';
document.body.appendChild(errorPopupMessage);

const addPayerErrorPopupMessage = document.createElement('div');
addPayerErrorPopupMessage.className = 'popup-message error';
addPayerErrorPopupMessage.textContent = 'Please enter valid payer details.';
document.body.appendChild(addPayerErrorPopupMessage);

// Function to update total amount collected
function updateTotalAmount() {
    const total = payers.reduce((sum, payer) => sum + payer.amount, 0);
    totalAmountDisplay.textContent = `Total Collected: GHS ${total}`;
}

// Function to show pop-up message
function showPopupMessage() {
    popupMessage.classList.add('show');
    setTimeout(() => {
        popupMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

function showAddPayerPopupMessage() {
    addPayerPopupMessage.classList.add('show');
    setTimeout(() => {
        addPayerPopupMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

function showErrorPopupMessage() {
    errorPopupMessage.classList.add('show');
    setTimeout(() => {
        errorPopupMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

function showAddPayerErrorPopupMessage() {
    addPayerErrorPopupMessage.classList.add('show');
    setTimeout(() => {
        addPayerErrorPopupMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

// Set Payment Target
setTargetButton.addEventListener("click", () => {
    const target = parseFloat(paymentTargetInput.value);
    if (!isNaN(target) && target > 0) {
        paymentTarget = target;
        localStorage.setItem("paymentTarget", target);
        currentTargetDisplay.textContent = `Current Target: GHS ${target}`;
        showPopupMessage(); // Show pop-up message
    } else {
        showErrorPopupMessage(); // Show error pop-up message
    }
});

// Add Payer
addPayerButton.addEventListener("click", () => {
    const name = payerNameInput.value.trim();
    const amount = parseFloat(payerAmountInput.value);
    const method = paymentMethodSelect.value;

    if (name === "" || isNaN(amount) || amount <= 0) {
        showAddPayerErrorPopupMessage(); // Show error pop-up message
        return;
    }

    const balance = paymentTarget - amount;
    const status = balance > 0 ? `Owes GHS ${balance}` : `Change GHS ${Math.abs(balance)}`;

    const payer = { id: Date.now(), name, amount, method, balance, status };
    payers.push(payer);
    localStorage.setItem("payers", JSON.stringify(payers));

    payerNameInput.value = "";
    payerAmountInput.value = "";
    
    renderPayers();
    showAddPayerPopupMessage(); // Show pop-up message
});

// Render Payers List
function renderPayers() {
    payerList.innerHTML = "";
    payers.forEach(payer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${payer.name}</td>
            <td>GHS ${payer.amount}</td>
            <td>${payer.method}</td>
            <td class="${payer.balance >= 0 ? 'balance' : 'change'}">${payer.status}</td>
            <td>
                <button id="editPayer" onclick="editPayer(${payer.id})">Edit</button>
                <button id="deletePayer" onclick="deletePayer(${payer.id})">Delete</button>
            </td>
        `;
        payerList.appendChild(row);
    });

    updateTotalAmount(); // Update total amount whenever the list is rendered
}

// Edit Payer
function editPayer(id) {
    const payer = payers.find(p => p.id === id);
    if (payer) {
        payerNameInput.value = payer.name;
        payerAmountInput.value = payer.amount;
        paymentMethodSelect.value = payer.method;
        deletePayer(id);
    }
}

// Delete Payer
function deletePayer(id) {
    payers = payers.filter(p => p.id !== id);
    localStorage.setItem("payers", JSON.stringify(payers));
    renderPayers();
}

// Load stored data
renderPayers();