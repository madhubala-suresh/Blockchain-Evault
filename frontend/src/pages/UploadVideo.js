import { useState } from "react";
import axios from "axios";

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoCID, setVideoCID] = useState("");

    // Function to handle video upload
    const uploadVideo = async () => {
        if (!videoFile) return alert("Select a video first!");

        const formData = new FormData();
        formData.append("video", videoFile);

        try {
            const res = await axios.post("http://localhost:5000/api/videos/upload", formData);
            setVideoCID(res.data.videoCID);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // Function to download the video from IPFS
    const handleDownload = () => {
        if (!videoCID) return;
        const link = document.createElement("a");
        link.href = `https://gateway.pinata.cloud/ipfs/${videoCID}`;
        link.download = "video.mp4";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
            <button onClick={uploadVideo}>Upload Video</button>

            {videoCID && (
                <div>
                    <h3>Uploaded Video</h3>
                    <video controls width="400">
                        <source src={`https://gateway.pinata.cloud/ipfs/${videoCID}`} type="video/mp4" />
                    </video>
                    <br />
                    <button onClick={handleDownload}>Download Video</button>
                </div>
            )}
        </div>
    );
};

export default UploadVideo;
