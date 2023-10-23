import Database from 'better-sqlite3';
const db = new Database(':memory:');

// 初始化数据库和表
db.exec(`
  CREATE TABLE ECS_Entity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component TEXT,
    value INTEGER
  );
`);

// 预编译SQL语句
const insert = db.prepare('INSERT INTO ECS_Entity (component, value) VALUES (?, ?)');
const updateZ = db.prepare('UPDATE ECS_Entity SET value = value * 2 WHERE component = "Z"');
const updateData = db.prepare('UPDATE ECS_Entity SET value = value * 2 WHERE component = "Data"');

export default async function (count) {
  // 创建带有组件 A 到 Z 和 Data 的实体
  Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").forEach((component) => {
    for (let i = 0; i < count; i++) {
      insert.run(component, 1);
      insert.run("Data", 1);
    }
  });

  return () => {
    // 更新带有组件 Z 的实体
    updateZ.run();

    // 更新带有组件 Data 的实体
    updateData.run();
  };
}