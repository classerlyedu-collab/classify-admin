import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import { initialQuizData, QuizType } from "../../../src/types/Quiz";

const QuizDetails = ({ query }: { query: string }) => {
  const [isLoader, setIsloader] = useState(false);
  const [state, setState] = useState<QuizType>(initialQuizData);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Quiz Details",
    },
  ];

  const router = useRouter();

  const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
  if (!token) {
    router.push('/');
    setIsloader(false);
    return;
  };

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchQuizDetails = () => {
    setIsloader(true);
    apiRequest
      .get(endPoints.QUIZ_BY_ID + query, config)
      .then((response:any) => {
        setState(response.data);
        setIsloader(false);
      })
      .catch((error:any) => {
        console.log("fetchQuizDetails Error: ", error);
        setIsloader(false);
      });
  };

  useEffect(() => {
    if (query) {
      fetchQuizDetails();
    }
  }, [query]);

  return (
    <PageContainer>
      <Breadcrumb title="Quiz Details" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {/* Lesson Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Lesson: {state.lesson.name}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Questions Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Questions</Typography>
              <List dense>
                {state.questions.map((q, index) => (
                  <ListItem key={q._id}>
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontSize: '1rem' }}>Q{index + 1}: {q.question}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Answer: {q.answer}</Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Score: {q.score}</Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Options: {q.options.join(', ')}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />

              {/* Grade Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Grade</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>Grade Name: {state.grade.grade}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Topic Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Topic</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>Topic Name: {state.topic.name}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Subject Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Subject</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>Subject Name: {state.subject.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default QuizDetails;

export async function getServerSideProps(context: any) {
  const query = context.query.id;
  return {
    props: {
      query,
    },
  };
}