const request = indexedDB.open("MyTestDatabase", 3);
let db;
var objStore;
productlst = [];
var existFlg = true;
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
    addFirst();
});

// request.onupgradeneeded = (event) => {
//     // Save the IDBDatabase interface
//     db = event.target.result;
//     if (!db.objectStoreNames.contains('databaseStoreFirst')) {
//         // Create an objectStore for this database
//         console.log('create db_object')
//         const db_object = db.createObjectStore("databaseStoreFirst", { keyPath: "myKey", autoIncrement: true});
//         existFlg = false
//     }
// }

// request.onsuccess = function (event) 
// {
//     db = event.target.result;
//     objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
//     if (!existFlg) {
//         console.log('-----------add-----------')
//         addObjectStore();
//     } else {
//         console.log('-----------get all----------')
//         getAllItem();
//     }
//     updateOnlineStatus();
// }

// request.onerror = (event) => {
//     alert('open indexed DB faild!!!')
// }

//localForage
localforage.setDriver(localforage.INDEXEDDB)

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'dbLocalForage',
    version: 1.0,
    storeName: 'databaseStoreFirst',
});

function addFirst() {
    let index = 0;
    updateOnlineStatus();
    localforage.length().then(function (length) {
        console.log('length: ', length);
        if (length == 0) {
            for (let i = 0; i < dataJson.length; i++) {
                index = i + 1;
                let timeNow = new Date().getTime();
                let date = new Date(timeNow)
                console.log('Time Now: ', date.toLocaleString() );
                const item = {
                    name: dataJson[i].name,
                    price: dataJson[i].price,
                    description: dataJson[i].description,
                    image: dataJson[i].image,
                    created: new Date().getTime(),
                    
                };
                localforage.setItem(""+index, item).then(function (value){
                })
            }
        }
    })
    let header = '<td>#</td>'+
                '<td>Name</td>'+
                '<td>Price</td>'+
                '<td>Description</td>'+
                '<td>Action</td>'
    let content = '';
    localforage.iterate(function (value, key, i) {
        console.log('key: ', key,' - value: ', value);
        productlst.push(value);
        content += '<tr><td>'+key+'</td><td>'+productlst[i-1].name+'</td><td>'+productlst[i-1].price+'</td><td>'+productlst[i-1].description+'</td><td><button type="button"  class="btn btn-danger" onclick="delItem('+productlst[i-1].myKey+')">Del</button></td></tr>'
    }).then(function() {
        document.getElementById("prodLst").innerHTML = header + content;
    }).catch(function (err) {
        console.error('Error Iterate: ', err);
    })
}
// localforage.setItem(6, 'test3').then(function (value){
//     localforage.getItem(1).then(function (value) {
//         console.log('value: ', value);
//     })
//     localforage.keys().then(function (value) {
//         console.log('successCallBack: ',value)
//     })
//     localforage.length().then(function (length) {
//         console.log('length: ', length);
//     })
//     localforage.iterate(function (value, key, iterationNumber) {
//         console.log('key: ', key,' - value: ', value);
//     })
//     // localforage.contains('databaseStoreFirst')
// }).catch(function (err) {
//     console.error('Error setItem:', err)
// })
//-----------------------------

function updateOnlineStatus() {
  var condition = navigator.onLine ? "online" : "offline";
  document.getElementById('network').textContent = condition;
}

function getAllItem() {
    productlst = [];
    // const objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
    const tran = objStore.getAll()
    tran.onsuccess = (event) => {
        let content = '';
        let header = '<td>#</td>'+
                    '<td>Name</td>'+
                    '<td>Price</td>'+
                    '<td>Description</td>'+
                    '<td>Action</td>'
        let index = 0;
        for(let i = 0; i < tran.result.length; i++){
            productlst.push(tran.result[i]);
            index = i + 1;
            content += '<tr><td>'+index+'</td><td>'+productlst[i].name+'</td><td>'+productlst[i].price+'</td><td>'+productlst[i].description+'</td><td><button type="button"  class="btn btn-danger" onclick="delItem('+productlst[i].myKey+')">Del</button></td></tr>'
        }
        document.getElementById("prodLst").innerHTML = header + content;
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

function delItem(key) {
    const objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst")
    const tran = objStore.delete(key)
    tran.onsuccess = (event) => {
        console.log('del success')
        getAllItem()
    }
    tran.onerror = (event) => {
        console.log(`Del error is: ${event.target.error}` )
    }
}

function clearInput() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
}

function naviHome() {
    window.location.href = 'index.html';
}

function addItem(){
    const name = document.getElementById("name").value
    const price = document.getElementById("price").value
    const description = document.getElementById("description").value
    let isValid = checkValidate(name, price, description);
    if (isValid) {
        alert('thêm thành công!!!')
        // const item = {
        //         name: name,
        //         price: price,
        //         description: description,
        //         created: new Date().getTime(),
        //     };
        // objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
        // const res = objStore.add(item);
        // res.onsuccess = (event) => {
        //     alert('Thêm thành công!')
        //     clearInput()
        //     getAllItem()
        // }
    }
}

//validate form
function checkValidate(name, price, description) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const eleName = document.getElementById('name');
    const elePrice = document.getElementById('price');
    // const description = document.getElementById('description');
    let isCheck = true;
    if (name == '') {
        setError(eleName, 'Tên không được để trống');
        isCheck = false;
    } else {
        if (format.test(name)){
            setError(eleName, 'Tên không được chứa kí tự đặc biệt');
            isCheck = false;
        } else {
            setSuccess(eleName);
        }
    }

    if (price == '') {
        setError(elePrice, 'Giá bán không được để trống');
        isCheck = false;
    } else {
        let isNumberFlg = isNumber(price);
        if (!isNumberFlg){
            setError(elePrice, 'Giá bán phải là một số');
            isCheck = false
        } else {
            setSuccess(elePrice);
        }
    }
}

function isNumber(value){
    return /^[0-9]+$/.test(value);
}

function setError(ele, message) {
    let parentEle = ele.parentNode;
    parentEle.classList.remove('success');
    parentEle.classList.add('error');
    parentEle.querySelector('small').innerHTML = message;
}

function setSuccess(ele) {
    ele.parentNode.classList.remove('error');
    ele.parentNode.classList.add('success');
    parentEle.querySelector('small').innerHTML = '';
}

//regist serveice worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}
