// @ts-nocheck
/* Script to handle submitted orders during "2021女醫團購-FNI植物奶自動結算總金額" auction. It parses order content, calculate the
 * total price in response to discount plans, and finally sent receipt information to each purchaser.
 * 
 * URL to corresponding spreadsheet: https://docs.google.com/spreadsheets/d/1h3fw6dLrQ3GUma_dbyQn0ODj2VPC_RiQ7DOPXE11cRA/edit?resourcekey#gid=1249837221
 *
 * Author: Elizabeth Lai, Hsing-Yu Chen
 */

/* 
    Hi Elizabeth:

      * The reason why your previous script doesn't work is that it links to your form, not your spreadsheet, hence it receives differet 
        format of trigger output. You are supposed to OPEN THE SCRIPT FROM THE SPREADSHEET, NOT FROM THE FORM. 
        See more info: https://stackoverflow.com/questions/43429161/how-to-get-form-values-in-the-submit-event-handler/43433069#comment120256207_43433069

      * Your DAILY EMAIL QUOTA (i.e. maximum number allowed to send per day) IS LIMITED. I believe it's 100 per day as a free account.
        Therefore, you need to consdier how many customers to handle per day, if approach to 100/day or more, you need to upgrade to 
        business account.
        See more info: https://developers.google.com/apps-script/guides/services/quotas

      * You may want to use "取得預先填入的連結" from your form to set up default purchase number to 0, so that customers don't have to 
        set every item to 0 when they don't wanna buy it. 

      * Now the code is supposed to work and send email to orderers. I will take time to implement remaining functions when convenient. Have fun
        and give me feedbacks if any.
    
    Best Regards,
    Hsing-Yu, 6/19/2021
*/

function onSubmit(data) {

  //Loggers.log("onSubmit called");
  
  var subject = "2021女醫團購-FNI植物奶自動結算總金額", // 信件標題
      emailTitle = "電子郵件地址", // 表單中收件者 email 這個項目的標題
      namedValues = data.namedValues;
      notifyEmail = namedValues[emailTitle] ? namedValues[emailTitle][0]:"";

  var content = getReceipt(namedValues);
  sendEmail( notifyEmail, subject, content );
  return;
}

function getReceipt(namedValues) {

  var html = "", total_price = 0;

  //設定產品價格
  var price={ 
    "FNI 醇品植物奶 (盒裝，一盒20+8入) $450/盒":450,
    "<<<箱購>>> FNI 醇品植物奶 (盒裝，一盒20+8入) 8盒 $3500":3500,
    "FNI 醇品植物奶 (袋裝，一袋15入)   $200/袋":200,
    "<<<箱購>>> FNI 醇品植物奶 (袋裝，一袋15入) 20袋 4000元":4000,
    "FNI 醇品豆漿粉(500g/袋) $150":150,
    "<<<箱購>>> FNI 醇品豆漿粉 (500g/袋，共20+2袋) $3000/箱":3000,
    "FNI 醇品豆漿粉(40%蛋白質) (500g/袋) $250/袋":250,
    "<<<箱購>>> FNI 醇品豆漿粉(40%蛋白質) (500g/袋，共20+2袋) $5000/箱":5000
    };
    
  var money=0;
  
  var free_shipping_money=3000; //設定免運費金額
  
  var freight_A=65;//設定運費金額
  
  var freight_B=150;//設定運費金額
  
  var n=data.values.length;
  
  var fields="";
  
  var field=["時間戳記","電子郵件地址","FNI 醇品植物奶 (盒裝，一盒20+8入) $450/盒","<<<箱購>>> FNI 醇品植物奶 (盒裝，一盒20+8入) 8盒 $3500","FNI 醇品植物奶 (袋裝，一袋15入) $200/袋","<<<箱購>>> FNI 醇品植物奶 (袋裝，一袋15入) 20袋 4000元","FNI 醇品豆漿粉(500g/袋) $150","<<<箱購>>> FNI 醇品豆漿粉 (500g/袋，共20+2袋) $3000/箱","FNI 醇品豆漿粉(40%蛋白質) (500g/袋) $250/袋","訂購者姓名","訂購者電話","訂購者Email","寄件方式","取件人大名","取件人電話","請問您要取件之店名、店號為？","取貨付款？純取貨？","收件人姓名","收件人地址","收件人連絡電話","希望商品之送達時段","取貨付款？純取貨？","其他問題"]
  
  var d="";
  
  var i,j;
  
  var pickup;//取貨方式
  
  pickup=namedValues["寄件方式"] ? namedValues["寄件方式"][0]:"" ;
  
  for (i = 0; i < n; i++) {
    v= namedValues[field[i]] ? namedValues[field[i]][0]:"" ;
    if(v!="")//有輸入的資料才顯示
    {
      html+=field[i]+":"+v+"<br/>";
      if(price[field[i]]!=undefined) //有價格才計算
        money+=price[field[i]]*v;         
     }
  }
  
  html+="您購買"+money+"元<br/>";
  
  if(pickup=="7-11 (運費60)")  
  {
          if(money<free_shipping_money) 
          {
                money+=freight_A
                html+="運費:"+freight_A+"元<br/>";
          }
          else
          {
                html+="運費:免費(滿"+free_shipping_money+"元)<br/>";
          }
  }
  if(pickup=="大榮宅配 (運費150)")  
  {
                if(money<free_shipping_money) 
          {
                money+=freight_B
                html+="運費:"+freight_B+"元<br/>";
          }
          else
          {
                html+="運費:免費(滿"+free_shipping_money+"元)<br/>";
          }
  }
    
  html+="總費用為"+money+"元<br/>";
  html+="-----轉帳匯款資訊------------<br/>";
  html+="銀行名稱：第一商業銀行(代碼:007)<br/>";
  html+="分行名稱：長泰分行<br/>";
  html+="戶名：德裕菖有限公司<br/>";
  html+="帳號：212-10-133433<br/>";

  return html;
}

function sendEmail( recipient, title, content )
{
  try {
    MailApp.sendEmail({  
        to: recipient,
        subject: title,
        htmlBody: content
    });
  } 
  catch (error) {
    //Todo: maybe label in spreadsheet that the recipient doesn't receive an email
    Logger.log("failed attempt to send email to : " + recipient + " , remaining email quota: " + MailApp.getRemainingDailyQuota()); 
    return;
  }
  Logger.log("email sent to: " + recipient + " , remaining email quota: " + MailApp.getRemainingDailyQuota())

  return;
}