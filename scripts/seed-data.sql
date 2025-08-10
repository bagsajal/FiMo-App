-- Seed data for PowerLine Inspector app

-- Insert sample towers
INSERT INTO towers (id, tower_number, coordinates_lat, coordinates_lng, status, last_inspection, line_section, tower_type, height_meters) VALUES
('tower-1', 'T-145', 40.7128, -74.0060, 'good', '2024-01-10', 'Section A', 'Lattice', 45.5),
('tower-2', 'T-132', 40.7589, -73.9851, 'critical', '2024-01-11', 'Section B', 'Monopole', 38.2),
('tower-3', 'T-089', 40.7505, -73.9934, 'fair', '2024-01-08', 'Section D', 'Lattice', 42.8),
('tower-4', 'T-156', 40.7831, -73.9712, 'good', '2024-01-09', 'Section C', 'H-Frame', 35.6),
('tower-5', 'T-201', 40.7282, -74.0776, 'poor', '2024-01-05', 'Section A', 'Lattice', 48.3);

-- Insert sample users
INSERT INTO users (id, username, email, full_name, role, phone) VALUES
('user-1', 'jsmith', 'john.smith@powerline.com', 'John Smith', 'inspector', '+1-555-0101'),
('user-2', 'sjohnson', 'sarah.johnson@powerline.com', 'Sarah Johnson', 'inspector', '+1-555-0102'),
('user-3', 'mwilson', 'mike.wilson@powerline.com', 'Mike Wilson', 'inspector', '+1-555-0103'),
('user-4', 'dbrown', 'david.brown@powerline.com', 'David Brown', 'supervisor', '+1-555-0104'),
('user-5', 'admin', 'admin@powerline.com', 'System Administrator', 'admin', '+1-555-0100');

-- Insert sample work orders
INSERT INTO work_orders (id, title, description, priority, status, assignee, location, coordinates_lat, coordinates_lng, due_date, created_date, tower_number, line_section) VALUES
('WO-001', 'Routine Inspection - Tower T-145', 'Monthly routine inspection of transmission tower T-145 including structural integrity check', 'medium', 'pending', 'John Smith', 'Grid Section A, Mile 12.5', 40.7128, -74.0060, '2024-01-15', '2024-01-10', 'T-145', 'Section A'),
('WO-002', 'Emergency Repair - Tower T-132', 'Critical structural damage detected, immediate repair required', 'critical', 'in-progress', 'Sarah Johnson', 'Grid Section B, Mile 8.2', 40.7589, -73.9851, '2024-01-12', '2024-01-11', 'T-132', 'Section B'),
('WO-003', 'Vegetation Management - Line Corridor', 'Tree trimming and vegetation clearance along transmission corridor', 'low', 'completed', 'Mike Wilson', 'Grid Section C, Mile 15-18', 40.7831, -73.9712, '2024-01-08', '2024-01-05', 'Multiple', 'Section C'),
('WO-004', 'Insulator Replacement - Tower T-089', 'Replace damaged insulators on tower T-089', 'high', 'pending', 'David Brown', 'Grid Section D, Mile 22.1', 40.7505, -73.9934, '2024-01-16', '2024-01-12', 'T-089', 'Section D'),
('WO-005', 'Foundation Assessment - Tower T-201', 'Assess foundation stability after recent weather events', 'high', 'pending', 'John Smith', 'Grid Section A, Mile 18.7', 40.7282, -74.0776, '2024-01-18', '2024-01-13', 'T-201', 'Section A');

-- Insert sample inspections
INSERT INTO inspections (id, work_order_id, tower_id, inspector_name, inspection_date, weather_conditions, overall_condition, structural_integrity, foundation_condition, conductor_condition, insulator_condition, hardware_condition, grounding_condition, vegetation_clearance, access_road_condition, observations, recommendations, critical_issues, requires_follow_up, status) VALUES
('INS-001', 'WO-003', 'tower-4', 'Mike Wilson', '2024-01-08', 'clear', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'adequate', 'good', 'Tower in excellent condition. All components functioning properly. Vegetation clearance maintained within acceptable limits.', 'Continue regular maintenance schedule. No immediate action required.', FALSE, FALSE, 'completed'),
('INS-002', 'WO-002', 'tower-2', 'Sarah Johnson', '2024-01-11', 'windy', 'critical', 'poor', 'fair', 'fair', 'poor', 'poor', 'good', 'adequate', 'fair', 'Significant structural damage observed on north leg. Multiple bolts showing signs of corrosion. Insulators cracked on Phase B.', 'Immediate structural repair required. Replace damaged insulators. Schedule follow-up inspection within 30 days.', TRUE, TRUE, 'completed');
