import { supabase, successNotification, errorNotification, doLogout } from "../main";

// load data
getDatas();

//assign sign out functionality
const btn_signout = document.getElementById("btn_signout");


btn_signout.onclick = doLogout;

//submit form functionality
const form_profile =document.getElementById("form_profile");

form_profile.onsubmit = async (e) => {
    e.preventDefault();

alert("hello");
};

// Get all values from input, select, textarea under form tag
const formData = new FormData(form_profile);

  //supabase user_information table
  const {data, error} = await supabase
  .from("dog_profiles")
  .insert([
      {

          name: formData.get("name"),
          year: formData.get("year"),
          breed: formData.get("breed"),
          gender: formData.get("gender"),
         
      },
  ]);

  console.log(data);

  if (error) {
    console.error(error);
  } else {
    // If the data is successfully saved, perform any necessary actions here
    console.log("Data saved successfully!");
    // For example, you can clear the form after submission
    form_profile.reset();
  };


// Load data  functionality
async function getDatas() {
  //get all rows
  
let { data: dog_profiles, error } = await supabase
.from('dog_profiles')
.select('*');

   


let container = "";
//get each profile
dog_profiles.forEach((profile) => {
    //if(dataId == dog_profiles.Profile_id)
    container += ` <form id="${profile.id}">                                         
      <div class="row mb-3">
        <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
        <div class="col-md-8 col-lg-9">
          <img id="profileImage" src="${profile.img_path}" class="" alt="Profile" width="100">
  
          <div class="pt-2">
            <div>
              <input type="file" accept="image/*" name="image" id="file" onchange="loadFile(event)" style="display: none;">
  
              <label for="file" style="cursor: pointer;" class="ps-1">
                <img src="./assets/imgs/upload.png" height="30px" alt="Upload Image">
              </label>
  
              <label for="deleteImage" style="cursor: pointer;" class="ps-4">
                <img src="./assets/imgs/delete.png" height="30px" alt="Delete Image">
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label for="name" class="col-md-4 col-lg-3 col-form-label">Name</label>
        <div class="col-md-8 col-lg-9">
          <input name="name" type="text" class="form-control" id="name" value="${profile.name}">
        </div>
      </div>

      <div class="row mb-3">
        <label for="year" class="col-md-4 col-lg-3 col-form-label">Year</label>
        <div class="col-md-8 col-lg-9">
          <input name="year" type="text" class="form-control" id="year" value="${profile.year}">
        </div>
      </div>

      <div class="row mb-3">
        <label for="breed" class="col-md-4 col-lg-3 col-form-label">Breed</label>
        <div class="col-md-8 col-lg-9">
          <input name="breed" type="text" class="form-control" id="breed" value="${profile.breed}">
        </div>
      </div>

      <div class="row mb-3">
        <label for="gender" class="col-md-4 col-lg-3 col-form-label">Gender</label>
        <div class="col-md-8 col-lg-9">
          <input name="gender" type="text" class="form-control" id="gender" value="${profile.gender}">
        </div>
      </div>
  
      <div class="text-center">
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>`;
    


 });

 //document.getElementById("get_data").innerHTML = container;
}