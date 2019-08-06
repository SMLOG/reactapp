import React from "react";
import "./App.css";
/*const nameMap: string[][] = [
  ["0", "股票名字；", "name"],
  ["1", "今日开盘价", "open"],
  ["2", "昨日收盘价；", "closed"],
  ["3", "当前价格；", "price"],
  ["4", "今日最高价；", "highPrice"],
  ["5", "今日最低价；", "lowPrice"],
  ["6", "即“买一“报价；", "buy1Price"],
  ["7", "即“卖一“报价；", "sell1Price"],
  ["8", "成交数；", "volTotal"],
  ["9", "成交额；", "total"],
  ["10", "“买一数；", "buy1Vol"],
  ["11", "“买一价；", "buy1Price"],
  ["12", "“买二数；", "buy2Vol"],
  ["13", "“买二价；", "buy2Price"],
  ["14", "“买三数；", "buy3Vol"],
  ["15", "“买三价；", "buy3Price"],
  ["16", "“买四数；", "buy4Vol"],
  ["17", "“买四价；", "buy4Price"],
  ["18", "“买五数；", "buy5Vol"],
  ["19", "“买五价；", "buy5Price"],
  ["20", "卖一数", "sell1Vol"],
  ["21", "卖一价", "sell1Price"],
  ["22", "卖二数", "sell2Vol"],
  ["23", "卖二价", "sell2Price"],
  ["24", "卖三数", "sell3Vol"],
  ["25", "卖三报价", "sell3Price"],
  ["26", "卖四数", "sell4Vol"],
  ["27", "卖四报价", "sell4Price"],
  ["28", "卖五数", "sell5Vol"],
  ["29", "卖五报价", "sell5Price"],
  ["30", "日期；", "date"],
  ["31", "时间；", "time"]
];*/
let thead = (            <tr className="rowh">
<th>代码</th>
<th>名</th>
<th>价</th>
<th>买一</th>
<th>卖一</th>
<th>开</th>
<th>昨</th>
<th>高</th>
<th>低</th>
<th>额(亿)</th>
<th>量(万)</th>
</tr>);
function covert(data) {

  if(data.code==='hkHSI'){
    return {
      name: data[1],
      open:data[2],
      closed:data[3],
      hight:data[4],
      low:data[5],
      price: data[6],
      percent: data[8]
  
  }
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
}
function getUrlVars() {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}
function loadScripts(scripts) {
  return scripts.reduce((currentPromise, scriptUrl) => {
    return currentPromise.then(() => {
      return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.async = true;
        script.src = scriptUrl;
        script.onload = () => resolve();
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    });
  }, Promise.resolve());
}
let vars = getUrlVars();
vars["codes"] = vars["codes"] || "sh000001";
vars["time"] = vars["time"] || "1000";

const codes = vars["codes"].split(",");
let stlist = {};
function notifyMe(title, msg) {

  // Let's check if the user is okay to get some notification
  console.log(title, msg)
  if(Notification.permission !=='granted')Notification.requestPermission();

  if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(title, { body: msg });
      notification.onclick = notification.close.bind(notification);
      setTimeout(notification.close.bind(notification), 8000);
  }



  // At last, if the user already denied any notification, and you 
  // want to be respectful there is no need to bother him any more.
}

