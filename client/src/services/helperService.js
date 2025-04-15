import axios from "axios";
import { decryption, encryption } from "./crypto-js/index";
const baseURL = process.env.REACT_APP_URL || "http://localhost:5000";
// REACT_APP_URL=http://172.16.15.173
const helperService = {
  rejectionHandler: ({ response }) => {
    return Promise.reject({
      status: response.status,
      data: response.data,
    });
  },
  //* =================== PUBLIC ROUTE ==================== *//
  login: async (payload) => {
    payload = {
      encryptedData: encryption(payload),
    };
    try {
      let { status, data } = await axios.post(
        `${baseURL}/api/v1/login`,
        payload
      );
      data = decryption(data);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },

  //* ================= PRIVATE ROUTES ======================== *//

  //** USERS */
  createUser: async (payload, config) => {
    try {
      let {
        status,
        data: { message },
      } = await axios.post(`${baseURL}/api/v1/user/create`, payload, config);
      if (status === 201) {
        return Promise.resolve({
          status,
          message,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getUser: async (payload, config) => {
    let url = `${baseURL}/api/v1/user/get`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.regno) url += `?regno=${payload.regno}`;
    try {
      let { status, data } = await axios.get(url, config);
      data = decryption(data);
      if (status === 200) {
        return Promise.resolve({
          status,
          data: data.userDetails,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      if (status === 401) message = "Unauthorized";
      return Promise.reject({
        status,
        message,
      });
    }
  },
  updateUser: async (payload, config) => {
    try {
      let {
        data: { message },
        status,
      } = await axios.post(`${baseURL}/api/v1/user/update`, payload, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          message,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  deleteUser: async ({ regno }, config) => {
    try {
      let {
        data: { message },
        status,
      } = await axios.post(`${baseURL}/api/v1/user/delete?${regno}`, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          message,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  createBulkUsers: async ({ file }, headers) => {
    try {
      let { data, status } = await axios({
        url: `${baseURL}/api/v1/users/createAll`,
        method: "POST",
        headers,
        data: file,
      });
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getUsers: async ({ page, limit, ...payload }, config) => {
    try {
      let { status, data } = await axios.post(
        `${baseURL}/api/v1/users/getAll?page=${page}&limit=${limit}`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch ({ response }) {
      let {
        status,
        data: { message },
      } = response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  adminDashboard: async (payload, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/user/admindashboard`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //** CONTESTS */
  createContest: async (payload, config) => {
    try {
      let {
        data: { message },
        status,
      } = await axios.post(`${baseURL}/api/v1/contest/create`, payload, config);
      return Promise.resolve({
        status,
        message,
      });
    } catch ({ response }) {
      let {
        status,
        data: { message },
      } = response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getContest: async (payload, config) => {
    let url = `${baseURL}/api/v1/contest/get`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.code) url += `?code=${payload.code}`;
    try {
      let { data, status } = await axios.get(url, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  updateContest: async (payload, config) => {
    try {
      let {
        data: { message },
        status,
      } = await axios.post(`${baseURL}/api/v1/contest/update`, payload, config);
      return Promise.resolve({
        status,
        message,
      });
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getContestWithCode: async (payload, config) => {
    let url = `${baseURL}/api/v1/contest/dashboard`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.code) url += `?code=${payload.code}`;
    try {
      let { data, status } = await axios.get(url, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getAllContests: async ({ page, past, limit }, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/contests/getAll?page=${page}&limit=${limit}&past=${past}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },

  //** QUIZZES */
  createQuizz: async (payload, config) => {
    try {
      let { status, data } = await axios.post(
        `${baseURL}/api/v1/quiz/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getQuizzes: async ({ id }, config) => {
    try {
      let { status, data } = await axios.get(
        `${baseURL}/api/v1/quiz/all?id=${id}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  updateQuiz: async (payload, config) => {
    try {
      let {
        data: { message },
        status,
      } = await axios.post(`${baseURL}/api/v1/quiz/update`, payload, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          message,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  deleteQuiz: async (payload, config) => {
    try {
      let {
        status,
        data: { message },
      } = await axios.post(`${baseURL}/api/v1/quiz/delete`, payload, config);
      if (status === 202) {
        return Promise.resolve({
          status,
          message,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getQuizQuestions: async ({ id, page = 1 }, config) => {
    try {
      let { status, data } = await axios.get(
        `${baseURL}/api/v1/mcq/all?id=${id}&page=${page}`,
        config
      );
      data = decryption(data);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  createQuizQuestion: async (payload, config) => {
    try {
      let { status, data } = await axios.post(
        `${baseURL}/api/v1/question/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },

  //** CHALLENGES */
  createChallenge: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/question/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getChallenges: async ({ id }, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/challenges/all?id=${id}`,
        config
      );
      data = decryption(data);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //** QUESTIONS */
  getQuestion: async ({ id, type }, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/question/get?id=${id}&type=${type} `,
        config
      );
      data = decryption(data);
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  updateQuestion: async (payload, config) => {
    let type_id = payload.type_id;
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/question/update?type=${type_id}`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  deleteQuestion: async (payload, config) => {
    let type_id = payload.type_id;
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/question/delete?type=${type_id}`,
        payload,
        config
      );
      if (status === 202) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //** COMPILE */
  compile: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/compiler`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data: data.output,
        });
      }
    } catch (err) {
      let { status, data } = err.response;
      return Promise.reject({
        status,
        data,
      });
    }
  },
  runCode: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/run-code`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //** TESTCASE */
  createTestcase: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/testcase/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getTestCases: async ({ questionId }, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/testcase/get?id=${questionId}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  updateTestcase: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/testcase/update`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  deleteTestcase: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/testcase/delete`,
        payload,
        config
      );
      if (status === 202) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //* SUBMISSIONS *//
  createSubmission: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/submission/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  getContestSubmissions: async ({ page, limit, contest_id }, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/submission/get?page=${page}&limit=${limit}`,
        { contest_id },
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //* ERROR LOGS */
  getErrorLogs: async (payload, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/errorLogs?created_by=${payload.created_by}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  //* DOWNLOAD */
  downloadStatistics: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/submission/export`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  downloadStudentsDetails: async (payload, config) => {
    try {
      let { data, status } = await axios.post(
        `${baseURL}/api/v1/user/export`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
  downloadSampleExcel: async (payload, config) => {
    try {
      let { data, status } = await axios.get(
        `${baseURL}/api/v1/sample_excel/download`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      let {
        status,
        data: { message = "Internal Server Error" },
      } = err.response;
      return Promise.reject({
        status,
        message,
      });
    }
  },
};
export default helperService;
