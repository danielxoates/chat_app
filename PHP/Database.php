<?php

/**
 * Database
 * 
 * Uses PDO to connect to a MySQL database and execute SQL statements
 *
 * @author Daniel Coates
 */

class Database
{
    private $dbConnection;
    private $serverName;
    private $username;
    private $password;

    public function __construct()
    {
        $this->setDBConnection();
    }

    private function setDBConnection()
    {
        try{
            $this->dbConnection = new PDO("mysql:host=nuwebspace_db;dbname=w21003534",
            "w21003534", "Monkey02");
            $this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo 'connected';
        }
        catch(Exception $e){
            throw new Exception("Connection error". $e->getMessage(), 0, $e);
        }  
    }
    public function executeSQL($sql, $params=[])
    {
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}