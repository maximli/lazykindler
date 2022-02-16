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

-- Clippings文件的md5。后台服务启动后，会每隔短暂的时间判断 /Volumes/Kindle/documents/My\ Clippings.txt是否存在
-- 并且md5是否和表中所存一致，如果不一致说明有新增，自动把kindle笔记导入数据库
CREATE TABLE clippings_md5 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    md5                 TEXT
);

-- 存放剪切文字
CREATE TABLE clipping (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
	book_name           TEXT,         -- 书名
    author              TEXT,         -- 作者
    content             TEXT,         -- 剪切内容
	addDate             TEXT,         -- 添加时间
	subjects            TEXT,         -- 标签
	coll_uuids          TEXT,         -- clipping_collections uuids列表，分号相隔
	md5                 TEXT,         -- md5
	create_time         TEXT          -- 创建时间
);

-- 存放剪切文字
CREATE TABLE clippings_coll (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
	name                TEXT,
	subjects            TEXT,         -- 标签
	clipping_uuids      TEXT,         -- clipping uuids列表，分号相隔
	create_time         TEXT          -- 创建时间
);