const request = indexedDB.open("MyTestDatabase", 3);
let db;
var objStore;
productlst = [];
var existFlg = true;
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

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
    // tran.onsuccess = (event) => {
    //     console.log(`Value is: ${event.target.result}` )
    //     let content = '';
    //     let header = '<td>#</td>'+
    //                 '<td>Name</td>'+
    //                 '<td>Price</td>'+
    //                 '<td>Description</td>'+
    //                 '<td>Action</td>'
    //     let index = 0;
    //     for(let i = 0; i < tran.result.length; i++){
    //         productlst.push(tran.result[i]);
    //         index = i + 1;
    //         content += '<tr><td>'+index+'</td><td>'+productlst[i].name+'</td><td>'+productlst[i].price+'</td><td>'+productlst[i].description+'</td><td><button type="button"  class="btn btn-danger" onclick="delItem('+productlst[i].myKey+')">Del</button></td></tr>'
    //     }
    //     document.getElementById("prodLst").innerHTML = header + content;
    // }
}

function addObjectStore(){
    let name = 'guitar'
    let price = '3.000.000VND'
    let description = 'description'
    const item = {
            name: name,
            price: price,
            description: description,
            created: new Date().getTime(),
        };
    // const objStore = db.transaction(["databaseStoreFirst"], "readwrite").objectStore("databaseStoreFirst");
    const res = objStore.add(item);
    res.onsuccess = (event) => {
        // alert('Thêm thành công!')
    }
}

function clearInput() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
}

function naviAdmin() {
    window.location.href = '/admin.html';
}

//regist serveice worker
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function() {
//         navigator.serviceWorker
//             .register("serviceWorker.js")
//             .then(res => console.log("service worker registered"))
//             .catch(err => console.log("service worker not registered", err))
//     })
// }
