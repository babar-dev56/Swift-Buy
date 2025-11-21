<?php
// Database connection
$host = "localhost";
$dbname = "swift_buy"; // Replace with your database name
$dbusername = "root"; // Replace with your database username
$dbpassword = ""; // Replace with your database password

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $dbusername, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validate inputs
    if (empty($name) || empty($email) || empty($password)) {
        die("All fields are required.");
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }

    // Check if the email is already registered
    $stmt = $conn->prepare("SELECT email FROM customers WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
       
        echo "<script>
                window.location.href = 'login.html';
                alert('Email is already registered! Please log in.');   
              </script>";
    }


    // Insert user into the database
    $stmt = $conn->prepare("INSERT INTO customers (name, email, password) 
                            VALUES (:name, :email, :password)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);

    if ($stmt->execute()) {
       
        echo "<script>
                window.location.href = 'login.html';
                alert('Signup successful! Please log in.');   
              </script>";


    } else {
        echo "Error: Could not register. Please try again.";
    }
}
?>