-- 存放书籍的相关元数据信息
CREATE TABLE book_meta (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid TEXT,            
    book_name TEXT,         -- 书名
    author TEXT,            -- 作者
	collection_id INTEGER,  -- 集合id
	subjects TEXT,          -- 标签
	stars     INTEGER,      -- 评分。满分10分
    book_size INTEGER,      -- 图书大小
    publisher TEXT,         -- 出版商
	done_dates TEXT,        -- 读完日期
	cover_content BLOB,     -- 封面
    cover_format TEXT,      -- 封面图像格式
	md5    TEXT,            -- md5
	create_time TEXT        -- 创建时间
);

-- 存放书籍的文件内容
CREATE TABLE book (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid TEXT,              
    book_name TEXT,         -- 书名
    book_format TEXT,       -- 格式
    book_size INTEGER,      -- 文件大小
	book_content BLOB,      -- 内容
	create_time TEXT        -- 创建时间
);

-- 临时导入的书籍
CREATE TABLE tmp_book (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid TEXT,
    create_time TEXT
);

-- 书籍集合
CREATE TABLE book_collection (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,               -- 集合名
	subjects TEXT,           -- 标签
	stars     INTEGER,       -- 评分。满分10分
    create_time TEXT
);
