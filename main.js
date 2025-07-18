let input = document.querySelector(".input");
let submit = document.querySelector(".submit");
let table = document.querySelector("table");
let loader = document.querySelector(".loader");

submit.onclick = () => {
    if(input.value.trim().length === 0) {
        return;
    }
    table.innerHTML = "";
    loader.style.display = "block";
    const data = getData(input.value.trim()).then((res) => {
        loader.style.display = "none";
        builTable(res);
    }).catch(() => {
        loader.style.display = "none";
        appendNotFound();
    });
};




// Making A Request Using Promise And XHR
const getData = function (userName) {
    return new Promise((resolved, rejected) => {
        let req = new XMLHttpRequest();
        req.onload = () => {
            if(req.readyState === 4 && req.status === 200) {
                resolved(JSON.parse(req.responseText));
            } else {
                rejected("Not Found");
            }
        }
        req.open("GET", `https://api.github.com/users/${userName}/repos`);
        req.send();  
    });
};


// Bulding The Table
function builTable(data) {

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
    let thReopName = document.createElement("th");
    thReopName.appendChild(document.createTextNode("Repo Name"));
    thead.appendChild(thReopName);
    let thOwonerName = document.createElement("th");
    thOwonerName.appendChild(document.createTextNode("Owner Name"));
    thead.appendChild(thOwonerName);

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