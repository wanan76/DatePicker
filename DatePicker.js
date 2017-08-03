
var box = null;
var backView = null;
var cancelBtn = null;
var okBtn = null;
var lastPageY = null;
var distance = 0;
var time = 0;
var lastTimeStamp = 0;
var interval = null;

var yearArr = [];
var monthArr = [];
var dayArr = [];
var hourArr = [];
var minuteArr = [];

var daySection = null;

var type = null;

/**
 *	params.timestamp //最初显示时间的时间戳
 *  params.type //时间显示类型  不传显示全部时间  传'date'显示年月日   传'time'显示时分
 */
exports.init = function (params) {

	yearArr = [];
	monthArr = [];
	dayArr = [];
	hourArr = [];
	minuteArr = [];

	if (params && params.type) {
		type = params.type;
	}

	var date = new Date();
	if (params && params.timestamp) {
		date.setTime(params.timestamp);
	}

	var year = date.getFullYear();

	for (var i = year - 4; i <= year + 4; i++) {
		yearArr.push(i);
	}

	var month = date.getMonth();

	for (var i = month + 1 - 4; i <= month + 1 + 4; i++) {
		if (i > 12) {
			monthArr.push(i - 12);
		}else if (i < 1) {
			monthArr.push(12 - i);
		}else{
			monthArr.push(i);
		}
	}

	var day = date.getDate();

	var stringTime;
	if (monthArr[4] == 12) {
		stringTime = yearArr[4] + 1 + '-' + 1 + '-' + '1' + ' 8:00:00';
	}else{
		stringTime = yearArr[4] + '-' + (monthArr[4] + 1) + '-' + '1' + ' 8:00:00';
	}
	var timestamp2 = Date.parse(new Date(stringTime)) - 60*60*24*1000;

	var newDate = new Date();
	newDate.setTime(timestamp2);

	var maxDay = newDate.getDate();

	for (var i = day - 4; i <= day + 4; i++) {
		if (i < 1) {
			dayArr.push(maxDay + i);
		}else if (i > maxDay){
			dayArr.push(i - maxDay);
		}else{
			dayArr.push(i);
		}
	}

	var hour = date.getHours();

	for (var i = hour - 4; i <= hour + 4; i++) {
		if (i < 1) {
			hourArr.push(24 + i);
		}else if (i > 24) {
			hourArr.push(i - 24);
		}else{
			hourArr.push(i);
		}
	}

	var minute = date.getMinutes();

	for (var i = minute - 4; i <= minute + 4; i++) {
		if (i < 0) {
			minuteArr.push(60 + i);
		}else if (i > 59){
			minuteArr.push(i - 60);
		}else{
			minuteArr.push(i);
		}
	}

	return {

		show:function (callBack) {
			//创建元素
			createElement();

			//取消按钮点击事件
			cancelBtn.onclick = function () {
				document.body.removeChild(backView);
			};
			//确定按钮点击事件
			okBtn.onclick = function () {
				var stringTime = yearArr[4] + '-' + monthArr[4] + '-' + dayArr[4] + ' ' + hourArr[4] + ':' + minuteArr[4] + ':' + '00';
				var ts = Date.parse(new Date(stringTime))
				callBack(ts);
				document.body.removeChild(backView);
			};
			//阻止底层window滚动
			backView.addEventListener('touchmove', function (event) {
				event.preventDefault();
			},false);
		}
	}
}

