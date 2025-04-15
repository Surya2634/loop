import React from "react";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CreateIcon from "@material-ui/icons/Create";
const ContestTable = ({
  data,
  deleteQuestion,
  setUpdateQuestion,
  setQuestionName,
  handleClickOpen,
}) => {
  return (
    <div className="challenge-chips d-flex flex-wrap  mt-4">
      {data?.length > 0 ? (
        <>
          <div className="d-flex upcoming-header border-top w-100 border-bottom mt-2 p-2 mb-1">
            <div className="col-md-3 text-center content-nav-title">
              Quiz Name
            </div>
            <div className="col-md-3 text-center content-nav-title">
              Created At
            </div>
            <div className="col-md-2 text-center content-nav-title">
              Max Score
            </div>
            <div className="col-md-2 text-center content-nav-title">Delete</div>
            <div className="col-md-2 text-center content-nav-title">
              {setUpdateQuestion ? "Edit" : null}
              {/* <i className="fas fa-external-link-alt"></i> */}
            </div>
          </div>
          {data?.map((question) => {
            return (
              <div className="d-flex w-100 p-2 border m-1" key={question._id}>
                <div className="col-md-3 text-center content-nav-title">
                  <Link
                    to={
                      setUpdateQuestion
                        ? `/quizzes/${question._id}/add-question`
                        : `/challenges/${question._id}/update`
                    }
                  >
                    {question.name}
                  </Link>
                </div>
                <div className="col-md-3 text-center content-nav-title">
                  {new Date(question?.created_at || "").toLocaleString()}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {question.total_mcqs ?? question.max_score}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  <DeleteOutlineIcon
                    className=""
                    onClick={() => deleteQuestion(question)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {setUpdateQuestion ? (
                    <div
                      onClick={() => {
                        setUpdateQuestion(true);
                        handleClickOpen();
                        setQuestionName({
                          id: question._id,
                          name: question.name,
                        });
                      }}
                    >
                      <CreateIcon style={{ cursor: "pointer" }} />
                    </div>
                  ) : null}
                </div>
                {/* <div className="col-md-2 text-center content-nav-title">
                  <i
                    style={{ cursor: "pointer" }}
                    className="fas fa-external-link-alt"
                    onClick={() => {
                      setErrorLog(log);
                      handleClickOpen();
                    }}
                  ></i>
                </div> */}
              </div>
            );
          })}
        </>
      ) : (
        // <table className="table">
        //   <thead className="thead-dark">
        //     <tr>
        //       <th>Quiz Name</th>
        //       <th>Created At</th>
        //       <th>Max Score</th>
        //       <th>delete</th>
        //       {setUpdateQuestion ? <th>edit</th> : null}
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {data?.map((question) => {
        //       return (
        //         <tr key={question._id}>
        //           <td>
        //             <Link
        //               style={{ color: "white" }}
        //               to={
        //                 setUpdateQuestion
        //                   ? `/quizzes/${question._id}/add-question`
        //                   : `/challenges/${question._id}/update`
        //               }
        //             >
        //               <span className="pl-2 text-dark">{question.name}</span>
        //             </Link>
        //           </td>
        //           <td>
        //             {new Date(question?.created_at || "").toLocaleString()}
        //           </td>
        //           <td>{question.total_mcqs ?? question.max_score}</td>
        //           <td>
        //             <DeleteOutlineIcon
        //               onClick={() => deleteQuestion(question)}
        //               style={{ cursor: "pointer" }}
        //             />
        //           </td>
        //           {setUpdateQuestion ? (
        //             <td>
        //               <div
        //                 className="px-2"
        //                 onClick={() => {
        //                   setUpdateQuestion(true);
        //                   handleClickOpen();
        //                   setQuestionName({
        //                     id: question._id,
        //                     name: question.name,
        //                   });
        //                 }}
        //               >
        //                 <CreateIcon style={{ cursor: "pointer" }} />
        //               </div>
        //             </td>
        //           ) : null}
        //         </tr>
        //       );
        //     })}
        //   </tbody>
        // </table>
        <span>
          {setUpdateQuestion ? "Quizzes" : "Challenges"} not created yet.
        </span>
      )}
    </div>
  );
};

export default ContestTable;
