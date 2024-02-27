<?php

class Chat {
    public $file;
    public $id;
    //public $message;
    public function __construct($file, $id){
        $this->file=$file;
        $this->id=$id;
    }
    public function addChat($message){
        $message= strval($this->id).$message;
        $message.='\n';
        file_put_contents($this->file, $message, FILE_APPEND | LOCK_EX);
    }
    public function readChats(){
        $content=file_get_contents($this->file);
        $messages=explode('\n', $content);
        array_pop($messages);
        return $messages;
    }
}