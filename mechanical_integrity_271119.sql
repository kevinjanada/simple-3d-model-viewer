-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2019 at 04:58 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mechanical_integrity`
--

-- --------------------------------------------------------

--
-- Table structure for table `dynamicspecification`
--

CREATE TABLE `dynamicspecification` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dynamicspecification`
--

INSERT INTO `dynamicspecification` (`id`, `name`, `value`, `createdAt`, `updatedAt`) VALUES
(1, 'tank', '{\"fields\":[{\"name\":\"codeAndStandard\",\"label\":\"CODE AND STANDARD\",\"dataType\":\"TEXT\",\"no\":1},{\"name\":\"fluid\",\"label\":\"FLUID\",\"dataType\":\"TEXT\",\"no\":2},{\"name\":\"mdmt\",\"label\":\"MDMT\",\"dataType\":\"FLOAT\",\"no\":3,\"unit\":\"C\"},{\"name\":\"designPressuare\",\"label\":\"DESIGN PRESSUARE\",\"dataType\":\"TEXT\",\"no\":4},{\"name\":\"hydrotestPressuare\",\"label\":\"HYDROTEST PRESSUARE\",\"dataType\":\"TEXT\",\"no\":5},{\"name\":\"operationPressuare\",\"label\":\"OPERATION PRESSUARE\",\"dataType\":\"FLOAT\",\"no\":6,\"unit\":\"C\"}]}', '2019-11-23 20:49:35', '2019-11-27 01:54:49'),
(2, 'psv', '{}', '2019-11-23 20:49:35', '2019-11-23 20:49:35'),
(3, 'pipe', '{}', '2019-11-23 20:49:35', '2019-11-23 20:49:35'),
(4, 'vessel', '{}', '2019-11-23 20:49:35', '2019-11-23 20:49:35'),
(5, 'he', '{}', '2019-11-23 20:49:35', '2019-11-23 20:49:35');

-- --------------------------------------------------------

--
-- Table structure for table `file_store`
--

CREATE TABLE `file_store` (
  `id` int(11) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `content` longblob,
  `size` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `parent`, `name`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 0, 'A', 'Node', '2019-11-11 00:00:00', '0000-00-00 00:00:00'),
