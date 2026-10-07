create Database SakhiVikas;
use SakhiVikas;

create table users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile_Number INT NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,
    
    category_id INT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(id)

);