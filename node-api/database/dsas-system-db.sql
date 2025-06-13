/*
 Navicat Premium Data Transfer

 Source Server         : mysql_server_localhost
 Source Server Type    : MySQL
 Source Server Version : 80038 (8.0.38)
 Source Host           : localhost:3307
 Source Schema         : dsas-system-db

 Target Server Type    : MySQL
 Target Server Version : 80038 (8.0.38)
 File Encoding         : 65001

 Date: 13/06/2025 15:04:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for appointment_tbl
-- ----------------------------
DROP TABLE IF EXISTS `appointment_tbl`;
CREATE TABLE `appointment_tbl`  (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `date` datetime NULL DEFAULT NULL,
  `timewindow_id` int NULL DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`appointment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of appointment_tbl
-- ----------------------------

-- ----------------------------
-- Table structure for availability_tbl
-- ----------------------------
DROP TABLE IF EXISTS `availability_tbl`;
CREATE TABLE `availability_tbl`  (
  `availability_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `start_date` date NULL DEFAULT NULL,
  `end_date` date NULL DEFAULT NULL,
  `capacity_per_day` int NULL DEFAULT NULL,
  `created_by` int NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`availability_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of availability_tbl
-- ----------------------------
INSERT INTO `availability_tbl` VALUES (1, '1', '2024-06-01', '2024-06-15', 50, 2, '2024-05-01 00:00:00');
INSERT INTO `availability_tbl` VALUES (2, '1', '2024-06-01', '2024-06-15', 50, 2, '2024-05-01 00:00:00');

-- ----------------------------
-- Table structure for log_entries_tbl
-- ----------------------------
DROP TABLE IF EXISTS `log_entries_tbl`;
CREATE TABLE `log_entries_tbl`  (
  `log_id` int NOT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `details` json NULL,
  `timestamp` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of log_entries_tbl
-- ----------------------------

-- ----------------------------
-- Table structure for time_window_tbl
-- ----------------------------
DROP TABLE IF EXISTS `time_window_tbl`;
CREATE TABLE `time_window_tbl`  (
  `window_id` int NOT NULL AUTO_INCREMENT,
  `availability_id` int NULL DEFAULT NULL,
  `start_time` time NULL DEFAULT NULL,
  `end_time` time NULL DEFAULT NULL,
  PRIMARY KEY (`window_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of time_window_tbl
-- ----------------------------
INSERT INTO `time_window_tbl` VALUES (1, 1, '08:30:00', '11:30:00');
INSERT INTO `time_window_tbl` VALUES (2, 2, '08:30:00', '11:30:00');

-- ----------------------------
-- Table structure for transaction_type_tbl
-- ----------------------------
DROP TABLE IF EXISTS `transaction_type_tbl`;
CREATE TABLE `transaction_type_tbl`  (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `transaction_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `transaction_details` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`transaction_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transaction_type_tbl
-- ----------------------------
INSERT INTO `transaction_type_tbl` VALUES (1, 'Claiming of ID', 'Claiming the ID in DSAS office');

-- ----------------------------
-- Table structure for users_tbl
-- ----------------------------
DROP TABLE IF EXISTS `users_tbl`;
CREATE TABLE `users_tbl`  (
  `user_id` int NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `date_added` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_tbl
-- ----------------------------
INSERT INTO `users_tbl` VALUES (0, 'SuperSudo', 'sudo123', 'sudo@gmail.com', '2025-06-11 10:31:15');

-- ----------------------------
-- Procedure structure for get_availability
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_availability`;
delimiter ;;
CREATE PROCEDURE `get_availability`(IN searchkey VARCHAR(100))
BEGIN
    SELECT 
        A.availability_id,
        T.transaction_title,
        DATE_FORMAT(A.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(A.end_date, '%Y-%m-%d') AS end_date,
        A.capacity_per_day,
        A.created_by,
        DATE_FORMAT(A.created_at, '%Y-%m-%d') AS created_at,
        TW.start_time,
        TW.end_time
    FROM availability_tbl AS A
    LEFT JOIN transaction_type_tbl AS T ON A.transaction_id = T.transaction_id
    LEFT JOIN time_window_tbl AS TW ON A.availability_id = TW.availability_id
    WHERE 
        A.availability_id LIKE CONCAT(searchkey, '%') OR
        A.capacity_per_day LIKE CONCAT(searchkey, '%') OR
        A.created_by LIKE CONCAT(searchkey, '%') OR
        T.transaction_title LIKE CONCAT(searchkey, '%')
    ORDER BY A.availability_id;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for login
-- ----------------------------
DROP PROCEDURE IF EXISTS `login`;
delimiter ;;
CREATE PROCEDURE `login`(IN jsondata JSON)
BEGIN

	DECLARE response JSON DEFAULT '{"success":"false", "message":"Db error, failed to verify user."}';
	DECLARE _email VARCHAR(100) DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.email"));
	DECLARE _password VARCHAR(100) DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.password"));

		SELECT user_id, email, user_name
    FROM users_tbl
    WHERE email = _email AND password = _password
    LIMIT 1;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for update_appointment
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_appointment`;
delimiter ;;
CREATE PROCEDURE `update_appointment`(IN `jsondata` JSON)
BEGIN
	

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for update_availability
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_availability`;
delimiter ;;
CREATE PROCEDURE `update_availability`(IN `jsondata` JSON)
BEGIN
	DECLARE _response JSON DEFAULT '{"success": "false", "message": "Database error."}';

	DECLARE _availability_id INT DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.availability_id"));
	DECLARE _transaction_id INT DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.transaction_id"));
	DECLARE _start_date DATE DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.start_date"));
	DECLARE _end_date DATE DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.end_date"));
	DECLARE _capacity_per_day INT DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.capacity_per_day"));
	DECLARE _created_by INT DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.created_by"));
	DECLARE _created_at DATE DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.created_at"));
	DECLARE _start_time TIME DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.start_time"));
	DECLARE _end_time TIME DEFAULT JSON_UNQUOTE(JSON_EXTRACT(jsondata, "$.end_time"));
	
	IF EXISTS(SELECT 1 FROM availability_tbl WHERE availability_id = _availability_id) THEN
	
		UPDATE availability_tbl
		SET transaction_id = _transaction_id,
				start_date = _start_date,
				end_date = _end_date,
				capacity_per_day = _capacity_per_day,
				created_by = _created_by,
				created_at = _created_at
		WHERE availability_id = _availability_id;
		
		SET _response = '{"success": "true", "message": "Record successfully updated."}';
	
	ELSE
	
		INSERT INTO availability_tbl (transaction_id, start_date, end_date, capacity_per_day, created_by, created_at)
		VALUES (_transaction_id, _start_date, _end_date, _capacity_per_day, _created_by, _created_at);
		
		SELECT LAST_INSERT_ID() INTO @new_availability_id;
		
		INSERT INTO time_window_tbl (availability_id, start_time, end_time)
		VALUES (@new_availability_id, _start_time, _end_time);
		
		SET _response = '{"success": "true", "message": "Record successfully inserted."}';
		
	END IF;
	
	SELECT _response AS result;

END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
