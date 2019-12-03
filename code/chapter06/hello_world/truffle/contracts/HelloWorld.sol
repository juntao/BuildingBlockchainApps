pragma solidity ^0.4.17;

contract HelloWorld  {
    
    string helloMessage;
    address public owner;

    function HelloWorld () public {
        helloMessage = "Hello, World!";
        owner = msg.sender;
    }
    
    function updateMessage (string _new_msg) public {
        helloMessage = _new_msg;
    }

    function sayHello () public constant returns (string) {
        return helloMessage;
    }

    function kill() public { 
        if (msg.sender == owner) selfdestruct(owner); 
    }
}
