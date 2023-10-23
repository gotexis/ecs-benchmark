import Database from 'better-sqlite3';
const db = new Database(':memory:');

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

const insertAB = db.prepare('INSERT INTO ECS_Entity (A, B) VALUES (1, 1)');
const insertABC = db.prepare('INSERT INTO ECS_Entity (A, B, C) VALUES (1, 1, 1)');
const insertABCD = db.prepare('INSERT INTO ECS_Entity (A, B, C, D) VALUES (1, 1, 1, 1)');
const insertABCE = db.prepare('INSERT INTO ECS_Entity (A, B, C, E) VALUES (1, 1, 1, 1)');

const swapAB = db.prepare('UPDATE ECS_Entity SET A = B, B = A WHERE A IS NOT NULL AND B IS NOT NULL');
const swapCD = db.prepare('UPDATE ECS_Entity SET C = D, D = C WHERE C IS NOT NULL AND D IS NOT NULL');
const swapCE = db.prepare('UPDATE ECS_Entity SET C = E, E = C WHERE C IS NOT NULL AND E IS NOT NULL');

export default async function (count) {
  // 创建实体
  for (let i = 0; i < count; i++) {
    insertAB.run();
    insertABC.run();
    insertABCD.run();
    insertABCE.run();
  }

  return () => {
    // 交换组件 A 和 B
    swapAB.run();

    // 交换组件 C 和 D
    swapCD.run();

    // 交换组件 C 和 E
    swapCE.run();
  };
}