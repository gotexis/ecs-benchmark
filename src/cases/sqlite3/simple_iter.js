import sql3 from 'sqlite3';
const db = new sql3.Database(':memory:');

// 初始化数据库和表
db.serialize(() => {
  db.run(`
    CREATE TABLE ECS_Entity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      A INTEGER,
      B INTEGER,
      C INTEGER,
      D INTEGER,
      E INTEGER
    );
  `);

  db.run('PRAGMA foreign_keys = ON;');
});

const insertEntity = (sql) => new Promise((resolve, reject) => {
  db.run(sql, (err) => {
    if (err) return reject(err);
    resolve();
  });
});

export default async function (count) {
  // 创建实体
  for (let i = 0; i < count; i++) {
    await insertEntity('INSERT INTO ECS_Entity (A, B) VALUES (1, 1)');
    await insertEntity('INSERT INTO ECS_Entity (A, B, C) VALUES (1, 1, 1)');
    await insertEntity('INSERT INTO ECS_Entity (A, B, C, D) VALUES (1, 1, 1, 1)');
    await insertEntity('INSERT INTO ECS_Entity (A, B, C, E) VALUES (1, 1, 1, 1)');
  }

  return () => new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('UPDATE ECS_Entity SET A = B, B = A WHERE A IS NOT NULL AND B IS NOT NULL', (err) => {
        if (err) return reject(err);
      });
      db.run('UPDATE ECS_Entity SET C = D, D = C WHERE C IS NOT NULL AND D IS NOT NULL', (err) => {
        if (err) return reject(err);
      });
      db.run('UPDATE ECS_Entity SET C = E, E = C WHERE C IS NOT NULL AND E IS NOT NULL', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}