function createElement() {
	// 半透明层
	backView = document.createElement('div');
	backView.id = 'backview';
	backView.style.position = 'fixed';
	backView.style.left = 0 + 'px';
	backView.style.right = 0 + 'px';
	backView.style.top = 0 + 'px';
	backView.style.bottom = 0 + 'px';
	backView.style.backgroundColor = 'rgba(0,0,0,0.5)';
	backView.style.zIndex = '1000';
	document.body.appendChild(backView);

	// 城市选择框
	box = document.createElement('div');
	box.id = 'box';
	box.style.position = 'absolute';
	box.style.left = 0 + 'px';
	box.style.right = 0 + 'px';
	box.style.bottom = 0 + 'px';
	box.style.height = 219 + 'px';
	box.style.backgroundColor = '#fff';
	box.style.zIndex = '1001';
	backView.appendChild(box);

	//取消与确定按钮
	var btns = document.createElement('div');
	btns.style.height = 44 + 'px';
	btns.style.width = '100%';
	btns.style.backgroundColor = '#f2f2f2';
	btns.style.zIndex = '1002';
	box.appendChild(btns);

	//取消按钮
	cancelBtn = document.createElement('span');
	cancelBtn.innerHTML = '取消';
	cancelBtn.style.display = 'inline-block';
	cancelBtn.style.marginTop = 12 + 'px';
	cancelBtn.style.marginLeft = 15 + 'px';
	cancelBtn.style.height = 20 + 'px';
	cancelBtn.style.lineHeight = 20 + 'px';
	btns.appendChild(cancelBtn);

	//取消按钮
	okBtn = document.createElement('span');
	okBtn.innerHTML = '确定';
	okBtn.style.float = 'right';
	okBtn.style.display = 'inline-block';
	okBtn.style.marginTop = 12 + 'px';
	okBtn.style.marginRight = 15 + 'px';
	okBtn.style.height = 20 + 'px';
	okBtn.style.lineHeight = 20 + 'px';
	btns.appendChild(okBtn);

	//中间两根线
	var topLine = document.createElement('div');
	topLine.style.position = 'absolute';
	topLine.style.left = '0px';
	topLine.style.right = '0px';
	topLine.style.top = '119px';
	topLine.style.height = '1px';
	topLine.style.backgroundColor = 'rgba(0,0,0,0.1)';
	topLine.style.zIndex = 100;
	box.appendChild(topLine);

	var bottomLine = document.createElement('div');
	bottomLine.style.position = 'absolute';
	bottomLine.style.left = '0px';
	bottomLine.style.right = '0px';
	bottomLine.style.top = '144px';
	bottomLine.style.height = '1px';
	bottomLine.style.backgroundColor = 'rgba(0,0,0,0.1)';
	bottomLine.style.zIndex = 100;
	box.appendChild(bottomLine);

	if (type == 'date') {
		createSection(box,'0%','33.3%','year',yearArr);

		createSection(box,'33.3%','33.3%','month',monthArr);

		createSection(box,'66.6%','33.3%','day',dayArr);
	}else if(type == 'time'){
		createSection(box,'0%','50%','hour',hourArr);

		createSection(box,'50%','50%','minute',minuteArr);
	}else{
		createSection(box,'0%','20%','year',yearArr);

		createSection(box,'20%','20%','month',monthArr);

		createSection(box,'40%','20%','day',dayArr);

		createSection(box,'60%','20%','hour',hourArr);

		createSection(box,'80%','20%','minute',minuteArr);
	}

	
}
function createSection(view,left,width,cla,data) {

	var section = document.createElement('div');
	section.style.position = 'absolute';
	section.style.left = left;
	section.style.top = 44 + 'px';
	section.style.width = width;
	section.style.bottom = 0 + 'px';
	section.style.overflow = 'hidden';
	view.appendChild(section);

	var topBox = document.createElement('div');
	topBox.style.height = 75 + 'px';
	section.appendChild(topBox);

	ul = document.createElement('ul');
	
	ul.style.marginTop = -100 + 'px';
	
	ul.class = cla;
	if (cla == 'day') {
		daySection = ul;
	}
	section.appendChild(ul);

	var bottomBox = document.createElement('div');
	bottomBox.style.height = 75 + 'px';
	section.appendChild(bottomBox);

	for (var i = 0; i < data.length; i++) {
		var li = createLi(cla,data[i]);
		ul.appendChild(li);
	}

	changeItemColor(ul,parseInt(ul.style.marginTop));

	ul.addEventListener('touchstart',function (event) {
		this.style.transition = 'all 0s';
		distance = 0;
		clearInterval(interval);
	});

	ul.addEventListener('touchmove',function (event) {

      	var pageY = event.touches[0].pageY;
      	var marginTop = parseInt(this.style.marginTop);
      	var timeStamp = event.timeStamp;
      	var bottom = this.offsetHeight - 25;

      	//判断是否第一次触摸，如果是，则给lastPageY赋值
      	if (!lastPageY) {
      		lastPageY = pageY;
      	}else{

      		this.style.marginTop = marginTop + pageY - lastPageY + 'px';

      		distance = pageY - lastPageY;

      		time = timeStamp - lastTimeStamp;

      		lastPageY = pageY;

      		lastTimeStamp = timeStamp;

      		changeItemColor(this,parseInt(this.style.marginTop));

      		if (this.class == 'year') {
      			reloadYearItems(this,parseInt(this.style.marginTop));
      		}else if(this.class == 'month'){
      			reloadMonthItems(this,parseInt(this.style.marginTop));
      		}else if(this.class == 'day'){
      			reloadDayItems(this,parseInt(this.style.marginTop));
      		}else if(this.class == 'hour'){
      			reloadHourItems(this,parseInt(this.style.marginTop));
      		}else if(this.class == 'minute'){
      			reloadMinuteItems(this,parseInt(this.style.marginTop));
      		}
      	}
	});
	ul.addEventListener('touchend',function (event) {
		var view = this;
		var marginTop = parseInt(view.style.marginTop);
		var bottom = view.offsetHeight - 25;
		lastPageY = null;
		if (distance > 3 || distance < -3){
			var speed = distance / time * 100000;
			var count= 1;
			interval = setInterval(function () {
				count += 0.8;
				var sp = speed / count;
				
				view.style.marginTop = marginTop + sp / 1000 + 'px';
      			changeItemColor(view,parseInt(view.style.marginTop));
      			if (view.class == 'year') {
      				reloadYearItems(view,parseInt(view.style.marginTop));
      			}else if(view.class == 'month'){
      				reloadMonthItems(view,parseInt(view.style.marginTop));
      			}else if(view.class == 'day'){
      				reloadDayItems(view,parseInt(view.style.marginTop));
      			}else if(view.class == 'hour'){
      				reloadHourItems(view,parseInt(view.style.marginTop));
      			}else if(view.class == 'minute'){
      				reloadMinuteItems(view,parseInt(view.style.marginTop));
      			}

      			if (Math.abs(sp) < 2000) {
      				clearInterval(interval);
      				scrollToPosition(view,marginTop);
      			}
      			marginTop = parseInt(view.style.marginTop);
			},1);
		}else{
			scrollToPosition(view,marginTop);	
		}
	});
}
function reloadUl(view,data) {
	for (var i = 0; i < data.length; i++) {
		if (view.class == 'year') {
			view.childNodes[i].innerHTML = data[i];
		}else if(view.class =='month'){
			view.childNodes[i].innerHTML = data[i] + '月';
		}else if(view.class =='day'){
			view.childNodes[i].innerHTML = data[i] + '日';
		}else if(view.class =='hour'){
			view.childNodes[i].innerHTML = data[i];
		}else if(view.class =='minute'){
			view.childNodes[i].innerHTML = data[i];
		}
	}
}
function reloadYearItems(view,marginTop) {
	view.style.transition = 'all 0s';
	if (marginTop <= -125) {
		var year = yearArr[4] + 1;
		yearArr = [];
		for (var i = year - 4; i <= year + 4; i++) {
			yearArr.push(i);
		}
		view.style.marginTop = -100 + 'px';
	}
	if (marginTop >= - 75) {
		var year = yearArr[4] -1;
		yearArr = [];
		for (var i = year - 4; i <= year + 4; i++) {
			yearArr.push(i);
		}
		view.style.marginTop = -100 + 'px';
	}
	reloadUl(view,yearArr);

	changeDayItems();
}
function reloadMonthItems(view,marginTop) {
	view.style.transition = 'all 0s';
	if (marginTop <= -125) {
		var month;
		if (monthArr[4] == 12) {
			month = 1;
		}else{
			month = monthArr[4] + 1;
		}
		monthArr = [];
		for (var i = month - 4; i <= month + 4; i++) {
			if (i > 12) {
				monthArr.push(i - 12);
			}else if (i < 1) {
				monthArr.push(12 + i);
			}else{
				monthArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	if (marginTop >= - 75) {
		var month;
		if (monthArr[4] ==1) {
			month = 12;
		}else{
			month = monthArr[4] - 1;
		}
		monthArr = [];
		for (var i = month - 4; i <= month + 4; i++) {
			if (i > 12) {
				monthArr.push(i - 12);
			}else if (i < 1) {
				monthArr.push(12 + i);
			}else{
				monthArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	reloadUl(view,monthArr);
	changeDayItems();
}
function reloadDayItems(view,marginTop) {
	view.style.transition = 'all 0s';

	var stringTime;
	if (monthArr[4] == 12) {
		stringTime = yearArr[4] + 1 + '-' + 1 + '-' + '1' + ' 8:00:00';
	}else{
		stringTime = yearArr[4] + '-' + (monthArr[4] + 1) + '-' + '1' + ' 8:00:00';
	}
	var timestamp2 = Date.parse(new Date(stringTime)) - 60*60*24*1000;

	var newDate = new Date();
	newDate.setTime(timestamp2);

	var maxDay = newDate.getDate();

	if (marginTop <= -125) {
		var day;

		if (dayArr[4] == maxDay) {
			day = 1;
		}else{
			day = dayArr[4] + 1;
		}
		dayArr = [];
		for (var i = day - 4; i <= day + 4; i++) {
			if (i < 1) {
				dayArr.push(maxDay + i);
			}else if (i > maxDay){
				dayArr.push(i - maxDay);
			}else{
				dayArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	if (marginTop >= - 75) {
		var day;
		if (dayArr[4] == 1) {
			day = maxDay;
		}else{
			day = dayArr[4] - 1;
		}
		dayArr = [];
		for (var i = day - 4; i <= day + 4; i++) {
			if (i < 1) {
				dayArr.push(maxDay + i);
			}else if (i > maxDay){
				dayArr.push(i - maxDay);
			}else{
				dayArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	reloadUl(view,dayArr);
}
function reloadHourItems(view,marginTop) {
	view.style.transition = 'all 0s';
	if (marginTop <= -125) {
		var hour;
		if (hourArr[4] == 24) {
			hour = 1;
		}else{
			hour = hourArr[4] + 1;
		}
		hourArr = [];
		for (var i = hour - 4; i <= hour + 4; i++) {
			if (i > 24) {
				hourArr.push(i - 24);
			}else if (i < 1) {
				hourArr.push(24 + i);
			}else{
				hourArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	if (marginTop >= - 75) {
		var hour;
		if (hourArr[4] ==1) {
			hour = 24;
		}else{
			hour = hourArr[4] - 1;
		}
		hourArr = [];
		for (var i = hour - 4; i <= hour + 4; i++) {
			if (i > 24) {
				hourArr.push(i - 24);
			}else if (i < 1) {
				hourArr.push(24 + i);
			}else{
				hourArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	reloadUl(view,hourArr);
}
function reloadMinuteItems(view,marginTop) {
	view.style.transition = 'all 0s';
	if (marginTop <= -125) {
		var minute;
		if (minuteArr[4] == 59) {
			minute = 0;
		}else{
			minute = minuteArr[4] + 1;
		}
		minuteArr = [];
		for (var i = minute - 4; i <= minute + 4; i++) {
			if (i < 0) {
				minuteArr.push(60 + i);
			}else if (i > 59){
				minuteArr.push(i - 60);
			}else{
				minuteArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	if (marginTop >= - 75) {
		var minute;
		if (minuteArr[4] == 0) {
			minute = 59;
		}else{
			minute = minuteArr[4] - 1;
		}
		minuteArr = [];
		for (var i = minute - 4; i <= minute + 4; i++) {
			if (i < 0) {
				minuteArr.push(60 + i);
			}else if (i > 59){
				minuteArr.push(i - 60);
			}else{
				minuteArr.push(i);
			}
		}
		view.style.marginTop = -100 + 'px';
	}
	reloadUl(view,minuteArr);
}

function changeDayItems() {
	var stringTime;
	if (monthArr[4] == 12) {
		stringTime = yearArr[4] + 1 + '-' + 1 + '-' + '1' + ' 8:00:00';
	}else{
		stringTime = yearArr[4] + '-' + (monthArr[4] + 1) + '-' + '1' + ' 8:00:00';
	}
	var timestamp2 = Date.parse(new Date(stringTime)) - 60*60*24*1000;
	var newDate = new Date();
	newDate.setTime(timestamp2);

	var maxDay = newDate.getDate();

	var max = Math.max.apply( Math, dayArr );

	if (max > maxDay || (dayArr[0] > dayArr[dayArr.length - 1] && max != maxDay)) {

		var tmpDay = dayArr[dayArr.length -1];

		dayArr = [];

		for (var i = 8; i >= 0; i--) {
			if (tmpDay - i < 1) {
				dayArr.push(maxDay + (tmpDay - i));
			}else{
				dayArr.push(tmpDay - i);
			}
		}
		for (var i = 0; i < dayArr.length; i++) {
			daySection.childNodes[i].innerHTML = dayArr[i] + '日';
		}
	}
}

function createLi(cla,innerHTML) {
	var li = document.createElement('li');
	li.style.listStyle = 'none';
	li.style.height = 25 + 'px';
	li.style.lineHeight = 25 + 'px';
	li.style.fontSize = 12 + 'px';
	
	if (cla == 'year') {
		li.innerHTML = innerHTML;
	}else if(cla =='month'){
		li.innerHTML = innerHTML + '月';
	}else if(cla =='day'){
		li.innerHTML = innerHTML + '日';
	}else if(cla =='hour'){
		li.innerHTML = innerHTML;
	}else if(cla =='minute'){
		li.innerHTML = innerHTML;
	}
	li.style.textAlign = 'center';
	li.style.wordBreak = 'keep-all';
	li.style.whiteSpace = 'nowrap';
	li.style.overflow = 'hidden';
	li.style.textOverflow = 'ellipsis';

	li.onclick = function (event) {
		event.preventDefault();
	}

	return li;
}
function changeItemColor(view,marginTop) {
	var childs = view.childNodes;
	for (var i = 0; i < childs.length; i++) {
		if (25 * i + marginTop >= -100 && 25 * i + marginTop <= 100) {
			var color = parseInt(Math.abs(0 - (25 * i + marginTop)) * 2) + 50;
			var radiu = parseInt(Math.abs(0 - (25 * i + marginTop)) / 1.5);
			childs[i].style.color = 'rgb(' + color + ',' + color + ',' + color + ')';
			childs[i].style.transform = 'rotateX(' + radiu + 'deg)';
		}	
	}
}
function scrollToPosition(view,marginTop) {
	view.style.transition = 'all 0.3s';
	if (Math.abs(marginTop % 25) < 13) {
		view.style.marginTop = marginTop - marginTop % 25 + 'px';
	}else{
		view.style.marginTop = marginTop - marginTop % 25 - 25 + 'px';
	}
	setTimeout(function () {
		var top = parseInt(view.style.marginTop);
		view.style.transition = 'all 0s';
		view.style.marginTop = -100 + 'px';
		changeItemColor(view,parseInt(view.style.marginTop));
		if (view.class == 'year') {
      		reloadYearItems(view,top);
      	}else if(view.class == 'month'){
      		reloadMonthItems(view,top);
      	}else if(view.class == 'day'){
      		reloadDayItems(view,top);
      	}else if(view.class == 'hour'){
      		reloadHourItems(view,top);
      	}else if(view.class == 'minute'){
      		reloadMinuteItems(view,top);
      	}
	},300);
	
}
