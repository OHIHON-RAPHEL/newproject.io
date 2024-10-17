const sideNavbtn = document.querySelector(".sideNav");
const sideNav = document.querySelector("aside");
const medInput = document.querySelector("#med-class");
const medNameInput = document.querySelector("#med-name");
const doseInput = document.querySelector("#dose");
const searchDiv1 = document.querySelector("#search-data1");
const searchDiv2 = document.querySelector("#search-data2");
const medData1 = document.querySelector("#result1");
const medData2 = document.querySelector("#result2");
const loader1 = document.querySelector("#spinner1");
const loader2 = document.querySelector("#spinner2");
const closeSearch = document.querySelectorAll(".close-search");
const addPrescription = document.querySelector("#add-prescription");
const intervalInput = document.querySelector("#interval");
const duration1 = document.querySelector("#duration1");
const duration2 = document.querySelector("#duration2");
const instructionInput = document.querySelector("#instruction");
const tableBody = document.querySelector("#tbody");
const noDrugRow = document.querySelector("#no-drugrow");
const donePrescribingBtn = document.querySelector("#done-prescribing");
const remarkDiv = document.querySelector("#remark");

sideNavbtn.addEventListener("mouseover", () => {
  // sideNav.classList.add("show");
  // sideNav.style.display = 'block'
  sideNav.classList.toggle("show", true);
});
sideNav.addEventListener("mouseleave", () => {
  // sideNav.classList.remove("show");
  sideNav.style.display = 'none'
});

// First api call when the first input field is clicked
medInput.addEventListener("focus", async () => {
  console.log("first input clicked");
  loader1.style.display = "block";
  try {
    const request = await fetch(
      "https://cliniqueplushealthcare.com.ng/prescriptions/drug_class"
    );
    const response = await request.json();
    if (!request.ok) {
      throw new Error();
    }
    loader1.style.display = "none";
    searchDiv1.style.display = "flex";
    medData1.innerHTML = "";
    response.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.textContent = item.name;
      medData1.appendChild(resultItem);
      resultItem.addEventListener("click", () => {
        medInput.value = item.name; // Adjust based on API response structure
        medData1.innerHTML = ""; // Clear results after selection
        searchDiv1.style.display = "none";
        // Trigger focus on the second input field and fetch its data
        medNameInput.focus();
        fetchMedNameData(item.id);
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});
closeSearch.forEach((btn) => {
  btn.addEventListener("click", () => {
    searchDiv1.style.display = "none";
    searchDiv2.style.display = "none";
  });
});

async function fetchMedNameData(id) {
  console.log("second input triggered");
  loader2.style.display = "block";
  try {
    const request = await fetch(
      `https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${id}`
    );
    const response = await request.json();
    if (!request.ok) {
      throw new Error();
    }
    loader2.style.display = "none";
    searchDiv2.style.display = "flex";
    medData2.innerHTML = "";
    response.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.textContent = item.medicine_name;
      medData2.appendChild(resultItem);
      resultItem.addEventListener("click", () => {
        medNameInput.value = item.medicine_name; // Adjust based on API response structure
        medData2.innerHTML = ""; // Clear results after selection
        searchDiv2.style.display = "none";
        doseInput.focus();
      });
    });
  } catch (error) {
    console.error(error.message);
  }
}

addPrescription.addEventListener("click", () => {
  // check for empty input
  if (
    !medInput.value ||
    !medNameInput.value ||
    !doseInput.value ||
    !intervalInput.value ||
    !duration1.value ||
    !duration2.value ||
    !instructionInput.value
  ) {
    alert("Please fill in all fields before adding the prescription.");
    return;
  }

  // new table row
  const newRow = document.createElement("tr");
  // s/n cell
  const snCell = document.createElement("td");
  snCell.textContent = tableBody.children.length + 1;
  // medicine class cell
  const medClassCell = document.createElement("td");
  medClassCell.textContent = medInput.value;
  // medicine name cell
  const medNameCell = document.createElement("td");
  medNameCell.textContent = medNameInput.value;
  // dose & interval cell
  const dose_freqCell = document.createElement("td");
  dose_freqCell.textContent = `${doseInput.value} - ${intervalInput.value}`;
  // duration cell
  const durationCell = document.createElement("td");
  durationCell.textContent = `${duration1.value} / ${duration2.value}`;
  // instruction cell
  const instructionCell = document.createElement("td");
  instructionCell.textContent = instructionInput.value;
  // action cell
  const actionCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Remove";
  deleteBtn.addEventListener("click", () => {
    tableBody.removeChild(newRow);
    updateSN();
    checkDrugRow();
  });
  actionCell.appendChild(deleteBtn);

  newRow.appendChild(snCell);
  newRow.appendChild(medNameCell);
  newRow.appendChild(medClassCell);
  newRow.appendChild(dose_freqCell);
  newRow.appendChild(durationCell);
  newRow.appendChild(instructionCell);
  newRow.appendChild(actionCell);

  tableBody.appendChild(newRow);
  checkDrugRow();
  clearInput();
});
const updateSN = () => {
  const rows = tableBody.children;
  for (let i = 0; i < rows.length; i++) {
    rows[i].firstElementChild.textContent = i + 1;
  }
};
const checkDrugRow = () => {
  if (tableBody.children.length === 0) {
    noDrugRow.style.display = "";
  } else {
    noDrugRow.style.display = "none";
  }
};
checkDrugRow();
donePrescribingBtn.addEventListener("click", () => {
  remarkDiv.style.display = "flex";
});
function clearInput() {
  medInput.value = "";
  medNameInput.value = "";
  doseInput.value = "";
  intervalInput.value = "";
  duration1.value = "";
  duration2.value = "";
  instructionInput.value = "";
}
