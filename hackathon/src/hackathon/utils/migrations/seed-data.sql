-- Insert Roles
INSERT INTO roles (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'STUDENT', 'Student role'),
  ('550e8400-e29b-41d4-a716-446655440002', 'TEACHER', 'Teacher role'),
  ('550e8400-e29b-41d4-a716-446655440003', 'ADMIN', 'Admin role');

-- Insert Users with hashed password for "123"
-- Note: Password hash below is bcrypt hash of "123" (you should use proper bcrypt hashing)
-- For testing, using simple bcrypt hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO

INSERT INTO users (id, code, "fullName", email, password, "roleId", "isActive", "classId", "createdAt", "updatedAt") VALUES
-- Tobey - Student (lớp CLASS001)
('550e8400-e29b-41d4-a716-446655440011', 'SV22110044', 'Tobey', 'Tobey@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', '550e8400-e29b-41d4-a716-446655440001', true, '550e8400-e29b-41d4-a716-446655440021', NOW(), NOW()),

-- KienMM - Student (lớp CLASS001)
('550e8400-e29b-41d4-a716-446655440012', 'SV22110046', 'KienMM', 'KienMM@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', '550e8400-e29b-41d4-a716-446655440001', true, '550e8400-e29b-41d4-a716-446655440021', NOW(), NOW()),

-- Huy - Teacher (không có classId vì dạy nhiều lớp, sẽ query qua `taughtClasses` relationship)
('550e8400-e29b-41d4-a716-446655440013', 'GV22110057', 'Huy', 'Huy@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', '550e8400-e29b-41d4-a716-446655440002', true, NULL, NOW(), NOW()),

-- Hoang - Student (lớp CLASS002)
('550e8400-e29b-41d4-a716-446655440014', 'SV22110047', 'Hoang', 'Hoang@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', '550e8400-e29b-41d4-a716-446655440001', true, '550e8400-e29b-41d4-a716-446655440022', NOW(), NOW());

-- Insert Classes (Huy is the teacher)
INSERT INTO classes (id, "classCode", "className", "scheduleTime", "teacherId", "isActive", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440021', 'CLASS001', 'Lớp 10A - Toán', 'Monday 08:00 - 09:30', '550e8400-e29b-41d4-a716-446655440013', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022', 'CLASS002', 'Lớp 10B - Tiếng Anh', 'Tuesday 10:00 - 11:30', '550e8400-e29b-41d4-a716-446655440013', true, NOW(), NOW());

-- Insert Chatboxes
INSERT INTO chatboxes (id, "classId", title, "isActive", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Buổi 1 - Chương 1', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440021', 'Buổi 2 - Chương 2', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440022', 'Buổi 1 - Unit 1', true, NOW(), NOW());

-- Insert Questions
INSERT INTO questions (id, "chatboxId", "userId", content, type, "createdAt", "updatedAt") VALUES
-- In-class questions for Chatbox 1 (Buổi 1 - Chương 1 - CLASS001)
(gen_random_uuid(), '0b056645-89db-47e4-af90-6ece75fce680', '550e8400-e29b-41d4-a716-446655440011', 'Biến (Variable) trong lập trình là gì?', 'in_class', NOW(), NOW()),
(gen_random_uuid(), '0b056645-89db-47e4-af90-6ece75fce680', '550e8400-e29b-41d4-a716-446655440012', 'Sự khác biệt giữa int và float là gì?', 'in_class', NOW(), NOW()),

-- Off-topic questions for Chatbox 2 (Buổi 2 - Chương 2 - CLASS001)
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440014', 'Ai có thể giới thiệu tài liệu tham khảo tốt?', 'off_topic', NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', 'Hôm nay có offline giải đáp thắc mắc không?', 'off_topic', NOW(), NOW()),

-- In-class questions for Chatbox 3 (Buổi 1 - Lập trình C++ về Array - CLASS002)
(gen_random_uuid(), 'aa9b3694-0739-4abd-a95d-a544da9d140f', '550e8400-e29b-41d4-a716-446655440014', 'Array là gì và cách khởi tạo trong C++?', 'in_class', NOW(), NOW()),
(gen_random_uuid(), 'aa9b3694-0739-4abd-a95d-a544da9d140f', '550e8400-e29b-41d4-a716-446655440012', 'Làm sao để duyệt qua tất cả phần tử trong mảng?', 'in_class', NOW(), NOW());
