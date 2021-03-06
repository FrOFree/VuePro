'use strict';
import go from 'gojs';
/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
  This class implements an inspector for GoJS model data objects.
  The constructor takes three arguments:
    {string} divid a string referencing the HTML ID of the to-be inspector's div.
    {Diagram} diagram a reference to a GoJS Diagram.
    {Object} options An optional JS Object describing options for the inspector.

  Options:
    inspectSelection {boolean} Default true, whether to automatically show and populate the Inspector
                               with the currently selected Diagram Part. If set to false, the inspector won't show anything
                               until you call Inspector.inspectObject(object) with a Part or JavaScript object as the argument.
    includesOwnProperties {boolean} Default true, whether to list all properties currently on the inspected data object.
    properties {Object} An object of string:Object pairs representing propertyName:propertyOptions.
                        Can be used to include or exclude additional properties.
    propertyModified function(propertyName, newValue) a callback
    multipleSelection {boolean} Default false, whether to allow multiple selection and change the properties of all the selected instead of
                                the single first object
    showAllProperties {boolean} Default false, whether properties that are shown with multipleSelection use the intersect of the properties when false or the union when true
                                only affects if multipleSelection is true
    showSize {number} Defaults 0, shows how many nodes are showed when selecting multiple nodes
                      when its lower than 1, it shows all nodes

  Options for properties:
    show: {boolean|function} a boolean value to show or hide the property from the inspector, or a predicate function to show conditionally.
    readOnly: {boolean|function} whether or not the property is read-only
    type: {string} a string describing the data type. Supported values: "string|number|boolean|color|arrayofnumber|point|rect|size|spot|margin|select"
    defaultValue: {*} a default value for the property. Defaults to the empty string.
    choices: {Array|function} when type == "select", the Array of choices to use or a function that returns the Array of choices.

  Example usage of Inspector:

  let inspector = new Inspector("myInspector", myDiagram,
    {
      includesOwnProperties: false,
      properties: {
        "key": { show: Inspector.showIfPresent, readOnly: true },
        "comments": { show: Inspector.showIfNode  },
        "LinkComments": { show: Inspector.showIfLink },
        "chosen": { show: Inspector.showIfNode, type: "checkbox" },
        "state": { show: Inspector.showIfNode, type: "select", choices: ["Stopped", "Parked", "Moving"] }
      }
    });

  This is the basic HTML Structure that the Inspector creates within the given DIV element:

  <div id="divid" class="inspector">
    <tr>
      <td>propertyName</td>
      <td><input value=propertyValue /></td>
    </tr>
    ...
  </div>

*/
function Inspector (divid, diagram, options) {
  let mainDiv = document.getElementById(divid);
  mainDiv.className = 'inspector';
  mainDiv.innerHTML = '';
  this._div = mainDiv;
  this._diagram = diagram;
  this._inspectedProperties = {};
  this._multipleProperties = {};

  // Either a GoJS Part or a simple data object, such as Model.modelData
  this.inspectedObject = null;

  // Inspector options defaults:
  this.includesOwnProperties = true;
  this.declaredProperties = {};
  this.inspectsSelection = true;
  this.propertyModified = null;
  this.multipleSelection = false;
  this.showAllProperties = false;
  this.showSize = 0;

  if (options !== undefined) {
    if (options['includesOwnProperties'] !== undefined) this.includesOwnProperties = options['includesOwnProperties'];
    if (options['properties'] !== undefined) this.declaredProperties = options['properties'];
    if (options['inspectSelection'] !== undefined) this.inspectsSelection = options['inspectSelection'];
    if (options['propertyModified'] !== undefined) this.propertyModified = options['propertyModified'];
    if (options['multipleSelection'] !== undefined) this.multipleSelection = options['multipleSelection'];
    if (options['showAllProperties'] !== undefined) this.showAllProperties = options['showAllProperties'];
    if (options['showSize'] !== undefined) this.showSize = options['showSize'];
  }

  let self = this;
  diagram.addModelChangedListener(function (e) {
    if (e.isTransactionFinished) self.inspectObject();
  });
  if (this.inspectsSelection) {
    diagram.addDiagramListener('ChangedSelection', function (e) {
      self.inspectObject();
    });
  }
}

