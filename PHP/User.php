<?php

class User{
    private $uname;
    private $password;
    private $startTime;
    private $addiction;
    private $connectedUser;

    public function __construct($user){
        $this->uname=$user;
    }
    public function setAddiction($addiction){
        $this->addiction=$addiction;
    }
    public function setPassword($password){
        $this->password=$password;
    }
    public function setTime($time){
        $this->startTime=$time;
    }
    public function Login(){
        $_SESSION['logged_on']='false';
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
                    $_SESSION['logged_on']='true';
                    $_SESSION['username']=$this->uname;
                }
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
        $db=new Database();
        $sql = "SELECT username FROM users WHERE username = '$this->uname'";
        $result=$db->executeSQL($sql);
        $this->password=password_hash($this->password, PASSWORD_DEFAULT);
        if(!empty($result)){
            $errors[] = 'already registered';
        }
        else{
            if(!isset($this->startTime)){
                $this->startTime=time();
            }
            if(!isset($this->connectedUser)){
                $this->connectedUser='NULL';
            }
            $sql="INSERT INTO users (username, pword, addiction, startTime, connected_user)
                VALUES ('$this->uname', '$this->password', '$this->addiction', $this->startTime, $this->connectedUser);";
            $db->executeSQL($sql);
            $input[] = 'Registered';
        }
        return array($input, $errors);
    }
    public function connectUsers(){
        $db=new Database();
        $sql = "SELECT username FROM users WHERE connected_user IS NULL";
        $result=$db->executeSQL($sql);
        $name = $result[array_rand($result)];
        echo $name['username'];
        print_r($this->uname);
        while($name['username'] == $this->uname){
            $name = $result[array_rand($result)];
            $dbName=$name['username'];
            echo 'reroll', $name['username'];
        }
        //TODO INSERT ERROR CHECKING WITH RESULTS
        $sql = "INSERT INTO users (connected_user) VALUES ('$dbName') WHERE username='$this->uname'";
        $db->executeSQL($sql);
        $sql = "INSERT INTO users (connected_user) VALUES ('$this->uname') WHERE username='$dbName'";
        $db->executeSQL($sql);
        echo 'success';
    }
    public function checkConnection(){
        $db=new Database();
        $sql = "SELECT username FROM users WHERE connected_user IS NOT NULL";
        $result=$db->executeSQL($sql);
        for($i=0;$i<sizeof($result);$i++){
            print_r($result[$i]);
            if(in_array($this->uname,$result[$i])){
                echo 'true';
                return true;
            }
        }
        return false;
    }
}