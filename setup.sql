CREATE DATABASE jobs;
CREATE USER jobs@localhost;
GRANT ALL PRIVILEGES ON jobs.* TO jobs@localhost;
FLUSH PRIVILEGES;


CREATE TABLE `runtime` (
  `ip` varchar(50) DEFAULT NULL,
  `job` varchar(50) DEFAULT NULL,
  `experiment` int(5) DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `ended` datetime DEFAULT NULL,
  `elapsed` int(11) DEFAULT NULL,
  `container` varchar(64) DEFAULT NULL,
  `logs` text,
  `code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 

CREATE TABLE `vm` (
  `host` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `boot` datetime DEFAULT NULL,
  `shutdown` datetime DEFAULT NULL,
  `experiment` int(5) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 