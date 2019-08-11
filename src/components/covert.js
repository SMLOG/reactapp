export function covert(data, code) {
  try {
    //港股
    if (code.toLowerCase().substring(0, 2) === "hk") {
      return {
        //temp[0]------CHEUNG KONG------名称
        name: data[1],
        open: data[2],
        closed: data[3],
        highPrice: data[4],
        lowPrice: data[5],
        price: data[6],
        diff: data[7],
        percent: data[8],
        buy1Price: data[9],
        sell1Price: data[10],
        total: data[11],
        volTotal: data[12],
        pe: data[13],
        weekRate: data[14],
        high52: data[15],
        low52: data[16],
        //temp[17]------2016/06/22------日期
        time: data[18] //temp[18]------16:01------时间
      };
    }
    //美股
    if (data[3].indexOf(":") > 0) {
      return {
        name: data[0],
        price: data[1],
        percent: data[2],
        time: data[3].split(/\s+/)[1],
        diff: data[4],
        open: data[5],
        highPrice: data[6],
        lowPrice: data[7],
        high52: data[8],
        low52: data[9],
        volTotal: data[10],
        total: data[11],
        marketValue: data[12],
        earningsPerShare: data[13],
        pe: data[14],
        beta: data[16],
        capital: data[17],
        //temp[20]------58.00------
        todayClose: data[21],
        //temp[22]------0.00------
        //temp[23]------0.00------
        //temp[24]------------
        //temp[25]------Jun 21 04:00PM EDT------
        closed: data[26] //temp[26]------49.26------昨日收盘价
        //temp[27]------0.00------
      };
    }
    return {
      name: data[0],
      open: data[1],
      closed: data[2],
      price: data[3],
      highPrice: data[4],
      lowPrice: data[5],
      buy1Price: data[6],
      sell1Price: data[7],
      volTotal: data[8],
      total: data[9],
      buy1Vol: data[10],
      //buy1Price: data[11],
      buy2Vol: data[12],
      buy2Price: data[13],
      buy3Vol: data[14],
      buy3Price: data[15],
      buy4Vol: data[16],
      buy4Price: data[17],
      buy5Vol: data[18],
      buy5Price: data[19],
      sell1Vol: data[20],
      //sell1Price: data[21],
      sell2Vol: data[22],
      sell2Price: data[23],
      sell3Vol: data[24],
      sell3Price: data[25],
      sell4Vol: data[26],
      sell4Price: data[27],
      sell5Vol: data[28],
      sell5Price: data[29],
      date: data[30],
      time: data[31]
    };
  } catch (e) {
    return {};
  }
}
