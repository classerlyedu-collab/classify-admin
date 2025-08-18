import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";

import TopCards from "../../../src/components/dashboards/modern/TopCards";
import RevenueUpdates from "../../../src/components/dashboards/modern/RevenueUpdates";
import YearlyBreakup from "../../../src/components/dashboards/modern/YearlyBreakup";
import MonthlyEarnings from "../../../src/components/dashboards/modern/MonthlyEarnings";
import EmployeeSalary from "../../../src/components/dashboards/modern/EmployeeSalary";
import Projects from "../../../src/components/dashboards/modern/Projects";
import Social from "../../../src/components/dashboards/modern/Social";
import SellingProducts from "../../../src/components/dashboards/modern/SellingProducts";
import WeeklyStats from "../../../src/components/dashboards/modern/WeeklyStats";
import TopPerformers from "../../../src/components/dashboards/modern/TopPerformers";
import Welcome from "../../../src/layouts/full/shared/welcome/Welcome";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import ActiveUsers from "../../../src/components/dashboards/modern/ActiveUsers";
import StripeUsers from "../../../src/components/dashboards/modern/StripeUsers";
import axios from "axios";

const Modern = () => {
  const [isLoader, setIsloader] = useState(false);

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={18}>
            {<StripeUsers isloader={isLoader} setIsloader={setIsloader} />}
          </Grid>
        </Grid>

        <Welcome />
      </Box>
    </PageContainer>
  );
};

export default Modern;
