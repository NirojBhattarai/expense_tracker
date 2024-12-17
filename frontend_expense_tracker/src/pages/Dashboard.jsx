import React, { useState, useEffect, useContext, useCallback} from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const Dashboard = () => {
  const user = useContext(AuthContext);
  console.log(user);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: "", amount: 0, type: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const _id=user?.userId;
  
  

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.post(
        `https://expense-tracker-qyva.onrender.com/api/v1/transaction/view/${_id}`
      );
      const fetchedTransactions = response.data.data || [];
      setTransactions(fetchedTransactions);

      // Calculate total income and expenses
      const income = fetchedTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const expenses = fetchedTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [_id]); 

  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Create Transaction
  const createTransaction = async () => {
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("amount", form.amount);
    formData.append("type", form.type);
    formData.append("userId", _id);
    if (invoice) formData.append("invoice", invoice);

    try {
      await axios.post(
        "https://expense-tracker-qyva.onrender.com/api/v1/transaction/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
    formData.append("userId", _id);
    if (invoice) formData.append("invoice", invoice);

    try {
      await axios.put(
        `https://expense-tracker-qyva.onrender.com/api/v1/transaction/update/${selectedTransaction._id}`,
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
  const deleteTransaction = async (transid) => {
    try {
      await axios.delete(
        `https://expense-tracker-qyva.onrender.com/api/v1/transaction/delete/${transid}/${_id}`
      );
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

  // Open Invoice Image Modal
  const openInvoiceModal = (invoiceUrl) => {
    setSelectedInvoice(invoiceUrl);
    setShowInvoiceModal(true);
  };

  // Close Invoice Image Modal
  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
  };

  // Chart Data for Income and Expenses
  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount ($)",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#34D399", "#F87171"],
        borderColor: ["#16A34A", "#DC2626"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Expense Tracker Dashboard
        </h1>
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
          <p className="text-2xl font-bold">
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Income and Expenses Chart */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Income and Expenses Overview
        </h2>

        {/* Form */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Add Transaction
          </h2>
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
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) })
                }
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
                onClick={
                  selectedTransaction ? updateTransaction : createTransaction
                }
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                {selectedTransaction ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Recent Transactions
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {transactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className={`flex justify-between items-center py-4 ${
                      transaction.type === "income"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    <span className="font-medium">{transaction.category}</span>
                    <span>${transaction.amount.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
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
                      {transaction.invoice && (
                        <button
                          onClick={() => openInvoiceModal(transaction.invoice)}
                          className="bg-green-500 text-white p-2 rounded"
                        >
                          View Invoice
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No transactions found.</p>
            )}
          </div>
        </div>

        {/* Graph Display */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto mt-10">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Income vs Expenses",
                  font: {
                    size: 18,
                    weight: "bold",
                  },
                  padding: {
                    top: 10,
                    bottom: 20,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  bodyColor: "white",
                  titleColor: "white",
                  cornerRadius: 5,
                  padding: 10,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    borderColor: "#e2e8f0", // Light gray gridlines
                  },
                  ticks: {
                    font: {
                      size: 14,
                    },
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: 14,
                    },
                  },
                },
              },
            }}
            height={200} 
          />
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
            <button
              onClick={closeInvoiceModal}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <img
              src={selectedInvoice}
              alt="Invoice"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-0">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Edit Transaction
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Category"
                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) })
                }
              />
              <select
                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={updateTransaction}
                className="bg-blue-600 text-white p-3 rounded-md mt-4 hover:bg-blue-700 transition duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
