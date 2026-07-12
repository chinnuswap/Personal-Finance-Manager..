let transactions =
JSON.parse(localStorage.getItem("transactions"))
|| [];

function addTransaction() {

    const description =
        document.getElementById("description").value;

    const amount =
        Number(document.getElementById("amount").value);

    const type =
        document.getElementById("type").value;
        const date =
    document.getElementById("date").value;

const category =
    document.getElementById("category").value;

    if(description === "" || amount <= 0){
        alert("Enter valid details");
        return;
    }

    const transaction = {
    description,
    amount,
    type,
    date,
    category
};
    transactions.push(transaction);
    localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

    updateUI();

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
}

function updateUI() {

    const list =
        document.getElementById("transaction-list");

    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((t,index)=>{

        if(t.type === "income"){
            income += t.amount;
        } else {
            expense += t.amount;
        }

        const li = document.createElement("li");

        li.innerHTML = `
    <div>
        <strong>${t.description}</strong>
        <br>
        ₹${t.amount}
        <br>
        ${t.category}
        <br>
        ${t.date}
    </div>

    <button onclick="deleteTransaction(${index})">
        Delete
    </button>
`;

        list.appendChild(li);
    });

    document.getElementById("income").innerText =
        `₹${income}`;

    document.getElementById("expense").innerText =
        `₹${expense}`;

    document.getElementById("balance").innerText =
        `₹${income - expense}`;
    createChart();    
}

function deleteTransaction(index){

    transactions.splice(index,1);
    localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

    updateUI();
}
function searchTransactions() {

    const searchValue =
    document.getElementById("search")
    .value
    .toLowerCase();

    const items =
    document.querySelectorAll("#transaction-list li");

    items.forEach(item => {

        if(
            item.innerText
            .toLowerCase()
            .includes(searchValue)
        ){
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}
function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );
}
function createChart() {

    const categoryTotals = {};

    transactions.forEach(t => {

        if(t.type === "expense") {

            if(categoryTotals[t.category]) {
                categoryTotals[t.category] += t.amount;
            } else {
                categoryTotals[t.category] = t.amount;
            }
        }
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const ctx =
    document.getElementById("expenseChart");

    if(window.expenseChartInstance){
        window.expenseChartInstance.destroy();
    }

    window.expenseChartInstance =
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        }
    });
}
