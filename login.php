<?php
// Start session
// session_start();

// Database connection
$host = "localhost";
$dbname = "swift_buy";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Fetch user from database
    $stmt = $conn->prepare("SELECT * FROM customers WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Verify password
        if ($password === $user['password']) {
            // Store user info in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];

            // Redirect to the home page
            header("Location: home.html");
            exit();
        } else {
            echo "<script>
            window.location.href = 'login.html';
            alert('Incorrect Password! Please try again');   
          </script>";
            
        }
    } else {
        
        echo "<script>
                window.location.href = 'login.html';
                alert('No user found with this email');   
              </script>";
    }
}
?>