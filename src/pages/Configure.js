import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Configure.css';

const Configure = () => {
  const navigate = useNavigate();
  
  // State for system configuration
  const [processes, setProcesses] = useState(0);
  const [resources, setResources] = useState(0);
  const [isConfigured, setIsConfigured] = useState(false);

  // State for matrices
  const [allocation, setAllocation] = useState([]);
  const [maximum, setMaximum] = useState([]);
  const [available, setAvailable] = useState([]);

  // Handle initial configuration
  const handleConfigure = (e) => {
    e.preventDefault();
    
    if (processes > 0 && resources > 0) {
      // Initialize empty matrices
      const emptyMatrix = Array(processes).fill(null).map(() => Array(resources).fill(0));
      const emptyAvailable = Array(resources).fill(0);

      setAllocation(emptyMatrix);
      setMaximum(emptyMatrix.map(row => [...row]));
      setAvailable(emptyAvailable);
      setIsConfigured(true);
    }
  };

  // Handle matrix input change
  const handleMatrixChange = (matrix, setMatrix, i, j, value) => {
    const newMatrix = matrix.map(row => [...row]);
    newMatrix[i][j] = parseInt(value) || 0;
    setMatrix(newMatrix);
  };

  // Handle available input change
  const handleAvailableChange = (index, value) => {
    const newAvailable = [...available];
    newAvailable[index] = parseInt(value) || 0;
    setAvailable(newAvailable);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store data in localStorage to pass to Simulation page
    const simulationData = {
      processes,
      resources,
      allocation,
      maximum,
      available
    };
    
    localStorage.setItem('simulationData', JSON.stringify(simulationData));
    navigate('/simulation');
  };

  // Reset configuration
  const handleReset = () => {
    setProcesses(0);
    setResources(0);
    setIsConfigured(false);
    setAllocation([]);
    setMaximum([]);
    setAvailable([]);
  };

  return (
    <div className="configure">
      <h1>Configure System</h1>
      
      {/* Initial Configuration */}
      {!isConfigured ? (
        <div className="config-section">
          <h2>System Setup</h2>
          <form onSubmit={handleConfigure} className="config-form">
            <div className="form-group">
              <label>Number of Processes:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={processes || ''}
                onChange={(e) => setProcesses(parseInt(e.target.value) || 0)}
                placeholder="Enter (1-10)"
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Resources:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={resources || ''}
                onChange={(e) => setResources(parseInt(e.target.value) || 0)}
                placeholder="Enter (1-10)"
                required
              />
            </div>
            <button type="submit" className="btn-configure">Configure</button>
          </form>
        </div>
      ) : (
        <div className="matrices-section">
          <div className="config-info">
            <p>Processes: {processes} | Resources: {resources}</p>
            <button onClick={handleReset} className="btn-reset">Reset</button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Allocation Matrix */}
            <div className="matrix-container">
              <h3>Allocation Matrix</h3>
              <p className="matrix-desc">Resources currently allocated to each process</p>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    {Array(resources).fill(null).map((_, j) => (
                      <th key={j}>R{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allocation.map((row, i) => (
                    <tr key={i}>
                      <td>P{i}</td>
                      {row.map((val, j) => (
                        <td key={j}>
                          <input
                            type="number"
                            min="0"
                            value={val}
                            onChange={(e) => handleMatrixChange(allocation, setAllocation, i, j, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Maximum Matrix */}
            <div className="matrix-container">
              <h3>Maximum Matrix</h3>
              <p className="matrix-desc">Maximum resources each process may request</p>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    {Array(resources).fill(null).map((_, j) => (
                      <th key={j}>R{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maximum.map((row, i) => (
                    <tr key={i}>
                      <td>P{i}</td>
                      {row.map((val, j) => (
                        <td key={j}>
                          <input
                            type="number"
                            min="0"
                            value={val}
                            onChange={(e) => handleMatrixChange(maximum, setMaximum, i, j, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Available Resources */}
            <div className="matrix-container">
              <h3>Available Resources</h3>
              <p className="matrix-desc">Resources currently available in the system</p>
              <table className="matrix-table">
                <thead>
                  <tr>
                    {Array(resources).fill(null).map((_, j) => (
                      <th key={j}>R{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {available.map((val, j) => (
                      <td key={j}>
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => handleAvailableChange(j, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <button type="submit" className="btn-submit">Run Simulation</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Configure;