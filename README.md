# DatePicker
//vue框架下导入
import datePicker from '../datePicker/datePicker.js';
//js下导入
var datePicker = require('../datePicker/datePicker.js');

/** 初始化函数
 *  params object类型 
      params.timestamp int类型 显示初始时间的时间戳，不传显示当前日期
      params.type string类型 传'date'显示年月日，传'time'显示时分，不传显示全部时间
 *  show()传入匿名函数
      选择好日期，点击确定按钮后回调
      timestamp int类型 选择日期的时间错
 */
datePicker.init(params).show(function (timestamp) {
  console.log(timestamp);
});
