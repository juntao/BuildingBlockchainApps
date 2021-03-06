var fun = new MainFun();
var webBrowser = new AppLink();
const lang = fun.languageChoice();
var tip = IUToast;
var userAddress = '';
var betAbi = '';
var betBin = '';
var contract_address = '';
var contract = '';
var instance = '';
var loadCount = 0;
var loading = 'Loading...';

$(function () {
    webBrowser.openBrowser();
    getAbi();
    getBin();
    initLanguage();
    initUserAddress();
    fun.addMainEvent(document.getElementById("addDiv"), "click", fun.createDivById("main-div-count"));
    fun.addMainEvent(document.getElementById("markCheckbox"), "click", allowUserBet);
    fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count", lang.tip.lessThan));
    document.getElementById("allowUserBet").setAttribute("for", "markCheckbox");
});

// init language
var initLanguage = function () {
    if (lang == '' || lang == null) {
        return;
    }
    fun.choiceInputLangByName("choice", lang.option);
    fun.choiceInputLangById("title", lang.title);
    fun.changeDomContentById("allowUserBet", lang.allowUserBet);
    fun.choiceInputLangById("betMinAmount", lang.betMinAmount);
    fun.changeDomContentById("delOption", lang.delOption);
    fun.changeDomContentById("addOption", lang.addOption);
    fun.changeDomContentById("submit", lang.createContract);
    fun.changeDomContentById("listTitle", lang.listTitle);
    fun.changeDomContentById("listStatus", lang.listStatus);
    fun.changeDomContentById("listTotalCount", lang.listTotalCount);
    fun.changeDomContentById("listTotalAmount", lang.listTotalAmount);
    fun.changeDomContentById("firstPage", lang.firstPage);
    fun.changeDomContentById("previousPage", lang.previousPage);
    fun.changeDomContentById("nextPage", lang.nextPage);
    fun.changeDomContentById("lastPage", lang.lastPage);
    fun.changeDomContentById("backNewContract", lang.backNewContract);
    fun.changeDomContentById("backIndex", lang.backIndex);
}

var initUserAddress = function () {
    var interval = setInterval(function () {
        web3.cmt.getAccounts(function (e, address) {
            if (address) {
                userAddress = address.toString();
                $("#userAddress").val(address);
                userAddress = address;
                tip.closeLoad();
                clearInterval(interval);
            }
        });
    }, 300);
}

var backIndex = function () {
    window.location.href = "./index.html";
}

var allowUserBet = function () {
    var allowUserBet = $("#allowUserBetCheckbox").val();
    if (allowUserBet == '1') {
        $("#allowUserBetCheckbox").val(0);
        $(".start-checkbox").attr('style', 'color:#000000');
        fun.changeDomContentById("allowUserBet", lang.allowedUserBet);
    } else {
        $("#allowUserBetCheckbox").val(1);
        $(".start-checkbox").attr('style', 'color:#dadde3');
        fun.changeDomContentById("allowUserBet", lang.allowUserBet);
    }
}

var checkChoice = function (inputValue) {
    var obj = document.getElementById("submit-div");
    var inputs = document.getElementsByName("choice");
    var root = document.getElementsByClassName("main-button")[0];
    var count = 0;
    var title = $("#title").val();
    var betMinAmount = $("#betMinAmount").val();
    if (inputValue == '' || inputValue == null || inputValue == 'undefined') {
        if (title.length >= 1400) {
            tip.error(lang.tip.exceedTitle);
            return;
        }
    } else {
        if (inputValue.length >= 200) {
            tip.error(lang.tip.exceedOption);
            return;
        }
    }
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != '') {
            count++;
        }
        if (count >= 3 && title != null && title != '' && betMinAmount != null && betMinAmount > 0) {
            root.style.cssText = "background-color: #1976d2;";
            fun.addMainEvent(obj, "click", startGame);
        } else {
            root.style.cssText = "background-color: #c6cfd5;";
            fun.delMainEvent(obj, "click", startGame);
        }
    }
};

