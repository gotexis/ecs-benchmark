import sql from 'sqlite3';
const db = new sql.Database(':memory:');

// 初始化数据库和表
db.serialize(() => {
  db.run(`
    CREATE TABLE ECS_Entity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      A INTEGER,
      B INTEGER
    );
  `);
});

// 创建带有组件 A 的实体
const insertA = db.prepare('INSERT INTO ECS_Entity (A) VALUES (?)');
// 创建带有组件 B 的实体
const insertB = db.prepare('INSERT INTO ECS_Entity (B) VALUES (?)');

export default function (count) {
  // 创建带有组件 A 的实体
  for (let i = 0; i < count; i++) {
    insertA.run(1);
  }

  return () => {
    // 根据带有组件 A 的实体数量，创建带有组件 B 的实体
    db.get('SELECT COUNT(*) as count FROM ECS_Entity WHERE A IS NOT NULL', [], (err, row) => {
      if (err) {
        throw err;
      }
      const entitiesWithA = row.count;

      for (let i = 0; i < entitiesWithA; i++) {
        insertB.run(1);
      }

      // 删除所有带有组件 B 的实体
      db.run('DELETE FROM ECS_Entity WHERE B IS NOT NULL', (err) => {
        if (err) {
          throw err;
        }
      });
    });
  };
}
