import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: "100px",
  },
  textField: {
    margin: theme.spacing(1),
  },
  fieldColor: {
    width: "100%",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00511B",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00511B",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#00511B",
    },
  },
}));

const PasswordField = (props) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  return (
    <div>
      <FormControl
        className={(classes.textField, classes.fieldColor)}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          {props.type}
        </InputLabel>
        <OutlinedInput
          id={props.id ?? "inputid"}
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={props.onClickHandler}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={props.labelWidth}
        />
      </FormControl>
    </div>
  );
};

export default PasswordField;
