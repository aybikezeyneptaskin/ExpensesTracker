const { apiBaseUrl = "http://localhost:8080" } = window.EXPENSE_TRACKER_CONFIG || {};

const totalAmountElement = document.getElementById("totalAmount");
const expenseListElement = document.getElementById("expenseList");
const expenseCountElement = document.getElementById("expenseCount");
const emptyStateElement = document.getElementById("emptyState");
const loadingStateElement = document.getElementById("loadingState");
const formElement = document.getElementById("expenseForm");
const formMessageElement = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const setFormMessage = (message, type = "") => {
  formMessageElement.textContent = message;
  formMessageElement.className = "form-message";

  if (type) {
    formMessageElement.classList.add(type);
  }
};

const setLoadingState = (isLoading) => {
  loadingStateElement.classList.toggle("hidden", !isLoading);
};

const renderExpenses = (expenses) => {
  expenseListElement.innerHTML = "";
  expenseCountElement.textContent = `${expenses.length} item${expenses.length === 1 ? "" : "s"}`;

  if (!expenses.length) {
    emptyStateElement.classList.remove("hidden");
    return;
  }

  emptyStateElement.classList.add("hidden");

  expenses.forEach((expense) => {
    const listItem = document.createElement("li");
    listItem.className = "expense-item";

    const meta = document.createElement("div");
    meta.className = "expense-meta";

    const title = document.createElement("p");
    title.className = "expense-title";
    title.textContent = expense.title;

    const details = document.createElement("div");
    details.className = "expense-details";

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatCurrency(expense.amount);

    const category = document.createElement("span");
    category.className = "chip";
    category.textContent = expense.category || "Other";

    details.append(amount, category);
    meta.append(title, details);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteExpense(expense.id));

    listItem.append(meta, deleteButton);
    expenseListElement.appendChild(listItem);
  });
};

const updateTotalAmount = (total) => {
  totalAmountElement.textContent = formatCurrency(total);
};

const readExpenses = async () => {
  setLoadingState(true);

  try {
    const response = await fetch(`${apiBaseUrl}/api/expenses`);

    if (!response.ok) {
      throw new Error("Failed to load expenses.");
    }

    const expenses = await response.json();
    renderExpenses(expenses);
  } catch (error) {
    console.error(error);
    setFormMessage("Unable to load expenses right now. Please try again.", "error");
    expenseListElement.innerHTML = "";
    emptyStateElement.classList.remove("hidden");
  } finally {
    setLoadingState(false);
  }
};

const readTotal = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/expenses/total`);

    if (!response.ok) {
      throw new Error("Failed to load total.");
    }

    const total = await response.json();
    updateTotalAmount(total);
  } catch (error) {
    console.error(error);
    updateTotalAmount(0);
  }
};

const createExpense = async (expenseData) => {
  const response = await fetch(`${apiBaseUrl}/api/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to create expense.");
  }

  return response.json();
};

const deleteExpense = async (id) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete expense.");
    }

    setFormMessage("Expense deleted successfully.", "success");
    await Promise.all([readExpenses(), readTotal()]);
  } catch (error) {
    console.error(error);
    setFormMessage("Unable to delete the expense. Please try again.", "error");
  }
};

formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value.trim();

  if (!title) {
    setFormMessage("Please enter an expense title.", "error");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    setFormMessage("Please enter a valid amount greater than zero.", "error");
    return;
  }

  if (!category) {
    setFormMessage("Please choose a category.", "error");
    return;
  }

  submitButton.disabled = true;
  setFormMessage("Adding expense...", "");

  try {
    await createExpense({ title, amount, category });
    formElement.reset();
    setFormMessage("Expense added successfully.", "success");
    await Promise.all([readExpenses(), readTotal()]);
  } catch (error) {
    console.error(error);
    setFormMessage("Unable to add expense. Please check the values and try again.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

const initializeApp = async () => {
  await Promise.all([readExpenses(), readTotal()]);
};

initializeApp();
