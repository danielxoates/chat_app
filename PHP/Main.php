<?php
ini_set("session.savepath", "final_project/php/sessionData");
session_start();
include 'Autoloader.php';
Autoloader::register();
$errors=array();
$type = filter_has_var(INPUT_POST, 'type')? $_POST['type']:null;
$type=trim($type);
if($type==null){
    $errors="Type is empty";
}
if($type=='set'){
    $username=$_SESSION['username'];
    $timer=new Timer($username);
    $timer->setTime();
    if(empty($errors)){
        $result= $timer->UTC;
    }
    else{
        $result=$errors;
    }
    $finalReturn= array('result' => $result);
    $finalReturn=json_encode($finalReturn);
    $result=json_encode($result);
    echo $finalReturn;
    return ($finalReturn);
}
if($type=='reset'){
    $username=$_SESSION['username'];
    $timer=new Timer($username);
    $timer->resetTime();
}
if($type=='login'){
    $username = filter_has_var(INPUT_POST, 'username')? $_POST['username']:null;
    $username=trim($username);
    if ($username==null){
        $errors[]="Username is empty";
    }
    $password = filter_has_var(INPUT_POST, 'password')? $_POST['password']:null;
    $password=trim($password);
    if (empty($password)){
        $errors[]= "Password is empty";
    }
    $user = new User($username);
    $user->setPassword($password);
    $result=$user->Login();
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
}
if($type=='register'){
    $username = filter_has_var(INPUT_POST, 'username')? $_POST['username']:null;
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
    if ($addiction==null)
        $errors[]= "addiction is empty";
    }
    
    $user = new User($username);
    $user->setAddiction($addiction);
    $user->setPassword($password);
    $user->setTime(time());
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




