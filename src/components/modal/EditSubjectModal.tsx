import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from "@mui/material";
import { IconRowRemove } from "@tabler/icons-react";

const EditDeleteModal = ({ open, handleClose, subject, handleDelete, handleEdit }: any) => {
    const [name, setName] = useState(subject?.name || "");
    const [image, setImage] = useState(subject?.image || "");

    const onSave = () => {
        handleEdit(subject._id, name, image);
        handleClose();
    };

    const onDelete = () => {
        handleDelete(subject._id);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit or Delete Subject</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Subject Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    margin="normal"
                />
                <Box>
                    <img src={image} alt="subject image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDelete} color='warning'>
                    <IconRowRemove size={16} /> Delete
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={onSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDeleteModal;