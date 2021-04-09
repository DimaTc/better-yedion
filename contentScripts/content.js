//globals vars
let grades = [];
let showSettings = false;
let hideNonGrades = false;
let hideNonPoints = false;
let sortLogic = { key: "", order: 1 };

// default values of columns keys, will be replaced if stored locally
let dataKeys = {
  courseSemester: { enabled: false, name: "סמסטר" },
  courseName: { enabled: true, name: "שם הקורס" },
  courseType: { enabled: true, name: "סוג" },
  courseGrade: { enabled: true, name: "ציון" },
  courseExamTerm: { enabled: true, name: "מועד" },
  coursePoints: { enabled: true, name: "נקודות זכות" },
  courseHours: { enabled: true, name: "שעות סמסטריאליות" },
};
//

/**
 * Load saved values for the columns keys & other filters
 */
function loadGradeKeys() {
  Object.keys(dataKeys).forEach((k) => {
    let savedState = localStorage.getItem(k);
    if (savedState !== null) dataKeys[k].enabled = savedState == "true";
  });
  hideNonGrades = localStorage.getItem("hideNonGrades") == "true"; //if null or not true, anyway it will be false
  hideNonPoints = localStorage.getItem("hideNonPoints") == "true";
}

/**
 * Create a new table under the tag with the class name "row2".
 * this function will create the table and the option panel.
 *
 * @param {Array} data - array of grade objects to build the table with
 * @param {Object} keys - the columns keys with values to filter and show the correct columns
 */
function addNewTable(data, keys) {
  let parentRow = document.getElementsByClassName("row2")[0];
  //Create the options panel, passing callbacks
  let optionsPanel = createOptionsPanel(
    keys,
    toggleGrades,
    hideNonGrades,
    togglePoints,
    hideNonPoints,
    () => (showSettings = !showSettings),
    showSettings
  );
  //Create the grade table
  let table = createDataTable(data, keys, sortHandler, sortLogic.key, filterGradesAndPoints);
  parentRow.prepend(table);
  parentRow.prepend(optionsPanel);
}

//Callbacks

/**
 * This function will be used to filter elements based on the settings
 *
 * @param {Object} element that represent grade in a course
 */
function filterGradesAndPoints(element) {
  if (hideNonGrades && !(element.courseGrade > 0)) return false;
  if (hideNonPoints && !(element.coursePoints > 0)) return false;
  return true;
}

/**
 * Sort handler, will be activated from within the table
 * @param {String} k - the column key that will sorted
 */
function sortHandler(k) {
  if (sortLogic.key !== k) {
    sortLogic.key = k;
    sortLogic.order = 1;
  } else sortLogic.order *= -1; //reverse order

  grades.sort((a, b) => {
    if (a[k] > 0 && b[k] > 0) return (parseInt(a[k]) - parseInt(b[k])) * sortLogic.order;
    a = a[k] === undefined ? "" : a[k];
    b = b[k] === undefined ? "" : b[k];
    return a.localeCompare(b) * sortLogic.order;
  });
  updateTable(grades, dataKeys);
}
function toggleGrades() {
  hideNonGrades = !hideNonGrades;
  localStorage.setItem("hideNonGrades", hideNonGrades);
  updateTable(grades, dataKeys);
}

function togglePoints() {
  hideNonPoints = !hideNonPoints;
  localStorage.setItem("hideNonPoints", hideNonPoints);
  updateTable(grades, dataKeys);
}
//

//activate script
loadGradeKeys();
grades = getGrades("[id^=divmsg]", "Box_ph");

//init handlers
Object.keys(dataKeys).forEach((k) => {
  dataKeys[k]["toggleHandler"] = () => {
    dataKeys[k].enabled = !dataKeys[k].enabled;
    localStorage.setItem(k, dataKeys[k].enabled);
    updateTable(grades, dataKeys);
  };
});
if (grades.length > 0) addNewTable(grades, dataKeys);
console.log(grades);
