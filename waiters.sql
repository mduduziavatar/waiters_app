create table staff(
	id serial not null primary key,
	staffName text not null
);

create table daysOfWeek(
	id serial not null primary key,
	staff_id int,
	monday varchar not null,	
	tuesday varchar not null,
	wednesday varchar not null,
	thursday varchar not null,
	friday varchar not null,
	saturday varchar not null,
	sunday varchar not null,
	foreign key (staff_id) references staff(id)
);

insert into daysOfWeek (days) values ('Monday');
insert into daysOfWeek (days) values ('Tuesday');
insert into daysOfWeek (days) values ('Wednesday');
insert into daysOfWeek (days) values ('Thursday');
insert into daysOfWeek (days) values ('Friday');