// Some static predicates to use with the "show" property.
Inspector.showIfNode = function (part) {
  return part instanceof go.Node;
};
Inspector.showIfLink = function (part) {
  return part instanceof go.Link;
};
Inspector.showIfGroup = function (part) {
  return part instanceof go.Group;
};

// Only show the property if its present. Useful for "key" which will be shown on Nodes and Groups, but normally not on Links
Inspector.showIfPresent = function (data, propname) {
  if (data instanceof go.Part) data = data.data;
  return typeof data === 'object' && data[propname] !== undefined;
};

/**
* Update the HTML state of this Inspector given the properties of the {@link #inspectedObject}.
* @param {Object} object is an optional argument, used when {@link #inspectSelection} is false to
*                        set {@link #inspectedObject} and show and edit that object's properties.
*/
Inspector.prototype.inspectObject = function (object) {
  let inspectedObject = null;
  let inspectedObjects = null;
  if (object === null) return;
  if (object === undefined) {
    if (this.inspectsSelection) {
      if (this.multipleSelection) { // gets the selection if multiple selection is true
        inspectedObjects = this._diagram.selection;
      } else { // otherwise grab the first object
        inspectedObject = this._diagram.selection.first();
      }
    } else { // if there is a single inspected object
      inspectedObject = this.inspectedObject;
    }
  } else { // if object was passed in as a parameter
    inspectedObject = object;
  }
  if (inspectedObjects && inspectedObjects.count === 1) {
    inspectedObject = inspectedObjects.first();
  }
  if (inspectedObjects && inspectedObjects.count <= 1) {
    inspectedObjects = null;
  }

  // single object or no objects
  if (!inspectedObjects || !this.multipleSelection) {
    if (inspectedObject === null) {
      this.inspectedObject = inspectedObject;
      this.updateAllHTML();
      return;
    }

    this.inspectedObject = inspectedObject;
    if (this.inspectObject === null) return;
    let mainDiv = this._div;
    mainDiv.innerHTML = '';

    // use either the Part.data or the object itself (for model.modelData)
    let data = (inspectedObject instanceof go.Part) ? inspectedObject.data : inspectedObject;
    if (!data) return;
    // Build table:
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    this._inspectedProperties = {};
    this.tabIndex = 0;
    let declaredProperties = this.declaredProperties;

    // Go through all the properties passed in to the inspector and show them, if appropriate:
    for (let name in declaredProperties) {
      let desc = declaredProperties[name];
      if (!this.canShowProperty(name, desc, inspectedObject)) continue;
      let val = this.findValue(name, desc, data);
      tbody.appendChild(this.buildPropertyRow(name, val));
    }
    // Go through all the properties on the model data and show them, if appropriate:
    if (this.includesOwnProperties) {
      for (let k in data) {
        if (k === '__gohashid') continue; // skip internal GoJS hash property
        if (this._inspectedProperties[k]) continue; // already exists
        if (declaredProperties[k] && !this.canShowProperty(k, declaredProperties[k], inspectedObject)) continue;
        tbody.appendChild(this.buildPropertyRow(k, data[k]));
      }
    }

    table.appendChild(tbody);
    mainDiv.appendChild(table);
  } else { // multiple objects selected
    let mainDiv = this._div;
    mainDiv.innerHTML = '';
    let shared = new go.Map(); // for properties that the nodes have in common
    let properties = new go.Map(); // for adding properties
    let all = new go.Map(); // used later to prevent changing properties when unneeded
    let it = inspectedObjects.iterator;
    // Build table:
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    this._inspectedProperties = {};
    this.tabIndex = 0;
    let declaredProperties = this.declaredProperties;
    it.next();
    inspectedObject = it.value;
    this.inspectedObject = inspectedObject;
    let data = (inspectedObject instanceof go.Part) ? inspectedObject.data : inspectedObject;
    if (data) { // initial pass to set shared and all
      // Go through all the properties passed in to the inspector and add them to the map, if appropriate:
      for (let name in declaredProperties) {
        let desc = declaredProperties[name];
        if (!this.canShowProperty(name, desc, inspectedObject)) continue;
        let val = this.findValue(name, desc, data);
        if (val === '' && desc && desc.type === 'checkbox') {
          shared.add(name, false);
          all.add(name, false);
        } else {
          shared.add(name, val);
          all.add(name, val);
        }
      }
      // Go through all the properties on the model data and add them to the map, if appropriate:
      if (this.includesOwnProperties) {
        for (let k in data) {
          if (k === '__gohashid') continue; // skip internal GoJS hash property
          if (this._inspectedProperties[k]) continue; // already exists
          if (declaredProperties[k] && !this.canShowProperty(k, declaredProperties[k], inspectedObject)) continue;
          shared.add(k, data[k]);
          all.add(k, data[k]);
        }
      }
    }
    let nodecount = 2;
    while (it.next() && (this.showSize < 1 || nodecount <= this.showSize)) { // grabs all the properties from the other selected objects
      properties.clear();
      inspectedObject = it.value;
      if (inspectedObject) {
        // use either the Part.data or the object itself (for model.modelData)
        data = (inspectedObject instanceof go.Part) ? inspectedObject.data : inspectedObject;
        if (data) {
          // Go through all the properties passed in to the inspector and add them to properties to add, if appropriate:
          for (let name in declaredProperties) {
            let desc = declaredProperties[name];
            if (!this.canShowProperty(name, desc, inspectedObject)) continue;
            let val = this.findValue(name, desc, data);
            if (val === '' && desc && desc.type === 'checkbox') {
              properties.add(name, false);
            } else {
              properties.add(name, val);
            }
          }
          // Go through all the properties on the model data and add them to properties to add, if appropriate:
          if (this.includesOwnProperties) {
            for (let k in data) {
              if (k === '__gohashid') continue; // skip internal GoJS hash property
              if (this._inspectedProperties[k]) continue; // already exists
              if (declaredProperties[k] && !this.canShowProperty(k, declaredProperties[k], inspectedObject)) continue;
              properties.add(k, data[k]);
            }
          }
        }
      }
      if (!this.showAllProperties) {
        // Cleans up shared map with properties that aren't shared between the selected objects
        // Also adds properties to the add and shared maps if applicable
        let addIt = shared.iterator;
        let toRemove = [];
        while (addIt.next()) {
          if (properties.has(addIt.key)) {
            let newVal = all.get(addIt.key) + '|' + properties.get(addIt.key);
            all.set(addIt.key, newVal);
            if ((declaredProperties[addIt.key] && declaredProperties[addIt.key].type !== 'color' && declaredProperties[addIt.key].type !== 'checkbox' && declaredProperties[addIt.key].type !== 'select') || !declaredProperties[addIt.key]) { // for non-string properties i.e color
              newVal = shared.get(addIt.key) + '|' + properties.get(addIt.key);
              shared.set(addIt.key, newVal);
            }
          } else { // toRemove array since addIt is still iterating
            toRemove.push(addIt.key);
          }
        }
        for (let i = 0; i < toRemove.length; i++) { // removes anything that doesn't showAllPropertiess
          shared.remove(toRemove[i]);
          all.remove(toRemove[i]);
        }
      } else {
        // Adds missing properties to all with the correct amount of seperators
        let addIt = properties.iterator;
        while (addIt.next()) {
          if (all.has(addIt.key)) {
            if ((declaredProperties[addIt.key] && declaredProperties[addIt.key].type !== 'color' && declaredProperties[addIt.key].type !== 'checkbox' && declaredProperties[addIt.key].type !== 'select') || !declaredProperties[addIt.key]) { // for non-string properties i.e color
              let newVal = all.get(addIt.key) + '|' + properties.get(addIt.key);
              all.set(addIt.key, newVal);
            }
          } else {
            let newVal = '';
            for (let i = 0; i < nodecount - 1; i++) newVal += '|';
            newVal += properties.get(addIt.key);
            all.set(addIt.key, newVal);
          }
        }
        // Adds bars in case properties is not in all
        addIt = all.iterator;
        while (addIt.next()) {
          if (!properties.has(addIt.key)) {
            if ((declaredProperties[addIt.key] && declaredProperties[addIt.key].type !== 'color' && declaredProperties[addIt.key].type !== 'checkbox' && declaredProperties[addIt.key].type !== 'select') || !declaredProperties[addIt.key]) { // for non-string properties i.e color
              let newVal = all.get(addIt.key) + '|';
              all.set(addIt.key, newVal);
            }
          }
        }
      }
      nodecount++;
    }
    // builds the table property rows and sets multipleProperties to help with updateall
    let mapIt;
    if (!this.showAllProperties) mapIt = shared.iterator;
    else mapIt = all.iterator;
    while (mapIt.next()) {
      tbody.appendChild(this.buildPropertyRow(mapIt.key, mapIt.value)); // shows the properties that are allowed
    }
    table.appendChild(tbody);
    mainDiv.appendChild(table);
    let allIt = all.iterator;
    while (allIt.next()) {
      this._multipleProperties[allIt.key] = allIt.value; // used for updateall to know which properties to change
    }
  }
};

