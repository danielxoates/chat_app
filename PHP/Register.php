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
$addiction = filter_has_var(INPUT_POST, 'addiction')? $_POST['addiction']:null;
$addiction=trim($addiction);
if ($addiction==null){
    $errors[]= "addiction is empty";
}
$user = new User($username);
$user->setAddiction($addiction);
$user->setPassword($password);
$result=$user->Register();
if(empty($result[1]) && empty($errors)){
    $result=$result[0];
}else{
    $result=$result[1];
}
$finalReturn= array('result' => $result);
$finalReturn=json_encode($finalReturn);
$result=json_encode($result);
echo var_export($finalReturn);
return ($finalReturn);