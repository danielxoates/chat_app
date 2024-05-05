<?php

class User
{
    private $uname;
    private $password;
    private $startTime;
    private $addiction;
    private $connectedUser;


    public function __construct($user)
    {
        $this->uname = $user;
    }
    public function setAddiction($addiction)
    {
        $this->addiction = $addiction;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }
    public function setTime($time)
    {
        $this->startTime = $time;
    }

    public function Login()
    {
        $_SESSION['logged_on'] = 'false';
        $input = array();
        $errors = array();
        try {
            $db = new Database();
            $sql = "SELECT username, pword FROM users WHERE username = '$this->uname'";
            $result = $db->executeSQL($sql);
            if ($result[0]["username"]) {
                $storedPword = $result[0]["pword"];
                if (password_verify($this->password, $storedPword)) {
                    $input[] = 'logged in';
                    $_SESSION['logged_on'] = 'true';
                    $_SESSION['username'] = $this->uname;
                } else {
                    $errors[] = "Either username or password are incorrect";
                }
            } else {
                $errors[] = "Either username or password are incorrect";
            }
            return array($input, $errors);
        } catch (Exception $e) {
            echo "<p>Query failed: " . $e->getMessage() . "</p>\n";
        }
    }
    public function Register()
    {
        $input = array();
        $errors = array();
        $db = new Database();
        $sql = "SELECT username FROM users WHERE username = '$this->uname'";
        $result = $db->executeSQL($sql);
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        if (!empty($result)) {
            $errors[] = 'already registered';
        } else {
            if (!isset($this->startTime)) {
                $this->startTime = time();
            }
            if (!isset($this->connectedUser)) {
                $this->connectedUser = 'NULL';
            }
            $sql = "INSERT INTO users (username, pword, addiction, startTime, connected_user, user_num, user_file)
                VALUES ('$this->uname', '$this->password', '$this->addiction', $this->startTime, $this->connectedUser, 0, null);";
            $db->executeSQL($sql);
            $input[] = 'Registered';
        }
        return array($input, $errors);
    }
    public function connectUsers()
    {
        $db = new Database();
        $sql = "SELECT prev_users FROM users WHERE username = '$this->uname'";
        $result = $db->executeSQL($sql);
        $prevNames=$result[0]['prev_users'];
        $prevNames= json_decode($prevNames);
    
        // Fetch random username not in prev_users and with connected_user as null
        $sql = "SELECT username FROM users WHERE connected_user IS NULL";
        $result = $db->executeSQL($sql);
        // Check if there are users available
        if (sizeof($result)>1) {
            $availableUsers = array_column($result, 'username');

            // Check if all available users are already in prevNames
            $remainingUsers = array_diff($availableUsers, $prevNames->names);

            // Iterate over the result until a suitable user is found
            if(sizeof($remainingUsers)>1){
                $randomUserName = null;
                while (!$randomUserName && sizeof($remainingUsers)>1) {
                    // Get a random user from the remaining available users
                    $randomUser = $remainingUsers[array_rand($remainingUsers)];
        
                    if ($randomUser == $this->uname) {
                        // Skip if the random user is the same as the current user
                        continue;
                    }
        
                    $randomUserName = $randomUser;
                }
            }
            else{
                return;
            }
            array_push($prevNames->names, $randomUserName);
            $prevNames=json_encode($prevNames);
            // Update connected_user for both users
            $sql = "UPDATE users SET connected_user='$randomUserName', user_num=1, prev_users='$prevNames', switch_state=1 WHERE username='$this->uname'";
            $db->executeSQL($sql);
            $sql = "SELECT prev_users FROM users WHERE  username = '$randomUserName'";
            $result=$db->executeSQL($sql);
            $prevNames=$result[0]['prev_users'];
            $prevNames= json_decode($prevNames);
            array_push($prevNames->names, $this->uname);
            $prevNames=json_encode($prevNames);
            $sql = "UPDATE users SET connected_user='$this->uname', user_num=2, prev_users='$prevNames', switch_state=1 WHERE username='$randomUserName'";
            $db->executeSQL($sql);    
// Output the randomly selected username
        } else {
            //echo "No available users found.";
            return;
        }
    }
    public function checkConnection()
    {
        $db = new Database();
        $sql = "SELECT username, user_num, connected_user FROM users WHERE connected_user IS NOT NULL";
        $result = $db->executeSQL($sql);
        for ($i = 0; $i < sizeof($result); $i++) {
            if (strtolower($this->uname) == strtolower($result[$i]['username'])) {
                return array(
                    'user_num' => $result[$i]['user_num'],
                    'connected_user' => $result[$i]['connected_user']
                );
            }
        }
        return false;
    }
    public function disconnect()
    {
        $db = new Database();
        $sql = "SELECT connected_user FROM users WHERE username='$this->uname'";
        $result=$db->executeSQL($sql);
        $secondUser=$result[0]['connected_user'];
        echo $secondUser;
        $sql = "UPDATE users SET connected_user=NULL, switch_state=0, alert=1 WHERE username='$secondUser'";
        $db->executeSQL($sql);
        $sql = "UPDATE users SET connected_user=NULL, switch_state=0 WHERE username='$this->uname'";
        $db->executeSQL($sql);
    }
    public function checkState()
    {
        $db = new Database();
        $sql = "SELECT switch_state, alert FROM users WHERE username='$this->uname'";
        $result=$db->executeSQL($sql);
        $sql="UPDATE users SET alert=0 WHERE username='$this->uname'";
        $db->executeSQL($sql);
        return $result;
    }
}
