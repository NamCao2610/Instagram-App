import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db, firebase } from './firebase';
import './ImageUpload.css';
import axios from './axios';

function ImageUpload({ username, avatar }) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [url, setUrl] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed', (snapshot) => {
            //progress function...
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, (error) => {
            //handle error 
            console.log(error);
            alert(error.message)
        }, () => {
            //complete function
            storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {

                    setUrl(url);

                    axios.post('/upload', {
                        caption: caption,
                        user: username,
                        image: url,
                        avatar: avatar
                    });

                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imgUrl: url,
                        username,
                        avatar
                    })

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
        })
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"></progress>
            <input type="text" placeholder="Enter a caption..." onChange={e => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button disabled={!image} onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
