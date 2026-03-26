-- Insert initial admin teacher
INSERT IGNORE INTO teachers (name, subject) VALUES ('teacher', 'Administration');

-- Insert sample subjects
INSERT IGNORE INTO subjects (subject_name) VALUES ('Computer Science');
INSERT IGNORE INTO subjects (subject_name) VALUES ('Mathematics');
INSERT IGNORE INTO subjects (subject_name) VALUES ('Physics');

-- Insert sample students
INSERT IGNORE INTO students (name, roll_number, department) VALUES ('John Doe', 'CS101', 'Computer Science');
INSERT IGNORE INTO students (name, roll_number, department) VALUES ('Jane Smith', 'CS102', 'Computer Science');
INSERT IGNORE INTO students (name, roll_number, department) VALUES ('Alice Johnson', 'ME201', 'Mechanical');