/**
* @ignore
* This predicate should be false if the given property should not be shown.
* Normally it only checks the value of "show" on the property descriptor.
* The default value is true.
* @param {string} propertyName the property name
* @param {Object} propertyDesc the property descriptor
* @param {Object} inspectedObject the data object
* @return {boolean} whether a particular property should be shown in this Inspector
*/
Inspector.prototype.canShowProperty = function (propertyName, propertyDesc, inspectedObject) {
  if (propertyDesc.show === false) return false;
  // if "show" is a predicate, make sure it passes or do not show this property
  if (typeof propertyDesc.show === 'function') return propertyDesc.show(inspectedObject, propertyName);
  return true;
};

/**
* @ignore
* This predicate should be false if the given property should not be editable by the user.
* Normally it only checks the value of "readOnly" on the property descriptor.
* The default value is true.
* @param {string} propertyName the property name
* @param {Object} propertyDesc the property descriptor
* @param {Object} inspectedObject the data object
* @return {boolean} whether a particular property should be shown in this Inspector
*/
Inspector.prototype.canEditProperty = function (propertyName, propertyDesc, inspectedObject) {
  if (this._diagram.isReadOnly || this._diagram.isModelReadOnly) return false;
  // assume property values that are functions of Objects cannot be edited
  let data = (inspectedObject instanceof go.Part) ? inspectedObject.data : inspectedObject;
  let valtype = typeof data[propertyName];
  if (valtype === 'function') return false;
  if (propertyDesc) {
    if (propertyDesc.readOnly === true) return false;
    // if "readOnly" is a predicate, make sure it passes or do not show this property
    if (typeof propertyDesc.readOnly === 'function') return !propertyDesc.readOnly(inspectedObject, propertyName);
  }
  return true;
};

