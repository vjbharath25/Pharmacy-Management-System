let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
let editIndex = -1;
let bill = [];
let chart; // for chart destroy fix

function saveData() {
  localStorage.setItem("medicines", JSON.stringify(medicines));
}

function displayData(data = medicines) {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  data.forEach((med, index) => {

    let lowStock = med.quantity < 5 ? "class='low-stock'" : "";

    table.innerHTML += `
      <tr ${lowStock}>
        <td>${med.name}</td>
        <td>${med.price}</td>
        <td>${med.quantity}</td>
        <td>
          <button onclick="editMedicine(${index})">Edit</button>
          <button onclick="deleteMedicine(${index})">Delete</button>
          <button onclick="addToBill(${index})">Bill</button>
        </td>
      </tr>
    `;
  });

  loadChart();
}

function addMedicine() {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let quantity = document.getElementById("quantity").value;

  if (name === "" || price === "" || quantity === "") {
    alert("Fill all fields bro!");
    return;
  }

  if (editIndex === -1) {
    medicines.push({ name, price, quantity });
  } else {
    medicines[editIndex] = { name, price, quantity };
    editIndex = -1;
  }

  saveData();
  displayData();
  clearFields();
}

function editMedicine(index) {
  let med = medicines[index];

  document.getElementById("name").value = med.name;
  document.getElementById("price").value = med.price;
  document.getElementById("quantity").value = med.quantity;

  editIndex = index;
}

function deleteMedicine(index) {
  medicines.splice(index, 1);
  saveData();
  displayData();
}

function searchMedicine() {
  let search = document.getElementById("search").value.toLowerCase();
  let filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search)
  );
  displayData(filtered);
}

function clearFields() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
}

// 🔐 Logout
function logout(){
  window.location = "login.html";
}

// 🧾 BILL SYSTEM
function addToBill(index){
  bill.push(medicines[index]);
  showBill();
}

function showBill(){
  let total = 0;
  let content = "<h2>Pharmacy Bill</h2>";

  bill.forEach(item => {
    content += `<p>${item.name} - ₹${item.price}</p>`;
    total += Number(item.price);
  });

  content += `<h3>Total: ₹${total}</h3>`;

  let win = window.open("", "", "width=300,height=400");
  win.document.write(content);
  win.print();
}

// 📊 CHART FIX (important)
function loadChart(){
  let names = medicines.map(m => m.name);
  let qty = medicines.map(m => m.quantity);

  let ctx = document.getElementById("chart").getContext("2d");

  // destroy old chart
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: names,
      datasets: [{
        label: "Stock Quantity",
        data: qty
      }]
    }
  });
}

// INITIAL LOAD
displayData();
