-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(255),
  client VARCHAR(255),
  date DATE,
  description TEXT,
  featured BOOLEAN DEFAULT false
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  quote TEXT,
  image VARCHAR(255),
  featured BOOLEAN DEFAULT false
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  featured BOOLEAN DEFAULT false
);

-- Create stats table
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  value INT,
  icon VARCHAR(100)
);

-- Create client_briefs table
CREATE TABLE IF NOT EXISTS client_briefs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  contactName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  projectType VARCHAR(100),
  description TEXT,
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('new', 'in-progress', 'completed', 'rejected') DEFAULT 'new'
);

-- Create careers/jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  type ENUM('full-time', 'part-time', 'contract', 'remote') DEFAULT 'full-time',
  description TEXT,
  requirements TEXT,
  postedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  closingDate DATE,
  active BOOLEAN DEFAULT true
);
