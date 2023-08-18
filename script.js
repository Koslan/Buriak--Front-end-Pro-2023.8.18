class Student {
    constructor(name, surname, yearOfBirth) {
        this.name = name;
        this.surname = surname;
        this.yearOfBirth = yearOfBirth;
        this.marks = [];
        this.attendance = new Array(25).fill(undefined);
    }

    getAge() {
        return new Date().getFullYear() - this.yearOfBirth;
    }

    getAverageMark() {
        console.log(this.marks);
        const sum = this.marks.reduce((acc, mark) => acc + mark, 0);
        return sum / this.marks.length;
    }

    present() {
        const index = this.attendance.indexOf(undefined);
        if (index !== -1) this.attendance[index] = true;
    }

    absent() {
        const index = this.attendance.indexOf(undefined);
        if (index !== -1) this.attendance[index] = false;
    }

    addMark(mark) {
        if (mark >= 0 && mark <= 100) this.marks.push(mark);
    }

    removeMark(index) {
        if (index >= 0 && index < this.marks.length) {
            this.marks.splice(index, 1);
        }
    }

    summary() {
        const averageMark = this.getAverageMark();
        const attendanceCount = this.attendance.filter(val => val === true).length;
        const averageAttendance = attendanceCount / this.attendance.length;

        if (averageMark > 90 && averageAttendance > 0.9) return "Молодець!";
        if (averageMark <= 90 || averageAttendance <= 0.9) return "Добре, але можна краще";
        return "Редиска!";
    }
}

let students = [];

function updateStudentsList() {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = students.map((student, index) => `<option value="${index}">${student.name} ${student.surname}</option>`).join('');
}

function getSelectedStudent() {
    const selectedIndex = document.getElementById('studentsList').selectedIndex;
    return students[selectedIndex];
}

function addMarkToStudent() {
    const student = getSelectedStudent();
    const mark = parseInt(document.getElementById('mark').value);
    
    // Ensuring mark is between 1 and 100
    if (mark && mark >= 1 && mark <= 100) {
        student.addMark(mark);
        document.getElementById('mark').value = '';  // Reset the input field
        saveToLocalStorage();
        updateStudentTable();
    } else {
        alert("Please enter a valid mark between 1 and 100.");
    }
}

function updateStudentTable() {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.surname}</td>
            <td>${student.yearOfBirth}</td>
            <td>${student.marks.length ? student.getAverageMark().toFixed(2) : 'No Marks'}</td>
        </tr>
    `).join('');
}

function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadFromLocalStorage() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        students = parsedStudents.map(s => Object.assign(new Student(), s));
    } else {
        students = [];
    }
}

document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const birthYear = parseInt(document.getElementById('birthYear').value);
    
    const student = new Student(name, surname, birthYear);
    students.push(student);

    saveToLocalStorage();
    updateStudentsList();
   updateStudentTable();
    e.target.reset();
});

window.onload = function () {
    loadFromLocalStorage();
    updateStudentsList();
    updateStudentTable();

    const currentPageUrl = window.location.href;
  const username = currentPageUrl.split("/")[2].split(".")[0];
  const repoName = currentPageUrl.split("/")[3];
  const githubRepoUrl = `https://github.com/${username}/${repoName}`;

  document.getElementById("github-link").href = githubRepoUrl;

    document.querySelectorAll('table td').forEach(cell => {
        cell.addEventListener('click', makeCellEditable);
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        localStorage.clear();
        alert('Local storage cleared!');
        location.reload();
    });
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('table td').forEach(cell => {
        cell.addEventListener('click', makeCellEditable);
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        localStorage.clear();
        alert('Local storage cleared!');
        location.reload();
    });
});

function markPresent() {
    const student = getSelectedStudent();
    student.present();
    saveToLocalStorage();
}

function markAbsent() {
    const student = getSelectedStudent();
    student.absent();
    saveToLocalStorage();
}

function getSummary() {
    const student = getSelectedStudent();
    const summaryMessage = student.summary();
    document.getElementById('summary').textContent = summaryMessage;
}

function makeCellEditable(e) {
    let cell = e.target;

    // Check if the cell is already being edited
    if(cell.querySelector('input')) return;

    let originalValue = cell.textContent;
    cell.innerHTML = `<input type="text" value="${originalValue}">`;
    let input = cell.querySelector('input');

    input.focus();

    // Save the updated value when the input field loses focus
    input.addEventListener('blur', function() {
        saveUpdatedValue(cell);
    });

    // Also save the updated value when the user hits Enter
    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            saveUpdatedValue(cell);
        }
    });
}

function saveUpdatedValue(cell) {
    let input = cell.querySelector('input');
    let updatedValue = input.value;
    cell.textContent = updatedValue;

    // If the value has changed, take some action
    if (cell.textContent !== updatedValue) {
        console.log(`Value changed to ${updatedValue}`);
        // You can add more logic here, for example, updating other parts of your application
    }
}