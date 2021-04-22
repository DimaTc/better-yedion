/**
 *
 * @param {String} semesterQuery - String that will be used to find the element that contains the semester divs
 * @param {String} gradeClass - Class name to find all the div elements that contains all the grades
 * @returns array of grade objects
 */
function getGrades(semesterQuery, gradeClass) {
  // Get all the semester divs
  let semesters = Array.from(document.querySelectorAll(semesterQuery));

  for (let s in semesters) {
    // Get all the grades per semester
    let divs = semesters[s].getElementsByClassName(gradeClass);
    let items = Array.from(divs)
      .map((e) => ({ ...convertToItem(e), courseSemester: s }))
      .filter((e) => e.courseName != undefined);
    grades = [...grades, ...items]; // append new grades
  }
  return grades;
}

/**
 * Converts element that contains the course info, to an object that can be used to build the table
 *
 * @param {HTMLElement} divElem the html element that represents the course
 * @returns Object the include course grade, info, and link if available
 */
function convertToItem(divElem) {
  // Get the grade (only one with <b> tag)
  let courseGrade = divElem.getElementsByTagName("b")[0].innerText;
  // Filter out unnecessary text
  courseGrade = courseGrade.split(":")[1].trim().split(/\s/)[0];

  // get course name (only one with <h2> tag)
  let courseName = divElem.getElementsByTagName("h2")[0].innerText.trim();
  // get course details (the first div)
  let courseDetails = getCourseDetails(divElem.getElementsByTagName("div")[0].innerText.split("/"));
  // get course type (the second div)
  let courseType = divElem.getElementsByTagName("div")[1].innerText.trim();
  // get grade distribution link (if present)
  let onclickInfo;
  if (divElem.getElementsByTagName("a").length > 0) onclickInfo = divElem.getElementsByTagName("a")[0].getAttribute("onclick");
  return { courseGrade, courseName, ...courseDetails, courseType, onclickInfo };
}

/**
 *  This function will convert the string array of course details to an object
 * @param {Array} textArr - array of strings from course details
 * @returns Object that represents that course details
 */
function getCourseDetails(textArr) {
  let res = {};
  textArr.forEach((e) => {
    let [key, value] = e.trim().split(" ");
    switch (key) {
      case "מועד":
        key = "courseExamTerm";
        break;
      case 'ש"ס':
        key = "courseHours";
        break;
      default:
        key = "coursePoints";
    }
    res[key] = value;
  });
  return res;
}
