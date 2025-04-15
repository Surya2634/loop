import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import "./Testcase.css";
import Loader from "../../../../../../../images/loader.webp";
import CompilerError from "../CompileError/CompilerError";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#E1F8FF",

    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const Testcase = ({
  testCaseOutput,
  testcases,
  isError,
  isSampleFailed,
  errors,
  isLoading,
}) => {
  const [expanded, setExpanded] = useState("panel1");
  const [output, setOutput] = useState({});
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  useEffect(() => {
    setOutput(testCaseOutput);
  }, [testCaseOutput]);
  return (
    <div className="h-100">
      {(!isError && Object.keys(output).length <= 0) || isError ? (
        <CompilerError errors={errors} />
      ) : (
        <>
          <h6 className="p-2 font-weight-bolder test-case-heading mt-5">
            Sample Test Case
          </h6>
          <div className="position-relative">
            {testcases?.sample?.map((testcase, index) => {
              let sampleOutput =
                (output?.sample && output?.sample[index]) || {};
              return (
                <Accordion
                  square
                  key={"sample" + index}
                  expanded={expanded === `panel${index + 1}`}
                  onChange={handleChange(`panel${index + 1}`)}
                >
                  <AccordionSummary
                    aria-controls={`panel${index + 1}d-content`}
                    id={`panel${index + 1}d-header`}
                  >
                    <Typography
                      component={"span"}
                      variant={"body2"}
                      className="test-case-heading "
                    >
                      {isLoading ? (
                        <img
                          src={Loader}
                          alt="loader"
                          height={40}
                          className="p-2 rounded-circle"
                        />
                      ) : (
                        <div className="d-flex align-items-center">
                          <button
                            className={`d-flex align-items-center justify-content-center btn btn-${
                              sampleOutput?.errors ? "danger" : "success"
                            }`}
                          >
                            {sampleOutput?.errors ? (
                              <CancelIcon />
                            ) : (
                              <CheckCircleOutlineIcon />
                            )}
                          </button>
                          <span className="ml-3 text-dark">
                            Test Case {index + 1}
                          </span>
                        </div>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="d-flex flex-column">
                    <p>{`Input : ${testcase?.input}`}</p>
                    <p>Output :</p>
                    <pre>{JSON.parse(testcase?.output || '""')}</pre>
                    <p>Your output :</p>
                    <pre>
                      {sampleOutput?.actualOutput
                        ? JSON.parse(sampleOutput?.actualOutput || '""')
                        : ""}
                    </pre>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
          {!isSampleFailed ? (
            <>
              {/* Hidden test Case Accordian */}
              <h6 className="p-2 font-weight-bolder test-case-heading mt-5">
                Hidden Test Case
              </h6>
              <div className="position-relative">
                {Array.apply(0, Array(testcases?.hidden || 0)).map(
                  (testcase, index) => {
                    let length = (testcases?.sample?.length || 0) + index + 1;
                    let hiddenOutput =
                      (output?.hidden && output?.hidden[index]) || false;
                    return (
                      <Accordion
                        square
                        key={"hidden" + index}
                        expanded={expanded === `panel${length}`}
                      >
                        <AccordionSummary
                          aria-controls={`panel${length}d-content`}
                          id={`panel${length}d-header`}
                        >
                          <div className="test-case-heading w-100 mr-auto">
                            {isLoading ? (
                              <img
                                src={Loader}
                                alt="loader"
                                height={40}
                                className="p-2 rounded-circle"
                              />
                            ) : (
                              <div className="d-flex align-items-center">
                                <button
                                  className={`d-flex align-items-center justify-content-center btn btn-${
                                    hiddenOutput ? "success" : "danger"
                                  }`}
                                >
                                  {hiddenOutput ? (
                                    <CheckCircleOutlineIcon />
                                  ) : (
                                    <CancelIcon />
                                  )}
                                </button>
                                <span className="ml-3 text-dark">
                                  Test Case {length}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="lock-icon p-2 float-right">
                            <LockRoundedIcon />
                          </div>
                        </AccordionSummary>
                      </Accordion>
                    );
                  }
                )}
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Testcase;
