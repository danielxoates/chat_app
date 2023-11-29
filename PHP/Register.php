<?php

include 'User.php';

$input = array();
$errors=array();
$username = filter_has_var(INPUT_POST, 'username')? $_POST['username']:null;
$username=trim($username);
$username=trim($username);
if ($username==null){
    $errors[]="Username is empty";
}
$password = filter_has_var(INPUT_POST, 'password')? $_POST['password']:null;
$password=trim($password);
if ($password==null){
    $errors[]= "Password is empty";
}
$user = new User($username, $password);
$result=$user->Register();
if(empty($result[1]) && empty($errors)){
    //echo var_dump($result[0]);
    $result=$result[0];
}else{
    //echo var_dump($result[1]);
    //echo var_dump($errors);
    $result=$result[1];
}
$finalReturn= array('result' => $result);
$finalReturn=json_encode($finalReturn);
$result=json_encode($result);
echo var_export($finalReturn);
return ($finalReturn);