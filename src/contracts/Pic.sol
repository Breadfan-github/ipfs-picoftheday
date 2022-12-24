pragma solidity >=0.4.21 <0.6.0;

contract Pic {

	string picHash;

	function set(string memory _picHash) public {
		picHash = _picHash;
	}

	function get() public view returns(string memory) {
		return picHash;
	}
}
