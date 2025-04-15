import React from "react";
import AceEditor from "react-ace";
import * as ace from "ace-builds/src-noconflict/ace";
ace.config.set("basePath", "/assets/ui/");
ace.config.set("modePath", "");
ace.config.set("themePath", "");
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-textmate";

const Editor = (props) => {
  return (
    <div>
      <AceEditor
        height={props.height}
        width="100%"
        placeholder="Your code goes here.."
        mode={props.language}
        theme={props.theme}
        name="Editor"
        onChange={(value) => props.onChangeHandler(value)}
        fontSize={20}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={props.value}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default Editor;
