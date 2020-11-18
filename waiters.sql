drop table if exists totalDays, staff, nameDays;
create table staff(
	id serial not null primary key,
	staffname text not null
);

CREATE TABLE totalDays (
  id serial not null primary key,
  weekday TEXT,
);

INSERT INTO totalDays (weekday) VALUES ('monday');
INSERT INTO totalDays (weekday) VALUES ('tuesday');
INSERT INTO totalDays (weekday) VALUES ('wednesday');
INSERT INTO totalDays (weekday) VALUES ('thursday');
INSERT INTO totalDays (weekday) VALUES ('friday');

create table nameDays(
	id serial not null primary key,
	staff_id int,
	totalDays_id int,
	foreign key (staff_id) references staff(id),
	foreign key (totalDays_id) references totalDays(id)
);