<?php
/**
 * AutoLoader class
 * 
 * This autoloads classes as they're needed in the main api file
 * 
 * @author danielcoates 
 */
abstract class Autoloader
{
    public static function register()
    {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }
    public static function autoload($className)
    {
        $filename=$className.".php";
        $filename=str_replace("\\",DIRECTORY_SEPARATOR,$filename);
        if(!is_readable($filename)){
            throw new Error('File not found');
        }
        require $filename;
    }
}