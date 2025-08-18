import React, { useEffect, useState } from "react";
import { Select, MenuItem, TextField, Button, CircularProgress, Backdrop } from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const BCrumb = [
    {
        to: "/",
        title: "Subjects",
    },
    {
        title: "Add Subject",
    },
];

const AddSubjectForm = () => {
    const router = useRouter();
    const [grades, setGrades] = useState<any>([]);
    const [subjectName, setSubjectName] = useState("");
    const [selectedGrade, setSelectedGrade] = useState<any>(""); // store the selected grade object
    const [subjectImage, setSubjectImage] = useState<any>(null); // Allow to store the image preview URL
    const [isLoader, setIsLoader] = useState(false);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    useEffect(() => {
        if (!token) {
            router.push('/');  // Ensure this happens only in the client-side
            setIsLoader(false);
            return; // Exit if no token is available
        }
    }, [token, router]);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        // Fetch grades
        const fetchGrades = async () => {
            setIsLoader(true);
            try {
                const response = await apiRequest.get(endPoints.GET_ALL_GRADES, config);
                setGrades(response.data);  // Set the fetched grades
            } catch (error) {
                console.log("Error fetching grades:", error);
            } finally {
                setIsLoader(false);
            }
        };

        fetchGrades();
    }, []);

    const handleUploadClick = () => {
        try {
            setIsLoader(true);
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (event) => {
                const target = event.target as HTMLInputElement;
                const file: any = target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        let data = new FormData();
                        data.append("file", file);
                        await apiRequest.post(endPoints.UPLOAD_IMAGE, data, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                        setSubjectImage(file); // Store the file instead of the URL
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        } catch (error: any) {
            toast.error('error');
        } finally {
            setIsLoader(false);
        }
    };


    const handleSubmit = async () => {
        if (!subjectName || !selectedGrade) {
            toast.error('Please fill in all fields!');
            return;
        }

        setIsLoader(true);
        try {
            const formData = new FormData();

            formData.append("name", subjectName);
            formData.append("grade", selectedGrade._id);  // Use the grade ID for submission
            formData.append("image", subjectImage); // Attach the image in the form data

            await apiRequest.post(endPoints.ADD_SUBJECT, formData, config);
            toast.success('Subject Added Successfully!')
            router.back();
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <PageContainer>
            <Breadcrumb
                title="Subject"
                items={BCrumb}
            />

            <Backdrop open={isLoader}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <TextField
                label="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Select
                value={selectedGrade?._id || ""}
                onChange={(e) => setSelectedGrade(grades.find((grade: any) => grade._id === e.target.value))}
                fullWidth
                displayEmpty
                renderValue={(selected) => (selected ? selectedGrade.grade : "Select Grade")} // Show the grade name
            >
                {grades.map((grade: any) => (
                    <MenuItem key={grade._id} value={grade._id}>
                        {grade.grade} {/* Show grade name here */}
                    </MenuItem>
                ))}
            </Select>

            {/* <div>
                <Button variant="outlined" onClick={handleUploadClick} fullWidth style={{ margin: "16px 0" }}>
                    Select Image
                </Button> */}

            {/* Display selected image as preview */}
            {/* {subjectImage && (
                    <div>
                        <img
                            src={subjectImage}
                            alt="Subject Preview"
                            style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                        />
                    </div>
                )}
            </div> */}

            <Button sx={{ marginTop: 5 }} variant="contained" onClick={handleSubmit} fullWidth>
                Add Subject
            </Button>
        </PageContainer>
    );
};

export default AddSubjectForm;