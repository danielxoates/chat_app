<?php

class User{
    private $uname;
    private $password;
    private $points;
    private $addiction;
    private $connectedUser;

    public function __construct($user, $pword){
        $this->uname=$user;
        $this->password=$pword;
        include 'Database.php';
        //$this->addiction=$addiction;
    }
    public function Login(){
        /*ini_set("session.savepath", "/home/unn_w21003534/sessionData");
        session_start();
        $_SESSION['logged_on']='false';*/
        $input = array();
        $errors=array();
        try{
            $db=new Database();
            $sql = "SELECT username, pword FROM users WHERE username = '$this->uname'";
            $result=$db->executeSQL($sql);
            if($result[0]["username"]){
                $storedPword=$result[0]["pword"];
                if(password_verify($this->password, $storedPword)){
                    $input[]= 'logged in';
                }
                /*$passwordHash=$user->passwordHash;
                $pwdCheck=password_verify($password, $passwordHash);
                if ($pwdCheck==true){
                    $_SESSION['logged_on']='true';
                }*/
                else{
                    $errors[]= "Either username or password are incorrect";
                }
    
            }
            else{
                $errors[]= "Either username or password are incorrect";
            }
            return array($input, $errors);
        }
        catch(Exception $e){
            echo "<p>Query failed: ".$e->getMessage()."</p>\n";
        }
    }
    public function Register(){
        $input = array();
        $errors=array();
        echo 'in user';
        $db=new Database();
        $sql = "SELECT username FROM users WHERE username = '$this->uname'";
        $result=$db->executeSQL($sql);
        $this->password=password_hash($this->password, PASSWORD_DEFAULT);
        if(!empty($result)){
            $errors[] = 'already registered';
        }
        else{
            if(!isset($this->points)){
                $this->points='NULL';
            }
            if(!isset($this->connectedUser)){
                $this->connectedUser='NULL';
            }
            $sql="INSERT INTO users (username, pword, addiction, points, connected_user)
                VALUES ('$this->uname', '$this->password', '$this->addiction', $this->points, $this->connectedUser);";
            $db->executeSQL($sql);
            $input[] = 'Registered';
        }
        return array($input, $errors);
    }
}