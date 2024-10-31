document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const total = document.getElementById("total");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("Expenses")) || [];
  let totalAmount = calculateTotal();

  // Add Event Listener to Form Submit
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Preventing Default Behaviour of Form
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name,
        amount,
      };

      expenses.push(newExpense);
      saveExpenses();
      renderExpenses();
      updateTotal();
      //Clear Input
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
    }
  });

  // Function to Calculate Total
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Function to Update Total
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  //Function to Render Expenses
  function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `${expense.name} - $${expense.amount}
      <button data-id='${expense.id}'>Delete</button>`;
      expenseList.appendChild(li);
    });
  }

  // Store Expenses in Local Storage
  function saveExpenses() {
    localStorage.setItem("Expenses", JSON.stringify(expenses));
  }

  //Add Event Listener to Delete Expense Item
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const index = expenses.findIndex((expense) => expense.id === expenseId);
      if (index !== -1) {
        expenses.splice(index, 1);
        renderExpenses();
        updateTotal();
        saveExpenses();
      }
    }
  });

  renderExpenses();
  updateTotal();
});
