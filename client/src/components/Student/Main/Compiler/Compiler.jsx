import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./Compiler.css";
import Male from "../../../../images/man.webp";
import TextField from "@material-ui/core/TextField";
import ComImg from "../../../../images/Loop1.webp";
import { AuthContext, useLoader } from "../../../../contexts/AuthContext";
import helperService from "../../../../services/helperService";
import { parseCode, template } from "../../../../services/utils";
import Editor from "../../../Reducer/Editor/Editor";
import GoBack from "../../../Reducer/GoBack/GoBack";
import CustomButton from "../../../Reducer/CustomButton/CustomButton";
import { useHistory } from "react-router-dom";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";

const Compiler = (props) => {
  const history = useHistory();
  const [authState] = useContext(AuthContext);
  const [loader, showLoader, hideLoader] = useLoader();
  const themes = [
    "xcode",
    "monokai",
    "github",
    "nord_dark",
    "textmate",
    "one_dark",
  ];
  const languages = ["c", "java"];
  const [themeName, setThemeName] = React.useState("nord_dark");
  const [language, setLanguage] = React.useState(
    sessionStorage.getItem("compile")
      ? JSON.parse(sessionStorage.getItem("compile"))?.lang
      : "java"
  );
  const [input, setInput] = React.useState(
    sessionStorage.getItem("compile")
      ? JSON.parse(sessionStorage.getItem("compile"))?.input
      : ""
  );

  const [output, setOutput] = React.useState("");
  const [code, setCode] = React.useState(
    sessionStorage.getItem("compile")
      ? JSON.parse(sessionStorage.getItem("compile"))?.code
      : template.java
  );

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: "95%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    props.setSideToggle(true);
    return () => props.setSideToggle(false);
  });

  const handleChange = (event) => {
    setThemeName(event.target.value);
  };

  const handleLanguage = (event) => {
    setLanguage(event.target.value);
    setCode(template[event.target.value]);
    sessionStorage.removeItem("compile");
  };
  const compile = async () => {
    showLoader();
    try {
      let parsedCode = parseCode(code);
      sessionStorage.setItem(
        "compile",
        JSON.stringify({ code, input, lang: language })
      );
      const { status, data } = await helperService.compile(
        { code: parsedCode, input, lang: language },
        { headers: { Authorization: authState?.user?.token } }
      );
      if (status === 200) {
        setOutput(data);
      }
    } catch (err) {
      setOutput(err.data.err);
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="container-fluid p-0 compiler-container">
      {loader}
      <div className="d-flex">
        <div className="d-flex mr-auto mt-2">
          <GoBack onClickHandler={() => history.goBack()} />
          <div className="complier-img">
            <img
              src={ComImg}
              alt="compilerImg"
              height="40"
              width="100"
              className="img-fluid ml-3 pt-2"
            />
          </div>
        </div>
        <div className="user-info position-relative">
          <div className="d-flex mx-4 pt-3 user-det justify-content-end">
            <div className="gender-info mr-3">
              <img src={Male} alt="male" height="50" width="50" />
            </div>
            <div className="user-profile d-flex flex-column">
              <span className="user-name">{authState?.user?.name}</span>
              <span className="register-no">{authState?.user?.regno}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="col-md-9 p-0">
          <Editor
            language={language}
            theme={themeName}
            height="calc(100vh - 66px)"
            onChangeHandler={(value) => setCode(value)}
            value={code}
          />
        </div>
        <div className="col-md-3 p-3">
          <div className="d-flex w-100">
            <div className="col-md-6 p-0">
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Select Language
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={language}
                  onChange={handleLanguage}
                >
                  {languages.map((name) => {
                    return (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6 p-0">
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Select theme
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={themeName}
                  onChange={handleChange}
                >
                  {themes.map((name) => {
                    return (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="d-flex flex-column">
            <TextField
              className="mt-3"
              id="outlined-multiline-static"
              label="Enter your input"
              multiline
              rows={6}
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="d-flex align-items-end justify-content-end border-bottom">
              <CustomButton
                className="btn-hover color-11 my-3 d-flex align-items-center py-2 px-3"
                onClickHandler={compile}
              >
                <CodeRoundedIcon />
                <span className="ml-2"> COMPILE</span>
              </CustomButton>
            </div>
            <div className="d-flex flex-column">
              <span className="mt-3 text-highlight font-weight-bolder">
                OUTPUT :
              </span>

              <TextField
                className="mt-2 text-output"
                id="outlined-multiline-static"
                multiline
                rows={10}
                variant="outlined"
                value={output}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
