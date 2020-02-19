pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    // 测试领养函数
    function testUserCanAdoption() public {
        uint returnedId = adoption.adopt(8);
        uint expected = 8;

        Assert.equal(returnedId, expected, "Adoption of pet 8 should be recorded");
    }
    // 测试领养者地址
    function testAdopterAddressBypetId() public {
        address expected = address(this);
        address adopter = adoption.adopters(8);

        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");

    }

    //测试所有的领养者
    function testGetAdopterAddressByPetIdInArray() public {

        address expected =  address(this);
        address[16] memory adopters = adoption.getAdopters();
        Assert.equal(adopters[8], expected, "owner of pet Id 8 should be recorded");


    }

}