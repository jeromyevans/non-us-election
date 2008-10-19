create table Vote (Id bigint not null auto_increment, Country varchar(3), IPAddress varchar(255), Timestamp datetime, VoteType integer, primary key (Id)) ENGINE=InnoDB;
create table VoteResult (Id bigint not null auto_increment, country varchar(255), democratic integer not null, republican integer not null, timestamp datetime, primary key (Id)) ENGINE=InnoDB;
