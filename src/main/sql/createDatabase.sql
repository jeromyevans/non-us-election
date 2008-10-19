create database nonuselection;
grant all on nonuselection.* to 'nonuselection'@'localhost';
grant all on nonuselection.* to 'nonuselection'@'localhost.localdomain';

set password for 'nonuselection'@'localhost' = PASSWORD('md5f6986ff2fffa31a3da873ebd72aef8459a4c6');
set password for 'nonuselection'@'localhost.localdomain' = PASSWORD('md5f6986ff2fffa31a3da873ebd72aef8459a4c6');