CREATE DATABASE IF NOT EXISTS userdb;
CREATE DATABASE IF NOT EXISTS profiledb;
CREATE DATABASE IF NOT EXISTS appointmentsdb;
CREATE DATABASE IF NOT EXISTS pharmacydb;
CREATE DATABASE IF NOT EXISTS mediadb;
CREATE DATABASE IF NOT EXISTS videocalldb;

GRANT ALL PRIVILEGES ON userdb.* TO 'nicolasmanager'@'%';
GRANT ALL PRIVILEGES ON profiledb.* TO 'nicolasmanager'@'%';
GRANT ALL PRIVILEGES ON appointmentsdb.* TO 'nicolasmanager'@'%';
GRANT ALL PRIVILEGES ON pharmacydb.* TO 'nicolasmanager'@'%';
GRANT ALL PRIVILEGES ON mediadb.* TO 'nicolasmanager'@'%';
GRANT ALL PRIVILEGES ON videocalldb.* TO 'nicolasmanager'@'%';

FLUSH PRIVILEGES;
