const router = require("express").Router();
const { userLogin, userAuth, routeAuth } = require("../utils/Auth");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createBulkUsers,
  getAllUsers,
  adminDashboard,
} = require("../controllers/userController");
const {
  createContest,
  getContest,
  updateContest,
  deleteContest,
  getAllContests,
  getContestForDashboard,
} = require("../controllers/contestController");
const {
  createQuestion,
  getQuestion,
  updateQuestion,
  getAllMCQS,
  getAllChallenges,
  deleteQuestion,
} = require("../controllers/questionController");
const {
  createQuiz,
  getQuiz,
  updateQuiz,
  getAllQuizzes,
  deleteQuiz,
} = require("../controllers/quizController");
const {
  createMultipleTestCases,
  updateTestCase,
  getTestCases,
  deleteTestCase,
} = require("../controllers/testcaseController");
const {
  createSubmission,
  getSubmission,
} = require("../controllers/submissionController");
const { getErrorLogs } = require("../controllers/errorLogsController");
const {
  compile,
  executeContestChallenge,
} = require("../controllers/compileController");
const {
  exportSubmissions,
  exportUsers,
  exportSampleUsersDetails,
} = require("../controllers/exportController");
const {
  createExecution,
  getExecution,
  getAllExecutions,
  updateExecution,
} = require("../controllers/executionController");

//? Public Routes
//* =============Login=============  *//
router.post("/api/v1/login", userLogin);

//? Private Routes
//* ==========USER========== *//
//* Create User
router.post(
  "/api/v1/user/create",
  userAuth,
  routeAuth("createUser"),
  createUser
);
//* Get User
router.get("/api/v1/user/get", userAuth, routeAuth("getUser"), getUser);
//* Update User
router.post(
  "/api/v1/user/update",
  userAuth,
  routeAuth("updateUser"),
  updateUser
);
//* Delete User
router.post(
  "/api/v1/user/delete/",
  userAuth,
  routeAuth("deleteUser"),
  deleteUser
);
//* Create Multiple Users
router.post(
  "/api/v1/users/createAll",
  userAuth,
  routeAuth("createBulkUsers"),
  createBulkUsers
);
//* Get Mulitple Users
router.post(
  "/api/v1/users/getAll",
  userAuth,
  routeAuth("getAllUsers"),
  getAllUsers
);
router.get(
  "/api/v1/user/admindashboard",
  userAuth,
  routeAuth("adminDashboard"),
  adminDashboard
);
//* =============Contest=============== *//
router.post(
  "/api/v1/contest/create",
  userAuth,
  routeAuth("createContest"),
  createContest
);
router.get(
  "/api/v1/contest/get",
  userAuth,
  routeAuth("getContest"),
  getContest
);
router.get(
  "/api/v1/contest/dashboard",
  userAuth,
  routeAuth("getContestForDashboard"),
  getContestForDashboard
);
router.get(
  "/api/v1/contests/getAll",
  userAuth,
  routeAuth("getAllContests"),
  getAllContests
);
router.post(
  "/api/v1/contest/update",
  userAuth,
  routeAuth("updateContest"),
  updateContest
);
router.post(
  "/api/v1/contest/delete",
  userAuth,
  routeAuth("deleteContest"),
  deleteContest
);

//* ================Quiz================
router.post(
  "/api/v1/quiz/create",
  userAuth,
  routeAuth("createQuiz"),
  createQuiz
);
router.get("/api/v1/quiz/get", userAuth, routeAuth("getQuiz"), getQuiz);
router.post(
  "/api/v1/quiz/update",
  userAuth,
  routeAuth("updateQuiz"),
  updateQuiz
);
router.get(
  "/api/v1/quiz/all",
  userAuth,
  routeAuth("getAllQuizzes"),
  getAllQuizzes
);
router.post(
  "/api/v1/quiz/delete",
  userAuth,
  routeAuth("deleteQuiz"),
  deleteQuiz
);
//* ==============Question===============
router.post(
  "/api/v1/question/create",
  userAuth,
  routeAuth("createQuestion"),
  createQuestion
);
router.get(
  "/api/v1/question/get",
  userAuth,
  routeAuth("getQuestion"),
  getQuestion
);
router.post(
  "/api/v1/question/update",
  userAuth,
  routeAuth("updateQuestion"),
  updateQuestion
);
router.post(
  "/api/v1/question/delete",
  userAuth,
  routeAuth("deleteQuestion"),
  deleteQuestion
);
router.get("/api/v1/mcq/all", userAuth, routeAuth("getAllMCQS"), getAllMCQS);
router.get(
  "/api/v1/challenges/all",
  userAuth,
  routeAuth("getAllChallenges"),
  getAllChallenges
);
//* ==============Testcase==============*//
router.post(
  "/api/v1/testcase/create",
  userAuth,
  routeAuth("createMultipleTestCases"),
  createMultipleTestCases
);
router.get(
  "/api/v1/testcase/get",
  userAuth,
  routeAuth("getTestCases"),
  getTestCases
);
router.post(
  "/api/v1/testcase/update",
  userAuth,
  routeAuth("updateTestCase"),
  updateTestCase
);
router.post(
  "/api/v1/testcase/delete",
  userAuth,
  routeAuth("deleteTestCase"),
  deleteTestCase
);
//* =============Execution===============*//
router.post(
  "/api/v1/execution/create",
  userAuth,
  routeAuth("createExecution"),
  createExecution
);
router.post(
  "/api/v1/execution/get",
  userAuth,
  routeAuth("getExecution"),
  getExecution
);
router.post(
  "/api/v1/execution/update",
  userAuth,
  routeAuth("updateExecution"),
  updateExecution
);
//* =============Submission===============*//
router.post(
  "/api/v1/submission/create",
  userAuth,
  routeAuth("createSubmission"),
  createSubmission
);
router.post(
  "/api/v1/submission/get",
  userAuth,
  routeAuth("getSubmission"),
  getSubmission
);
//* ========DOWNLOAD======== */
router.post(
  "/api/v1/submission/export",
  userAuth,
  routeAuth("exportSubmissions"),
  exportSubmissions
);
router.get(
  "/api/v1/sample_excel/download",
  userAuth,
  routeAuth("exportSampleUsersDetails"),
  exportSampleUsersDetails
);
router.post(
  "/api/v1/user/export",
  userAuth,
  routeAuth("exportUsers"),
  exportUsers
);
//* ==============Compiler===============*//
router.post("/api/v1/compiler", userAuth, routeAuth("compiler"), compile);
router.post(
  "/api/v1/run-code",
  userAuth,
  routeAuth("executeContestChallenge"),
  executeContestChallenge
);

//* =============== Error Logs =========== *//
router.get("/api/v1/errorLogs", userAuth, routeAuth("errorLogs"), getErrorLogs);

module.exports = router;
