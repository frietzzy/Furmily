import { supabase, successNotification, errorNotification, doLogout } from "../main";


const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;


// Function to send a message
const sendMessage = async () => {
    const messageInput = document.getElementById('messageInput');
    const messageContent = messageInput.value.trim();

    if (messageContent !== '') {
        const senderId = 'your_sender_id';
        const recipientId = 'your_recipient_id';

        const timestamp = new Date();
        const isRead = false;

        try {
            const { data, error } = await supabase
                .from('conversation')
                .insert([
                    {
                        sender_id: senderId,
                        recipient_id: recipientId,
                        content: messageContent,
                        timestamp: timestamp,
                        is_read: isRead,
                        is_sent: true
                    }
                ]);

            if (error) {
                console.log('Error sending message:', error);
            } else {
                // If successful, clear the input field after sending the message
                messageInput.value = '';
                // Optionally, update the UI to display the sent message
                // ...
            }
        } catch (error) {
            console.log('Error sending message:', error);
        }
    }
};

// Event listener for sending messages
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', sendMessage);


// Function to upload an image
const uploadImage = async () => {
    const input = document.getElementById('imageUploadInput');
    const file = input.files[0];

    if (file) {
        try {
            // Upload the file to Supabase storage
            const { data, error } = await supabase.storage.from('your_bucket_name').upload('path/to/store', file);

            if (error) {
                console.error('Error uploading image:', error);
            } else {
                const imageUrl = data.Key; // Get the URL of the uploaded image
                // Process the URL or send it as a message in the conversation
                // ...
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
};

// Event listener for uploading an image (hidden file input triggered by album button)
const uploadImageButton = document.getElementById('uploadImageButton');
uploadImageButton.addEventListener('click', () => {
    const imageUploadInput = document.getElementById('imageUploadInput');
    imageUploadInput.click(); // Trigger the file input
});

// Event listener for handling image upload
const imageUploadInput = document.getElementById('imageUploadInput');
imageUploadInput.addEventListener('change', uploadImage);