/**
 * @ignore
 * @param {any} propName
 * @param {any} propDesc
 * @param {any} data
 * @return {any}
 */
Inspector.prototype.findValue = function (propName, propDesc, data) {
  let val = '';
  if (propDesc && propDesc.defaultValue !== undefined) val = propDesc.defaultValue;
  if (data[propName] !== undefined) val = data[propName];
  if (val === undefined) return '';
  return val;
};

/**
* @ignore
* This sets this._inspectedProperties[propertyName] and creates the HTML table row:
*    <tr>
*      <td>propertyName</td>
*      <td><input value=propertyValue /></td>
*    </tr>
* @param {string} propertyName the property name
* @param {*} propertyValue the property value
* @return the table row
*/
Inspector.prototype.buildPropertyRow = function (propertyName, propertyValue) {
  // let mainDiv = this._div;
  let tr = document.createElement('tr');

  let td1 = document.createElement('td');
  td1.textContent = propertyName;
  if (this.declaredProperties[propertyName] && this.declaredProperties[propertyName].label) {
    td1.textContent = this.declaredProperties[propertyName].label;
  }
  tr.appendChild(td1);

  let td2 = document.createElement('td');
  let decProp = this.declaredProperties[propertyName];
  let input = null;
  let self = this;
  function updateall () {
    self.updateAllProperties();
  }
  // 动态更改inspector输入框类型
  if (decProp && decProp.typeFunc && typeof decProp.typeFunc === 'function') {
    decProp.type = decProp.typeFunc(this.inspectedObject);
  }
  if (decProp && decProp.type === 'select') {
    // console.log('decProp', decProp, propertyName);
    // console.log('this.inspectedObjec', this.inspectedObject.data);

    input = document.createElement('select');
    this.updateSelect(decProp, input, propertyName, propertyValue);
    input.addEventListener('change', updateall);
  } else {
    input = document.createElement('input');

    input.value = this.convertToString(propertyValue);
    if (decProp) {
      let t = decProp.type;
      if (t !== 'string' && t !== 'number' && t !== 'boolean' &&
        t !== 'arrayofnumber' && t !== 'point' && t !== 'size' &&
        t !== 'rect' && t !== 'spot' && t !== 'margin') {
        input.setAttribute('type', decProp.type);
      }
      if (decProp.type === 'color') {
        if (input.type === 'color') {
          input.value = this.convertToColor(propertyValue);
          // input.addEventListener("input", updateall);
          input.addEventListener('change', updateall);
        }
      } if (decProp.type === 'checkbox') {
        input.checked = !!propertyValue;
        input.addEventListener('change', updateall);
      }
    }
    if (input.type !== 'color') input.addEventListener('blur', updateall);
  }

  if (input) {
    input.tabIndex = this.tabIndex++;
    input.disabled = !this.canEditProperty(propertyName, decProp, this.inspectedObject);
    td2.appendChild(input);
  }
  tr.appendChild(td2);

  this._inspectedProperties[propertyName] = input;
  return tr;
};

