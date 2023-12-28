import { supabase, successNotification, errorNotification, doLogout } from "../main";


const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;


  // Function to fetch profiles from Supabase
const fetchProfiles = async () => {
  try {
      const { data: profiles, error } = await supabase
          .from('add_profiles')
          .select('*'); // You can specify columns if needed

      if (error) {
          console.error('Error fetching profiles:', error);
          return { data: [], error }; // Return an empty array as data in case of error
      }

      return { data: profiles || [], error: null }; // Return the data and error object
    } catch (err) {
      console.error('Error fetching profiles:', err);
      return { data: [], error: err }; // Return an empty array and the error
    }
  };


// Function to display fetched profiles in the UI
const displayProfiles = (profiles) => {
  const profileList = document.getElementById('profileList');
  profileList.innerHTML = ''; // Clear previous content

  profiles.forEach((profile) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = profile.name; // Display profile information as needed
    profileList.appendChild(listItem);
  });
};

// Event listener for "See all profiles" button click
const seeAllProfilesBtn = document.getElementById('seeAllProfilesBtn');
seeAllProfilesBtn.addEventListener('click', async () => {
  try {
    // Fetch profiles when the button is clicked
    const profilesResponse = await fetchProfiles();
    console.log(profilesResponse); // Logging the response for debugging purposes

    const { data: profiles, error } = profilesResponse || {};


    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    // Display profiles in the UI
    displayProfiles(profiles);

    // Show the profile list container after fetching profiles
    const profileListContainer = document.getElementById('profileListContainer');
    profileListContainer.style.display = 'block';
  } catch (err) {
    console.log('Error:', err);
  }
});


// Array of profiles
const profiles = [
  {
    name: 'Buddy',
    age: '3 years old',
    breed: 'German Shepherd',
    image: './assets/imgs/german_shepherd.jpg',
    info:  'Buddy is a friendly German Shepherd 3 years old looking for a studmate.'
  },
  {
      name: 'Rocky',
      age: '2 years old',
      breed: 'Siberian Husky',
      image: './assets/imgs/husky.jpg',
      info:  'Rocky is a 2 years old energetic Siberian Husky searching for a studmate.'
  },
 
  // Add more profiles here as needed
];

// Index to keep track of the current profile being displayed
let currentProfileIndex = 0;

// Function to display the current profile
function displayCurrentProfile() {
  const currentProfile = profiles[currentProfileIndex];
  const dogCard = document.getElementById('dogCard');
  const dogImage = document.querySelector('#dogCard img');
  const dogInfo = document.querySelector('#dogCard h4');
  const modalBody = document.querySelector('.modal-body');

  // Update profile information in the DOM
  dogImage.src = currentProfile.image;
  dogInfo.innerHTML = `${currentProfile.name}, ${currentProfile.age}<i>(${currentProfile.breed})</i>`;

  // Update modal content
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = 'About ' + currentProfile.name;
  modalBody.innerHTML = `<p>${currentProfile.info}</p>`;
}

// Display the initial profile
displayCurrentProfile();

// Get reference to the like and dislike buttons
const dislikeButton = document.getElementById('dislikeButton');
const likeButton = document.getElementById('likeButton');
const matchModal = $('#matchModal');

// Event listener for dislike button
dislikeButton.addEventListener('click', function() {
  // Implement functionality for disliking the dog here
  console.log('Disliked the dog');

  // Move to the next profile or reset if it's the last profile
  currentProfileIndex++;
  if (currentProfileIndex >= profiles.length) {
      currentProfileIndex = 0;
  }

  // Display the next profile
  displayCurrentProfile();
});

// Event listener for like button
likeButton.addEventListener('click', function() {
  // Implement functionality for liking the dog here
  console.log('Liked the dog');

  // Show 'Match!' modal
  matchModal.modal('show');

  // Add event listener to the modal close event
  matchModal.on('hidden.bs.modal', function () {
      // Redirect to the message page after the modal is closed
      window.location.href = 'message.html'; // Replace 'message.html' with the desired URL
  });
});