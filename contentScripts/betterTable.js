//Constants (should add from a resource file, would be better for locale & less hard-coded)
const SETTINGS_BTN_TEXT = "הגדרות סינון";
const TOGGLE_GRADE_LABEL = "הסתר מקוצעות ללא ציון";
const TOGGLE_POINT_LABEL = "הסתר ציונים ללא נקודות זכות";
//

/**
 *
 * @returns HTMLElement for the header of the table, will be used to customize and sort
 */
function createHeader(keys, sortHandler, sortedK) {
  let elements = Object.keys(keys)
    .filter((k) => keys[k].enabled)
    .map((k) => {
      let header = document.createElement("div");
      header.className = "better-header";
      header.onclick = (e) => sortHandler(k);
      header.classList.add("g-bg-primary");
      let span = document.createElement("span");
      span.innerText = keys[k].name;
      span.className = k == sortedK ? "sorted" : "";
      header.append(span);
      return header;
    });
  return elements;
}

function createOptionsPanel(keys, toggleGrades, hideNonGrades, togglePoints, hideNonPoints, toggleSettingsState, showSettings) {
  let wrapper = document.createElement("div");
  let button = document.createElement("div");
  let div = document.createElement("div");
  wrapper.className = "better-wrapper";
  button.className = "settings-btn";
  button.innerText = SETTINGS_BTN_TEXT;
  div.className = showSettings ? "better-options show" : "better-options hide";
  button.onclick = () => {
    showSettings = toggleSettingsState();
    div.className = showSettings ? "better-options show" : "better-options hide";
  };
  div.append(createColumnSelectionSection(keys));
  div.append(createValueSelectorsSection(toggleGrades, hideNonGrades, togglePoints, hideNonPoints));
  wrapper.append(button);
  wrapper.append(div);
  return wrapper;
}

function createToggleCheckbox(labelText, id, checked, handler) {
  let div = document.createElement("div");
  let checkbox = document.createElement("input");
  let label = document.createElement("label");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.onchange = handler;
  checkbox.checked = checked;
  checkbox.margin = "2px";
  label.innerText = labelText;
  label.style.margin = "0 5px";
  div.append(checkbox);
  div.append(label);
  return div;
}

function createColumnSelectionSection(keys) {
  let div = document.createElement("div");
  Object.keys(keys).forEach((k) => {
    let selectorDiv = createToggleCheckbox(keys[k].name, k, keys[k].enabled, keys[k].toggleHandler);
    div.append(selectorDiv);
  });
  return div;
}

function createValueSelectorsSection(toggleGrades, hideNonGrades, togglePoints, hideNonPoints) {
  let div = document.createElement("div");
  let gradeSelector = createToggleCheckbox(TOGGLE_GRADE_LABEL, "grade-selector", hideNonGrades, toggleGrades);
  let pointSelector = createToggleCheckbox(TOGGLE_POINT_LABEL, "point-selector", hideNonPoints, togglePoints);
  div.append(gradeSelector);
  div.append(pointSelector);
  return div;
}

function createDataTable(data, keys, sortHandler, sortedK, filter) {
  let div = document.createElement("div");
  //Create value for grid-template-columns (e.g. "auto auto auto" for 3 columns)
  let columnCount = Object.keys(keys)
    .filter((k) => keys[k].enabled)
    .map((e) => "auto")
    .join(" ");

  div.className = "better-grades-div";
  div.style.gridTemplateColumns = columnCount;
  //Add headers
  createHeader(keys, sortHandler, sortedK).forEach((elem) => div.append(elem));
  //Add values
  data.filter(filter).forEach((elem, i) => {
    //foreach for courses
    let courseRowElements = createCourseRow(elem, keys);
    let bgColor = i % 2 == 0 ? "even" : "odd";
    courseRowElements.forEach((courseData) => {
      courseData.className += " " + bgColor;
      div.append(courseData);
    });
  });
  return div;
}

function createCourseRow(data, keys) {
  elements = Object.keys(keys)
    .filter((k) => keys[k].enabled)
    .map((k) => {
      let div = document.createElement("div");
      div.className = "course-info";
      let alternativeElement = undefined;
      let text = data[k];
      if (k == "courseGrade" && text > 0) {
        div.className += " course-grade";
        alternativeElement = document.createElement("div");
        alternativeElement.setAttribute("onclick", data.onclickInfo);
        if (data.onclickInfo) alternativeElement.classList.add("dist-grades");
        alternativeElement.innerText = text;
        if (text < 60) alternativeElement.classList.add("fail");
      } else if (k == "courseSemester") text = ["א'", "ב'", "קיץ"][parseInt(text)];

      //Add text or an element
      if (alternativeElement) div.append(alternativeElement);
      else div.innerText = text === undefined ? "---" : text;

      return div;
    });

  return elements;
}

/**
 * removes "better-grades-div" and "better-wrapper" and create new ones with the updates values
 * @param {Object} data of the grade
 * @param {Object} keys for column values
 */
function updateTable(data, keys) {
  document.getElementsByClassName("better-wrapper")[0].remove();
  document.getElementsByClassName("better-grades-div")[0].remove();
  addNewTable(data, keys);
}
