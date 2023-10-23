import sql3 from 'sqlite3';
const db = new sql3.Database(':memory:');

// 初始化数据库和表
db.exec(`
  CREATE TABLE ECS_Entity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    A INTEGER,
    B INTEGER,
    C INTEGER,
    D INTEGER,
    E INTEGER
  );
`);

const insert = db.prepare('INSERT INTO ECS_Entity (A, B, C, D, E) VALUES (1, 1, 1, 1, 1)');
const updateA = db.prepare('UPDATE ECS_Entity SET A = A * 2 WHERE A IS NOT NULL');
const updateB = db.prepare('UPDATE ECS_Entity SET B = B * 2 WHERE B IS NOT NULL');
const updateC = db.prepare('UPDATE ECS_Entity SET C = C * 2 WHERE C IS NOT NULL');
const updateD = db.prepare('UPDATE ECS_Entity SET D = D * 2 WHERE D IS NOT NULL');
const updateE = db.prepare('UPDATE ECS_Entity SET E = E * 2 WHERE E IS NOT NULL');

export default async function (count) {
  // 创建实体
  for (let i = 0; i < count; i++) {
    insert.run();
  }

  return () => {
    // 更新组件 A
    updateA.run();

    // 更新组件 B
    updateB.run();

    // 更新组件 C
    updateC.run();

    // 更新组件 D
    updateD.run();

    // 更新组件 E
    updateE.run();
  };
}