// 'npm run devStart' to start the server using nodemon //
/* Steps: 
- take data from api
- take data from user
- put both of them in an object (endpoint)
- send the object data to the server (POST)
- GET the data back from server and display it to user
*/ 

//My personal api key w/ '&units=imperial' in the end to get temp in fahrenheit
const key = ",&appid=acbaec6450bac6c126565392cbf94d26&units=imperial";

//The URL to get weather info from the API
const apiURL = "http://api.openweathermap.org/data/2.5/weather?zip="

//A const used to show the appropriate error message to the user below zip code text area
const apiErrorMessage = document.querySelector("#error");

//The callback function to be excuted when button is pressed that links all steps of the project
const generate = () => {

// Create a new date instance dynamically with JS
let d = new Date();
let currentDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

//A const that contains the value of what the user wrote in the 'enter zipcode' textarea AFTER clicking button
const zip = document.querySelector("#zip").value;
//A const that contains the value of what the user wrote in the 'how are you feeling' text area AFTER clicking button
const feelings = document.getElementById("feelings").value;

//Function takes the zip code then takes data returned from function below
getApiWeatherData(zip).then((data) => {
        //If there was data returned (no errors in the zip code), destructure it to get the specific items we need from it
        if (data){
            // destructure the obj returned by the api & only get from it the city name ,temperature & weather description
            const {
                name: city,
                main: {temp},
                weather: [{description}],
            } = data;
            
            //Create the final data to be sent to the server
            const myServerInfo = {
                currentDate,
                city,
                temp,
                description,
                feelings,
            };

            //Sending (posting) the data to the server
            postToServer("/add", myServerInfo);
            
            //Puts out the data for the user to see on the browser
            uiUpdate();
        }
    });
};

//Selecting the button & adding an event listener for clicks to excute the callback function when it's clicked
document.querySelector("#generate").addEventListener("click", generate);



/* Functions included inside the button callback function: */

//The async function to get (fetch) the data from the api
const getApiWeatherData = async (zip) => {
    try{
        //Fetching data from the link, zip code & api key as provided by the api
        const response = await fetch(apiURL + zip + key);
        const data = await response.json();

        //If there's something wrong with the zip code written -> show the appropriate error message, otherwise return the data
        if(data.cod != 200) {
            apiErrorMessage.innerHTML = data.message;
            setTimeout(() => apiErrorMessage.innerHTML = '', 3000);
        }
        return data;
    }
    catch (err) {console.log(err);}
};

//The function to post the data to server
const postToServer = async(url = "", info = {}) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info), // turn the obj to a string
});
    try{
        const newData = await res.json(); //convert it into json
        //console.log(`Saved data`, newData); // Not needed, for testing only
        return newData;
    }catch(err){
        console.log(err);
    }
};

//Function that updates the UI by putting out the data to the user`
const uiUpdate = async () => {
    const res = await fetch("/all"); //Takes the data from the server
    try{
        const data = await res.json(); //turn the data to an obj

        //Set the value of each div item to it's corresponding value in the data retrieved
        document.querySelector("#date").innerHTML = "Date: " + data.currentDate;
        document.querySelector("#temp").innerHTML = "Temperature: " + data.temp +"&degF";
        document.getElementById("city").innerHTML = "City: " + data.city;
        document.querySelector("#description").innerHTML = "Description: " + data.description;
        document.querySelector("#content").innerHTML = "Feeling: " + data.feelings ;
    }catch(err) {
        console.log(err);
    }
};
