import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import { LockOpen, Lock } from "@mui/icons-material";
import { initialParentData, ParentType } from "../../../src/types/Parents";

const FbDefaultForm = ({ query }: { query: string }) => {  // Correctly type the query prop
  const [isLoader, setIsloader] = useState(false);
  const [state, setState] = useState<ParentType>(initialParentData);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Parent",
    },
  ];

  const router = useRouter();

  const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
  if (!token) {
    router.push('/');
    setIsloader(false);
    return; // Exit if no token is available
  };

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchStudentDetails = () => {
    console.log("query ==> " + query); // This should log the student ID

    setIsloader(true);
    apiRequest
      .get(endPoints.PARENTS_BY_ID + query, config)  // Use the student ID for the request
      .then((response) => {
        console.log("Response ====>", response);
        setState(response.data);
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchStudentDetails ==> " + error);
        setIsloader(false);
      });
  };

  const toggleBlockUser = async () => {
    setIsloader(true);
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
        setIsloader(false);
      })
      .catch(() => setIsloader(false));
  };

  useEffect(() => {
    if (query) {  // Ensure query is defined before making the request
      fetchStudentDetails();
    }
  }, [query]);

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
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Childrens ({state?.childIds?.length ?? 0})</Typography>
              {state?.childIds?.map((student: any) => (
                <Grid container spacing={2} mb={2} key={student._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={student.auth.image} alt={student.auth.fullName} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{student.auth.fullName}</Typography>
                  </Grid>
                </Grid>
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
  const query = context.query.id; // Extract the student ID from the URL
  return {
    props: {
      query,  // Pass the student ID to the props
    },
  };
}