var startGame = function () {
    var inputs = document.getElementsByName("choice");
    var numChoices = 0;
    var gameDesc = '';

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != '') {
            var inputValue = inputs[i].value
            gameDesc += inputValue.trim() + ";";
            numChoices++;
        }
    }
    if (numChoices <= 2) {
        tip.error(lang.tip.lessThan);
        return;
    }
    var title = $("#title").val();
    if (title == null || title == '') {
        tip.error(lang.tip.nullTitle);
        return;
    }
    var betMinAmount = $("#betMinAmount").val();
    if (betMinAmount == null || betMinAmount == '' || isNaN(betMinAmount)) {
        tip.error(lang.tip.fillRightAmount);
        return;
    }
    if (betMinAmount <= 0) {
        tip.error(lang.tip.moreThanZero);
        return;
    }
    var allowUserBet = $("#allowUserBetCheckbox").val();
    var allowUserBetAmount = false;
    if (allowUserBet == 0) {
        allowUserBetAmount = true;
    }

    var minBetAmount = web3.toWei(betMinAmount, "cmt");
    gameDesc = gameDesc.replace(/(^;)|(;$)/g, "");
    // deploy and start the game
    var contract = web3.cmt.contract(betAbi);
    var feeDate = '0x' + contract.new.getData(gameDesc, numChoices - 1, minBetAmount, allowUserBetAmount, {data: betBin.object});
    tip.loading(lang.bet.init + title);
    web3.cmt.estimateGas({data: feeDate}, function (e, returnGas) {
        var gas = '1700000';
        if (!e) {
            gas = Number(returnGas * 2);
        }
        contract.new([gameDesc, numChoices - 1, minBetAmount, allowUserBetAmount], {
            from: userAddress.toString(),
            data: feeDate,
            gas: gas,
            gasPrice: '2000000000'
        }, function (e, instance) {
            if (e) {
                tip.close();
                tip.error(lang.tip.createFailed);
            } else {
                contract_address = instance.address;
                // if callback fun have no result then should call function for check result for this tx
                var shouldCheckTheResult = Boolean($("#shouldCheckTheResult").val());
                if (typeof contract_address != 'undefined' && shouldCheckTheResult) {
                    shouldCheckTheResult = false;
                    console.log('Contract mined! address: ' + contract_address + ' transactionHash: ' + instance.transactionHash);
                    setTheContractAddressAndTurn(instance);
                    $("#shouldCheckTheResult").val("");
                }

                if (shouldCheckTheResult) {
                    console.log("call back have not result ,then will call the function for check the result by this tx ");
                    fun.checkTransactionStatus(instance.transactionHash, setTheContractAddressAndTurn, callbackError);
                    $("#shouldCheckTheResult").val("");
                }
            }
        });
    });
};

/**
 * save bet data in local storage
 */
var saveLocalStorageBet = function (contractAddress) {
    if (window.localStorage) {
        var storage = window.localStorage;
        var item = {"userAddress": userAddress, "contractAddress": contractAddress};
        storage.setItem("bets", item);
    }
}


/**
 * create contract success callback function
 */
var setTheContractAddressAndTurn = function (result) {
    if (result != null && (result.contractAddress != 'undefined' || result.address != 'undefined')) {
        tip.right(lang.bet.betCreated);
        setTimeout(function () {
            var turnAddress = result.contractAddress;
            if (turnAddress == 'undefined') {
                turnAddress = result.address
                saveLocalStorageBet(turnAddress);
            }
            console.log(turnAddress);
            window.location.href = './join.html?contract=' + turnAddress;
        }, 2000);
    }
};

var startOnlyNumber = function (obj) {
    if (obj.indexOf(".") > -1) {
        console.log(obj.substr(0, obj.indexOf(".")));
        $("#betMinAmount").val(obj.substr(0, obj.indexOf(".")));
        tip.error(lang.tip.positive)
        return;
    }
    obj = obj.replace(/\D/g, '');
    var t = obj.charAt(0);
    if (t == 0) {
        obj = obj.substr(1, obj.length);
    }
    $("#betMinAmount").val(obj);
    checkChoice();
    return obj;
}

/**
 * create contract success callback function
 */
var callbackError = function () {
    tip.error(lang.tip.createFailed);
};

/**
 * read the abi info from the abi file
 */
var getAbi = function () {
    $.ajax({
        url: 'BettingGame.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            betAbi = JSON.parse(data);
        }
    });
}

/**
 * read the bin info from the bin file
 */
var getBin = function () {
    $.ajax({
        url: 'BettingGame.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            betBin = JSON.parse(data);
        }
    });
}
