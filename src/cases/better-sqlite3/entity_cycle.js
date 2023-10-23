import Database from 'better-sqlite3';
const db = new Database(':memory:');

// 初始化数据库和表
db.exec(`
  CREATE TABLE ECS_Entity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    A INTEGER,
    B INTEGER
  );
`);

const insertA = db.prepare('INSERT INTO ECS_Entity (A) VALUES (?)');
const insertB = db.prepare('INSERT INTO ECS_Entity (B) VALUES (?)');
const countWithA = db.prepare('SELECT COUNT(*) FROM ECS_Entity WHERE A IS NOT NULL');
const deleteWithB = db.prepare('DELETE FROM ECS_Entity WHERE B IS NOT NULL');

export default function (count) {
  // 创建带有组件 A 的实体
  for (let i = 0; i < count; i++) {
    insertA.run(1);
  }

  return () => {
    // 根据带有组件 A 的实体数量，创建带有组件 B 的实体
    const entitiesWithA = countWithA.get()['COUNT(*)'];
    for (let i = 0; i < entitiesWithA; i++) {
      insertB.run(1);
    }

    // 删除所有带有组件 B 的实体
    deleteWithB.run();
  };
}