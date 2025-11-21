<?php
$serverName = "localhost"; // Use your SQL Server name or IP address
$username = "root";
$password ="";
$datbase ="swift_buy";
$con = mysqli_connect($serverName,$username,$password,$datbase);
if(!$con){
    // die("error detected".mysqli_error($con));
    echo" Error Established";
}
else{
    echo" Connection Established";
}
?>