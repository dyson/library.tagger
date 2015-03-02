/*! library.tagger v0.0.1 | MIT License | dysonsimmons.com/library.tagger */

(function(L) {

  L.fn.tagger = function() {
    return this.each(function() {
      var e = this;
      e.style.display = 'none'; // should be set in CSS but lets make sure

      var keyCodes = {'backspace': 8, 'comma': 188},
          tags = {};

      // HTML Elements
      var wrapperE = document.createElement('DIV');
      wrapperE.className = 'tagger-wrapper';
      wrapperE.id = e.id + '-tagger-wrapper';
      var inputE = document.createElement('INPUT');
      inputE.id = e.id + '-add-tag';

      wrapperE.appendChild(inputE);
      e.insertAdjacentElement('afterEnd', wrapperE);

      // Insert existing tags
      if (e.value !== '') {
        createTags(tags, e);
        addTags(tags, inputE);
      }

      // set placeholder
      inputE.placeholder = e.placeholder;

      // set focus on click
      wrapperE.addEventListener('click', function() {
        inputE.focus();
      });

      // create tag on blur
      inputE.addEventListener('blur', function() {
        createAndAddTag(tags, inputE, e);
      });

      // create tag on comma and delete tag on backspace
      inputE.addEventListener('keydown', function(event) {
        if (event.keyCode === keyCodes.comma) { // create tag on comma
          createAndAddTag(tags, inputE, e);
          event.preventDefault();
        } else if (event.keyCode === keyCodes.backspace && inputE.value === '') { // delete last tag on backspace
          removeAndDeleteTag(tags, undefined, e);
        }
      });
    });
  };

  createTags = function(tags, e) {
    var values = e.value.split(',');
    var createdTags = [];
    for (var i = 0; i < values.length; i++) {
      createdTags.push(createTag(tags, values[i], e));
    }
    return createdTags;
  };

  createAndAddTag = function(tags, inputE, e) {
      tag = createTag(tags, inputE.value, e);
      if (tag !== false && addTag(tag, inputE)) {
        updateInputValues(e, tags);
        inputE.value = '';
      }
      return tag;
  };

  createTag = function(tags, value, e) {
    if (value === '' || /^\s*$/.test(value)) return false;
    if (tags[value] !== undefined) return tags[value];

    // tag
    var tag = document.createElement('div');
    tag.className = 'tag';
    var tagContent = document.createTextNode(value);
    tag.appendChild(tagContent);

    // close link
    var close = document.createElement('a');
    close.href = '#';
    var closeContent = document.createTextNode('x');
    close.appendChild(closeContent);

    // add close to tag
    tag.appendChild(close);

    // hook up close link
    close.addEventListener('click', function(event) {
      removeAndDeleteTag(tags, value, e);
      event.preventDefault();
    });

    // add to tags
    tags[value] = tag;

    return tags[value];
  };

  addTags = function(tags, inputE) {
    for (var key in tags) {
      if (tags.hasOwnProperty(key)) {
        addTag(tags[key], inputE);
      }
    }
  };

  addTag = function(tag, inputE) {
    if (tag.parentNode === null) {
      inputE.insertAdjacentElement('beforeBegin', tag);
      return true;
    }
    return false;
  };

  removeAndDeleteTag = function(tags, value, e) {
    if (Object.keys(tags).length === 0) return false;
    if (value === undefined) { // delete the last tag (backspace was pressed in input)
      var lastTagKey = getLastTagKey(tags);
      tags[lastTagKey].remove();
      delete tags[lastTagKey];
    } else { // delete the tag with the value provided
      tags[value].remove();
      delete tags[value];
    }
    updateInputValues(e, tags);
    return true;
  };

  getLastTagKey = function(tags) {
    var lastKey;
    for (var key in tags) {
      if (tags.hasOwnProperty(key)) {
        lastKey = key;
      }
    }
    return lastKey;
  };

  updateInputValues = function(e,tags) {
    var values = [];
    for (var key in tags) {
      if (tags.hasOwnProperty(key)) {
        values.push(key);
      }
    }
    e.value = values.join(',');
  };

})(L);

