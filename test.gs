/* Script to test functions
 *
 * Author: Elizabeth Lai, Hsing-Yu Chen
 */

// a test case that simulates onSubmit trigger input 
var test_data = {"authMode":"FULL","namedValues":{"時間戳記":["2021/6/19 上午 12:37:34"],"FNI 醇品豆漿粉(500g/袋) $150":["0"],"FNI 醇品植物奶 (盒裝，一盒20+8入) $450/盒":["0"],"收件人連絡電話":[""],"取件人電話":["123456789"],"收件人姓名":[""],"寄件方式":["7-11 (運費60)"],"訂購者電話":["123456789"],"<<<箱購>>> FNI 醇品植物奶 (盒裝，一盒20+8入) 8盒 $3500":["0"],"其他問題":["test"],"取件人大名":["test test"],"請問您要取件之店名、店號為？":["123456789"],"<<<箱購>>> FNI 醇品植物奶 (袋裝，一袋15入) 20袋 4000元":["0"],"取貨付款？純取貨？":["取貨付款",""],"收件人地址":[""],"訂購者Email":["peterchen33011@gmail.com"],"希望商品之送達時段":[""],"<<<箱購>>> FNI 醇品豆漿粉 (500g/袋，共20+2袋) $3000/箱":["0"],"電子郵件地址":["peterchen33011@gmail.com"],"FNI 醇品豆漿粉(40%蛋白質) (500g/袋) $250/袋":["0"],"":[""],"<<<箱購>>> FNI 醇品豆漿粉(40%蛋白質) (500g/袋，共20+2袋) $5000/箱":["0"],"訂購者姓名":["Hsing-Yu Chen"],"FNI 醇品植物奶 (袋裝，一袋15入) $200/袋":["0"]},"range":{"columnEnd":24,"columnStart":1,"rowEnd":10,"rowStart":10},"source":{},"triggerUid":"7535632","values":["2021/6/19 上午 12:37:34","Hsing-Yu Chen","123456789","peterchen33011@gmail.com","0","0","0","0","0","0","0","0","7-11 (運費60)","test test","123456789","123456789","取貨付款","","","","","","test","peterchen33011@gmail.com",""]}

function test_onSubmit()
{
  onSubmit(test_data);
  return;
}

function test_getReceipt()
{
  console.log( getReceipt(test_data.namedValues) );
}

function test_sendEmail()
{
  sendEmail("456", "test", "test"); // an error testcase
}