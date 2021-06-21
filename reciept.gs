// deploy as web app to see html layout
function doGet() {
  return getReceipt(test_data);
}

function getReceipt(data)
{
  var template = HtmlService.createTemplateFromFile('Receipt');
  template.dataFromServerTemplate = parseOrder(data);
  //Logger.log(parseOrder(data))
  //Logger.log(template.evaluate().getContent());
  return template.evaluate();
}

function parseOrder(data)
{
  var ret = {}
  var order = data.namedValues;
  ret['ship_method'] = order["寄件方式"]
  
  var order_table = [['品項','單價','購買數量','總價']];
  var init_price = 0, final_price;
  var prices = getMap('price_list');
  var freeShipping = false;

  for (var item in prices) 
  {
    var quantity = order[item][0], price = prices[item], subtotal = price * quantity;
    if( quantity > 0 )
    {
      order_table.push( [ item, price, quantity, subtotal ] )
      init_price += subtotal;
    }
  }
  ret['order_table'] = order_table, ret['init_price'] = init_price;

  ret = Object.assign({},ret, calcDiscount(data, init_price));
  //Logger.log(ret);
  return ret;
}

function calcDiscount(data, init_price)
{
  var ret = {}
  var order = data.namedValues;
  var discounted_price = init_price;
  var discount_plans = getMap('discount_plans');
  var discount_unit = discount_plans['discount_unit'], discount = discount_plans['discount'];

  // discount $x for every $y
  var refund = Math.floor(init_price/discount_unit) * discount;
  ret["refund"] = refund;
  discounted_price -= refund;
  
  // shipping fee
  var ship_method = getMap('ship_method');
  if ( discounted_price >= discount_plans['freeship_thres'] ) // shipping fee exempted
  {
    ret["ship_fee"] = 0
  }
  else
  {
    var shipfee = ship_method[order["寄件方式"]];
    ret["ship_fee"] = shipfee;
    discounted_price += shipfee;
  }
  ret["final_price"] = discounted_price;
  return ret;
}

function getMap(sheet_name)
{
  var dict = {};
  var sheet = SpreadsheetApp
    .getActive()
    .getSheetByName(sheet_name)
  var row = sheet.getLastRow(), col = sheet.getLastColumn();
  var vals = sheet.getRange( 2, 1, row-1, col ).getValues();
  for( var i = 0; i < vals.length; i++ )
  {
    dict[vals[i][0]] = vals[i][1];
  }
  return dict;
}