/**
* @ignore
* HTML5 color input will only take hex,
* so let HTML5 canvas convert the color into hex format.
* This converts "rgb(255, 0, 0)" into "#FF0000", etc.
* @param {string} propertyValue
* @return {string}
*/
Inspector.prototype.convertToColor = function (propertyValue) {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = propertyValue;
  return ctx.fillStyle;
};

/**
* @ignore
* @param {string}
* @return {Array.<number>}
*/
Inspector.prototype.convertToArrayOfNumber = function (propertyValue) {
  if (propertyValue === 'null') return null;
  let split = propertyValue.split(' ');
  let arr = [];
  for (let i = 0; i < split.length; i++) {
    let str = split[i];
    if (!str) continue;
    arr.push(parseFloat(str));
  }
  return arr;
};

/**
* @ignore
* @param {*}
* @return {string}
*/
Inspector.prototype.convertToString = function (x) {
  if (x === undefined) return 'undefined';
  if (x === null) return 'null';
  if (x instanceof go.Point) return go.Point.stringify(x);
  if (x instanceof go.Size) return go.Size.stringify(x);
  if (x instanceof go.Rect) return go.Rect.stringify(x);
  if (x instanceof go.Spot) return go.Spot.stringify(x);
  if (x instanceof go.Margin) return go.Margin.stringify(x);
  if (x instanceof go.List) return this.convertToString(x.toArray());
  if (Array.isArray(x)) {
    let str = '';
    for (let i = 0; i < x.length; i++) {
      if (i > 0) str += ' ';
      let v = x[i];
      str += this.convertToString(v);
    }
    return str;
  }
  return x.toString();
};

