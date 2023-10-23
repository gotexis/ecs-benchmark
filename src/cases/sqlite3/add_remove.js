import sql from 'sqlite3';
const db = new sql.Database(':memory:');


// 初始化数据库和表
db.serialize(() => {
  db.run(`
    CREATE TABLE ECS_Entity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      A BOOLEAN,
      B BOOLEAN
    );
  `);
});

const insertEntity = () => new Promise((resolve, reject) => {
  db.run('INSERT INTO ECS_Entity (A) VALUES (true)', function(err) {
    if (err) return reject(err);
    resolve(this.lastID);
  });
});

const addComponentB = () => new Promise((resolve, reject) => {
  db.run('UPDATE ECS_Entity SET B = true', function(err) {
    if (err) return reject(err);
    resolve();
  });
});

const removeComponentB = () => new Promise((resolve, reject) => {
  db.run('UPDATE ECS_Entity SET B = null', function(err) {
    if (err) return reject(err);
    resolve();
  });
});

export default async function (count) {
  const insertPromises = [];
  for (let i = 0; i < count; i++) {
    insertPromises.push(insertEntity());
  }
  await Promise.all(insertPromises);

  return async () => {
    await addComponentB();
    await removeComponentB();
  };
}