let input = document.querySelector(".input");
let submit = document.querySelector(".submit");
let table = document.querySelector("table");
let loader = document.querySelector(".loader");

// Trigger The submit Button When Clicking Enter Button
input.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        submit.click();
    }
});

submit.onclick = async () => {

    // We Clear The Table If There Is Previous Data
    table.innerHTML = "";

    // If The Input Field Is Empty We Do Nothing
    if(input.value.trim().length === 0) {
        return;
    }

    // We Display The Loading Element
    loader.style.display = "block";

    // Getting The Data From The Fetching Function
    const data = await getData(input.value.trim());

    // After We Get The Data We Display None The Loader Element
    loader.style.display = "none";

    // We Check If The Data Wasn't found Or The Connection Failed Or Zero Repos
    if(data.status === 404) {
        appendNotFound();
    } else if(data.networkError) {
        appendNetWorkError();
    } else {
        buildTable(data);
    }
};




// Making A Request Using Promise And XHR
const getData = async function (userName) {
    // Try And Catch To Check If The Fetch Goes Well
    try {
        let response =  await fetch(`https://api.github.com/users/${userName}/repos`);
        // If The Response Is Not Ok, We Return The Status
        if(!response.ok) {
            return {status: response.status};
        }
        // If The Response Was Success We Return The Data
        let myData = await response.json();
        return myData;
    } catch(error) {
        return {networkError: true};
    }
};


// Bulding The Table
function buildTable(data) {

    //If There Are No Repos 
    if(data.length === 0) {
        appendZeroRepos();
        return;
    }

    // Making The Head
    let thead = document.createElement("thead");

    let thN = document.createElement("th");
    thN.appendChild(document.createTextNode("N"));
    thead.appendChild(thN);
    let thRepoName = document.createElement("th");
    thRepoName.appendChild(document.createTextNode("Repo Name"));
    thead.appendChild(thRepoName);
    let thOwnerName = document.createElement("th");
    thOwnerName.appendChild(document.createTextNode("Owner Name"));
    thead.appendChild(thOwnerName);

    table.appendChild(thead);


    // Making The Body
    let tbody = document.createElement("tbody");
    for(let i = 0; i < data.length; i++) {
        let tr = document.createElement("tr");

        let tdNo = document.createElement("td");
        tdNo.appendChild(document.createTextNode(`${i + 1}`));
        tdNo.setAttribute("data-number", "No");
        tr.appendChild(tdNo);

        let tdName = document.createElement("td");
        tdName.setAttribute("data-repoName", "Repo Name")
        tdName.appendChild(document.createTextNode(`${data[i].name}`));
        tr.appendChild(tdName);

        let tdOwnerName = document.createElement("td");
        tdOwnerName.setAttribute("data-ownerName", "Owner Name");
        tdOwnerName.appendChild(document.createTextNode(`${data[i].owner.login}`));
        tr.appendChild(tdOwnerName);

        
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
}

// If Nothing Found
function appendNotFound() {
    let caption = document.createElement("caption");
    caption.appendChild(document.createTextNode("No User Found"));
    table.appendChild(caption);
}

// If There Is Zero Repos
function appendZeroRepos() {
    let caption = document.createElement("caption");
    caption.appendChild(document.createTextNode("The User Has Zero Public Repos"));
    table.appendChild(caption);
};

// If There Is A Netwrok Error
function appendNetWorkError() {
    let caption = document.createElement("caption");
    caption.appendChild(document.createTextNode("Check Your Connection"));
    table.appendChild(caption);
}
