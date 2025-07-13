import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// 题目相关API
export const fetchQuestions = async () => {
  // 假设后端有获取题目列表的接口（如 /data-management/questions），如无可后续补充
  return axios.get(`${BASE_URL}/data-management/questions`);
};

// 评测结果相关API
export const fetchEvaluationResults = async () => {
  // 假设后端有获取评测结果列表的接口（如 /data-management/evaluation-results），如无可后续补充
  return axios.get(`${BASE_URL}/data-management/evaluation-results`);
};

// 文档相关API
export const fetchDocuments = async () => {
  return axios.get(`${BASE_URL}/document-analysis/documents`);
};

// 获取单个文档解析结果
export const fetchDocumentAnalysis = async (documentId) => {
  return axios.get(`${BASE_URL}/document-analysis/documents/${documentId}`);
};

// 上传文档并生成题目
export const uploadDocument = async (file, questionType = 'multiple_choice', numQuestions = 5) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('question_type', questionType);
  formData.append('num_questions', numQuestions);
  return axios.post(`${BASE_URL}/document-analysis/upload`, formData);
};

// 获取可用模型列表
export const fetchModels = async () => {
  return axios.get(`${BASE_URL}/model-evaluation/models`);
};

// 评测模型
export const evaluateModel = async (modelId, questions, evaluationMetrics = ["accuracy", "fluency", "relevance"]) => {
  return axios.post(`${BASE_URL}/model-evaluation/evaluate`, {
    model_id: modelId,
    questions,
    evaluation_metrics: evaluationMetrics
  });
};

// 其他API可按需补充 
