CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    date TIMESTAMP
);

insert into blogs (author, url, title) values ('testAuthor', 'test.com', 'testTitle');
insert into blogs (author, url, title, likes) values ('testAuthor0', 'test.com0', 'testTitle0', 1);
select * from blogs;