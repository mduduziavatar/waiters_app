drop table if exists totaldays, staff, namedays;
create table staff(
	id serial not null primary key,
	name text
);

CREATE TABLE totaldays(
  id serial not null primary key,
  weekday text
);

INSERT INTO totaldays (weekday) VALUES ('monday');
INSERT INTO totaldays (weekday) VALUES ('tuesday');
INSERT INTO totaldays (weekday) VALUES ('wednesday');
INSERT INTO totaldays (weekday) VALUES ('thursday');
INSERT INTO totaldays (weekday) VALUES ('friday');

create table namedays(
	id serial not null primary key,
	staff_name text,
	totaldays_name text
);