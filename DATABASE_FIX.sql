# SQL Commands to Fix Database Users

## 1. Enable users (set enabled = true)
UPDATE users SET enabled = true WHERE enabled = false;

## 2. Update passwords to BCrypt encoded versions
## Replace 'plaintext_password' with actual passwords

-- Example: If password is 'admin123'
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'admin@example.com';

-- Example: If password is 'user123'  
UPDATE users SET password = '$2a$10$N.kmcvZjDUX4PvqmdFfyPeagQrTXVqmXly5E5Jq8R8VgS7Hq6V8Pu' WHERE email = 'user@example.com';

## 3. Common BCrypt encoded passwords for testing:
-- 'password' = '$2a$10$N9qo8uLOickgx2ZMRZoMye7xDz6mO18k1QehGG8YdkRDdRao.flm6'
-- 'admin123' = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'
-- 'user123'  = '$2a$10$N.kmcvZjDUX4PvqmdFfyPeagQrTXVqmXly5E5Jq8R8VgS7Hq6V8Pu'

## 4. Check current users
SELECT id, full_name, email, role, enabled, 
       CASE 
         WHEN password LIKE '$2a$%' OR password LIKE '$2b$%' OR password LIKE '$2y$%' 
         THEN 'ENCODED' 
         ELSE 'PLAIN_TEXT' 
       END as password_status
FROM users;