<?php

class Chat {
    public $file;
    //public $message;
    public function __construct($file){
        $this->file=$file;
    }
    public function addChat($message){
        $message.='\n';
        file_put_contents($this->file, $message, FILE_APPEND | LOCK_EX);
    }
    public function readChats(){
        $content=file_get_contents($this->file);
        $messages=explode('\n', $content);
        return array_values($messages);
    }
}