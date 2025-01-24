import initSqlJs from 'sql.js';

let db;

async function openDb() {
  if (!db) {
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    db = new SQL.Database();
    db.run('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, description TEXT, amount REAL)');
  }
  return db;
}

export async function getExpenses() {
  const db = await openDb();
  const result = db.exec('SELECT * FROM expenses');
  return result[0].values;
}

export async function addExpense(description, amount) {
  const db = await openDb();
  db.run('INSERT INTO expenses (description, amount) VALUES (?, ?)', [description, amount]);
}

export async function getTotalExpenses() {
  const db = await openDb();
  const result = db.exec('SELECT SUM(amount) as total FROM expenses');
  return result[0].values[0] ? result[0].values[0][0] : 0;
}
