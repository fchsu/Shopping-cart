// 全域變數設定


// 動作與監聽
updated();
window.addEventListener('popstate', historyPage, false);


// 函式設定
	// 更新畫面顯示內容
function updated(e){
	// let siteUrl = location.search;
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'json/data.JSON', true);
	xhr.onload = (e) => {
		if (xhr.readyState === 4){
			// if (xhrReg.status === 200){
				const data = JSON.parse(xhr.responseText);
				let vmContent = new Vue({
					el: '#content',
					data: {
						product: [data.phone, data.notebook],
						shoppingCart: JSON.parse(localStorage.getItem("shoppingCartRecord")) || [],
						shoppingNumber: JSON.parse(localStorage.getItem("shoppingNumberRecord")) || [],
						classStatus: {
							hoverOn: true,
							phoneOn: true,
							notebookOn: false
						},
						judgment: {
							productOn: true,
							shoppingCartOn: false,
							listButtom: true,
							detailButtom: false,
							inputCartButtom: true,
							alreadyShoppingButtom: false
						}
					},
					methods: {
						// 點選 phone 分類更改商品顯示內容
						clickPhone: function(e){
							this.product.splice(0, 2, data.phone);
							this.classStatus.phoneOn = true;
							this.classStatus.notebookOn = false;
							this.judgment.listButtom = true;
							this.judgment.detailButtom = false;
							history.pushState({
								sitePosition: 'phone',
								url: '/phone'
							}, 'phone', '?page=phone');
						},
						// 點選 notebook 分類更改商品顯示內容
						clickNotebook: function(e){
							this.product.splice(0, 2, data.notebook);
							this.classStatus.phoneOn = false;
							this.classStatus.notebookOn = true;
							this.judgment.listButtom = true;
							this.judgment.detailButtom = false;
							history.pushState({
								sitePosition: 'notebook',
								url: '/notebook'
							}, 'notebook', '?page=notebook');
						},
						// 點選單一商品顯示詳細內容
						clickList: function(index){
							let Len = this.shoppingCart.length;
							switch (this.product[0]){
								case data.phone:
									this.product.splice(0, 2, data.phone[index]);
									break;
								case data.notebook:
									this.product.splice(0, 2, data.notebook[index]);
									break;
							}
							this.judgment.listButtom = false;
							this.judgment.detailButtom = true;
							this.judgment.inputCartButtom = true;
							this.judgment.alreadyShoppingButtom = false;
							for (let i = 0; i < Len; i++){
								if (this.shoppingCart[i]['No.'] === this.product[0]['No.'] && this.shoppingCart[i]['產品名稱'] === this.product[0]['產品名稱']){
								this.judgment.inputCartButtom = false;
								this.judgment.alreadyShoppingButtom = true;
								}
							}
						},
						// 點擊加入購物車按鈕
						clickInputCart: function(e){
							this.judgment.inputCartButtom = false;
							this.judgment.alreadyShoppingButtom = true;
							vmCart.InputCart();
							this.shoppingCart.push(this.product[0]);
							this.shoppingNumber.push(1);
							localStorage.setItem("shoppingCartRecord", JSON.stringify(this.shoppingCart));
							localStorage.setItem("shoppingNumberRecord", JSON.stringify(this.shoppingNumber));
						},
						// 更換顯示內容 產品列表 → 購物列表
						changePage: function(e){
							this.judgment.productOn = false;
							this.judgment.shoppingCartOn = true;
							history.pushState({
								sitePosition: 'shoppingCart',
								url: '/shoppingCart'
							}, 'shoppingCart', '?page=shoppingCart');
						},
						// 點擊減少(-)按鈕，數量減1
						clickReduce: function(index, e){
							let inputNumber = e.currentTarget.nextElementSibling;
							if (this.shoppingNumber[index] > 1){
								this.shoppingNumber[index]--;
								inputNumber.value--;
								localStorage.setItem("shoppingNumberRecord", JSON.stringify(this.shoppingNumber));
							}
						},
						// 點擊增加(+)按鈕，數量加1
						clickIncrease: function(index, e){
							let inputNumber = e.currentTarget.previousElementSibling;
							if (this.shoppingNumber[index] < 100){
								this.shoppingNumber[index]++;
								inputNumber.value++;
								localStorage.setItem("shoppingNumberRecord", JSON.stringify(this.shoppingNumber));
							}
							// this.count(index);
						},
						// 依數量計算採購小計
						count: function(index){
							const price = this.shoppingCart[index]['價格'].slice(1);
							const priceNumber = parseInt(price.slice(-11, -8) + price.slice(-7, -4) + price.slice(-3));
							const cartNumber = this.shoppingNumber[index];
							const SubtotalPrice = priceNumber * cartNumber;
							return SubtotalPrice;
						}
					}
				});
				let vmCart = new Vue({
					el: '#header',
					data: {
						number: vmContent.shoppingCart.length,
						classStatus: {
							hoverOn: true,
						},
					},
					methods: {
						InputCart: function(e){
							vmCart.number++;
						},
						clickShoppingCart: function(e){
							vmContent.changePage();
						}
					}
				});
			// }
		}
	}
	xhr.send();
}
	// 修改歷史紀錄
function historyPage(e){
	console.log(e.state.sitePosition);
}