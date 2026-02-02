# FitSwitch Database Table Structure

## 1. users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'OWNER', 'ADMIN') NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. gym
```sql
CREATE TABLE gym (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    gym_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    pincode VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    open_time VARCHAR(255),
    close_time VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3. gym_plans
```sql
CREATE TABLE gym_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gym_id BIGINT NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE
);
```

## 4. gym_facilities
```sql
CREATE TABLE gym_facilities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gym_id BIGINT NOT NULL,
    facility_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE
);
```

## 5. memberships
```sql
CREATE TABLE memberships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    gym_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES gym_plans(id) ON DELETE CASCADE,
    UNIQUE KEY unique_active_membership (user_id, gym_id, status)
);
```

## 6. otp_verifications
```sql
CREATE TABLE otp_verifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);
```

## Entity Relationships

### User (1:N relationships)
- User → Gym (owner_id)
- User → Membership (user_id)
- User → OtpVerification (email)

### Gym (1:N relationships)
- Gym → GymPlan (gym_id)
- Gym → GymFacility (gym_id)
- Gym → Membership (gym_id)

### GymPlan (1:N relationships)
- GymPlan → Membership (plan_id)

### Foreign Key Constraints
- gym.owner_id → users.id
- gym_plans.gym_id → gym.id
- gym_facilities.gym_id → gym.id
- memberships.user_id → users.id
- memberships.gym_id → gym.id
- memberships.plan_id → gym_plans.id
- otp_verifications.email → users.email

### Indexes for Performance
```sql
CREATE INDEX idx_gym_owner_id ON gym(owner_id);
CREATE INDEX idx_gym_plans_gym_id ON gym_plans(gym_id);
CREATE INDEX idx_gym_facilities_gym_id ON gym_facilities(gym_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_gym_id ON memberships(gym_id);
CREATE INDEX idx_memberships_plan_id ON memberships(plan_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_otp_email ON otp_verifications(email);
```