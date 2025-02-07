import { useGlobalContext } from "@/context/GlobalContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useState } from "react";

const UploadJson = () => {
    const [open, setOpen] = useState(false);
    const [bookingJson, setBookingJson] = useState();
    const [roomingListsJson, setRoomingListsJson] = useState();
    const [roomingListBookingsJson, setRoomingListBookingsJson] = useState();
    const { triggerRefresh } = useGlobalContext(); // Import context function
    const onClose = () => {
        setOpen(false)
        return console.log('success')
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setState: (data: any) => void) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    console.log("JSON uploaded:", json);
                    setState(json);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    alert("Invalid JSON file.");
                }
            };

            reader.readAsText(file);
        }
    };

    const uploadJson = async (url: string, method: string = 'POST', jsonData?: any) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: jsonData ? JSON.stringify(jsonData) : undefined,
            });
    
            if (!response.ok) {
                throw new Error(`Failed to upload ${url}: ${response.statusText}`);
            }
    
            return response;
        } catch (error) {
            console.error("Upload error:", error);
            throw error; // Ensure errors are caught in `handleUpload`
        }
    };

    const handleDeleteAllData = async () => {
        try{
            console.log("Cleaning database...");
        
            try {
                await uploadJson("http://localhost:3002/rooming-list-booking/delete-all", 'DELETE');
                console.log("Database cleaned ✅");
            } catch (error) {
                console.error('Error deleting:', error);
                console.warn("Database cleanup failed, continuing...");
            }
    
        } catch (error) { 
            console.log('error', error)
        } finally {
            setOpen(true)
        }
    }
    
    const handleUpload = async () => {
        try {
            if (!bookingJson || !roomingListsJson || !roomingListBookingsJson) {
                alert("Please upload all JSON files before proceeding.");
                return;
            }
      
            console.log("Uploading Bookings...");
            await uploadJson("http://localhost:3002/booking", 'POST', bookingJson);
            console.log("Bookings uploaded ✅");
    
            console.log("Uploading Rooming Lists...");
            await uploadJson("http://localhost:3002/rooming-lists", "POST", roomingListsJson);
            console.log("Rooming Lists uploaded ✅");
    
            console.log("Uploading Rooming List Bookings...");
            await uploadJson("http://localhost:3002/rooming-list-booking", "POST", roomingListBookingsJson);
            console.log("Rooming List Bookings uploaded ✅");

            triggerRefresh();
    
            alert("All files uploaded successfully!");
            setOpen(false);
        } catch (error) {
            console.error('Error uploading:', error);
            alert("Upload failed! Check console for details.");
        } finally {
            setOpen(false)
        }
    };
    

    return (
        <>
            <Button
                onClick={handleDeleteAllData}
                fullWidth
                sx={{
                    borderRadius: '8px',
                    fontSize: '14px',
                    maxWidth: '325px',
                    fontWeight: '600',
                    background: '#4323FF',
                    color: 'white',
                    textTransform: 'capitalize'
                }}
            >
                Insert Bookings and Rooming Lists
            </Button>

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Insert Bookings and Rooming Lists</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>

                        <Button variant="contained" component="label">
                            Upload Bookings Json
                            <input type="file" accept=".json" hidden onChange={(e) => handleFileChange(e, setBookingJson)} />
                        </Button>

                        <Button variant="contained" component="label">
                            Upload Rooming Lists Json
                            <input type="file" accept=".json" hidden onChange={(e) => handleFileChange(e, setRoomingListsJson)} />
                        </Button>

                        <Button variant="contained" component="label">
                            Upload Rooming List Bookings Json
                            <input type="file" accept=".json" hidden onChange={(e) => handleFileChange(e, setRoomingListBookingsJson)} />
                        </Button>
                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button disabled={!bookingJson || !roomingListsJson || !roomingListBookingsJson} variant="outlined" onClick={handleUpload} sx={{marginRight: 'auto'}}>Upload</Button>
                    <Button onClick={onClose} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </> 
    )
};

export default UploadJson;