/**
* @ignore
* Update all of the HTML in this Inspector.
*/
Inspector.prototype.updateAllHTML = function () {
  let inspectedProps = this._inspectedProperties;
  // let diagram = this._diagram;
  let isPart = this.inspectedObject instanceof go.Part;
  let data = isPart ? this.inspectedObject.data : this.inspectedObject;
  if (!data) {
    for (let name in inspectedProps) {
      let input = inspectedProps[name];
      if (input instanceof HTMLSelectElement) {
        input.innerHTML = '';
      } else if (input.type === 'color') {
        input.value = '#000000';
      } else if (input.type === 'checkbox') {
        input.checked = false;
      } else {
        input.value = '';
      }
    }
  } else {
    for (let name in inspectedProps) {
      let input = inspectedProps[name];
      let propertyValue = data[name];
      if (input instanceof HTMLSelectElement) {
        let decProp = this.declaredProperties[name];
        this.updateSelect(decProp, input, name, propertyValue);
      } else if (input.type === 'color') {
        input.value = this.convertToColor(propertyValue);
      } else if (input.type === 'checkbox') {
        input.checked = !!propertyValue;
      } else {
        input.value = this.convertToString(propertyValue);
      }
    }
  }
};

/**
* @ignore
* Update an HTMLSelectElement with an appropriate list of choices, given the propertyName
*/
Inspector.prototype.updateSelect = function (decProp, select, propertyName, propertyValue) {
  select.innerHTML = '';
  let choices = decProp.choices;
  if (typeof choices === 'function') choices = choices(this.inspectedObject, propertyName);
  if (!Array.isArray(choices)) choices = [];
  decProp.choicesArray = choices;
  for (let i = 0; i < choices.length; i++) {
    let choice = choices[i];
    let opt = document.createElement('option');
    if (choice.label && choice.value) {
      opt.text = this.convertToString(choice.label);
      opt.value = this.convertToString(choice.value);
    } else {
      opt.text = this.convertToString(choice);
    }
    select.add(opt, null);
  }
  if (propertyValue.value) {
    select.value = this.convertToString(propertyValue.value);
  } else {
    select.value = this.convertToString(propertyValue);
  }
};

