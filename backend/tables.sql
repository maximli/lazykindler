-- 存放书籍的相关元数据信息
CREATE TABLE book_meta (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
    name                TEXT,         -- 书名
    description         TEXT,         -- 描述
    author              TEXT,         -- 作者
	subjects            TEXT,         -- 标签
	stars               INTEGER,      -- 评分。满分10分
    size                INTEGER,      -- 图书大小
    publisher           TEXT,         -- 出版商
	coll_uuids          TEXT,         -- book_collections uuids列表，分号相隔
	done_dates          TEXT,         -- 读完日期
	md5                 TEXT,         -- md5
	create_time         TEXT          -- 创建时间
);

-- 存放书籍的文件内容
CREATE TABLE book (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid           TEXT,
    name           TEXT,         -- 书名
    format         TEXT,         -- 格式
    size           INTEGER,      -- 文件大小
	content        BLOB,         -- 内容
	create_time    TEXT          -- 创建时间
);

-- 存放书籍封面
CREATE TABLE cover (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid           TEXT,
    name           TEXT,         -- 书名
    size           INTEGER,      -- 文件大小
	content        TEXT,         -- 内容
	create_time    TEXT          -- 创建时间
);

-- 临时导入的书籍
CREATE TABLE tmp_book (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
    create_time         TEXT
);

-- 书籍集合
CREATE TABLE book_collection (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid                TEXT,
	name                TEXT,           -- 集合名
    description         TEXT,           -- 描述
    book_uuids          TEXT,           -- book uuid集合
	subjects            TEXT,           -- 标签
	stars               INTEGER,        -- 评分。满分10分
    create_time         TEXT
);
