import React from "react";
import "./App.css";
import { loadScripts } from "./loadScripts";
import { connect } from "react-redux";
import { notifyMe } from "./notifyMe";
import { covert } from "./covert";
import { getUrlVars } from "./thead";
import { removeStock } from "../actions";
import SelectTest from "./Select2";


const mapStateToProps = state => ({
  stocks: state.stocks
});

let vars = getUrlVars();

vars["time"] = vars["time"] || "1000";

let stlist = {};
window.addEventListener("load", function() {
  Notification.requestPermission(function(status) {
    // This allows to use Notification.permission with Chrome/Safari
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
  });
});

function compareValueToColor(target, base) {
  if (target > base) return "up";
  if (target < base) return "down";
  return "";
}
let items = [];
class StockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], timeStr: "" };
  }
  componentWillMount(){
const electron = window.electron;

let win = electron.remote.getCurrentWindow();
let biasX = 0;
let biasY = 0;
document.addEventListener('mousedown', function (e) {
  alert(e)
    switch (e.button) {
        case 0:
            biasX = e.x;
            biasY = e.y;
            document.addEventListener('mousemove', moveEvent);
            break;
        case 2:
          electron.ipcRenderer.send('createSuspensionMenu');
            break;
    }
});
document.addEventListener('mouseup', function () {
    biasX = 0;
    biasY = 0;
    document.removeEventListener('mousemove', moveEvent)
});

function moveEvent(e) {
    win.setPosition(e.screenX - biasX, e.screenY - biasY)
}

  }
  isTradeTime() {
    let d = new Date();
    if (d.getDay() === 6 || d.getDay() === 0) return false;
    if (d.getHours() < 9 || d.getHours() > 16) return false;
    if (
      ((d.getHours() === 11 && d.getMinutes() > 30) || d.getHours() > 11) &&
      d.getHours() < 13
    )
      return false;
    return true;
  }
  refresh() {
    let titles = [];

    this.timerID = setTimeout(() => {
      let codes = this.props.stocks.map(i => {
        if (i.countryID === "41") return "gb_" + i.code.replace(".", "$");
        if (i.countryID === "33") return "hk" + i.code;

        return i.code;
      });
      var scripts = ["http://hq.sinajs.cn/list=" + codes.join(",")];
      if (this.props.stocks.length < 1) {
        this.setState({ ...this.state, items: [] });
      } else
        loadScripts(scripts).then(() => {
          items = codes
            .map(code => {
              let data = covert(window["hq_str_" + code].split(","), code);
              data.code = code;
              return data;
            })
            .map(data => {
              let percent = toFixed(
                ((data.price - data.closed) / data.closed) * 100,
                2
              );
              data.percent = percent;
              data.openColor = compareValueToColor(data.open, data.closed);
              data.highColor = compareValueToColor(data.highPrice, data.closed);
              data.lowColor = compareValueToColor(data.lowPrice, data.closed);
              data.buy1Color = compareValueToColor(data.buy1Price, data.closed);
              data.sell1Color = compareValueToColor(
                data.sell1Price,
                data.closed
              );
              data.priceColor = compareValueToColor(data.price, data.closed);

              titles.push(
                `${percent}% ${toFixed(data.price, 2)}(${toFixed(
                  data.price - data.closed,
                  2
                )})${data.name}`
              );

              let msgs = [];

              stlist[data.code] = stlist[data.code] || {
                percentThreshold: 0,
                lastTotal: 0,
                tt: new Array(15).fill(0)
              };
              let st = stlist[data.code];
              // percentThreshold
              if (
                data.price > 0 &&
                Math.abs(percent - st.percentThreshold) > 0.5
              ) {
                st.percentThreshold =
                  (percent / Math.abs(percent)) *
                  Math.floor(Math.abs(percent) / 0.5) *
                  0.5;
                msgs.push(
                  `${data.name}:\n${data.price} ${percent}%(${toFixed(
                    data.price - data.closed,
                    2
                  )})  ${percent - st.percentThreshold > 0 ? "↑" : "↓"}`
                );
              }

              let tt = st.tt;
              let d = new Date();
              if (!tt.time) {
                tt.time = d.getTime();
                tt.prevTotal = data.volTotal;
              } else if (d.getTime() - tt.time > 15 * 1000) {
                tt.time = d.getTime();
                let diff = data.volTotal - tt.prevTotal;
                let scanSize = toFixed(diff / tt.prevTotal, 0);
                if (scanSize > 3) {
                  msgs.push(`${data[0]}:\nVol ${scanSize}* ${diff}`);
                }
              }

              msgs.map(text => {
                console.log(text);
                notifyMe(data.time, text);
                return "";
              });

              return data;
            });

          document.title = titles.join(",");
          let d = new Date();

          this.setState({
            ...this.state,
            items,
            timeStr: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
          });
        });
      this.refresh();
    }, vars["time"]);
  }
  componentDidMount() {
    this.refresh();
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  render() {
    return (
      <div>
        <div>
          {this.state.timeStr}
          <span>
            <SelectTest />
          </span>
        </div>
        <table>
          <tbody>
            <tr className="rowh">
              <th>代码</th>
              <th>名</th>
              <th>价</th>
              <th>开</th>
              <th>昨</th>
              <th>高</th>
              <th>低</th>
              <th>额(亿)</th>
              <th>量(万)</th>
              <th>PE</th>
              <th>市值</th>
            </tr>
            {this.state.items.map((item, i) => (
              <Item
                key={i}
                item={item}
                className={"row" + (i % 2)}
                delete={() => {
                  this.props.dispatch(removeStock(item));
                }}
              />
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
        {toFixed(item.price, 2)}
        <span>
          (
          {(item.price - item.closed > 0 ? "+" : "") +
            toFixed(item.price - item.closed, 2)}
          )
        </span>
        <span> {item.percent}%</span>
      </td>
      <td className={item.openColor}>{toFixed(item.open, 2)}</td>
      <td>{toFixed(item.closed, 2)}</td>
      <td className={item.highColor}>{toFixed(item.highPrice, 2)}</td>
      <td className={item.lowColor}>{toFixed(item.lowPrice, 2)}</td>

      <td>{toFixed(item.total / 100000000, 3)}</td>
      <td>{toFixed(item.volTotal / 1000000, 3)}</td>
      <td>{item.pe}</td>
      <td>{toFixed(item.marketValue / 10000 / 10000, 2)}</td>
      <td onClick={() => props.delete(item)}>
        <span style={{ cursor: "pointer" }}>x</span>
      </td>
    </tr>
  );
}

const VisibleStockList = connect(mapStateToProps)(StockList);
export default VisibleStockList;
