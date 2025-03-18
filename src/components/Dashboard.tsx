import React, { FC, useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  useTheme,
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  PeopleOutline as PeopleIcon,
  Assessment as AssessmentIcon,
  VpnKey as VpnKeyIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import WaitingAcceptance from './WaitingAcceptance';
import WaitingPin from './WaitingPin';
import WithPin from './WithPin';
import ProspectiveStudents from './ProspectiveStudents';

// Sample data
const monthlyStats = [
  { month: 'Jan', applications: 65, accepted: 40, rejected: 25 },
  { month: 'Feb', applications: 85, accepted: 55, rejected: 30 },
  { month: 'Mar', applications: 95, accepted: 60, rejected: 35 },
  { month: 'Apr', applications: 75, accepted: 45, rejected: 30 },
  { month: 'May', applications: 90, accepted: 58, rejected: 32 },
  { month: 'Jun', applications: 100, accepted: 65, rejected: 35 },
];

const programStats = [
  { name: 'Business Admin', value: 35 },
  { name: 'Computer Science', value: 25 },
  { name: 'Engineering', value: 20 },
  { name: 'Medicine', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const stats = {
  totalApplicants: 150,
  waitingAcceptance: 45,
  waitingPin: 30,
  withPin: 55,
  prospectiveStudents: 20,
  acceptedApplicants: 35,
  rejectedApplicants: 15,
};

// Tab IDs for navigation
enum TabId {
  DASHBOARD = 'dashboard',
  WAITING_ACCEPTANCE = 'waitingAcceptance',
  WAITING_PIN = 'waitingPin',
  WITH_PIN = 'withPin',
  PROSPECTIVE = 'prospective',
}

// Sample data for waiting acceptance table
const waitingAcceptanceData = [
  {
    id: 1,
    applicationNumber: 'APP-2023-001',
    status: 'Pending Review',
    updatedOn: '2023-06-15',
    submittedOn: '2023-06-10',
  },
  {
    id: 2,
    applicationNumber: 'APP-2023-002',
    status: 'Documents Verification',
    updatedOn: '2023-06-14',
    submittedOn: '2023-06-08',
  },
  {
    id: 3,
    applicationNumber: 'APP-2023-003',
    status: 'Interview Scheduled',
    updatedOn: '2023-06-16',
    submittedOn: '2023-06-05',
  },
  {
    id: 4,
    applicationNumber: 'APP-2023-004',
    status: 'Pending Review',
    updatedOn: '2023-06-13',
    submittedOn: '2023-06-11',
  },
  {
    id: 5,
    applicationNumber: 'APP-2023-005',
    status: 'Documents Verification',
    updatedOn: '2023-06-12',
    submittedOn: '2023-06-07',
  },
  {
    id: 6,
    applicationNumber: 'APP-2023-006',
    status: 'Interview Scheduled',
    updatedOn: '2023-06-11',
    submittedOn: '2023-06-01',
  },
  {
    id: 7,
    applicationNumber: 'APP-2023-007',
    status: 'Pending Review',
    updatedOn: '2023-06-10',
    submittedOn: '2023-06-03',
  },
];

const Dashboard: FC = () => {
  const [open, setOpen] = React.useState(true);
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [activeTab, setActiveTab] = useState<TabId>(TabId.DASHBOARD);
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const menuItems = [
    { 
      id: TabId.DASHBOARD, 
      text: 'Dashboard Overview', 
      icon: <DashboardIcon />, 
      count: stats.totalApplicants 
    },
    { 
      id: TabId.WAITING_ACCEPTANCE, 
      text: 'Waiting Acceptance', 
      icon: <PeopleIcon />, 
      count: stats.waitingAcceptance 
    },
    { 
      id: TabId.WAITING_PIN, 
      text: 'Waiting for PIN', 
      icon: <VpnKeyIcon />, 
      count: stats.waitingPin 
    },
    { 
      id: TabId.WITH_PIN, 
      text: 'Applicants with PIN', 
      icon: <PersonIcon />, 
      count: stats.withPin 
    },
    { 
      id: TabId.PROSPECTIVE, 
      text: 'Prospective Students', 
      icon: <SchoolIcon />, 
      count: stats.prospectiveStudents 
    },
  ];

  const StatCard = ({ title, value, icon, trend = null }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean } | null;
  }) => (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[10],
          transform: 'translateY(-4px)',
          transition: 'all 0.3s',
        },
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        p: 1,
        color: '#13A215',
      }}>
        {icon}
      </Box>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ mb: 2, color: '#13A215' }}>
        {value}
      </Typography>
      {trend && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUpIcon 
            sx={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              transform: trend.isPositive ? 'none' : 'rotate(180deg)',
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ color: trend.isPositive ? 'success.main' : 'error.main' }}
          >
            {trend.value}% from last month
          </Typography>
        </Stack>
      )}
    </Card>
  );

  // Dashboard Overview Content
  const DashboardContent: FC = () => (
    <>
      {/* Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ color: '#333', mb: 2 }}>
              Application Analytics
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={timeFilter}
                label="Time Period"
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplicants}
            icon={<AssessmentIcon />}
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Accepted" 
            value={stats.acceptedApplicants}
            icon={<CheckCircleIcon />}
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending PIN" 
            value={stats.waitingPin}
            icon={<VpnKeyIcon />}
            trend={{ value: 5, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Rejected" 
            value={stats.rejectedApplicants}
            icon={<CancelIcon />}
            trend={{ value: 2, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Application Trends */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Application Trends
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#13A215" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="accepted" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="rejected" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Program Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Program Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={programStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {programStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Monthly Statistics */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Monthly Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#13A215" />
                <Bar dataKey="accepted" fill="#0088FE" />
                <Bar dataKey="rejected" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  // Modify renderContent function
  const renderContent = () => {
    switch (activeTab) {
      case TabId.DASHBOARD:
        return <DashboardContent />;
      case TabId.WAITING_ACCEPTANCE:
        return <WaitingAcceptance totalWaiting={stats.waitingAcceptance} />;
      case TabId.WAITING_PIN:
        return <WaitingPin totalWaitingPin={stats.waitingPin} />;
      case TabId.WITH_PIN:
        return <WithPin totalWithPin={stats.withPin} />;
      case TabId.PROSPECTIVE:
        return <ProspectiveStudents totalProspective={stats.prospectiveStudents} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#13A215',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            WUA Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            ...(open ? {} : {
              width: theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.id}
                selected={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(19, 162, 21, 0.1)',
                    borderRight: '4px solid #13A215',
                    '&:hover': {
                      backgroundColor: 'rgba(19, 162, 21, 0.2)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(19, 162, 21, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeTab === item.id ? '#13A215' : 'text.secondary',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: activeTab === item.id ? 600 : 400,
                        color: activeTab === item.id ? '#13A215' : 'text.primary',
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                  secondary={`Total: ${item.count}`}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard; 