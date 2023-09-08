const typePosition = document.querySelector(".type-position");
const typePostionModal = document.querySelector("#typePosition");
const positionModal = document.querySelector("#position");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector(".modal-student");
const studentTableBody = document.querySelector(".student-table tbody");
const modalOpenBtn = document.querySelector(".modal-open-btn");
const modalSubmitBtn = document.querySelector(".modal-submit-btn");
const studentSearchInput = document.querySelector(".student-search-input");
const typeMarried = document.querySelector(".type-married")
const sorted = document.querySelector(".type-sort")


let studentsJson = localStorage.getItem("students");

let students = JSON.parse(studentsJson) || [];
let selected = null;
let search =""
let positiontype = "Position"
let married ="isMarried"
let sort = "Sort";

typeMarried.innerHTML = "<option>isMarried</option>";

marry.map((married)=>{
  typeMarried.innerHTML += `<option>${married}</option>`;
})

typePosition.innerHTML = "<option>Position</option>";
typePostionModal.innerHTML = "<option>Select</option>";

type.map((pos) => {
  typePosition.innerHTML += `<option>${pos}</option>`;
  typePostionModal.innerHTML += `<option>${pos}</option>`;
});

positionModal.innerHTML = "<option>Select</option>";

position.map((pos) => {
  positionModal.innerHTML += `<option>${pos}</option>`;
});

//modal

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  this.classList.add("was-validated");
  if (this.checkValidity()) {
    let {
      firstName,
      lastName,
      adress,
      birthDate,
      position,
      typePosition,
      salary,
      isMarried,
    } = this.elements;
    let student = {
      firstName: firstName.value,
      lastName: lastName.value,
      adress: adress.value,
      birthDate: birthDate.value,
      position: position.value,
      typePosition: typePosition.value,
      salary: salary.value,
      isMarried: isMarried.checked,
    };
    if (selected === null) {
      students.push(student);
    } else {
      student[selected] = student;
    }
    console.log(student);

    localStorage.setItem("students", JSON.stringify(students));
    bootstrap.Modal.getInstance(studentModal).hide();

    this.classList.remove("was-validated");

    getStudents();
  }
});

function getStudentRow(
  {
    firstName,
    lastName,
    adress,
    birthDate,
    position,
    typePosition,
    salary,
    isMarried,
  },
  i
) {
  return `
  <tr>
    <th scope="row">${i + 1}</th>
    <td>${firstName}</td>
    <td>${lastName}</td>
    <td>${adress}</td>
    <td>${birthDate}</td>
    <td>${position}</td>
    <td>${typePosition}</td>
    <td>${salary} $</td>
    <td>${isMarried ? "Yes" : "No"}</td>
    <td class="text-end">
      <button onclick="editStudent(${i})" data-bs-toggle="modal"
      data-bs-target="#exampleModal" class="me-1 btn btn-primary">Edit</button>
      <button onclick="deleteStudent(${i})" class=" btn btn-danger">Delete</button>
    </td>

  </tr>                
  `;
}

function getStudents() {
  studentTableBody.innerHTML = "";

  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  results.map((student, i) => {
    studentTableBody.innerHTML += getStudentRow(student, i);
  });

  if (positiontype !== "Position") {
    results = results.filter((student) => student.typePosition === positiontype);
  }

  if (married !== "isMarried") {
    results = results.filter((student) => student.isMarried ? "Yes" : "No" === married);
  }

  if (sort !== "Sort") {
    results.sort((a, b) => {
      let nameA;
      let nameB;
      if (sort === "1") {
        nameA = a.salary;
        nameB = b.salary;
      } else {
        nameB = a.salary;
        nameA = b.salary;
      }

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (results.length !== 0) {
    studentTableBody.innerHTML = "";
    results.map((student, i) => {
      studentTableBody.innerHTML += getStudentRow(student, i);
    });
  } else {
    studentTableBody.innerHTML = `<td colspan="10">
      <div class="alert alert-danger">No students</div>
    </td>`;
  }
}

getStudents();

function deleteStudent(i) {
  let deleteConfirm = confirm("really delete it?");
  if (deleteConfirm) {
    students.splice(i, 1);
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  }
}

function editStudent(i) {
  selected = i;
  modalSubmitBtn.textContent = "Save Student";

  let {
    firstName,
    lastName,
    adress,
    birthDate,
    position,
    typePosition,
    salary,
    isMarried,
  } = students[i];

  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.adress.value = adress;
  studentForm.birthDate.value = birthDate;
  studentForm.position.value = position;
  studentForm.typePosition.value = typePosition;
  studentForm.salary.value = salary;
  studentForm.isMarried.chacked = isMarried;
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
  modalSubmitBtn.textContent = "Add student";
  let {
    firstName,
    lastName,
    adress,
    birthDate,
    position,
    typePosition,
    salary,
    isMarried,
  } = studentForm.elements;
  firstName.value = "";
  lastName.value = "";
  adress.value = "";
  birthDate.value = "";
  position.value = "position[0]";
  typePosition.value = "typePosition[0]";
  salary.value = "";
  isMarried.chacked = false;
});

studentSearchInput.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

typePosition.addEventListener("change", function () {
  positiontype = this.value;
  console.log(positiontype);
  getStudents();
});

typeMarried.addEventListener("change", function () {
  married = this.value;
  console.log(typeMarried);
  getStudents();
});

sorted.addEventListener("change", function () {
  sort = this.value;
  getStudents();
  console.log(sort);
});