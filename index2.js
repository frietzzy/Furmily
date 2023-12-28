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