window.addEventListener('load', function () {
  Notification.requestPermission(function (status) {
      // This allows to use Notification.permission with Chrome/Safari
      if (Notification.permission !== status) {
          Notification.permission = status;
      }
  });
});


   function compareValueToColor(target,base){
	   if(target>base)return 'up';
	   if(target<base)return 'down';
	   return '';
   }
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: new Array(0), timeStr: "00:00:00" };
  }
  isTradeTime() {
    let d = new Date();
    if (d.getDay() === 6 || d.getDay() === 0) return false;
    if (d.getHours() < 9 || d.getHours() > 16) return false;
    if (((d.getHours() === 11 && d.getMinutes() > 30) || d.getHours() > 11) && d.getHours() < 13) return false;
    return true;
}
  refresh() {
    console.log(new Date());
    let titles = [];

    setTimeout(() => {
      var scripts = ["http://hq.sinajs.cn/list=" + vars["codes"]];
      loadScripts(scripts).then(() => {
        let items = codes
          .map(code => {
            let data = covert(window["hq_str_" + code].split(","));
            data.code = code;
            return data;
          })
          .map(data => {
            let percent = toFixed( ((data.price - data.closed) / data.closed) * 100, 2);
            data.percent = percent;
            data.openColor = compareValueToColor(data.open,data.closed);
            data.highColor= compareValueToColor(data.highPrice,data.closed);
            data.lowColor= compareValueToColor(data.lowPrice,data.closed);
            data.buy1Color= compareValueToColor(data.buy1Price,data.closed);
            data.sell1Color= compareValueToColor(data.sell1Price,data.closed);
            data.priceColor= compareValueToColor(data.price,data.closed);

            titles.push(`${percent}% ${toFixed(data.price,2)}(${toFixed(data.price - data.closed,2)})${data.name}`);

            let msgs =[];

            stlist[data.code] = stlist[data.code] || { percentThreshold: 0, lastTotal: 0,tt:new Array(15).fill(0) };
            let st = stlist[data.code];

                        // percentThreshold 
                        if (data[3]>0&&Math.abs(percent - st.percentThreshold) > 0.5) {
                          console.log(st.percentThreshold)
                          st.percentThreshold = percent / Math.abs(percent) * Math.floor(Math.abs(percent) / 0.5) * 0.5;
                          msgs.push(`${data[0]}:\n${data[3]} ${percent}%  ${((percent - st.percentThreshold) > 0 ? "↑" : "↓")}`);
                      }


                      let tt = st.tt;
                      let prevTotal = tt.reduce((a, b) => a + b, 0);
                      let last = tt.shift();
                      tt.push(data[8]);
                      let curTotal = tt.reduce((a, b) => a + b, 0) - last*tt.length;
                      prevTotal = - last*tt.length;
                      if(last>0&&curTotal / prevTotal>3){
                          msgs.push(`${data[0]}:\nVol ${Math.floor(curTotal/100)}/${Math.floor(prevTotal/100)} > ${Math.floor(curTotal / prevTotal)}`);
                      }
                      msgs.map(text=>{
                        console.log(text)
                        notifyMe(data.time,text );
                        return '';
                    })

            return data;
          });

        let timeStr = [new Date()]
          .map(d => `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)
          .join("");
        this.setState({ items: items, timeStr });
        document.title = titles.join(',');
      });
      this.refresh();
    }, vars["time"]);
  }
  componentDidMount() {
    // this.timerID = setInterval(() => this.tick(), 1000);
    this.refresh();
  }

  componentWillUnmount() {
    //clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <div>{this.state.timeStr}</div>
        <table>
          <tbody>{thead}
            {this.state.items.map((item, i) => (
              <Item key={item.code} item={item} className={"row" + (i % 2)} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
function toFixed(value, n) {
  return (value * 1).toFixed(n);
}
function Item(props) {
  let item = props.item;
  return (
    <tr className={props.className}>
      <td>{item.code}</td>
      <td>{item.name}</td>
      <td className={item.priceColor}>
	{toFixed(item.price, 2)}<span> {item.percent}%</span><span>({toFixed(item.price - item.closed, 2)})</span>
      </td>
      <td className={item.buy1Color}>
        {toFixed(item.buy1Price, 2)}({toFixed(item.buy1Vol / 100, 0)})
      </td>
      <td className={item.sell1Color}>
        {toFixed(item.sell1Price, 2)}({toFixed(item.sell1Vol / 100, 0)})
      </td>
      <td className={item.openColor}>{toFixed(item.open, 2)}</td>
      <td>{toFixed(item.closed, 2)}</td>
      <td className={item.highColor}>{toFixed(item.highPrice, 2)}</td>
      <td className={item.lowColor}>{toFixed(item.lowPrice, 2)}</td>

      <td>{toFixed(item.total / 100000000, 3)}</td>
      <td>{toFixed(item.volTotal / 1000000, 3)}</td>
    </tr>
  );
}
//ReactDOM.render(<Clock />, document.getElementById("root"));

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}*/

export default App;
