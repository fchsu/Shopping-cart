// 全域變數設定



// 動作與監聽
updated();


// 函式設定
// 遠端讀取資料
function updated(e){
	const xhr = new XMLHttpRequest();
	xhr.open('get', 'https://github.com/fchsu/Shopping-cart/blob/master/JSON/data.JSON', true);
	xhr.send(null);
	console.log(xhr);
}