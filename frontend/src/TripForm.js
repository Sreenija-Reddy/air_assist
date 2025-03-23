import React, { useState } from 'react';
import './TripForm.css';

const TripForm = () => {
    const [tripType, setTripType] = useState('one-way');
    const [role, setRole] = useState('requester');
    const [departureLocation, setDepartureLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [assistanceNeeded, setAssistanceNeeded] = useState('');
    const [servicesOffered, setServicesOffered] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            user_id: 1, 
            trip_type: tripType,
            role: role,
            destination: destination,
            departure_date: departureDate,
            return_date: returnDate,
            assistance_needed: role === 'requester' ? assistanceNeeded : undefined,
            services_offered: role === 'helper' ? servicesOffered : undefined,
        };

        try {
            const response = await fetch('http://localhost:5000/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("Response from backend:", result);

            if (response.ok && result.message === 'Trip created successfully') {
                // Success: Reset the form fields
                alert("Trip created successfully!");
                setTripType('one-way');
                setRole('requester');
                setDepartureLocation('');
                setDestination('');
                setDepartureDate('');
                setReturnDate('');
                setAssistanceNeeded('');
                setServicesOffered('');
                setErrorMessage(''); // Clear any previous error messages
            } else {
                // Error: Handle backend failure
                setErrorMessage(result.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            // Network or other errors
            console.error("Error submitting form:", error);
            setErrorMessage("An error occurred while submitting the form. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a Trip</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div>
                <label>Departure Location:</label>
                <input
                    type="text"
                    placeholder="Departure Location"
                    value={departureLocation}
                    onChange={(e) => setDepartureLocation(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Destination:</label>
                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Departure Date:</label>
                <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Return Date (optional):</label>
                <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                />
            </div>
            <div>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="requester">Requester</option>
                    <option value="helper">Helper</option>
                </select>
            </div>

            {role === 'requester' ? (
                <div>
                    <label>Assistance Needed:</label>
                    <input
                        type="text"
                        placeholder="Assistance Needed"
                        value={assistanceNeeded}
                        onChange={(e) => setAssistanceNeeded(e.target.value)}
                    />
                </div>
            ) : (
                <div>
                    <label>Services Offered:</label>
                    <input
                        type="text"
                        placeholder="Services Offered"
                        value={servicesOffered}
                        onChange={(e) => setServicesOffered(e.target.value)}
                    />
                </div>
            )}

            <div>
                <label>Trip Type:</label>
                <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
                    <option value="one-way">One-Way</option>
                    <option value="round-trip">Round-Trip</option>
                </select>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default TripForm;
