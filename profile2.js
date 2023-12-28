import { supabase, successNotification, errorNotification, doLogout } from "../main";


const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;

