import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import fileDownload from "js-file-download";

import GetAppIcon from "@material-ui/icons/GetApp";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
import ErrorLogDialogBox from "../../../../../Reducer/ErrorLogDialogBox/ErrorLogDialogBox";
import helperService from "../../../../../../services/helperService";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import Excel from "../../../../../../images/excel.webp";
import "./DropFileInput.css";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const [authState] = useContext(AuthContext);
  const [fileList, setFileList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [, setLogs] = useState({});

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];

    if (
      newFile &&
      newFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFileList([newFile]);
    } else {
      props.snackBar("Please select a valid  excel file", "error");
    }
  };

  const bulkUserUpload = async () => {
    const flag = await props.onFileChange(fileList);
    if (flag) setOpen(true);
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const fileRemove = (file) => {
    const updatedList = [fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.setLogs({});
  };
  const downloadSampleExcel = async () => {
    try {
      const { data, status } = await helperService.downloadSampleExcel(
        {},
        {
          headers: { Authorization: authState?.user?.token },
          responseType: "arraybuffer",
        }
      );
      if (status == 200) {
        props.snackBar("Downloaded Successfully!!", "success");
        fileDownload(data, "Sample_Bulk_Upload.xlsx");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  useEffect(() => {
    if (props.reqflag) {
      props.removeFileHandler(setFileList);
      props.setReqflag(false);
    }
  }, [props.reqflag]);
  useEffect(() => {
    setLogs(props?.logs);
  });
  return (
    <>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img alt="someImage" src={Excel} />
          <p>Drag & Drop your files here</p>
        </div>
        <input
          type="file"
          value=""
          onChange={onFileDrop}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item) => (
            <div
              key={item.lastModified}
              className="drop-file-preview__item d-flex w-100 align-items-center justify-content-center"
            >
              <img alt="someImage" src={Excel} />
              <div className="drop-file-preview__item__info d-flex flex-column">
                <span>{item.name}</span>
                <div className="d-flex justify-content-between">
                  <span>{item.size}B</span>

                  <CustomButton onClickHandler={() => fileRemove(item)}>
                    <DeleteIcon />
                  </CustomButton>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex align-items-center justify-content-center mt-3">
            <CustomButton
              className="btn-hover color-11 mt-2 d-flex align-items-center py-2 px-3"
              onClickHandler={bulkUserUpload}
            >
              <CreateNewFolderIcon />
              {"create Users"}
            </CustomButton>
          </div>
          <div className="d-flex align-items-end justify-content-end mt-3 p-2">
            {props?.logs?.totalLogs >= 0 && (
              <span
                role="button"
                className="badge badge-pill badge-secondary p-2"
                onClick={handleClickOpen}
              >
                Logs
              </span>
            )}

            <ErrorLogDialogBox
              open={open}
              handleClose={handleClose}
              log={props?.logs}
            />
          </div>
        </div>
      ) : (
        <div className="drop-file-preview__item mt-2 d-flex flex-column align-items-center justify-content-center">
          No file choosen. Excel file only be uploaded.
          <div className="d-flex align-items-center justify-content-center mt-3">
            <CustomButton
              className="btn-hover color-11 mt-4 d-flex align-items-center py-2 px-3"
              onClickHandler={downloadSampleExcel}
            >
              <GetAppIcon />
              Download Sample file
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
