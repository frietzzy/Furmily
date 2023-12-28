import { supabase, successNotification, errorNotification, doLogout } from "../main";

const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;

//const addprofilesImageUrl = supabase.storage.from('add_profiles').getPublicUrl('https://ekrykjpzstaflfasvjyq.supabase.co/storage/v1/object/public/add_profiles/public/')

const addprofilesImageUrl='https://ekrykjpzstaflfasvjyq.supabase.co/storage/v1/object/public/add_profiles/';

// Load Data
getDatas();



// Search Form Functionality
const form_search = document.getElementById("form_search");

form_search.onsubmit = async (e) => {
  e.preventDefault();

  // Get All values from input, select, textarea under form tag
  const formData = new FormData(form_search);

  // Reload Datas
  getDatas(formData.get("keyword"));
};

// Submit Form Functionality; Both Functional for Create and Update
const form_item = document.getElementById("form_item");

form_item.onsubmit = async (e) => {
  e.preventDefault();

  // Disable Button
  document.querySelector("#form_item button[type='submit']").disabled = true;
  document.querySelector("#form_item button[type='submit']").innerHTML = `
                      <span>Loading...</span>`;

  // Get All values from input, select, textarea under form tag
  const formData = new FormData(form_item);

  // Supabase Image Upload
  const image = formData.get("image_path");
  const { data, error } = await supabase.storage
    .from("add_profiles")
    .upload("public/" + image.name, image, {
      cacheControl: "3600",
      upsert: true,
    });
  // Pass supabase image data to image_data
  const image_data = data;

  // Error notification for upload
  if (error) {
    errorNotification(
      "Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image.",
      15
    );
    console.log(error);
  }

  if (for_update_id == "") {
    // Supabase Create
    const { data, error } = await supabase
      .from("add_profiles")
      .insert([
        {
         
        image_path: image_data == null ? null : image_data.path, // If you dont have uploading, you can comment this
        name : formData.get("name"),
        year : formData.get("year"),
        breed : formData.get("breed"),
        gender : formData.get("gender"),
        //user_id: userId, 

        },
      ])
      .select();

    if (error == null) {
      successNotification("Profile Successfully Added!", 15);

      // Reload Datas
      getDatas();
    } else {
      errorNotification("Something wrong happened. Cannot Add Profile.", 15);
      console.log(error);
    }
  }
  // for Update
  else {
    const { data, error } = await supabase
      .from("add_profiles")
      .update({
        image_path: image_data == null ? null : image_data.path, // If you dont have uploading, you can comment this
        name : formData.get("name"),
        year : formData.get("year"),
        breed : formData.get("breed"),
        gender : formData.get("gender"),
        //user_id: userId,  
      })
      .eq("id", for_update_id)
      .select();

    if (error == null) {
      successNotification("Successfully Updated!", 15);

      // Reset storage id
      for_update_id = "";

      // Reload Datas
      getDatas();
    } else {
      errorNotification("Something wrong happened. Cannot Add Profile.", 15);
      console.log(error);
    }
  }

  
  // Reset Form
  form_item.reset();

  // Enable Submit Button
  document.querySelector("#form_item button[type='submit']").disabled = false;
  document.querySelector(
    "#form_item button[type='submit']"
  ).innerHTML = `Submit`;
};

// Load Data Functionality
async function getDatas(keyword = "") {
  // Get all rows
  let { data: add_profiles, error } = await supabase
    .from("add_profiles")
    .select("*")
    // .like("item_name", "%" + keyword + "%");
    .or(
        "name.ilike.%" + keyword + "%", 
        "year.ilike.%" + keyword + "%", 
        "breed.ilike.%" + keyword + "%", 
        "gender.ilike.%" + keyword + "%"
    );

  // Temporary storage for html elements and each items
  let container = "";
  // Get Each item and interpolate with html elements
  add_profiles.forEach((add_profile) => {
    container += `<div class="col-6 mb-2">
    <div class="card h-100" data-id="${add_profile.id}">
        <img src="${addprofilesImageUrl + add_profile.image_path}" width="100%" height="225px">
        <div class="card-body">
            <a href="index2.html" class="link-offset-2 link-underline link-underline-opacity-0 text-dark">
                <h3 class="card-title">${add_profile.name}</h3>
            </a>

            <div class="d-flex justify-content-center align-items-center">
              <p>${add_profile.breed}</p>
              <div class="dropdown float-end">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="#" id="btn_edit" data-id="${
                            add_profile.id
                        }">Edit</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="btn_delete" data-id="${
                            add_profile.id
                        }">Delete Profile</a>
                    </li>
                </ul>
              </div>
            </div>
        
            
        </div>
    </div>
</div> `;
  });

  // Assign container to the html element to be displayed
  document.getElementById("get_data").innerHTML = container;

  // Assign click event on Edit Btns
  document.querySelectorAll("#btn_edit").forEach((element) => {
    element.addEventListener("click", editAction);
  });

  // Assign click event on Delete Btns
  document.querySelectorAll("#btn_delete").forEach((element) => {
    element.addEventListener("click", deleteAction);
  });
}

// Delete Functionality
const deleteAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  // Change background color the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "red";

  // Supabase Delete row
  const { error } = await supabase.from("add_profiles").delete().eq("id", id);

  if (error == null) {
    successNotification("Profile Successfully Deleted!", 15);

    // Reload Datas
    //getDatas(); // This is slow

    // Remove the Card from the list
    document.querySelector(`.card[data-id="${id}"]`).remove(); // recommended approach
  } else {
    errorNotification("Something wrong happened. Cannot Delete Profile.", 15);
    console.log(error);

    // Change background color the card that you want to delete
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "white";
  }
};

// Storage of Id of chosen data to update
let for_update_id = "";

// Edit Functionality; but show first
const editAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  // Change background color the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "yellow";

  // Supabase show by id
  let { data: items, error } = await supabase
    .from("add_profiles")
    .select("*")
    .eq("id", id);

  if (error == null) {
    // Store id to a variable; id will be utilize for update
    for_update_id = add_profiles[0].id;

    // Assign values to the form
    document.getElementById("name").value = add_profiles[0].name;
    document.getElementById("year").value = add_profiles[0].year;
    document.getElementById("breed").value = add_profiles[0].breed;
    document.getElementById("gender").value = add_profiles[0].gender;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
    document.querySelector("#form_item button[type='submit']").textContent =
      "Update";
  } else {
    errorNotification("Something wrong happened. Cannot Show Profile.", 15);
    console.log(error);

    // Change background color the card that you want to delete
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "white";
  }

  // Show Modal Form
  document.getElementById("modal_show").click();
};


