DROP TABLE IF EXISTS News;
DROP TABLE IF EXISTS Publishers;
CREATE TABLE IF NOT EXISTS News (news_id TEXT PRIMARY KEY, title TEXT, content TEXT, publication_date TEXT ,photos TEXT, publisher INTEGER  REFERENCES Publishers (publisher_id));
CREATE TABLE IF NOT EXISTS Publishers (publisher_id INTEGER PRIMARY KEY, name TEXT, contact_info TEXT);
INSERT INTO Publishers (publisher_id,name) VALUES (1,'纽约时报'),(2,'日本产经新闻'),(3,'BBC');



