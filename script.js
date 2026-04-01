/*IMPORTANT NOTES:
SYNTAX FOR LOCALSTORAGE :-
localStorage.setItem(key, value);
localStorage.getItem(key);
-----------------------------
Use form.reset()  [best practice]-
✔️ Use form.reset() when:
Clearing form after submit.
-------
USE 'RESET INPUTS MANUALLY' like:
descriptionEl.value = '';
if You want to reset some fields, not all.
*/ 

const balanceEl  = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

/* FOR THE ABOVE CODE LINE -
 Alternative writing style (same logic, clearer):
const storedData = localStorage.getItem('transactions');
if (storedData) {
  transactions = JSON.parse(storedData);
} else {
  transactions = [];
}  */ 

transactionFormEl.addEventListener('submit', addTransaction);

function addTransaction(e) {
  e.preventDefault();

  // get form values
  const description = descriptionEl.value.trim();
  // const amount = parseFloat(amountEl.value); OR,
  const amount = Number(amountEl.value);  //when type is "number" used in 'input' in html, then using 'Number()' is BEST. Use 'parseFloat' when u want some numbers out of a messy data (like a data having numbe
  // rs and alphabets mixed).

  if (!description || !amount) {
    alert('Please fill in both desc and amount.');
    return;
  }

  const transactionObject = {
    id: Date.now(),
    // description: description, OR,
    description,
    amount
  };

  transactions.push(transactionObject);
  
  localStorage.setItem('transactions',JSON.stringify(transactions));

  //other functions
  updateTransactionList();
  updateSummary();

  transactionFormEl.reset(); //resets form. As we added a 'submit' event listener, we have to reset it. ('reset' is only used for 'forms'.)
}

function updateTransactionList() {
  transactionListEl.innerHTML = '';

  // sort the transactions accordingly and bring the last as the first.
  const sortedTransactions = [...transactions].reverse();
  console.log('sorted transactions:',sortedTransactions);
  /*'spread operator'- Creates a shallow copy of the transactions array.
  You used it to protect your original transactions data.
Same values, new array in memory.
Mental rule to remember 🧠
🔹 Array methods that mutate:
reverse(), sort(), push(), pop(), splice()
*/ 
  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);

    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement('li');
  li.classList.add('transaction');
  li.classList.add(transaction.amount > 0 ? 'income': 'expenses');  //here 'income' and 'expenses' are the classes which are added.

  
  li.innerHTML = `
  <span> ${transaction.description} </span>
   <span> 
   ${formatCurrency(transaction.amount)}
   <button class="delete-btn" onclick="removeTransaction(${transaction.id})"> x </button>
   </span>`;

   return li;
}

function updateSummary() {
  const balance = transactions.reduce((acc,transaction) => {
   return acc + transaction.amount
  }, 0);

  const income = transactions.filter(transaction =>
    transaction.amount > 0)
    .reduce((acc,transaction) => {
    return acc + transaction.amount
  }, 0);

  const expenses = transactions.filter(transaction =>
    transaction.amount < 0)
    .reduce((acc,transaction) => {
    return acc + transaction.amount
  }, 0);

  // console.log('balance',balance);
  // console.log('income-',income);
  // console.log('expenses-',expenses);

  /*GOLDEN RULE TO REMEMBER-
  // ❌ WRONG
x => { x > 0 }
// ✅ RIGHT
x => { return x > 0 }
// ✅ ALSO RIGHT
x => x > 0

IF YOU USE {}, YOU MUST use 'return'.
  */ 

  balanceEl.textContent =  formatCurrency(balance);
  incomeAmountEl.textContent =  formatCurrency(income);
  expenseAmountEl.textContent =  formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US",{
    style: 'currency',
    currency: 'USD',
  }).format(number);
}  //this gives a formatted string.

function removeTransaction(id) {
  // filter the one we wanna delete
  transactions = transactions.filter(transaction => 
    transaction.id !== id);
    //the code line in words:"filter the 'transactions' array to create a new array, so go through each 'transaction', keep them in the new array EXCEPT the one which isnt equal to our 'transaction.id'. so basically dont keep which comes as 'false', keep those 'true' values."
    //remember , here 'id' is the one which we wanna DELETE(clicked on the cross btn).
    //filter keeps what returns true. so if 'false', it doesnt keep. so it says ='Keep everything except the one I clicked delete on.'

    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}


//initial render on the page 
updateTransactionList();
updateSummary();



/*NOTES ON-Currency Formatting in JavaScript

'return new Intl.NumberFormat("en-US", {' :-
Creates a new 'international number formatter'
Intl is a built-in JavaScript object for 'internationalization'
'NumberFormat' formats numbers based on locale rules
'"en-US"' means:
English language
United States formatting rules
Uses commas for thousands and a period for decimals
------------
1️⃣ Why use style: 'currency' and currency: 'USD' even if $ is in HTML?
$ in HTML is just a character
It does no formatting
It does not handle:
commas,decimal places,negative values,locale-specific formats.
style: 'currency' applies official money formatting rules
currency: 'USD' applies USD-specific rules
HTML $ cannot format values correctly

2️⃣ Why not add $ manually in JavaScript?
Manual formatting requires handling:
commas,decimals,rounding,negative numbers.
More code and higher chance of bugs
Difficult to change currency later
Intl.NumberFormat does all formatting automatically and correctly

3️⃣ Why do we need a formatted string?
Numbers → used for calculations
Strings → used for display (UI)
Currency display is UI, not math
.format(number) returns a string because it:
includes symbols and separators
follows locale rules
is meant only for display
UI elements (textContent, innerText) display strings only
Correct flow:
number → calculation
formatted string → display

4️⃣ Why this is BEST PRACTICE
Use numbers for all calculations
Use formatted strings only for UI
Let Intl.NumberFormat handle formatting
Keeps code clean, reliable, and scalable*/