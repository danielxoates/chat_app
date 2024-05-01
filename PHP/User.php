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
        print_r($result[0]['prev_users']);
        $prevNames=$result[0];

    
        // Fetch random username not in prev_users and with connected_user as null
        $sql = "SELECT username FROM users WHERE connected_user IS NULL";
        $result = $db->executeSQL($sql);
        //TODO get reults and check for names that aren't in prevNames
        // Check if there are users available
        if ($result) {
            $randomUserName = null;
            
            // Iterate over the result until a suitable user is found
            while (!$randomUserName) {
                // Get a random user from the result
                $randomUserIndex = array_rand($result);
                $randomUserName = $result[$randomUserIndex]['username'];
                if($randomUserName==$this->uname){
                    $randomUserName=null;
                }
                echo 'found user '.$randomUserName;
    
                // Check if the randomly selected user is not in prev_users
                if (in_array($randomUserName, $prevNames)) {
                    $randomUserName = null; // Reset the value if it's in prev_users
                }
            }  
            // Update connected_user for both users
            $sql = "UPDATE users SET connected_user='$randomUserName', user_num=1, prev_users='$randomUserName' WHERE username='$this->uname'";
            $db->executeSQL($sql);
            $sql = "UPDATE users SET connected_user='$this->uname', user_num=2, prev_users='$this->uname' WHERE username='$randomUserName'";
            $db->executeSQL($sql);
            
            echo $randomUserName; // Output the randomly selected username
        } else {
            echo "No available users found.";
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
}
