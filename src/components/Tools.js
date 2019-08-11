import React from "react";
const google =
  "javascript:window.open(`https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=${encodeURIComponent(getSelection().toString())}`,'gt');";
export default class Tools extends React.Component {
  render() {
    return (
      <div>
        <div>Tools</div>
        <ul>
          <li>
            <a href={google}>Google Translate</a>
          </li>
        </ul>
      </div>
    );
  }
}
