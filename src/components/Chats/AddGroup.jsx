
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../lib/axios';
import { setContactId, setShowAddAccountDialog, setShowAddGroupDialog } from '../../stores/chat/chat';
import { useChat } from '../../hooks/chat';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MobileStepper from '@mui/material/MobileStepper';
import { Autocomplete, Avatar, TextField } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddGroup() {

    const user_contacts = useSelector((state) => state.chat.user_contacts);

    const [selectedValues, setSelectedValues] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const [selectedImage, setSelectedImage] = useState();

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // This function will be triggered when the "Remove This Image" button is clicked
    const removeSelectedImage = () => {
        setSelectedImage();
    };

    const { fetchChatContacts } = useChat()
    const dispatch = useDispatch();

    const addGroupMembers = async () => {
        
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('name', groupName);
        formData.append('users', selectedValues);

        await axios.post(`/api/v1/group/create`,formData ,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        
        dispatch(setShowAddGroupDialog(false));
        setGroupName('');
        setSelectedValues([]);
        fetchChatContacts(true)
        setActiveStep(0)
    };

    const open = useSelector((state) => state.chat.ui.show_add_group_modal);
    const steps = [
        {
            label: 'Create a group',
        },
        {
            label: 'Select participants',

        },
    ];
    const maxSteps = steps.length;

    const handleNext = () => {
        if (activeStep === 0 && groupName.trim() === '') {
            // If the group name is empty, prevent moving to the next step
            return;
        }
        if (activeStep === 1 && selectedValues.length == 0) {
            // If no participants are selected, prevent moving to the next step
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };



    const handleAutocompleteChange = (event, newValue) => {
        setSelectedValues(newValue.map(option => option.id));
    };



    const handleChange = (event) => {
        setGroupName(event.target.value);
    };

    const NextButtonContent = ({ groupName, selectedValues, activeStep, maxSteps, handleNext }) => {
        if (groupName != '' && selectedValues.length != 0 && activeStep == 1) {
            return (
                <Button
                    size="small"
                    onClick={addGroupMembers}
                >
                    Add
                    <KeyboardArrowRight />
                </Button>
            );
        }

        return (
            <Button
                size="small"
                onClick={handleNext}
                disabled={(activeStep === maxSteps - 1) || (activeStep === 0 && groupName.trim() == '')}
            >
                Next
                <KeyboardArrowRight />
            </Button>
        );
    };

    const ImageUploadAvatar = ({selectedImage}) => {
        if (selectedImage) {
            return (

                <label>
                    <IconButton onClick={removeSelectedImage} component="label" sx={{ width: 24, height: 24, bgcolor: 'white' }} disableRipple>
                        <DeleteIcon color="error" sx={{ fontSize: 17 }} />
                    </IconButton>
                </label>
            )

        }
        return (

            <div className={{ '& > *': { margin: 1 } }}>
                <label>
                    <IconButton component="label" sx={{ width: 24, height: 24, bgcolor: 'white' }} disableRipple>
                        <FileUploadOutlinedIcon />
                        <TextField
                            onChange={imageChange}
                            type='file' sx={{ display: 'none' }} />
                    </IconButton>
                </label>
            </div>
        )

    }

    return (
        <>
            <Dialog

                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={() => dispatch(setShowAddGroupDialog(false))}
            >
                <DialogTitle>Contacts</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can create Groups from here
                    </DialogContentText>
                    <Box noValidate component="form" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: '100%',
                    }}
                    >
                        <div className='p-4 flex flex-col justify-center items-center w-full'>
                            <div className='mx-auto text-center text-lg font-semibold'>{steps[activeStep].label}</div>
                            <div className='my-2 w-full flex items-center justify-center flex-col'>
                                {
                                    (activeStep === 0) && (
                                        <>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    <ImageUploadAvatar selectedImage={selectedImage} />
                                                }
                                            >
                                                <Avatar
                                                    src={selectedImage && URL.createObjectURL(selectedImage)}
                                                    sx={{ m: 1, bgcolor: 'secondary.main', width: 66, height: 66 }} />

                                            </Badge>

                                            <TextField
                                                id="standard-search"
                                                label="Name"
                                                type="search"
                                                variant="standard"
                                                value={groupName} // Set the value of the TextField
                                                onChange={handleChange} // Handle value change
                                                sx={{ width: '80%' }}
                                            />
                                        </>
                                    )
                                }

                                {
                                    (activeStep === 1) && (
                                        <>
                                            <Autocomplete
                                                multiple
                                                id="tags-standard"
                                                options={user_contacts}
                                                getOptionLabel={(option) => option.name}
                                                onChange={handleAutocompleteChange}
                                                defaultValue={[]}
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Add Participants"
                                                        placeholder="users"
                                                    />
                                                )}
                                            />
                                        </>
                                    )
                                }

                            </div>
                        </div>
                        <MobileStepper
                            variant="text"
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={<NextButtonContent groupName={groupName} selectedValues={selectedValues} activeStep={activeStep} maxSteps={maxSteps} handleNext={handleNext} />}

                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>

                                    <KeyboardArrowLeft />
                                    Back
                                </Button>
                            }
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={addGroup}>Add</Button> */}
                </DialogActions>
            </Dialog >
        </>
    );
}

