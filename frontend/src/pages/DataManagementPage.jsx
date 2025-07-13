import { useState, useEffect } from 'react';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import { fetchQuestions, fetchEvaluationResults } from '../api';

// 题目管理组件
const QuestionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchQuestions()
      .then(res => setQuestions(res.data))
      .catch(err => setError('获取题目失败'))
      .finally(() => setLoading(false));
  }, []);

  const handleMenuOpen = (event, questionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestionId(questionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'primary';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'multiple_choice':
        return '选择题';
      case 'true_false':
        return '判断题';
      case 'short_answer':
        return '简答题';
      case 'essay':
        return '论述题';
      case 'mixed':
        return '混合题型';
      default:
        return type;
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        题目管理
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        管理评测题目，支持导入导出和格式转换。
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="搜索题目..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <Button variant="outlined" startIcon={<UploadIcon />} sx={{ mr: 1 }}>
            导入
          </Button>
          <Button variant="outlined" startIcon={<AddIcon />} color="primary">
            新建题目集
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.light' }}>
              <TableCell>题目集名称</TableCell>
              <TableCell>题型</TableCell>
              <TableCell>题目数量</TableCell>
              <TableCell>难度</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>创建日期</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center">加载中...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={7} align="center">{error}</TableCell></TableRow>
            ) : questions.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">暂无数据</TableCell></TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id} hover>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {question.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(question.type)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{question.count}</TableCell>
                  <TableCell>
                    <Chip
                      label={question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
                      size="small"
                      color={getDifficultyColor(question.difficulty)}
                    />
                  </TableCell>
                  <TableCell>{question.category}</TableCell>
                  <TableCell>{question.createdAt}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, question.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>编辑</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>导出</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>格式转换</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>删除</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// 评测结果管理组件
const ResultsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchEvaluationResults()
      .then(res => setEvaluationResults(res.data))
      .catch(err => setError('获取评测结果失败'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        评测结果管理
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        管理模型评测结果，支持查看详情和导出分析报告。
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="搜索评测结果..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" startIcon={<FilterListIcon />}>
          筛选
        </Button>
      </Box>

      <Grid container spacing={2}>
        {loading ? (
          <Grid item xs={12} align="center">加载中...</Grid>
        ) : error ? (
          <Grid item xs={12} align="center">{error}</Grid>
        ) : evaluationResults.length === 0 ? (
          <Grid item xs={12} align="center">暂无数据</Grid>
        ) : (
          evaluationResults.map((result) => (
            <Grid item xs={12} md={6} lg={4} key={result.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {result.title}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    评测日期: {result.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    题目集: {result.questionSet}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      评测模型:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {result.models.map((model) => (
                        <Chip key={model} label={model} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button size="small" startIcon={<AssessmentIcon />} sx={{ mr: 1 }}>
                      查看详情
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      导出报告
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

// 格式转换组件
const FormatConversion = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        格式转换
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        将题目和评测结果转换为不同格式，支持多种导入导出格式。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              题目格式转换
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                源格式
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JSON" variant="outlined" color="primary" />
                <Chip label="CSV" variant="outlined" />
                <Chip label="Excel" variant="outlined" />
                <Chip label="Markdown" variant="outlined" />
                <Chip label="自定义格式" variant="outlined" />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                目标格式
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JSON" variant="outlined" />
                <Chip label="CSV" variant="outlined" color="primary" />
                <Chip label="Excel" variant="outlined" />
                <Chip label="Markdown" variant="outlined" />
                <Chip label="自定义格式" variant="outlined" />
              </Box>
            </Box>

            <Button variant="contained" color="primary" startIcon={<SwapHorizIcon />}>
              开始转换
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              评测结果格式转换
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                源格式
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JSON" variant="outlined" />
                <Chip label="CSV" variant="outlined" color="primary" />
                <Chip label="Excel" variant="outlined" />
                <Chip label="PDF" variant="outlined" />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                目标格式
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JSON" variant="outlined" color="primary" />
                <Chip label="CSV" variant="outlined" />
                <Chip label="Excel" variant="outlined" />
                <Chip label="PDF" variant="outlined" />
              </Box>
            </Box>

            <Button variant="contained" color="primary" startIcon={<SwapHorizIcon />}>
              开始转换
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 主数据管理页面
const DataManagementPage = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  // 根据路径设置当前标签页
  useState(() => {
    if (location.pathname.includes('/results')) {
      setTabValue(1);
    } else if (location.pathname.includes('/conversion')) {
      setTabValue(2);
    } else {
      setTabValue(0);
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        数据管理
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label="题目管理"
            component={RouterLink}
            to="/data-management/questions"
            icon={<QuizIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="评测结果管理"
            component={RouterLink}
            to="/data-management/results"
            icon={<AssessmentIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="格式转换"
            component={RouterLink}
            to="/data-management/conversion"
            icon={<SwapHorizIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>
      </Paper>

      <Routes>
        <Route path="/" element={<QuestionsManagement />} />
        <Route path="/questions" element={<QuestionsManagement />} />
        <Route path="/results" element={<ResultsManagement />} />
        <Route path="/conversion" element={<FormatConversion />} />
      </Routes>
    </Box>
  );
};

export default DataManagementPage;
