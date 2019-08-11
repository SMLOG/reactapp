import React from "react";
import Autosuggest from "react-autosuggest";
import { loadScripts } from "./loadScripts";
import { connect } from "react-redux";
import { addStock } from "../actions";

const theme = {
  container: {
    position: "relative"
  },
  input: {
    width: 240,
    height: 25,
    padding: "10px 20px",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    border: "1px solid #aaa",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  inputFocused: {
    outline: "none"
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: "none"
  },
  suggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: 51,
    width: 280,
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px"
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd"
  }
};

function renderSuggestion(suggestion) {
  return (
    <div>
      <span style={{ width: "30%", display: "inline-block" }}>
        {suggestion.oname}
      </span>
      <span style={{ width: "30%", display: "inline-block" }}>
        {suggestion.code}
      </span>
      <span style={{ width: "30%", display: "inline-block" }}>
        {suggestion.name}
      </span>
    </div>
  );
}

class SelectStock extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    try {
      this.props.dispatch(addStock(JSON.parse(newValue)));
    } catch (e) {}
    return;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let name = "suggestdata_" + +new Date();
    let url = `https://suggest3.sinajs.cn/suggest/type=&key=${value}&name=${name}`;

    loadScripts([url]).then(() => {
      let items = window[name].split(";");
      //万科A,11,000002,sz000002,万科A,,万科A,99
      let options = items.map((eStr, i) => {
        let item = eStr.split(",");
        return {
          id: i,
          oname: item[0],
          name: item[4],
          countryID: item[1],
          code: item[3]
        };
      });
      options.unshift({ id: 0, oname: "选项", name: "名称", code: "代码" });
      this.setState({
        suggestions: options
      });
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  onGetSuggestionValue = suggest => {
    this.props.dispatch(addStock(suggest));
    return this.state.value;
  };
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "拼音/代码/名称",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.onGetSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={theme}
      />
    );
  }
}

SelectStock = connect()(SelectStock);
export default SelectStock;
