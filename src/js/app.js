App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
    // 调用了初始化web3
    return await App.initWeb3();
  },

  // 最新的web3初始化和之前的不同 所以到大改
  initWeb3: async function() {
    // 重点：初始化web3
     // Modern dapp browsers...
     if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        // await window.ethereum.enable();
        window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // 重点 初始化合约的调用 创建合约
    $.getJSON('Adoption.json', function(data){
      // 合约的信息数据
      var AdoptionArtifact = data;
      
      // 初始化合约对象
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      // 设置合约的provider
      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },
  // 设置领养标记
  markAdopted: function(adopters, account) {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      for(i = 0; i<adopters.length; i++){
        console.log(adopters[i]);
        if(adopters[i] !== '0x0000000000000000000000000000000000000000'){
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    })




  },

  handleAdopt: function(event) {
    event.preventDefault();
    var adoptionInstance;
    var petId = parseInt($(event.target).data('id'));
    // 处理领养需要消耗gas，所以需要先拿到账号 通过web3
    web3.eth.getAccounts(function(error, accounts){
      // 以该账号作为合约调用的发起账号
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;
        // 拿到合约实例后就能对合约进行调用

        return adoptionInstance.adopt(petId, {from: account});
        // 之后就要更新其领养状态
      }).then(function(result){
        // 更新领养状态
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      })
    });
  }

};

$(function() {
  $(window).load(function() {
    // 初始化
    App.init();
  });
});