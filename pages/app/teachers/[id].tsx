import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Backdrop,
  Divider,
  CardHeader,
  IconButton,
} from "@mui/material";
import { CheckBox, Block, LockOpen, Lock } from "@mui/icons-material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";

const FbDefaultForm = ({ query }: { query: string }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [state, setState] = useState<any>({});
  const router = useRouter();

  const BCrumb = [
    { to: "/", title: "Home" },
    { title: "Teacher" },
  ];

  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
  if (!token) {
    router.push("/");
    return;
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchStudentDetails = () => {
    setIsLoader(true);
    apiRequest
      .get(endPoints.TEACHER_BY_ID + query, config)
      .then((response) => {
        setState(response.data);
        setIsLoader(false);
      })
      .catch(() => setIsLoader(false));
  };

  const toggleBlockUser = async () => {
    setIsLoader(true);
    const endpoint = state.auth.isBlocked
      ? endPoints.UNBLOCK_USER
      : endPoints.BLOCK_USER;
    apiRequest
      .put(endpoint, { id: state.auth._id }, config)
      .then((response) => {
        setState((prevState: any) => ({
          ...prevState,
          auth: { ...prevState.auth, isBlocked: !prevState.auth.isBlocked },
        }));
        setIsLoader(false);
      })
      .catch(() => setIsLoader(false));
  };

  useEffect(() => {
    if (query) {
      fetchStudentDetails();
    }
  }, [query]);

  if (isLoader) {
    return (
      <Backdrop open={isLoader} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb title="Teacher Details" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<Avatar sx={{ width: 100, height: 100 }} src={state.auth?.image} alt={state.auth?.fullName} />}
              title={state.auth?.fullName}
              subheader={state.auth?.userName}
              action={
                <IconButton sx={{ fontSize: '2rem' }} onClick={toggleBlockUser} color={state.auth?.isBlocked ? 'error' : 'secondary'}>
                  {state.auth?.isBlocked ? <Lock /> : <LockOpen />}
                </IconButton>
              }
              sx={{
                '& .MuiCardHeader-title': { fontSize: '1.5rem', marginBottom: '0.4rem' }, // Customize title font size
                '& .MuiCardHeader-subheader': { fontSize: '0.8rem' }, // Customize subheader font size
              }}
            />
            <CardContent>
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}><strong>Email:</strong> {state.auth?.email}</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}><strong>Address:</strong> {state.auth?.fullAddress}</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}>
                <strong>Feedback:</strong> Average Rating {state.feedback?.average?.toFixed(1)} ({state.feedback?.total} ratings)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Subjects ({state?.subjects?.length ?? 0})</Typography>
              {state?.subjects?.map((subject: any) => (
                <Grid container spacing={2} mb={2} key={subject._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={subject.image} alt={subject.name} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{subject.name}</Typography>
                  </Grid>
                </Grid>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Students ({state?.students?.length ?? 0})</Typography>
              {state?.students?.map((student: any) => (
                <Grid container spacing={2} mb={2} key={student._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={student.auth.image} alt={student.auth.fullName} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{student.auth.fullName}</Typography>
                  </Grid>
                </Grid>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>Grades ({state?.grade?.length ?? 0})</Typography>
              {state?.grade?.map((grade: any) => (
                <Typography sx={{ fontSize: '0.8rem', mb: 1 }} key={grade._id} variant="body2">Grade: {grade.grade} - Students: {grade.students.length}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FbDefaultForm;

export async function getServerSideProps(context: any) {
  const query = context.query.id;
  return {
    props: {
      query,
    },
  };
}