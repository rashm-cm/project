import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Customer.css';

const Terminate = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [feedback, setFeedback] = useState(''); // State for feedback
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get('customer_id');
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is authenticated
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch enrolled services for the customer
          axios.get(`http://localhost:8081/customer/${customer_id}`)
            .then(serviceRes => setServices(serviceRes.data.services_enrolled))
            .catch(err => console.log("Error fetching services:", err));
        } else {
          setAuth(false);
          setMessage(res.data.Error);
          navigate('/login'); // Redirect to login page if not authenticated
        }
      })
      .catch(err => {
        console.log("Error during authentication check:", err);
        setAuth(false);
        setMessage('An error occurred during authentication.');
        navigate('/login'); // Redirect to login page on error
      });
  }, [navigate]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value); // Set feedback input value
  };

  const handleTerminate = () => {
    if (!selectedService) {
      alert('Please select a service to terminate.');
      return;
    }

    const serviceToTerminate = services.find(service => service.service_id === parseInt(selectedService));
    const terminationRequest = {
      customer_id: customer_id,
      service_id: serviceToTerminate.service_id,
      plan: serviceToTerminate.plan,
      features: serviceToTerminate.features,
      request_type: 'termination',
      status: 'termination',
      feedback: feedback // Include feedback in the termination request
    };
    console.log(feedback)

    axios.post('http://localhost:8081/requests', terminationRequest)
      .then(res => {
        if (res.data.Status === "Success") {
          alert('Request sent successfully! Awaiting admin approval.');
          navigate(`/?customer_id=${customer_id}`);
        } else {
          alert('Failed to send request.');
        }
      })
      .catch(err => {
        console.log("Error sending request:", err);
        alert('An error occurred while sending the termination request.');
      });
  };

  return (
    <div className="configure-container">
      {auth ? (
        <div className="configure-box">
          <h3>Welcome, {name}</h3>
          <h4>Terminate a Service</h4>
          <div className="configure-form">
            <label>Select Service: </label>
            <select value={selectedService} onChange={handleServiceChange} required>
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name}  
                </option>
              ))}
            </select>

            {/* Feedback Textarea */}
            <label>Feedback:</label>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Provide feedback (optional)"
              rows="4"
              cols="50"
            />

            <button onClick={handleTerminate}>Terminate Service</button>
          </div>
        </div>
      ) : (
        <div className="configure-message">
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Terminate;
