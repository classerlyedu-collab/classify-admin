import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Backdrop, CircularProgress } from '@mui/material';
import apiRequest from '../../../src/utils/axios';
import endPoints from '../../../src/constant/apiEndpoint';
import TabSearchBar from '../../../src/components/common/TabSearchBar';

interface User {
  _id: string;
  auth: {
    _id: string;
    fullName: string;
    email: string;
    userType: 'Parent' | 'Teacher' | 'Student';
    isSubscribed: boolean;
    isBlocked: boolean;
    createdAt: string;
  };
  code?: string;
  grade?: {
    grade: string;
  };
  subjects?: Array<{
    name: string;
  }>;
}

const SubscriptionsPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'User Subscriptions' }
  ];

  const fetchUsers = async () => {
    setIsLoader(true);
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;

    if (!token) {
      router.push('/');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Fetch all users (parents and teachers)
      const [parentsResponse, teachersResponse] = await Promise.all([
        apiRequest.get(endPoints.PARENTS, config),
        apiRequest.get(endPoints.TEACHERS, config)
      ]);

      const parents = parentsResponse?.data || [];
      const teachers = teachersResponse?.data || [];

      // Combine and format users
      const allUsers = [...parents, ...teachers].map(user => ({
        ...user,
        auth: {
          ...user.auth,
          userType: user.auth?.userType || (parents.includes(user) ? 'Parent' : 'Teacher')
        }
      }));

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error'
      });
    } finally {
      setIsLoader(false);
    }
  };

  // Update filtered users when users change
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleGrantAccess = async () => {
    if (!selectedUser) return;

    setIsLoader(true);
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;

    if (!token) {
      router.push('/');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Update user subscription status
      const updateData = {
        userId: selectedUser.auth._id,
        isSubscribed: true,
        couponCode: couponCode || undefined
      };

      await apiRequest.put(endPoints.UPDATE_USER, updateData, config);

      setSnackbar({
        open: true,
        message: `Free access granted to ${selectedUser.auth.fullName}`,
        severity: 'success'
      });

      // Refresh users list
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error granting access:', error);
      setSnackbar({
        open: true,
        message: 'Failed to grant access',
        severity: 'error'
      });
    } finally {
      setIsLoader(false);
    }
  };

  const handleRevokeAccess = async (user: User) => {
    setIsLoader(true);
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;

    if (!token) {
      router.push('/');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // First, cancel Stripe subscription if exists
      try {
        await apiRequest.post(endPoints.CANCEL_SUBSCRIPTION, {
          userId: user.auth._id
        }, config);
      } catch (stripeError) {
        console.log('Stripe cancellation failed (may not have subscription):', stripeError);
        // Continue with access revocation even if Stripe cancellation fails
      }

      // Then update user subscription status
      const updateData = {
        userId: user.auth._id,
        isSubscribed: false
      };

      await apiRequest.put(endPoints.UPDATE_USER, updateData, config);

      setSnackbar({
        open: true,
        message: `Access revoked from ${user.auth.fullName}`,
        severity: 'success'
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error revoking access:', error);
      setSnackbar({
        open: true,
        message: 'Failed to revoke access',
        severity: 'error'
      });
    } finally {
      setIsLoader(false);
    }
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setCouponCode('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setCouponCode('');
  };

  const getStatusColor = (isSubscribed: boolean) => {
    return isSubscribed ? 'success' : 'default';
  };

  const getStatusText = (isSubscribed: boolean) => {
    return isSubscribed ? 'Active' : 'Inactive';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Breadcrumb title="User Subscriptions" items={BCrumb} />

      <ParentCard title="Manage User Subscriptions">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search users by name or email..."
            data={users}
            searchFields={['auth.fullName', 'auth.email']}
            onResultClick={(result) => {
              // For subscriptions, we don't navigate, just filter
              console.log('Selected user:', result.data);
            }}
            onFilterChange={setFilteredUsers}
            maxResults={5}
          />
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Grant Free Access to Users
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Admins can grant free access to parents and teachers without requiring Stripe payment.
              Optionally add a coupon code for tracking purposes.
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600">
                          {user.auth.fullName}
                        </Typography>
                        {user.code && (
                          <Typography variant="caption" color="textSecondary">
                            Code: {user.code}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{user.auth.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.auth.userType}
                          size="small"
                          color={user.auth.userType === 'Teacher' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(user.auth.isSubscribed)}
                          size="small"
                          color={getStatusColor(user.auth.isSubscribed) as any}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.auth.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {!user.auth.isSubscribed ? (
                          <Tooltip title="Grant Free Access">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(user)}
                              size="small"
                            >
                              <IconPlus size={20} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Revoke Access">
                            <IconButton
                              color="error"
                              onClick={() => handleRevokeAccess(user)}
                              size="small"
                            >
                              <IconTrash size={20} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </ParentCard>

      {/* Grant Access Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Grant Free Access</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Grant free access to <strong>{selectedUser.auth.fullName}</strong> ({selectedUser.auth.email})?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                This will give the user full access to the platform without requiring payment.
              </Typography>

              <TextField
                fullWidth
                label="Coupon Code (Optional)"
                placeholder="e.g., ADMIN_FREE_2024"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                helperText="Add a coupon code for tracking purposes"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleGrantAccess}
            variant="contained"
            color="primary"
            disabled={isLoader}
          >
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default SubscriptionsPage;
