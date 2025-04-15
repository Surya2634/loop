import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const SelectReducer = (props) => {
  return (
    <div>
      <FormControl
        variant="outlined"
        size={props.size ? props.size : "medium"}
        className={props.className}
      >
        <InputLabel id="demo-simple-select-outlined-label">
          {props.name}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id={props.id ?? "select id"}
          value={props.value ?? ""}
          onChange={props.handleSelect}
          defaultValue={props.defaultValue ?? ""}
          disabled={props.disabled}
          label={props.name}
        >
          {props.array.map((item, id) => {
            return (
              <MenuItem value={item} key={item + id}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectReducer;
