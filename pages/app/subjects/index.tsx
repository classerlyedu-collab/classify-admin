import * as React from "react";

import { useTheme } from "@mui/material/styles";
import {
  Typography,
  TableHead,
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableFooter,
  IconButton,
  TableContainer
} from "@mui/material";
import { IconArrowRight, IconEdit } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import ParentCard from "../../../src/components/shared/ParentCard";
import BlankCard from "../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";
import endPoints from "../../../src/constant/apiEndpoint";
import apiRequest from "../../../src/utils/axios";
import { SubjectType } from "../../../src/types/Subjects";
import EditDeleteModal from "../../../src/components/modal/EditSubjectModal";
import toast from "react-hot-toast";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Subjects",
  },
];

const PaginationTable = () => {
  const [isLoader, setIsloader] = React.useState(false);

  const [subjects, setSubjects] = React.useState<SubjectType[]>([]);

  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState<SubjectType | null>(null);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjects.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchSubjects = () => {
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      return; // Exit if no token is available
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    apiRequest
      .get(endPoints.SUBJECTS, config)
      .then((response) => {
        console.log("Response ====>", response);
        setSubjects(response.data);
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchSubjects ==> " + error);
        setIsloader(false);
      });
  };

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (id: any, name: any, image: any) => {
    // Handle edit request
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log(id, name, image);

    apiRequest
      .put(endPoints.EDIT_SUBJECT, { id, name, image }, config)
      .then(() => {
        toast.success('Subject Saved Successfully!');
        fetchSubjects();
      })
      .catch((error) => {
        toast.error('Error Saving Subject!');
        console.log(error);
      });
    setSelectedSubject(null);

  };

  const handleDelete = (id: any) => {
    // Handle delete request
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    apiRequest
      .delete(`${endPoints.DELETE_SUBJECT}/${id}`, config)
      .then(() => {
        toast.success('Subject Deleted Successfully!');
        fetchSubjects();
      })
      .catch((error) => {
        toast.error('Error Deleting Subject!');
        console.log(error);
      });

    setSelectedSubject(null);
  };

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* breadcrumb */}
      <Breadcrumb
        title="Subjects"
        items={BCrumb}
        addBtn="Add Subject"
        isBtn={true}
        addBtnHREF="/app/subjects/create"
      />
      {/* end breadcrumb */}
      <ParentCard title="Subjects">
        <BlankCard>
          <TableContainer>
            <Table
              aria-label="custom pagination table"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Grade</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Teachers</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Students</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Edit</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Topics</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? subjects
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : subjects?.sort((a, b) => (a?.name > b?.name ? -1 : 1))
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row.grade.grade}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.grade?.teachers?.length}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.grade?.students?.length}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => { setSelectedSubject(row); setOpenModal(true); }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconArrowRight
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("/app/subjects/" + row._id);
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={6}
                    count={subjects.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </BlankCard>
      </ParentCard>

      {/* Edit/Delete Modal */}
      {selectedSubject && (
        <EditDeleteModal
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedSubject(null);
          }}
          subject={selectedSubject}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}

    </PageContainer>
  );
};

export default PaginationTable;