(2, 0, 'B', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(3, 0, 'C', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(4, 1, 'A1', 'node', '2019-11-11 00:00:00', '0000-00-00 00:00:00'),
(5, 1, 'A2', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(6, 1, 'A3', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(7, 2, 'B1', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(8, 2, 'B2', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(9, 5, 'A1.1', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(10, 5, 'A1.2', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(11, 9, 'A1.1.1', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(12, 9, 'A1.1.2', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(13, 12, 'A1.1.2.1', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(14, 12, 'A1.1.2.2', 'node', '2019-11-11 00:00:00', '2019-11-11 00:00:00'),
(15, 1, 'test1', 'node', '2019-11-12 08:56:38', '2019-11-12 08:56:38'),
(16, 14, 'A1.1.2.2.1', 'node', '2019-11-12 09:01:29', '2019-11-12 09:01:29'),
(17, 7, 'b1.3', 'node', '2019-11-18 12:43:53', '2019-11-18 12:43:53');

-- --------------------------------------------------------

--
-- Table structure for table `node`
--

CREATE TABLE `node` (
  `id` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `tag` varchar(120) DEFAULT NULL,
  `location` text,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `node`
--

INSERT INTO `node` (`id`, `parent`, `name`, `tag`, `location`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 0, 'Equipment', '', '', 'root', '2019-11-21 17:28:50', '2019-11-21 17:28:50'),
(2, 1, 'SOLUTION', '', NULL, 'area', '2019-11-21 17:29:47', '2019-11-23 06:52:13'),
(3, 1, 'FINISHING', '', NULL, 'area', '2019-11-21 17:32:44', '2019-11-23 07:09:39'),
(4, 1, 'UTILITY', '', NULL, 'area', '2019-11-21 17:33:07', '2019-11-23 07:09:49'),
(5, 1, 'Pipe', NULL, NULL, 'area', '2019-11-21 17:33:19', '2019-11-21 17:33:19'),
(7, 1, 'Heat Exchanger', NULL, NULL, 'area', '2019-11-21 17:34:21', '2019-11-21 17:34:21'),
(8, 2, 'SOLVENT TANK FARM', '', NULL, 'area', '2019-11-21 17:34:49', '2019-11-23 06:52:22'),
(9, 2, 'PURIFICATION', '', NULL, 'area', '2019-11-21 17:35:17', '2019-11-23 06:52:41'),
(10, 2, 'CHEMICAL PREPARATION', '', NULL, 'area', '2019-11-21 17:35:47', '2019-11-23 06:52:49'),
(11, 2, 'POLYMERIZATION', '', NULL, 'area', '2019-11-21 17:36:20', '2019-11-23 06:52:55'),
(12, 2, 'CONCENTRATION', '', NULL, 'area', '2019-11-21 17:36:39', '2019-11-23 06:53:02'),
(13, 2, 'STRIPPING', '', NULL, 'area', '2019-11-21 17:36:59', '2019-11-23 06:53:09'),
(14, 2, 'CRUMB SLURRY', '', NULL, 'area', '2019-11-21 17:37:22', '2019-11-23 06:53:18'),
(23, 8, 'Wet Process Solvent Storage Tank (ST-1616)', 'T1331-01', NULL, 'tank', '2019-11-26 23:37:07', '2019-11-26 23:37:07'),
(24, 8, 'Dry Process Solvent Storage Tank (ST-1617)', 'T1332-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(25, 8, 'Wet Process Solvent Storage Tank (ST-1618)', 'T2331-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(26, 8, 'Dry Process Solvent Storage Tank (ST-1619)', 'T2332-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(27, 8, 'Anti Oxidant S (ST-1607)', 'T6304-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(28, 8, 'Mes Daily Tank (ST-1608)', 'T6323-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(29, 8, 'Dry Raw Solvent Storage Tank (ST-1609)', 'T6332-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(30, 8, 'Clean Process Solvent Storage Tank (ST-1610)', 'T6333-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(31, 8, 'Wet Styrene Tank (ST-1611)', 'T6336-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(32, 8, 'Wet Raw Solvent Storage Tank (ST-1612)', 'T6337-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(33, 8, 'Polluted Solvent Storage Tank (ST-1613)', 'T6341-01', NULL, 'tank', '2019-11-26 23:38:29', '2019-11-26 23:38:29'),
(34, 9, 'Process Solvent Purification Column', 'C1333.01', NULL, 'none', '2019-11-26 23:41:49', '2019-11-26 23:41:49'),
(35, 9, 'Process Solvent Purification Column', 'C2333.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(36, 9, 'Raw Solvent Distillation Column', 'C6332.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(37, 9, 'Alumina Adsorber Column', 'C6334.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(38, 9, 'Styrene Drying Column', 'C6336.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(39, 9, 'Butadiene Drying Column', 'C6338.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(40, 9, 'Distillation Column', 'C6339.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(41, 9, 'Process Solvent Purification Column Feed Pre-Heater (TS)', 'E1333.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(42, 9, 'Process Solvent Purification Column Reboiler (TS)', 'E1333.03A', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(43, 9, 'Process Solvent Purification Column Reboiler (TS)', 'E1333.03B', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(44, 9, 'Process Solvent Purification Column Trim Cooler (TS)', 'E1333.05', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(45, 9, 'Process Solvent Purification Column Feed Pre-Heater (TS)', 'E2333.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(46, 9, 'Process Solvent Purification Column Reboiler (TS)', 'E2333.03A', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(47, 9, 'Process Solvent Purification Column Reboiler (TS)', 'E2333.03B', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(48, 9, 'Process Solvent Purification Column Trim Cooler (TS)', 'E2333.05', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(49, 9, ' Heat Exchanger / Silindris Horisontal', 'E6331.01', NULL, 'he', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(50, 9, 'Raw Solvent Distillation Column Condenser (TS)', 'E6332.02', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(51, 9, 'Butadiene Vapor Condenser (TS)', 'E6335.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(52, 9, 'Wet Styrene Circulation Cooler (TS)', 'E6336.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(53, 9, 'Butadiene Drying Column Condenser (TS)', 'E6338.02', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(54, 9, 'Dry Butadiene Vessel', 'V6331.01', NULL, 'vessel', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(55, 9, 'Wet Butadiene Vessel', 'V6335.01', NULL, 'vessel', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(56, 9, 'Solvent Purification Drain Drum', 'V6481.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(57, 9, 'Distillation Column Reflux Drum', 'V6339.01', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(58, 9, 'Solvent Heat Exchanger (TS)', 'E6304.01', NULL, 'he', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(59, 9, 'Process Solvent Purification Reflux Heater (TS)', 'E2333.07', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(60, 9, 'MES Injection Heater (TS)', 'E6323.02', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(61, 9, 'Process Solvent Purification  Reflux Heater (TS)', 'E1333.07', NULL, 'none', '2019-11-26 23:41:50', '2019-11-26 23:41:50'),
(62, 9, 'Butadiene Drying Column Feeding Heater (TS)', 'E6338.04', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(63, 9, 'Process Solvent Purification Column Bottoms Cooler (HS)', 'E1333.06', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(64, 9, 'Distillation Column Reboiler (TS)', 'E6339.01', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(65, 9, 'Process Solvent Purification Economiser (HS)', 'E1333.08', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(66, 9, 'Raw Solvent Distillation Column Feed Heater (TS)', 'E6332.04', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(67, 9, 'Process Solvent Purification Column Bottoms Cooler (HS)', 'E2333.06', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(68, 9, 'Process Solvent Purification Economiser (HS)', 'E2333.08', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(69, 9, 'Raw Solvent Distillation Column Bottoms Cooler (TS)', 'E6332.03', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(70, 9, 'Dry Process Solvent Cooler (TS)', 'E6334.01', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(71, 9, 'Butadiene Drying Column Reboiler (TS)', 'E6338.01', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(72, 9, 'Demi Water Heater (HS)', 'E6491.01', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(73, 9, 'Cooling Water Subcooler (TS)', 'E1221.02', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(74, 9, 'Raw Solvent Distillation Column Reboiler (TS)', 'E6332.01', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(75, 9, 'Butadiene Drying Column Bottoms Cooler (TS) (HS)', 'E6338.05', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(76, 9, 'Butadiene Drying Column Economiser  (HS)', 'E6338.03', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(77, 9, 'Distillation Column Economiser (TS)', 'E6339.04', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(78, 9, 'Distillation Column Overhead Product Cooler', 'E6339.06', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(79, 9, 'Dry Proc Solvent OVH', 'E6339.02', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(80, 9, 'Distillation Column Bottoms Cooler', 'E6339.03', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(81, 9, 'Distillation Column Feed Heater (TS)', 'E6339.05', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(82, 9, ' Process Solvent Purification Column Air Condenser', 'E1333.04', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(83, 9, '-', 'E2333.04', NULL, 'none', '2019-11-26 23:41:51', '2019-11-26 23:41:51'),
(84, 10, 'Etastop Make-up Vessel', 'V6315.01', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(85, 10, 'Epsistop Make-up Vessel', 'V6318.01', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(86, 10, 'Epsistop Daily Vessel', 'V6318.02', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(87, 10, 'Deltastop Make-up Vessel', 'V6319.01', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(88, 10, 'Terstop Preparation Vessel', 'V6314.01', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(89, 10, 'Tifane Make-up Vessel', 'V6317.01', NULL, 'vessel', '2019-11-26 23:52:17', '2019-11-26 23:52:17'),
(90, 10, 'Etastop Daily Vessel', 'V6315.02', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(91, 10, 'Startyl Make-up Vessel', 'V6311.01', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(92, 10, 'BPH Preparation Vessel', 'V6305.01', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(93, 10, 'BPH Daily Vessel', 'V6305.02', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(94, 10, 'Chemicals Drain Drum', 'V6487.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(95, 10, 'Deltastop/Epsistop Drain Drum', 'V6485.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(96, 10, 'Acid Drain Drum', 'V6484.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(97, 10, 'Concentration Drain Drum', 'V6483.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(98, 10, 'Polymerization Drain Drum', 'V6482.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(99, 10, 'Alkyls K.O. Drum ', 'V6414.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(100, 10, 'Terstop Daily Vessel', 'V6314.02', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(101, 10, 'Ceryl Storage Vessel', 'V1213.01', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(102, 10, 'Speedyl Storage Vessel', 'V1212.01', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(103, 10, ' Inityme Storage Vessel', 'V1211.01', NULL, 'vessel', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(104, 10, 'Preformator', 'R1223.02', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(105, 10, 'Preformator', 'R1223.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(106, 10, 'Alkylator', 'R1222.02', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(107, 10, 'Alkylator', 'R1222.01', NULL, 'none', '2019-11-26 23:52:18', '2019-11-26 23:52:18'),
(108, 10, 'BPH/Terstop Preparation Heater (TS)', 'E6305.01', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(109, 10, 'Birlene Make-up Cooler (TS)', 'E1224.01', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(110, 10, 'Birlene Cooler (TS)', 'E1223.01', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(111, 10, 'Birlene Cooler (TS)', 'E1223.02', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(112, 10, 'Stistop Daily Vessel', 'E6322.01', NULL, 'vessel', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(113, 10, 'Birlene Solvent Heat Exchanger', 'E1221.01', NULL, 'he', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(114, 10, 'Warm Water Heat Exchanger', 'E1223.03', NULL, 'he', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(115, 10, 'Birlene On-Spec Drum', 'V1224.01', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(116, 10, 'Emergency Stopper Vessel', 'V1228.01', NULL, 'vessel', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(117, 10, 'Emergency Stopper Vessel', 'V1227.01', NULL, 'vessel', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(118, 10, 'Birlene Off-Spec Drum', 'V1224.02', NULL, 'none', '2019-11-26 23:52:19', '2019-11-26 23:52:19'),
(119, 11, '1st Polymerization Reactor', 'R1342.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(120, 11, '2nd Polymerization Reactor', 'R1342.02', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(121, 11, '3rd Polymerization Reactor', 'R1342.03', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(122, 11, '1st Polymerization Reactor', 'R1345.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(123, 11, '2nd Polymerization Reactor', 'R1345.02', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(124, 11, '3rd Polymerization Reactor', 'R1345.03', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(125, 11, '1st Polymerization Reactor', 'R2342.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(126, 11, '2nd Polymerization Reactor', 'R2342.02', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(127, 11, 'Charge Header Exchanger (TS)', 'E2341.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(128, 11, 'Charge Header Exchanger (TS)', 'E1344.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(129, 11, 'Charge Header Exchanger (TS)', 'E1341.01', NULL, 'none', '2019-11-26 23:54:02', '2019-11-26 23:54:02'),
(130, 11, 'Polymerization Blowdown Drum', 'V6416.01', NULL, 'none', '2019-11-26 23:54:03', '2019-11-26 23:54:03'),
(131, 11, 'Emergency Stopper Vessel', 'V1347.01', NULL, 'vessel', '2019-11-26 23:54:03', '2019-11-26 23:54:03'),
(132, 12, '2nd Concentration Stage Pre-Heater', 'E1352.02C', NULL, 'none', '2019-11-26 23:56:02', '2019-11-26 23:56:02'),
(133, 12, '2nd Concentration Stage Pre-Heater', 'E1352.02A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(134, 12, '1st Concentration Stage Pre-Heater', 'E1352.01E', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(135, 12, '1st Concentration Stage Pre-Heater', 'E1352.01D', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(136, 12, '2nd Concentration Stage Pre-Heater', 'E1352.02B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(137, 12, '2nd Concentration Stage Pre-Heater (TS)', 'E2352.02B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(138, 12, '1st Concentration Stage Pre-Heater ', 'E2352.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(139, 12, '1st Concentration Stage Pre-Heater ', 'E2352.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(140, 12, '2nd Concentration Stage Pre-Heater (TS)', 'E2352.02A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(141, 12, '1st Concentration Stage Pre-Heater', 'E1352.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(142, 12, '1st Concentration Stage Pre-Heater', 'E1352.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(143, 12, 'Pre-Flash Filter', 'S1351.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(144, 12, 'Pre-Flash Filter', 'S1351.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(145, 12, 'Flash Filter', 'S1352.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(146, 12, 'Flash Filter', 'S1352.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(147, 12, 'Flash Filter', 'S2352.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(148, 12, 'Flash Filter', 'S2352.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(149, 12, 'Pre-Flash Filter', 'S2351.01B', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(150, 12, 'Pre-Flash Filter', 'S2351.01A', NULL, 'none', '2019-11-26 23:56:03', '2019-11-26 23:56:03'),
(151, 12, 'Concentration Section Air Condenser', 'E1353.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(152, 12, 'Concentration Section Trim Cooler', 'E2353.02', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(153, 12, 'Concentration Section Trim Cooler', 'E1353.02', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(154, 12, 'Recycle Solvent Vapors', 'E2353.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(155, 12, 'Polymer Solution Filter', 'S2361.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(156, 12, 'Polymer Solution Filter', 'S1361.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(157, 12, 'EC Polymer Solution Vessel', 'V1361.01', NULL, 'vessel', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(158, 12, 'Polymer Solution Filter', 'S1361.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(159, 12, 'HC Polymer Solution Vessel', 'V1361.02', NULL, 'vessel', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(160, 12, 'HS Polymer Solution Vessel', 'V1361.03', NULL, 'vessel', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(161, 12, 'Pre-Flash Drum', 'V1351.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(162, 12, '1st Stage Flash Drum', 'V1352.01', NULL, 'none', '2019-11-26 23:56:04', '2019-11-26 23:56:04'),
(163, 13, 'Stripped Vapor Trim Cooler (TS)', 'E2373.03', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(164, 13, 'Stripped Vapor Trim Cooler (TS)', 'E1373.04', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(165, 13, 'Stripped Vapor Trim Cooler (TS)', 'E1373.03', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(166, 13, ' Stripped Vapors H2O + Solvents', 'E2373.01', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(167, 13, 'Stripped Vapor Filter', 'S1372.01B', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(168, 13, 'Stripped Vapor Filter', 'S1372.01A', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(169, 13, 'Stripped Vapor Filter', 'S1371.01B', NULL, 'none', '2019-11-26 23:58:25', '2019-11-26 23:58:25'),
(170, 13, 'Stripped Vapor Filter', 'S2371.01A', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(171, 13, 'Stripped Vapor Filter', 'S2371.01B', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(172, 13, 'Stripped Vapor Filter', 'S1371.01A', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(173, 13, 'Stripped Vapor Condensate Drum', 'V1373.01', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(174, 13, 'Tertiary Stripper', 'V1372.03', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(175, 13, 'Second Stripper', 'V1372.02', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(176, 13, 'First Stripper', 'V1372.01', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(177, 13, 'Second Stripper', 'V1371.02', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(178, 13, 'Second Stripper', 'E1373.02', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(179, 13, 'Stripped Vapor Air Condenser', 'E1373.01', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(180, 13, 'Tertiary Stripper', 'V1371.03', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(181, 13, 'Stripped Vapor Filter', 'S2371.01A', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(182, 13, 'Stripped Vapor Filter', 'S2371.01B', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(183, 13, 'Stripped Vapor Condensate Drum', 'V2373.01', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(184, 13, 'Stripped Vapor Trim Cooler (TS)', 'E2373.03', NULL, 'none', '2019-11-26 23:58:26', '2019-11-26 23:58:26'),
(185, 13, 'Second Stripper', 'V2371.02', NULL, 'none', '2019-11-26 23:58:27', '2019-11-26 23:58:27'),
(186, 13, 'First Stripper', 'V2371.01', NULL, 'none', '2019-11-26 23:58:27', '2019-11-26 23:58:27'),
(187, 13, 'Tertiary Stripper', 'V2371.03', NULL, 'none', '2019-11-26 23:58:27', '2019-11-26 23:58:27'),
(188, 13, ' Stripped Vapors H2O + Solvents', 'E2373.01', NULL, 'none', '2019-11-26 23:58:27', '2019-11-26 23:58:27'),
(189, 14, 'Crumbs Slurry Tank (ST-1620)', 'T1374-01', NULL, 'tank', '2019-11-26 23:59:54', '2019-11-26 23:59:54'),
(190, 14, 'Crumbs Slurry Tank (ST-1621)', 'T1374-02', NULL, 'tank', '2019-11-26 23:59:54', '2019-11-26 23:59:54'),
(191, 14, 'Crumbs Slurry Tank (ST-1623)', 'T2374-01', NULL, 'tank', '2019-11-26 23:59:54', '2019-11-26 23:59:54'),
(192, 3, 'Recycle Water Tank (ST-1622)', 'T1375-01', NULL, 'tank', '2019-11-27 00:01:57', '2019-11-27 00:01:57'),
(193, 3, 'Recycle Water Tank (ST-1624)', 'T2375-01', NULL, 'tank', '2019-11-27 00:01:57', '2019-11-27 00:01:57'),
(194, 4, 'Utility Water Tank (ST-1615)', 'T6491-02', NULL, 'tank', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(195, 4, 'Demi Water Tank (ST-1614)', 'T6491-01', NULL, 'tank', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(196, 4, 'Expansion  Vessel', 'V6452.02', NULL, 'vessel', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(197, 4, 'Main Flare K.O. Drum', 'V6411.01', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(198, 4, 'Off-Gas K.O. Drum', 'V6412.01', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(199, 4, 'Acid Vessel', 'V6491.04', NULL, 'vessel', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(200, 4, 'MPC Flash Drum', 'V6442.01', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(201, 4, 'IA Receiver', 'V6421.01', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(202, 4, 'Stripping K.O. Drum', 'V6415.01', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(203, 4, 'LPC Flash Drum', 'V6442.02', NULL, 'none', '2019-11-27 00:03:55', '2019-11-27 00:03:55'),
(204, 4, '-', 'V6486.01B', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(205, 4, '-', 'V6486.01A', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(206, 4, 'Condensate Air Cooler', 'E6442.01', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(207, 4, ' Waste Water Cooler', 'E6486.01', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(208, 4, 'Mechanical Filter', 'S6442.01B', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(209, 4, 'Mechanical Filter', 'S6442.01A', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(210, 4, 'Side Stream Filter', 'S6451.01D', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(211, 4, 'Side Stream Filter', 'S6451.01C', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(212, 4, 'Side Stream Filter', 'S6451.01B', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(213, 4, 'Side Stream Filter', 'S6451.01A', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(214, 4, 'Anion Resin Filter', 'S6491.03B ', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(215, 4, 'Anion Resin Filter', 'S6491.03A', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(216, 4, 'Sand Filter', 'S6491.01B', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(217, 4, 'Cation Resin Filter', 'S6491.02A ', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(218, 4, 'Alumina Filter', 'S6334.01', NULL, 'none', '2019-11-27 00:03:56', '2019-11-27 00:03:56'),
(219, 4, 'Sand Filter', 'S6491.01C ', NULL, 'none', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(220, 4, 'Cation Resin Filter', 'S6491.02B ', NULL, 'none', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(221, 4, 'Sand Filter', 'S6491.01A ', NULL, 'none', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(222, 4, 'Activated Carbon Filter', 'S6491.06B', NULL, 'none', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(223, 4, ' Activated Carbon Filter', 'S6491.06A', NULL, 'none', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(224, 4, 'GPC Vessel', 'V6343.01', NULL, 'vessel', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(225, 4, 'Blader Foam Tank', 'V6474.02', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(226, 4, 'Blader Foam Tank', 'V6474.01', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(227, 4, 'Blader Foam Tank', 'V6474.06', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(228, 4, 'Blader Foam Tank', 'V6474.03', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(229, 4, 'Blader Foam Tank', 'V6474.04', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(230, 4, 'Blader Foam Tank', 'V6474.05', NULL, 'tank', '2019-11-27 00:03:57', '2019-11-27 00:03:57'),
(231, 23, 'PSV3', 'PSV3-T1331-01', NULL, 'psv', '2019-11-26 18:05:53', '2019-11-26 18:05:53'),
(232, 189, 'PSV2B', 'PSV2B-T1374-01', NULL, 'psv', '2019-11-26 18:07:00', '2019-11-26 18:07:00'),
(233, 190, 'PSV2A', 'PSV2A-T1374-02', NULL, 'psv', '2019-11-26 18:07:47', '2019-11-26 18:07:47'),
(234, 190, 'PSV2B', 'PSV2B-T1374-02', NULL, 'psv', '2019-11-26 18:09:06', '2019-11-26 18:09:06');

-- --------------------------------------------------------

--
-- Table structure for table `specification`
--

CREATE TABLE `specification` (
  `id` int(11) NOT NULL,
  `json` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specification`
--

INSERT INTO `specification` (`id`, `json`, `createdAt`, `updatedAt`) VALUES
(17, '{\"material\":\"1\",\"outherDiameter\":\"3\",\"innserDiameter\":\"4w\",\"field1\":\"5\",\"field2\":\"6\",\"field3\":\"7\",\"field34\":\"7\"}', '2019-11-26 11:24:23', '2019-11-26 16:03:32'),
(18, '{\"material\":\"5\",\"outherDiameter\":\"3\",\"innserDiameter\":\"4w\",\"field1\":\"5\",\"field2\":\"6q\",\"field3\":\"7a\",\"field34\":\"7\"}', '2019-11-26 16:01:06', '2019-11-26 16:22:11'),
(23, '{\"material\":\"1\",\"outherDiameter\":\"110\",\"innserDiameter\":\"100\",\"field1\":\"6\",\"field2\":\"4\",\"field3\":\"5\",\"field34\":\"5\",\"exDate\":\"2019-11-26\"}', '2019-11-26 18:37:11', '2019-11-27 01:16:09'),
(24, '{\"material\":\"5\",\"outherDiameter\":null,\"innserDiameter\":null,\"field1\":null,\"field2\":\"333333\",\"field3\":null,\"field34\":\"56\",\"exDate\":\"2019-11-27\"}', '2019-11-26 18:41:29', '2019-11-27 01:29:33'),
(25, '{\"material\":\"2\",\"outherDiameter\":null,\"innserDiameter\":null,\"field1\":\"34\",\"field2\":\"32\",\"field3\":\"10\",\"field34\":\"79\",\"exDate\":\"2019-11-07\"}', '2019-11-26 18:48:02', '2019-11-27 01:23:14'),
(26, '{\"material\":\"1\",\"outherDiameter\":null,\"innserDiameter\":null,\"field1\":null,\"field2\":\"#211dfdf\",\"field3\":null,\"field34\":\"45444\",\"exDate\":null}', '2019-11-26 18:50:53', '2019-11-27 01:28:52'),
(27, '{\"material\":\"3\",\"outherDiameter\":null,\"innserDiameter\":null,\"field1\":null,\"field2\":\"test\",\"field3\":null,\"field34\":null,\"exDate\":null}', '2019-11-26 18:56:25', '2019-11-27 01:29:56');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '0192023a7bbd73250516f069df18b500', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dynamicspecification`
--
ALTER TABLE `dynamicspecification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `file_store`
--
ALTER TABLE `file_store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `node`
--
ALTER TABLE `node`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `specification`
--
ALTER TABLE `specification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dynamicspecification`
--
ALTER TABLE `dynamicspecification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `file_store`
--
ALTER TABLE `file_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `node`
--
ALTER TABLE `node`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
