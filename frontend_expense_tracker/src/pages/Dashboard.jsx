import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: "", amount: 0, type: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/v1/transaction/view"); 
      const fetchedTransactions = response.data.data; 
      setTransactions(fetchedTransactions);

      // Calculate totals
      const income = fetchedTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = fetchedTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Create Transaction
  const createTransaction = async () => {
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("amount", form.amount);
    formData.append("type", form.type);
    if (invoice) formData.append("invoice", invoice);

    try {
      await axios.post("http://localhost:5001/api/v1/transaction/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ category: "", amount: 0, type: "" });
      setInvoice(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  // Update Transaction
  const updateTransaction = async () => {
    if (!selectedTransaction) return;

    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("amount", form.amount);
    formData.append("type", form.type);
    if (invoice) formData.append("invoice", invoice);

    try {
      await axios.put(
        `http://localhost:5001/api/v1/transaction/update/${selectedTransaction._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSelectedTransaction(null);
      setForm({ category: "", amount: 0, type: "" });
      setInvoice(null);
      setShowModal(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/transaction/delete/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Open Modal to Edit Transaction
  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setForm({
      category: transaction.category,
      amount: transaction.amount,
      type: transaction.type,
    });
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedTransaction(null);
    setForm({ category: "", amount: 0, type: "" });
    setShowModal(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Expense Tracker Dashboard</h1>
      </header>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Net Balance</h2>
          <p className="text-2xl font-bold">${(totalIncome - totalExpenses).toFixed(2)}</p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Transaction</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Category"
              className="border p-2 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
            />
            <select
              className="border p-2 rounded"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="file"
              onChange={(e) => setInvoice(e.target.files[0])}
              className="border p-2 rounded"
            />
            <button
              onClick={selectedTransaction ? updateTransaction : createTransaction}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {selectedTransaction ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Transactions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {transactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className={`flex justify-between items-center py-4 ${
                    transaction.type === "income" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  <span className="font-medium">{transaction.category}</span>
                  <span>${transaction.amount.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{transaction.createdAt}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(transaction)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Category"
                className="border p-2 rounded"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="border p-2 rounded"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              />
              <select
                className="border p-2 rounded"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <button
                onClick={updateTransaction}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