/**
* @ignore
* Update all of the data properties of {@link #inspectedObject} according to the
* current values held in the HTML input elements.
*/
Inspector.prototype.updateAllProperties = function () {
  let inspectedProps = this._inspectedProperties;
  let diagram = this._diagram;
  if (diagram.selection.count === 1 || !this.multipleSelection) { // single object update
    let isPart = this.inspectedObject instanceof go.Part;
    let data = isPart ? this.inspectedObject.data : this.inspectedObject;
    if (!data) return;

    diagram.startTransaction('set all properties');
    for (let name in inspectedProps) {
      let input = inspectedProps[name];
      let value = input.value;

      // don't update "readOnly" data properties
      let decProp = this.declaredProperties[name];
      if (!this.canEditProperty(name, decProp, this.inspectedObject)) continue;

      // If it's a boolean, or if its previous value was boolean,
      // parse the value to be a boolean and then update the input.value to match
      let type = '';
      if (decProp !== undefined && decProp.type !== undefined) {
        type = decProp.type;
      }
      if (type === '') {
        let oldval = data[name];
        if (typeof oldval === 'boolean') type = 'boolean'; // infer boolean
        else if (typeof oldval === 'number') type = 'number';
        else if (oldval instanceof go.Point) type = 'point';
        else if (oldval instanceof go.Size) type = 'size';
        else if (oldval instanceof go.Rect) type = 'rect';
        else if (oldval instanceof go.Spot) type = 'spot';
        else if (oldval instanceof go.Margin) type = 'margin';
      }

      // convert to specific type, if needed
      switch (type) {
      case 'boolean': value = !(value === false || value === 'false' || value === '0'); break;
      case 'number': value = parseFloat(value); break;
      case 'arrayofnumber': value = this.convertToArrayOfNumber(value); break;
      case 'point': value = go.Point.parse(value); break;
      case 'size': value = go.Size.parse(value); break;
      case 'rect': value = go.Rect.parse(value); break;
      case 'spot': value = go.Spot.parse(value); break;
      case 'margin': value = go.Margin.parse(value); break;
      case 'checkbox': value = input.checked; break;
      case 'select':
        if (decProp.choicesArray[input.selectedIndex] && decProp.choicesArray[input.selectedIndex].value) {
          value = decProp.choicesArray[input.selectedIndex].value;
        } else {
          value = decProp.choicesArray[input.selectedIndex];
        }
        break;
      }

      // in case parsed to be different, such as in the case of boolean values,
      // the value shown should match the actual value
      input.value = value;

      // modify the data object in an undo-able fashion
      diagram.model.setDataProperty(data, name, value);
      // notify any listener
      if (this.propertyModified !== null) this.propertyModified(name, value, this);
    }
    diagram.commitTransaction('set all properties');
  } else { // selection object update
    diagram.startTransaction('set all properties');
    for (let name in inspectedProps) {
      let input = inspectedProps[name];
      let value = input.value;
      let arr1 = value.split('|');
      let arr2 = [];
      if (this._multipleProperties[name]) {
        // don't split if it is union and its checkbox type
        if (this.declaredProperties[name] && this.declaredProperties[name].type === 'checkbox' && this.showAllProperties) {
          arr2.push(this._multipleProperties[name]);
        } else {
          arr2 = this._multipleProperties[name].toString().split('|');
        }
      }
      let it = diagram.selection.iterator;
      let change = false;
      if (this.declaredProperties[name] && this.declaredProperties[name].type === 'checkbox') change = true; // always change checkbox
      if (arr1.length < arr2.length && (!this.declaredProperties[name] || !(this.declaredProperties[name] && (this.declaredProperties[name].type === 'color' || this.declaredProperties[name].type === 'checkbox' || this.declaredProperties[name].type === 'choices')))) {
        change = true;
      } else { // standard detection in change in properties
        for (let j = 0; j < arr1.length && j < arr2.length; j++) {
          if (!(arr1[j] === arr2[j]) && !(this.declaredProperties[name] && this.declaredProperties[name].type === 'color' && arr1[j].toLowerCase() === arr2[j].toLowerCase())) {
            change = true;
          }
        }
      }
      if (change) { // only change properties it needs to change instead all of them
        for (let i = 0; i < diagram.selection.count; i++) {
          it.next();
          let isPart = it.value instanceof go.Part;
          let data = isPart ? it.value.data : it.value;

          if (data) { // ignores the selected node if there is no data
            if (i < arr1.length) value = arr1[i];
            else value = arr1[0];

            // don't update "readOnly" data properties
            let decProp = this.declaredProperties[name];
            if (!this.canEditProperty(name, decProp, it.value)) continue;

            // If it's a boolean, or if its previous value was boolean,
            // parse the value to be a boolean and then update the input.value to match
            let type = '';
            if (decProp !== undefined && decProp.type !== undefined) {
              type = decProp.type;
            }
            if (type === '') {
              let oldval = data[name];
              if (typeof oldval === 'boolean') type = 'boolean'; // infer boolean
              else if (typeof oldval === 'number') type = 'number';
              else if (oldval instanceof go.Point) type = 'point';
              else if (oldval instanceof go.Size) type = 'size';
              else if (oldval instanceof go.Rect) type = 'rect';
              else if (oldval instanceof go.Spot) type = 'spot';
              else if (oldval instanceof go.Margin) type = 'margin';
            }

            // convert to specific type, if needed
            switch (type) {
            case 'boolean': value = !(value === false || value === 'false' || value === '0'); break;
            case 'number': value = parseFloat(value); break;
            case 'arrayofnumber': value = this.convertToArrayOfNumber(value); break;
            case 'point': value = go.Point.parse(value); break;
            case 'size': value = go.Size.parse(value); break;
            case 'rect': value = go.Rect.parse(value); break;
            case 'spot': value = go.Spot.parse(value); break;
            case 'margin': value = go.Margin.parse(value); break;
            case 'checkbox': value = input.checked; break;
            case 'select': value = decProp.choicesArray[input.selectedIndex]; break;
            }

            // in case parsed to be different, such as in the case of boolean values,
            // the value shown should match the actual value
            input.value = value;

            // modify the data object in an undo-able fashion
            diagram.model.setDataProperty(data, name, value);

            // notify any listener
            if (this.propertyModified !== null) this.propertyModified(name, value, this);
          }
        }
      }
    }
    diagram.commitTransaction('set all properties');
  }
};
export {Inspector};
