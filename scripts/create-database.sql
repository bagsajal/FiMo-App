-- Create database schema for PowerLine Inspector app

-- Work Orders table
CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    assignee VARCHAR(100),
    location VARCHAR(255),
    coordinates_lat DECIMAL(10, 8),
    coordinates_lng DECIMAL(11, 8),
    due_date DATE,
    created_date DATE,
    tower_number VARCHAR(50),
    line_section VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Towers table
CREATE TABLE IF NOT EXISTS towers (
    id VARCHAR(50) PRIMARY KEY,
    tower_number VARCHAR(50) UNIQUE NOT NULL,
    coordinates_lat DECIMAL(10, 8),
    coordinates_lng DECIMAL(11, 8),
    status VARCHAR(20) CHECK (status IN ('good', 'fair', 'poor', 'critical')),
    last_inspection DATE,
    line_section VARCHAR(50),
    installation_date DATE,
    tower_type VARCHAR(50),
    height_meters DECIMAL(6, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(50) PRIMARY KEY,
    work_order_id VARCHAR(50),
    tower_id VARCHAR(50),
    inspector_name VARCHAR(100),
    inspection_date DATE,
    weather_conditions VARCHAR(50),
    overall_condition VARCHAR(20),
    structural_integrity VARCHAR(20),
    foundation_condition VARCHAR(20),
    conductor_condition VARCHAR(20),
    insulator_condition VARCHAR(20),
    hardware_condition VARCHAR(20),
    grounding_condition VARCHAR(20),
    vegetation_clearance VARCHAR(20),
    access_road_condition VARCHAR(20),
    observations TEXT,
    recommendations TEXT,
    critical_issues BOOLEAN DEFAULT FALSE,
    requires_follow_up BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) CHECK (status IN ('draft', 'completed', 'submitted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
    FOREIGN KEY (tower_id) REFERENCES towers(id)
);

-- Inspection Photos table
CREATE TABLE IF NOT EXISTS inspection_photos (
    id VARCHAR(50) PRIMARY KEY,
    inspection_id VARCHAR(50),
    photo_url VARCHAR(500),
    photo_name VARCHAR(255),
    photo_description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('inspector', 'supervisor', 'admin')),
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_assignee ON work_orders(assignee);
CREATE INDEX IF NOT EXISTS idx_work_orders_due_date ON work_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_towers_status ON towers(status);
CREATE INDEX IF NOT EXISTS idx_towers_tower_number ON towers(tower_number);
CREATE INDEX IF NOT EXISTS idx_inspections_work_order ON inspections(work_order_id);
CREATE INDEX IF NOT EXISTS idx_inspections_tower ON inspections(tower_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(inspection_date);
