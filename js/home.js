const request = indexedDB.open("MyTestDatabase", 3);
let db;
var objStore;
productlst = [];
var existFlg = true;
var dataJson;
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("data/data-menu.json", function(text){
    dataJson = JSON.parse(text);
    console.log(dataJson);
});

request.onupgradeneeded = (event) => {
    // Save the IDBDatabase interface
    db = event.target.result;
    if (!db.objectStoreNames.contains('databaseStoreFirst')) {
        // Create an objectStore for this database
        console.log('create db_object')
        const db_object = db.createObjectStore("databaseStoreFirst", { keyPath: "myKey", autoIncrement: true});
        existFlg = false
    }
}

request.onsuccess = function (event) 
{
    db = event.target.result;
    objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
    if (!existFlg) {
        console.log('-----------add-----------')
        addObjectStore();
    } else {
        console.log('-----------get all----------')
        getAllItem();
    }
    updateOnlineStatus();
}

request.onerror = (event) => {
    alert('open indexed DB faild!!!')
}



function updateOnlineStatus() {
  var condition = navigator.onLine ? "online" : "offline";
  document.getElementById('network').textContent = condition;
}

function getAllItem() {
    productlst = [];
    // const objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
    const tran = objStore.getAll()
    tran.onsuccess = (event) => {
        console.log(`Value is: ${event.target.result}` )
        let content = '';
        for(let i = 0; i < tran.result.length; i++){
            productlst.push(tran.result[i]);
            content += '<div class="card" id="'+productlst[i].myKey+'">'+
                            '<img class="card-image" src="'+productlst[i].image+'" alt="###">'+
                            '<div class="card-content">'+
                                '<p class="card-title">'+productlst[i].name+'</p>'+
                                '<p class="card-price">'+Number(productlst[i].price).toLocaleString('vi-VN', {style : 'currency', currency : 'VND', maximumFractionDigits: 9})+'</p>'+
                            '</div>'+
                            '<div class="card-action">'+
                                '<button class="btn btn-success"><img src="images/icon/cart-plus.svg" alt="cart"></button>'+
                                '<button class="btn btn-danger">Mua ngay</button>'+
                            '</div>'+
                        '</div>'
        }
        document.getElementById("cardLst").innerHTML = content;
    }
}

function addObjectStore(){
    for (let i = 0; i < dataJson.length; i++) {
        const item = {
                name: dataJson[i].name,
                price: dataJson[i].price,
                description: dataJson[i].description,
                image: dataJson[i].image,
                created: new Date().getTime(),
            };
        // const objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
        const res = objStore.add(item);
        res.onerror = (event) => {
            console.error(`Error addObjectStore:  ${event.target.error}`)
        }
    }
}

function clearInput() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
}

function naviAdmin() {
    window.location.href = 'admin.html';
}

