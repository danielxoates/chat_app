<?php

class Timer{
    public $UTC;
    public $uname;
    public function __construct($username){
        $this->uname=$username;
    }
    public function setTime(){
        if($_SESSION['logged_on']=='true'){
            $db=new Database();
            $sql = "SELECT startTime FROM users WHERE username = '$this->uname';";
            $result=$db->executeSQL($sql);
        }
        if($result[0]['startTime']==null){
            $this->UTC=0;
        }
        else{
            $this->UTC=$result[0]['startTime'];
        }
    }
    public function resetTime(){
        $db=new Database();
        $time=time();
        if($_SESSION['logged_on']=='true'){
            $sql = "UPDATE users set startTime=$time where username='$this->uname';";
            $result=$db->executeSQL($sql);
        }
    }
}