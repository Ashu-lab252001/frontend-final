import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FormHeader from '../components/FormHeader/FormHeader';
import Sidebar from '../components/SideBarCanvas/Sidebar';
import Canvas from '../components/Canvas/Canvas';
import '../styles/formBuilder.css';
import useAuthenticatedApi from '../utils/useAuthenticatedApi';
import API_ENDPOINTS from '../config/api';

function FormBuilder() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { authenticatedFetch } = useAuthenticatedApi();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [],
    folder: new URLSearchParams(location.search).get('folderId') || '',
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (formId) {
      fetchFormData();
    } else {
      initializeCanvas();
    }
  }, [formId]);

  const fetchFormData = async () => {
    try {
      const data = await authenticatedFetch(API_ENDPOINTS.apiFormsById(formId));
      setFormData({
        ...data,
        fields: data.fields.map((field) => ({
          ...field,
          id: field._id,
        })),
      });
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const initializeCanvas = () => {
    const startNode = {
      id: Date.now(),
      type: 'Start',
      label: 'Start',
      position: { x: 50, y: 50 },
    };
    setFormData((prevData) => ({
      ...prevData,
      fields: [startNode],
    }));
  };

  const addElement = (elementType, section) => {
    const newField = {
      type: elementType,
      id: Date.now(),
      label: `New ${elementType}`,
      required: false,
      errorMessage: `Please enter a valid ${elementType.toLowerCase()}`,
    };

    if (section === 'Inputs') {
      newField.options = elementType === 'Rating' ? ['Option 1'] : undefined;
      if (elementType === 'Rating') {
        newField.starCount = 5;
      }
    }

    if (['Image', 'Video', 'GIF'].includes(elementType)) {
      newField.url = '';
    }

    setFormData((prevData) => ({
      ...prevData,
      fields: [...prevData.fields, newField],
    }));
  };

  const saveForm = async () => {
    try {
      const dataToSend = {
        ...formData,
        fields: formData.fields.map(({ id, ...field }) => field), // Remove client-side id
      };
      if (formId) {
        await authenticatedFetch(API_ENDPOINTS.apiFormsById(formId), {
          method: 'PUT',
          body: JSON.stringify(dataToSend),
        });
      } else {
        await authenticatedFetch(API_ENDPOINTS.apiForms, {
          method: 'POST',
          body: JSON.stringify(dataToSend),
        });
      }
      navigate('/workspace');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="form-builder">
      <FormHeader
        formName={formData.title}
        onSave={saveForm}
        onFormNameChange={(value) => handleFormDataChange('title', value)}
        authenticatedFetch={authenticatedFetch}
        onThemeToggle={toggleTheme} // Pass theme toggle handler
        currentTheme={theme} // Pass current theme
      />
      <div className="main-content">
        <Sidebar
          addElement={(elementType, section) => addElement(elementType, section)}
          sections={[
            {
              title: 'Bubbles',
              items: ['Text', 'Image', 'Video', 'GIF'],
            },
            {
              title: 'Inputs',
              items: ['Text', 'Number', 'Email', 'Phone', 'Date', 'Rating', 'Buttons'],
            },
          ]}
        />
        <Canvas
          elements={formData.fields}
          setFormData={setFormData}
          description={formData.description}
          onDescriptionChange={(value) => handleFormDataChange('description', value)}
        />
      </div>
    </div>
  );
}

export default FormBuilder;