// pragma solidity ^0.5.0;

// contract Adoption {
//     // 保存领养者的信息(address)
//     address[16] public adopters;

//     // 处理领养的函数
//     function adopt(uint petId) public returns (uint) {
//         require(petId >= 0 && petId <= 15);
//         adopters[petId] = msg.sender;

//         return petId;
//     }

//     // 显示所有领养者的信息
//     function getAdopters() public view returns (address[16] memory) {
//         return adopters;
//     }

// }
pragma solidity >=0.4.21 <0.7.0;

contract Adoption {
    address[16] public adopters;

    function adopt(uint petId) public returns (uint) {
        require(petId>=0 && petId <= 15);
        adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

}

