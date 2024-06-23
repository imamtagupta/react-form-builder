// src/components/DynamicForm.js
import React, { useState } from 'react';
import Select from 'react-select';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import './DynamicForm.css';

const DynamicForm = () => {
  const [formData, setFormData] = useState({
    textInput: '',
    dropdown: null,
    autosuggest: '',
    file: null,
  });

  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, dropdown: selectedOption });
  };

  const handleSuggestionsFetch = ({ value }) => {
    axios.get(`/api/suggestions?q=${value}`).then((response) => {
      setSuggestions(response.data);
    });
  };

  const handleSuggestionsClear = () => {
    setSuggestions([]);
  };

  const handleAutosuggestChange = (e, { newValue }) => {
    setFormData({ ...formData, autosuggest: newValue });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleDownload = () => {
    const { dropdown } = formData;
    if (dropdown) {
      axios
        .get(`/api/download?item=${dropdown.value}`, { responseType: 'blob' })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${dropdown.label}.pdf`);
          document.body.appendChild(link);
          link.click();
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="form-container">
      <h2>Dynamic Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Text Input:</label>
          <input
            type="text"
            name="textInput"
            value={formData.textInput}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dropdown:</label>
          <Select
            classNamePrefix="react-select"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
            ]}
            value={formData.dropdown}
            onChange={handleSelectChange}
          />
        </div>

        <div className="form-group">
          <label>Auto-Suggest:</label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionsFetch}
            onSuggestionsClearRequested={handleSuggestionsClear}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
            inputProps={{
              value: formData.autosuggest,
              onChange: handleAutosuggestChange,
            }}
            theme={{
              input: 'react-autosuggest__input',
            }}
          />
        </div>

        <div className="form-group">
          <label>File Upload:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-buttons">
          <button type="button" className="download-btn" onClick={handleDownload}>
            Download
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
