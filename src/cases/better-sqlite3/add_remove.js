import Database from 'better-sqlite3';
const db = new Database(':memory:');

// 初始化数据库和表
db.exec(`
  CREATE TABLE ECS_Entity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    A BOOLEAN,
    B BOOLEAN
  );
`);

const insert = db.prepare('INSERT INTO ECS_Entity (A) VALUES (true)');
const addComponentB = db.prepare('UPDATE ECS_Entity SET B = true');
const removeComponentB = db.prepare('UPDATE ECS_Entity SET B = false');

export default async function (count) {
  // 创建实体
  for (let i = 0; i < count; i++) {
    insert.run();
  }

  return () => {
    // 添加组件 B
    addComponentB.run();

    // 删除组件 B
    removeComponentB.run();
  };
}
