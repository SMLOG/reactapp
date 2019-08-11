import Search from "react-search";
import React, { Component } from "react";

import { loadScripts } from "./loadScripts";

export default class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.HiItems = this.HiItems.bind(this);
    this.getItemsAsync = this.getItemsAsync.bind(this);
    this.state = { repos: [] };
  }
  HiItems(items) {
    console.log(items);
  }

  getItemsAsync(searchValue, cb) {
    //let url2 = `https://api.github.com/search/repositories?q=${searchValue}&language=javascript`;
    let name = "suggestdata_" + +new Date();
    let url = `https://suggest3.sinajs.cn/suggest/type=&key=${searchValue}&name=${name}`;

    loadScripts([url]).then(() => {
      let items = window[name].split(";");
      //万科A,11,000002,sz000002,万科A,,万科A,99
      let options = items.map((eStr, i) => {
        let item = eStr.split(",");
        return { id: i, value: item[0] };
      });
      this.setState({ repos: options });
      console.log(items);
      cb(searchValue);
    });

    /*fetch(url2)
      .then(response => {
        return response.json();
      })
      .then(results => {
        if (results.items != undefined) {
          let items = results.items.map((res, i) => {
            return { id: i, value: res.full_name };
          });
          this.setState({ repos: items });
          cb(searchValue);
        }
      });*/
  }

  render() {
    return (
      <div>
        <Search
          items={this.state.repos}
          multiple={false}
          getItemsAsync={this.getItemsAsync}
          onItemsChanged={this.HiItems}
        />
      </div>
    );
  }
}
