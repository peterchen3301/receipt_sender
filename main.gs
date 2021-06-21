// @ts-nocheck
/* Script to handle submitted orders during "2021女醫團購-FNI植物奶自動結算總金額" auction. It parses order content, calculate the
 * total price in response to discount plans, and finally sent receipt information to each purchaser.
 * 
 * URL to corresponding spreadsheet: https://docs.google.com/spreadsheets/d/1h3fw6dLrQ3GUma_dbyQn0ODj2VPC_RiQ7DOPXE11cRA/edit?resourcekey#gid=1249837221
 *
 * Author: Elizabeth Lai, Hsing-Yu Chen
 */

function onSubmit(data) {

  //Loggers.log("onSubmit called");
  
  var subject = "2021女醫團購-FNI植物奶自動結算總金額", // 信件標題
      emailTitle = "電子郵件地址", // 表單中收件者 email 這個項目的標題
      namedValues = data.namedValues;
      notifyEmail = namedValues[emailTitle] ? namedValues[emailTitle][0]:"";

  var content = getReceipt(data).getContent();
  sendEmail( notifyEmail, subject, content );
  return;
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
    //Todo: maybe mark this recipient didn't receive an email
    Logger.log("failed attempt to send email to : " + recipient + " , remaining email quota: " + MailApp.getRemainingDailyQuota()); 
    return;
  }
  Logger.log("email sent to: " + recipient + " , remaining email quota: " + MailApp.getRemainingDailyQuota())

  return;
}