<?php
function getConnection(){
    try{
        $connection = new PDO("mysql:host=localhost;dbname=unn_w21003534",
        "unn_w21003534", "password");
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $connection;
    }
    catch(Exception $e){
        throw new Exception("Connection error". $e->getMessage(), 0, $e);
    }
}
function show_errors(array $errors){
    $results="";
    $results .= array_values($errors)[0];
    $results .= "\nPlease use the login form again.\n";
    $results .= "<a href='http://unn-w21003534.newnumyspace.co.uk/webTech2/exam/login.php'>Form here</a>";
    return $results;
}
function set_session($key, $value){
    $_SESSION[$key]=$value;
    return true;
}
function validate_logon(){

    ini_set("session.savepath", "/home/unn_w21003534/sessionData");
    session_start();
    $_SESSION['logged_on']='false';
    $input = array();
    $errors=array();


    $username = filter_has_var(INPUT_POST, 'username')? $_POST['username']:null;
    $username=trim($username);
    if (empty($username)){
        $errors[]="Username is empty";
    }
    $password = filter_has_var(INPUT_POST, 'password')? $_POST['password']:null;
    $password=trim($password);
    if (empty($password)){
        $errors[]= "Password is empty";
    }
    try{
        require_once('functions.php');
        $dbConn = getConnection();

        $sql= "SELECT username, passwordHash FROM nmc_users WHERE username=:username";
        $stmt=$dbConn->prepare($sql);
        $stmt->execute(array(
            ':username'=>$username
        ));
        $user=$stmt->fetchObject();
        if($user){
            $passwordHash=$user->passwordHash;
            $pwdCheck=password_verify($password, $passwordHash);
            if ($pwdCheck==true){
                $_SESSION['logged_on']='true';
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
        if (defined("DEVELOPMENT") && DEVELOPMENT===true){
            echo "<p>Query failed: ".$e->getMessage()."</p>\n";
        }
        else{
            echo "<p>A problem has occured</p>\n";
            log_error($e);
        }
    }
}
function get_session($key){
    $exists=isset($_SESSION[$key]);
    if ($exists==true){
        $value=$_SESSION[$key];
        return $value;
    }
    else{
        return false;
    }
    

}
function check_login(){
    $value=$_SESSION['logged_on'];
    if($value){
        return true;
    }
    else{
        return false;
    }
}

function loginLink(){
    try{       
        if(isset($_SESSION['logged_on'])){
            echo "<a href='logout.php'>Logout</a>";
        }
        else{
            echo "<a href='login.php'>Login</a>";
        }
    }
    catch(Exception $e){
        if (defined("DEVELOPMENT") && DEVELOPMENT===true){
            echo "<p>Query failed: ".$e->getMessage()."</p>\n";
        }
        else{
            echo "<p>A problem has occured</p>\n";
            log_error($e);
        }
    }
}


function makePageStart($title, $css){
    $pageStartContent= <<<PAGESTART
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>$title</title>
        <link href="$css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <div id="gridContainer">
PAGESTART;
    $pageStartContent.="\n";
    return $pageStartContent;
}
function makeHeader($headerContent){
    $headContent=<<<HEAD
        <header>
            <h1>$headerContent</h1>
        </header>
HEAD;
    $headContent .="\n";
    return $headContent;
}
function makeNavMenu($navMenuHeader, array $links){
    $navMenuContent=<<<NAVMENUSTART
        <nav>
            <h2>$navMenuHeader</h2>
            <ul>
NAVMENUSTART;
    foreach($links as $key=>$value){
        $navMenuContent.= <<<NAVMENUITEM
            <li><a href="$key">$value</a></li>
NAVMENUITEM;
    }
    $navMenuContent .= <<<NAVMENUEND
        </ul>
    </nav>
NAVMENUEND;

    $navMenuContent .="\n";
    return $navMenuContent;
}
function startMain(){
    return "<main>\n";
}
function endMain(){
    return "</main>\n";
}
function makeFooter($footerContent){
    $footContent=<<<FOOT
    <footer>
        <p>$footerContent</p>
    </footer>
FOOT;
    $footContent.="\n";
    return $footContent;
}
function makePageEnd(){
    return "<div>\n<body>\n</html>";
}
function exceptionHandler ($e) {
    echo "<p><strong>Problem occured</strong></p>";
    log_error($e);
}
set_exception_handler('exceptionHandler');
function errorHandler($errno, $errstr, $errfile, $errline){
    if (!(error_reporting() & $errno)){
        return;
    }
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}
set_error_handler("errorHandler");
function log_error($e){
    $fileHandle = fopen("Logs/error_log_field.log", "ab");
    $errorDate = date('D M j G:i:s T Y');
    $errorMessage=$e->getMessage();

    $toReplace = array("\n\r", "\n", "\r");
    $replaceWith = '';
    $errorMessage=str_replace($toReplace, $replaceWith, $errorMessage);
    fwrite($fileHandle, "$errorDate|$errorMessage".PHP_EOL);
    fclose($fileHandle);
}
?>