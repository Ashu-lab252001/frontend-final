import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResponsePage.css';
import FormHeader from '../components/FormHeader/FormHeader';
import API_ENDPOINTS from '../config/api';

function ResponsePage() {
  const [submissions, setSubmissions] = useState([]);
  const [formName, setFormName] = useState('');
  const [summaryStats, setSummaryStats] = useState({ views: 0, starts: 0, completed: 0 });
  const { formId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsResponse, formResponse, statsResponse] = await Promise.all([
          axios.get(`${API_ENDPOINTS.apiSubmissions}/form-submissions/${formId}`),
          axios.get(`${API_ENDPOINTS.apiForms}/${formId}`),
          axios.get(`${API_ENDPOINTS.apiFormsStats}/${formId}`)
        ]);

        setSubmissions(submissionsResponse.data);
        setFormName(formResponse.data.name);
        setSummaryStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [formId]);

  const handleFormNameChange = (newName) => {
    setFormName(newName);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_ENDPOINTS.apiForms}/${formId}`, { name: formName });
    } catch (error) {
      console.error('Error saving form name:', error);
    }
  };

  const calculateCompletionRate = () => {
    const { starts, completed } = summaryStats;
    return starts > 0 ? Math.round((completed / starts) * 100) : 0;
  };

  return (
    <>
      <FormHeader
        formName={formName}
        onFormNameChange={handleFormNameChange}
        onSave={handleSave}
      />
      <div className="response-page">
        <div className="summary-section">
          <div className="summary-card">Views<br />{summaryStats.views}</div>
          <div className="summary-card">Starts<br />{summaryStats.starts}</div>
          <div className="chart-container">
            <div className="donut-chart">
              <span className="chart-label">{summaryStats.completed}</span>
            </div>
            <p>Completion Rate</p>
            <p>{calculateCompletionRate()}%</p>
          </div>
        </div>
        <div className="response-content">
          <table className="response-table">
            <thead>
              <tr>
                <th>Submitted At</th>
                <th>Button</th>
                <th>Email</th>
                <th>Text</th>
                <th>Button 2</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{new Date(submission.timestamp).toLocaleString()}</td>
                  <td>{submission.button1}</td>
                  <td>{submission.email1}</td>
                  <td>{submission.text1}</td>
                  <td>{submission.button2}</td>
                  <td>{submission.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ResponsePage;